/**
 * ESPN Authenticator Service
 * Automated ESPN cookie extraction using Puppeteer
 * Provides Plaid-style authentication flow with improved token extraction
 */

const ESPNTokenExtractor = require('./espn-token-extractor');
const SessionManager = require('./session-manager');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');

class ESPNAuthenticator {
    constructor(options = {}) {
        this.tokenExtractor = new ESPNTokenExtractor(options);
        this.sessionManager = new SessionManager();
        this.timeout = options.timeout || 60000;
    }

    /**
     * Initialize authentication session (Plaid-style link token)
     */
    async initializeConnection(clientId, redirectUri) {
        try {
            const sessionId = uuidv4();
            const linkToken = this.sessionManager.generateLinkToken();
            
            // Store link token with session manager
            await this.sessionManager.storeLinkToken(linkToken, {
                client_id: clientId,
                redirect_uri: redirectUri,
                session_id: sessionId
            });

            // Store auth session
            await this.sessionManager.storeAuthSession(sessionId, {
                clientId,
                redirectUri,
                linkToken,
                status: 'initialized',
                platform: 'espn'
            });

            logger.info(`Initialized ESPN auth session: ${sessionId}`);

            return {
                link_token: linkToken,
                session_id: sessionId,
                auth_url: `${process.env.API_URL || 'http://localhost:3000'}/api/v1/auth/espn/login?session=${sessionId}`,
                expiration: new Date(Date.now() + 900000).toISOString() // 15 minutes
            };
        } catch (error) {
            logger.error('Failed to initialize connection:', error);
            throw error;
        }
    }

    /**
     * Handle ESPN login - prepare browser and return ready state
     */
    async handleESPNLogin(sessionId, userAgent = null) {
        let browser = null;
        let page = null;

        try {
            // Get session info
            const sessionData = await this.redis.get(`auth_session:${sessionId}`);
            if (!sessionData) {
                throw new Error('Session expired or invalid');
            }

            const session = JSON.parse(sessionData);
            
            // Update session status
            await this.updateSessionStatus(sessionId, 'login_started');

            // Launch browser
            browser = await this.createBrowser(userAgent);
            page = await browser.newPage();

            // Set up page with realistic headers
            await this.configurePage(page, userAgent);

            // Navigate to ESPN login with retry logic
            logger.info('Navigating to ESPN login page');
            try {
                await page.goto('https://www.espn.com/login', {
                    waitUntil: 'domcontentloaded', // Less strict than networkidle2
                    timeout: 30000
                });
            } catch (navError) {
                logger.warn('Initial navigation failed, retrying...', navError.message);
                // Try again with even less strict settings
                await page.goto('https://www.espn.com/login', {
                    waitUntil: 'load',
                    timeout: 30000
                });
            }

            // Wait for login form to be ready
            await this.waitForLoginForm(page);

            // Store browser session for later use
            this.sessions.set(sessionId, { browser, page });
            
            // Also store browser endpoint in Redis for reconnection
            const wsEndpoint = browser.wsEndpoint();
            await this.redis.setex(`browser:${sessionId}`, 300, wsEndpoint);

            logger.info(`ESPN login form ready for session: ${sessionId}`);

            return {
                success: true,
                sessionId,
                message: 'Login form ready - waiting for user credentials',
                status: 'awaiting_credentials'
            };

        } catch (error) {
            logger.error(`ESPN login setup failed for session ${sessionId}:`, error);
            await this.updateSessionStatus(sessionId, 'error', error.message);
            
            // Clean up on error
            if (page) await page.close();
            if (browser) await browser.close();
            
            throw error;
        }
    }

    /**
     * Submit credentials and extract cookies using new token extractor
     */
    async submitCredentials(sessionId, credentials) {
        try {
            logger.info(`Starting ESPN authentication for session: ${sessionId}`);

            // Update session status
            await this.sessionManager.updateAuthSession(sessionId, {
                status: 'extracting_tokens'
            });

            // Use the new token extractor
            const extractionResult = await this.tokenExtractor.extractTokens(credentials);

            if (!extractionResult.success) {
                await this.sessionManager.updateAuthSession(sessionId, {
                    status: 'error',
                    error: extractionResult.error || extractionResult.message
                });

                return {
                    success: false,
                    error: extractionResult.error,
                    message: extractionResult.message,
                    requires2FA: extractionResult.requires2FA
                };
            }

            // Validate extracted tokens
            const validation = ESPNTokenExtractor.validateTokens(extractionResult.tokens);
            if (!validation.valid) {
                throw new Error(`Token validation failed: ${validation.error}`);
            }

            // Generate public token using session manager
            const publicToken = this.sessionManager.generatePublicToken();
            
            // Store ESPN tokens securely
            await this.sessionManager.storeESPNTokens(publicToken, extractionResult.tokens, {
                session_id: sessionId,
                extracted_at: new Date().toISOString(),
                method: 'puppeteer_v2'
            });

            // Update session as completed
            await this.sessionManager.updateAuthSession(sessionId, {
                status: 'completed',
                public_token: publicToken
            });

            logger.info(`ESPN authentication successful for session: ${sessionId}`);

            return {
                success: true,
                public_token: publicToken,
                platform: 'espn',
                message: 'Authentication successful',
                tokens_extracted: true
            };

        } catch (error) {
            logger.error(`Credential submission failed for session ${sessionId}:`, error);
            
            await this.sessionManager.updateAuthSession(sessionId, {
                status: 'error',
                error: error.message
            });

            return {
                success: false,
                error: error.message,
                type: error.type || 'EXTRACTION_ERROR'
            };
        }
    }

    /**
     * Perform the actual login on ESPN
     */
    async performLogin(page, credentials) {
        try {
            // Wait for Disney ID iframe (ESPN uses Disney authentication)
            await page.waitForSelector('iframe[name="disneyid-iframe"]', { timeout: 30000 });
            
            const frames = page.frames();
            const loginFrame = frames.find(frame => frame.name() === 'disneyid-iframe');
            
            if (!loginFrame) {
                throw new Error('Login frame not found');
            }

            // Enter email
            logger.info('Entering email');
            await loginFrame.waitForSelector('input[type="email"]', { timeout: 10000 });
            await this.humanType(loginFrame, 'input[type="email"]', credentials.email);
            
            // Click continue
            await loginFrame.click('button[type="submit"]');
            await this.randomDelay(1000, 2000);

            // Enter password
            logger.info('Entering password');
            await loginFrame.waitForSelector('input[type="password"]', { timeout: 10000 });
            await this.humanType(loginFrame, 'input[type="password"]', credentials.password);
            
            // Submit login
            await loginFrame.click('button[type="submit"]');

            // Handle potential 2FA
            const needs2FA = await this.check2FA(page, loginFrame);
            if (needs2FA) {
                return {
                    success: false,
                    requires2FA: true,
                    message: 'Two-factor authentication required'
                };
            }

            // Wait for successful login redirect
            logger.info('Waiting for login completion');
            await page.waitForNavigation({ 
                waitUntil: 'networkidle2', 
                timeout: 30000 
            }).catch(() => {
                // Sometimes navigation doesn't happen, check if we're logged in
            });

            // Verify we're logged in
            await page.goto('https://fantasy.espn.com', { waitUntil: 'networkidle2' });
            
            const isLoggedIn = await page.evaluate(() => {
                // Check for login indicators
                return document.querySelector('.user-info') !== null ||
                       document.querySelector('[data-testid="user-menu"]') !== null ||
                       document.cookie.includes('espn_s2');
            });

            if (!isLoggedIn) {
                throw new Error('Login failed - credentials may be incorrect');
            }

            logger.info('ESPN login successful');
            return { success: true };

        } catch (error) {
            logger.error('Login failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Extract ESPN cookies from the page
     */
    async extractESPNCookies(page) {
        try {
            const cookies = await page.cookies();
            
            const espnS2 = cookies.find(cookie => cookie.name === 'espn_s2');
            const swid = cookies.find(cookie => cookie.name === 'SWID');

            if (!espnS2 || !swid) {
                // Try to navigate to a page that might set the cookies
                await page.goto('https://fantasy.espn.com/games', { waitUntil: 'networkidle2' });
                await this.randomDelay(2000, 3000);
                
                const newCookies = await page.cookies();
                const newEspnS2 = newCookies.find(cookie => cookie.name === 'espn_s2');
                const newSwid = newCookies.find(cookie => cookie.name === 'SWID');
                
                return {
                    espn_s2: newEspnS2?.value || null,
                    swid: newSwid?.value || null,
                    all_cookies: newCookies
                };
            }

            return {
                espn_s2: espnS2.value,
                swid: swid.value,
                all_cookies: cookies
            };

        } catch (error) {
            logger.error('Cookie extraction failed:', error);
            throw new Error(`Cookie extraction failed: ${error.message}`);
        }
    }

    /**
     * Discover user's leagues from ESPN
     */
    async discoverUserLeagues(page, cookies) {
        try {
            // Navigate to fantasy games page
            await page.goto('https://fantasy.espn.com/games', { 
                waitUntil: 'networkidle2' 
            });

            // Extract league information
            const leagues = await page.evaluate(() => {
                const leagueElements = document.querySelectorAll('[class*="league"], [data-testid*="league"], .Table__TD a[href*="leagueId"]');
                const leagueData = [];
                const seenIds = new Set();

                leagueElements.forEach(element => {
                    let leagueLink = element;
                    if (!element.href) {
                        leagueLink = element.querySelector('a[href*="leagueId"]');
                    }
                    
                    if (leagueLink && leagueLink.href) {
                        const href = leagueLink.href;
                        const leagueIdMatch = href.match(/leagueId[=\/](\d+)/);
                        const leagueId = leagueIdMatch ? leagueIdMatch[1] : null;
                        
                        if (leagueId && !seenIds.has(leagueId)) {
                            seenIds.add(leagueId);
                            
                            const leagueName = element.textContent?.trim() || 'Unknown League';
                            const sport = href.includes('/football/') ? 'football' : 
                                         href.includes('/basketball/') ? 'basketball' : 
                                         href.includes('/baseball/') ? 'baseball' : 'unknown';

                            leagueData.push({
                                league_id: leagueId,
                                name: leagueName,
                                sport: sport,
                                url: href
                            });
                        }
                    }
                });

                return leagueData;
            });

            logger.info(`Found ${leagues.length} leagues for user`);
            return leagues;

        } catch (error) {
            logger.error('Failed to discover leagues:', error);
            return [];
        }
    }

    // Helper methods
    async createBrowser(userAgent = null) {
        const args = [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // Add this for M1 Macs
            '--disable-gpu'
        ];

        if (this.browserWS) {
            return await puppeteer.connect({
                browserWSEndpoint: this.browserWS
            });
        }

        // Try to use system Chrome first if available
        const executablePaths = [
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/Applications/Chromium.app/Contents/MacOS/Chromium',
            puppeteer.executablePath() // Fall back to Puppeteer's Chrome
        ];

        let browser = null;
        for (const execPath of executablePaths) {
            try {
                browser = await puppeteer.launch({
                    headless: false, // Show browser for debugging
                    executablePath: execPath,
                    args,
                    defaultViewport: null,
                    ignoreDefaultArgs: ['--disable-extensions', '--enable-automation'],
                    handleSIGINT: false,
                    handleSIGTERM: false,
                    handleSIGHUP: false
                });
                logger.info(`Launched browser using: ${execPath}`);
                break;
            } catch (err) {
                logger.warn(`Failed to launch with ${execPath}: ${err.message}`);
                continue;
            }
        }

        if (!browser) {
            throw new Error('Failed to launch Chrome. Please ensure Chrome is installed.');
        }

        return browser;
    }

    async configurePage(page, userAgent = null) {
        // Set realistic viewport
        await page.setViewport({
            width: 1366 + Math.floor(Math.random() * 100),
            height: 768 + Math.floor(Math.random() * 100)
        });

        // Set user agent
        const ua = userAgent || this.getRandomUserAgent();
        await page.setUserAgent(ua);

        // Set extra headers
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        });

        // Block unnecessary resources for speed
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            const resourceType = request.resourceType();
            if (['image', 'font', 'media'].includes(resourceType)) {
                request.abort();
            } else {
                request.continue();
            }
        });
    }

    async humanType(elementOrFrame, selector, text) {
        const element = await elementOrFrame.$(selector);
        await element.click({ clickCount: 3 }); // Triple click to select all
        await element.press('Backspace'); // Clear field
        
        for (const char of text) {
            await elementOrFrame.type(selector, char, {
                delay: 50 + Math.random() * 150
            });
        }
    }

    async randomDelay(min, max) {
        const delay = min + Math.random() * (max - min);
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    async waitForLoginForm(page) {
        // Wait for either direct login form or Disney iframe
        await Promise.race([
            page.waitForSelector('iframe[name="disneyid-iframe"]', { timeout: 30000 }),
            page.waitForSelector('input[type="email"]', { timeout: 30000 })
        ]);
    }

    async check2FA(page, loginFrame) {
        try {
            // Check for 2FA indicators
            await Promise.race([
                loginFrame.waitForSelector('[data-testid="verification-code"]', { timeout: 5000 }),
                loginFrame.waitForSelector('input[placeholder*="code"]', { timeout: 5000 }),
                page.waitForNavigation({ timeout: 5000 })
            ]);

            // If we find 2FA elements, return true
            const has2FA = await loginFrame.$('[data-testid="verification-code"]') ||
                          await loginFrame.$('input[placeholder*="code"]');
            
            return !!has2FA;
        } catch {
            return false;
        }
    }

    getRandomUserAgent() {
        const userAgents = [
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ];
        return userAgents[Math.floor(Math.random() * userAgents.length)];
    }

    async updateSessionStatus(sessionId, status, error = null) {
        const key = `auth_session:${sessionId}`;
        const sessionData = await this.redis.get(key);
        
        if (sessionData) {
            const session = JSON.parse(sessionData);
            session.status = status;
            session.lastUpdate = new Date().toISOString();
            if (error) session.error = error;
            
            await this.redis.setex(key, 300, JSON.stringify(session));
        }
    }

    async storeCookies(sessionId, cookies, leagues) {
        const crypto = require('crypto');
        const algorithm = 'aes-256-gcm';
        const key = Buffer.from(process.env.ENCRYPTION_KEY || 'your-32-character-encryption-key', 'utf8').slice(0, 32);
        const iv = crypto.randomBytes(16);
        
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        
        const data = JSON.stringify({
            espn_s2: cookies.espn_s2,
            swid: cookies.swid,
            leagues,
            created: new Date().toISOString()
        });
        
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();
        
        const encryptedData = {
            encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex')
        };

        await this.redis.setex(
            `user_session:${sessionId}`,
            3600, // 1 hour
            JSON.stringify(encryptedData)
        );
    }

    async getSessionData(sessionId) {
        const crypto = require('crypto');
        const encryptedDataStr = await this.redis.get(`user_session:${sessionId}`);
        
        if (!encryptedDataStr) {
            throw new Error('Session not found or expired');
        }

        const encryptedData = JSON.parse(encryptedDataStr);
        const algorithm = 'aes-256-gcm';
        const key = Buffer.from(process.env.ENCRYPTION_KEY || 'your-32-character-encryption-key', 'utf8').slice(0, 32);
        
        const decipher = crypto.createDecipheriv(
            algorithm, 
            key, 
            Buffer.from(encryptedData.iv, 'hex')
        );
        
        decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
        
        let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return JSON.parse(decrypted);
    }

    /**
     * Clean up any hanging browser sessions
     */
    async cleanup() {
        for (const [sessionId, session] of this.sessions) {
            try {
                if (session.browser) {
                    await session.browser.close();
                }
            } catch (error) {
                logger.error(`Failed to close browser for session ${sessionId}:`, error);
            }
        }
        this.sessions.clear();
    }
}

module.exports = ESPNAuthenticator;