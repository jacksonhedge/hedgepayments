/**
 * ESPN Token Extractor
 * Automated extraction of ESPN cookies (espn_s2 and SWID) using Puppeteer
 * Based on research from https://github.com/cwendt94/espn-api/discussions/150
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const logger = require('../../utils/logger');
const fs = require('fs').promises;
const path = require('path');

// Add stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

class ESPNTokenExtractor {
  // Static properties for session reuse
  static sharedBrowser = null;
  static browserCleanupTimer = null;
  static BROWSER_IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

  constructor(options = {}) {
    this.options = {
      headless: options.headless !== false, // Default to headless
      timeout: options.timeout || 30000,
      userAgent: options.userAgent || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      reuseSession: options.reuseSession !== false, // Default to true
      ...options
    };
    
    this.browser = null;
    this.page = null;
    this.cookieFile = path.join(__dirname, '../../data/espn-cookies.json');
  }

  /**
   * Load saved cookies from file
   */
  async loadSavedCookies() {
    try {
      const cookieData = await fs.readFile(this.cookieFile, 'utf8');
      const cookies = JSON.parse(cookieData);
      
      // Check if cookies are still valid (not expired)
      const validCookies = cookies.filter(cookie => {
        if (!cookie.expires) return true; // Session cookies are always valid
        return new Date(cookie.expires * 1000) > new Date();
      });
      
      if (validCookies.length > 0) {
        logger.debug(`Loaded ${validCookies.length} valid cookies from file`);
        return validCookies;
      } else {
        logger.debug('All saved cookies have expired');
        return null;
      }
    } catch (error) {
      logger.debug('No saved cookies found or failed to load:', error.message);
      return null;
    }
  }

  /**
   * Save cookies to file for future use
   */
  async saveCookies(cookies) {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(this.cookieFile);
      await fs.mkdir(dataDir, { recursive: true });
      
      // Filter and save important cookies
      const importantCookies = cookies.filter(cookie => {
        const name = cookie.name.toLowerCase();
        const domain = cookie.domain || '';
        
        // Save Disney and ESPN related cookies
        return (
          domain.includes('disney') || 
          domain.includes('espn') ||
          name.includes('session') ||
          name.includes('auth') ||
          name.includes('token') ||
          name.includes('login') ||
          name.includes('consent') ||
          name.includes('terms') ||
          name === 'espn_s2' ||
          name === 'SWID'
        );
      });
      
      await fs.writeFile(this.cookieFile, JSON.stringify(importantCookies, null, 2));
      logger.debug(`Saved ${importantCookies.length} cookies to file`);
    } catch (error) {
      logger.warn('Failed to save cookies:', error.message);
    }
  }

  /**
   * Check if we have valid authentication cookies
   */
  async hasValidAuth() {
    // Check current page cookies if browser is available
    let cookies;
    if (this.page) {
      cookies = await this.page.cookies();
    } else {
      cookies = await this.loadSavedCookies();
      if (!cookies) return false;
    }
    
    // Check for key ESPN authentication cookies
    const hasESPNS2 = cookies.some(c => c.name === 'espn_s2' && c.value && c.value.length > 50);
    const hasSWID = cookies.some(c => c.name === 'SWID' && c.value && c.value.startsWith('{'));
    
    logger.debug(`Auth cookies status: espn_s2=${hasESPNS2}, SWID=${hasSWID}`);
    return hasESPNS2 && hasSWID;
  }

  /**
   * Get or create shared browser instance
   */
  static async getSharedBrowser(options = {}) {
    if (!ESPNTokenExtractor.sharedBrowser || ESPNTokenExtractor.sharedBrowser.disconnected) {
      logger.debug('Creating new shared browser instance...');
      
      ESPNTokenExtractor.sharedBrowser = await puppeteer.launch({
        headless: options.headless !== false,
        defaultViewport: { width: 1920, height: 1080 },
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-blink-features=AutomationControlled',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      });
      
      logger.debug('Shared browser created successfully');
    }
    
    // Reset cleanup timer
    ESPNTokenExtractor.resetBrowserCleanupTimer();
    
    return ESPNTokenExtractor.sharedBrowser;
  }

  /**
   * Reset browser cleanup timer
   */
  static resetBrowserCleanupTimer() {
    if (ESPNTokenExtractor.browserCleanupTimer) {
      clearTimeout(ESPNTokenExtractor.browserCleanupTimer);
    }
    
    ESPNTokenExtractor.browserCleanupTimer = setTimeout(async () => {
      logger.debug('Browser idle timeout reached, cleaning up...');
      await ESPNTokenExtractor.cleanupSharedBrowser();
    }, ESPNTokenExtractor.BROWSER_IDLE_TIMEOUT);
  }

  /**
   * Cleanup shared browser instance
   */
  static async cleanupSharedBrowser() {
    if (ESPNTokenExtractor.sharedBrowser && !ESPNTokenExtractor.sharedBrowser.disconnected) {
      logger.debug('Closing shared browser instance...');
      try {
        await ESPNTokenExtractor.sharedBrowser.close();
      } catch (error) {
        logger.debug('Error closing browser:', error.message);
      }
      ESPNTokenExtractor.sharedBrowser = null;
    }
    
    if (ESPNTokenExtractor.browserCleanupTimer) {
      clearTimeout(ESPNTokenExtractor.browserCleanupTimer);
      ESPNTokenExtractor.browserCleanupTimer = null;
    }
  }

  /**
   * Force cleanup of shared browser (for graceful shutdowns)
   */
  static async forceCleanup() {
    await ESPNTokenExtractor.cleanupSharedBrowser();
  }

  /**
   * Extract ESPN cookies using username/password authentication
   * @param {Object} credentials - ESPN login credentials
   * @param {string} credentials.email - ESPN email
   * @param {string} credentials.password - ESPN password
   */
  async extractTokens(credentials) {
    let startTime = Date.now();
    
    try {
      logger.info('Starting ESPN cookie extraction...');
      
      // Validate credentials
      if (!credentials || !credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      // Launch browser
      await this.launchBrowser();
      
      // Try to load saved cookies first
      const savedCookies = await this.loadSavedCookies();
      if (savedCookies) {
        logger.info('Loading saved cookies to skip Disney Terms...');
        await this.page.setCookie(...savedCookies);
        
        // Check if we already have valid authentication
        if (await this.hasValidAuth()) {
          logger.info('Valid saved authentication found, extracting cookies...');
          const result = await this.extractCookies();
          if (result.success) {
            logger.info('Successfully authenticated using saved cookies!');
            return result;
          } else {
            logger.debug('Saved cookies invalid, proceeding with fresh login...');
          }
        }
      }
      
      // Navigate directly to Disney login - skip all ESPN Fantasy navigation
      logger.info('Navigating directly to Disney login page...');
      await this.page.goto('https://secure.web.plus.espn.com/identity/login', {
        waitUntil: 'networkidle0',
        timeout: this.options.timeout
      });

      // Check if already logged in
      const isLoggedIn = await this.checkIfLoggedIn();
      if (isLoggedIn) {
        logger.info('Already logged in, extracting cookies...');
        return await this.extractCookies();
      }

      // Find and click login button
      logger.info('Clicking login button...');
      await this.clickLoginButton();

      // Handle the Disney ID iframe login
      logger.info('Handling Disney ID login...');
      await this.handleDisneyLogin(credentials);

      // Check for 2FA
      const needs2FA = await this.check2FA();
      if (needs2FA) {
        return {
          success: false,
          requires2FA: true,
          message: 'Two-factor authentication is required. Please disable 2FA temporarily or handle manually.'
        };
      }

      // Wait for successful login and redirect
      logger.info('Waiting for login success...');
      await this.waitForLoginSuccess();

      // Extract the cookies
      logger.info('Extracting ESPN cookies...');
      const result = await this.extractCookies();

      const duration = Date.now() - startTime;
      logger.info(`ESPN cookie extraction completed in ${duration}ms`);

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`ESPN cookie extraction failed after ${duration}ms:`, error);
      
      // Take screenshot for debugging
      if (this.page) {
        try {
          await this.page.screenshot({ 
            path: '/tmp/espn-extraction-error.png',
            fullPage: true 
          });
          logger.info('Error screenshot saved to /tmp/espn-extraction-error.png');
        } catch (screenshotError) {
          // Ignore screenshot errors
        }
      }

      return {
        success: false,
        error: error.message,
        type: this.categorizeError(error)
      };

    } finally {
      await this.cleanup();
    }
  }

  /**
   * Launch Puppeteer browser with stealth configuration
   */
  async launchBrowser() {
    logger.debug('Launching Puppeteer browser...');
    
    if (this.options.reuseSession) {
      // Use shared browser for session reuse
      logger.debug('Using shared browser for session reuse...');
      this.browser = await ESPNTokenExtractor.getSharedBrowser({
        headless: this.options.headless
      });
    } else {
      // Create new browser instance
      this.browser = await puppeteer.launch({
        headless: this.options.headless ? 'new' : false,
        defaultViewport: { width: 1280, height: 720 },
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      });
    }

    this.page = await this.browser.newPage();
    
    // Set user agent
    await this.page.setUserAgent(this.options.userAgent);
    
    // Set viewport
    await this.page.setViewport({ width: 1280, height: 720 });

    // Enable request interception for performance
    await this.page.setRequestInterception(true);
    this.page.on('request', (request) => {
      // Block unnecessary resources
      const resourceType = request.resourceType();
      if (resourceType === 'image' || resourceType === 'stylesheet' || resourceType === 'font') {
        request.abort();
      } else {
        request.continue();
      }
    });

    logger.debug('Browser launched successfully');
  }

  /**
   * Check if user is already logged in
   */
  async checkIfLoggedIn() {
    try {
      // Look for elements that indicate logged in state
      const loggedInIndicators = [
        'a[data-testid="my-account"]',
        '.user-menu',
        '[data-testid="profile-menu"]',
        'button[data-testid="my-account"]'
      ];

      for (const selector of loggedInIndicators) {
        const element = await this.page.$(selector);
        if (element) {
          return true;
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Click the login button
   */
  async clickLoginButton() {
    try {
      // First, let's see what's actually on the page
      const pageTitle = await this.page.title();
      logger.debug(`Page title: ${pageTitle}`);
      
      // Check if we're already on a login page
      const url = this.page.url();
      logger.debug(`Current URL: ${url}`);
      
      if (url.includes('disneyid') || url.includes('registerdisney') || url.includes('login')) {
        logger.info('Already on login page, skipping login button click');
        return;
      }

      // Get all links on the page for debugging
      const allLinks = await this.page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        return links.slice(0, 10).map(link => ({
          text: link.textContent?.trim().substring(0, 50),
          href: link.href,
          id: link.id,
          className: link.className
        }));
      });
      logger.debug('First 10 links on page:', JSON.stringify(allLinks, null, 2));

      // Common login button selectors - Updated for current ESPN site
      const loginSelectors = [
        'a[data-testid="login"]',
        'a[data-module="login"]', 
        'button[data-testid="login"]',
        'a[href*="login"]',
        '.account-login',
        '[title="Log In"]',
        // Additional selectors for ESPN Fantasy
        'a[href*="members.espn.com"]',
        'a[href*="disney"]',
        'a[href*="disneyid"]',
        'a[href*="registerdisney"]'
      ];

      let clicked = false;
      for (const selector of loginSelectors) {
        try {
          const element = await this.page.$(selector);
          if (element) {
            await element.click();
            clicked = true;
            logger.debug(`Clicked login button: ${selector}`);
            break;
          }
        } catch (error) {
          // Try next selector
          continue;
        }
      }

      // If no standard selectors worked, try text-based approach
      if (!clicked) {
        logger.debug('Trying text-based login link detection...');
        const loginLinkFound = await this.page.evaluate(() => {
          const links = Array.from(document.querySelectorAll('a'));
          for (const link of links) {
            const text = link.textContent?.toLowerCase() || '';
            const href = link.href || '';
            if ((text.includes('log in') || text.includes('sign in') || text.includes('login')) ||
                (href.includes('login') || href.includes('disney') || href.includes('registerdisney'))) {
              link.click();
              return { text: link.textContent, href: link.href };
            }
          }
          return null;
        });
        
        if (loginLinkFound) {
          clicked = true;
          logger.debug(`Clicked login link via text: ${JSON.stringify(loginLinkFound)}`);
        }
      }

      if (!clicked) {
        // Take a screenshot for debugging
        await this.page.screenshot({ 
          path: '/tmp/login-button-debug.png',
          fullPage: false 
        });
        logger.debug('Login button debug screenshot saved to /tmp/login-button-debug.png');
        throw new Error('Could not find login button');
      }

      // Wait for login page to load
      await this.page.waitForTimeout(2000);

    } catch (error) {
      throw new Error(`Failed to click login button: ${error.message}`);
    }
  }

  /**
   * Handle Disney ID iframe login
   */
  async handleDisneyLogin(credentials) {
    try {
      // Take a screenshot after clicking login to see what loaded
      await this.page.screenshot({ 
        path: '/tmp/after-login-click.png',
        fullPage: true 
      });
      logger.debug('Screenshot after login click saved to /tmp/after-login-click.png');
      
      // Log current URL after clicking login
      const currentUrl = this.page.url();
      logger.debug(`Current URL after login click: ${currentUrl}`);
      
      // Check what's actually on the page
      const pageTitle = await this.page.title();
      logger.debug(`Page title after login click: ${pageTitle}`);
      
      // Wait a bit for page to load
      await this.page.waitForTimeout(3000);
      
      // Check for different Disney login patterns
      const possibleSelectors = [
        'iframe[name="disneyid-iframe"]',
        'iframe[src*="disney"]',
        'iframe[src*="registerdisney"]',
        'iframe[id*="disney"]',
        '#disneyid-iframe',
        '.disney-iframe',
        'iframe[title*="Disney"]'
      ];
      
      let loginFrame = null;
      let frameSelector = null;
      
      // Try to find any Disney-related iframe
      for (const selector of possibleSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 3000 });
          frameSelector = selector;
          logger.debug(`Found iframe with selector: ${selector}`);
          break;
        } catch (error) {
          // Continue to next selector
        }
      }
      
      if (!frameSelector) {
        // Check if we're on Disney Terms of Use page - handle it properly
        if (currentUrl.includes('disneytermsofuse.com')) {
          logger.info('Detected Disney Terms page - processing terms agreement');
          await this.handleDisneyTermsPage();
          
          // Wait for redirect after terms are accepted
          await this.page.waitForTimeout(3000);
          const newUrl = this.page.url();
          logger.debug(`URL after processing terms: ${newUrl}`);
          
          // Check if we're now on a Disney login page
          if (newUrl.includes('disney') || newUrl.includes('registerdisney') || newUrl.includes('accounts.disney')) {
            logger.info('Redirected to Disney login page after terms');
            await this.handleDirectDisneyLogin(credentials);
            return;
          }
        }
        
        // Check if we're directly on a Disney login page (no iframe)
        if (currentUrl.includes('disney') || currentUrl.includes('registerdisney')) {
          logger.info('Detected direct Disney login page (no iframe)');
          await this.handleDirectDisneyLogin(credentials);
          return;
        }
        
        // List all iframes on the page
        const allIframes = await this.page.evaluate(() => {
          const iframes = Array.from(document.querySelectorAll('iframe'));
          return iframes.map(iframe => ({
            name: iframe.name,
            src: iframe.src,
            id: iframe.id,
            title: iframe.title
          }));
        });
        logger.debug('All iframes on page:', JSON.stringify(allIframes, null, 2));
        
        throw new Error('Could not find Disney ID login iframe');
      }

      // Get the iframe
      const frames = await this.page.frames();
      loginFrame = frames.find(frame => 
        frame.name() === 'disneyid-iframe' || 
        frame.url().includes('disney') ||
        frame.url().includes('registerdisney')
      );

      if (!loginFrame) {
        throw new Error('Could not access Disney ID login iframe');
      }

      // Wait for email field
      await loginFrame.waitForSelector('input[type="email"], input[name="email"], input[placeholder*="email" i]', {
        timeout: 10000
      });

      // Enter email
      logger.debug('Entering email...');
      await loginFrame.type('input[type="email"], input[name="email"], input[placeholder*="email" i]', credentials.email, {
        delay: 100 // Human-like typing
      });

      // Click continue or submit
      const continueSelectors = [
        'button[type="submit"]',
        'button[data-testid="continue"]',
        'input[type="submit"]',
        'button:contains("Continue")'
      ];

      let submitted = false;
      for (const selector of continueSelectors) {
        try {
          await loginFrame.click(selector);
          submitted = true;
          break;
        } catch (error) {
          continue;
        }
      }

      if (!submitted) {
        throw new Error('Could not find email submit button');
      }

      // Wait for password field
      await loginFrame.waitForSelector('input[type="password"]', {
        timeout: 10000
      });

      // Enter password
      logger.debug('Entering password...');
      await loginFrame.type('input[type="password"]', credentials.password, {
        delay: 100
      });

      // Submit login form
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button[data-testid="sign-in"]'
      ];

      submitted = false;
      for (const selector of submitSelectors) {
        try {
          await loginFrame.click(selector);
          submitted = true;
          break;
        } catch (error) {
          continue;
        }
      }

      if (!submitted) {
        throw new Error('Could not find login submit button');
      }

      logger.debug('Login form submitted');

    } catch (error) {
      throw new Error(`Disney login failed: ${error.message}`);
    }
  }

  /**
   * Handle Disney Terms of Use page
   */
  async handleDisneyTermsPage() {
    try {
      logger.debug('Starting comprehensive Disney Terms page handling...');
      
      // Wait for page to fully load
      await this.page.waitForTimeout(3000);
      
      // Take a screenshot for debugging
      try {
        await this.page.screenshot({ path: '/tmp/disney-terms-before-processing.png' });
        logger.debug('Disney Terms page screenshot saved to /tmp/disney-terms-before-processing.png');
      } catch (e) {
        logger.debug('Could not save screenshot:', e.message);
      }

      // STRATEGY 1: Scroll to bottom to find agreement button
      logger.debug('Scrolling to bottom of Disney Terms page to find agreement button...');
      await this.page.evaluate(() => {
        // Scroll to the very bottom of the page
        window.scrollTo(0, document.body.scrollHeight);
      });
      
      // Wait for any dynamic content to load
      await this.page.waitForTimeout(2000);
      
      // Try to find and click agreement button at bottom
      const bottomButtonClicked = await this.page.evaluate(() => {
        // Look for all buttons/links near the bottom of the page
        const allElements = Array.from(document.querySelectorAll('button, a, input[type="submit"], [role="button"]'));
        const pageHeight = document.body.scrollHeight;
        
        for (const element of allElements) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const text = (element.textContent || element.value || '').toLowerCase().trim();
          
          // Check if element is in bottom 30% of page
          const isNearBottom = elementTop > (pageHeight * 0.7);
          
          // Check if text suggests it's an agreement button
          const isAgreementButton = text.includes('agree') || 
                                   text.includes('accept') || 
                                   text.includes('continue') ||
                                   text.includes('confirm') ||
                                   text.includes('proceed') ||
                                   text.includes('ok') ||
                                   text.includes('next');
          
          if (isNearBottom && isAgreementButton && rect.width > 0 && rect.height > 0) {
            try {
              element.click();
              return { 
                success: true, 
                clicked: text,
                position: `${elementTop}px from top (page height: ${pageHeight}px)`
              };
            } catch (e) {
              // Continue to next element
            }
          }
        }
        
        return { success: false, reason: 'No agreement buttons found at bottom of page' };
      });
      
      logger.debug('Bottom button click result:', JSON.stringify(bottomButtonClicked, null, 2));
      
      if (bottomButtonClicked.success) {
        await this.page.waitForTimeout(3000);
        const currentUrl = this.page.url();
        if (!currentUrl.includes('disneytermsofuse.com')) {
          logger.info('Successfully clicked agreement button at bottom of page!');
          return;
        }
      }
      
      // STRATEGY 2: Skip direct navigation (breaks auth tokens)
      // Direct navigation bypasses necessary authentication setup
      logger.debug('Skipping direct navigation to preserve authentication tokens');
      
      // STRATEGY 3: Reveal hidden elements and comprehensive scrolling
      logger.debug('Scrolling to reveal all page elements...');
      
      // Try multiple scroll strategies
      await this.page.evaluate(() => {
        // Scroll to bottom
        window.scrollTo(0, document.body.scrollHeight);
        document.documentElement.scrollTop = document.documentElement.scrollHeight;
        
        // Try scrolling the html element too
        const htmlElement = document.documentElement;
        htmlElement.scrollTop = htmlElement.scrollHeight;
        
        // Force show any hidden elements
        const hiddenElements = document.querySelectorAll('[style*="display: none"], [style*="visibility: hidden"]');
        hiddenElements.forEach(el => {
          el.style.display = 'block';
          el.style.visibility = 'visible';
        });
      });
      
      // STRATEGY 4: Try clicking all red elements at bottom of page
      logger.debug('Attempting to click any red elements in footer area...');
      const redElementsResult = await this.page.evaluate(() => {
        const allElements = Array.from(document.querySelectorAll('*'));
        const redElements = [];
        
        for (const el of allElements) {
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          
          // Check if element is in footer area (bottom 30% of page)
          const isInFooter = rect.bottom > window.innerHeight * 0.7;
          
          // Check if element has red background
          const hasRedBackground = style.backgroundColor.includes('red') || 
                                  style.backgroundColor.includes('rgb(255,') ||
                                  style.backgroundColor.includes('#ff') ||
                                  style.backgroundColor.includes('#FF');
          
          // Skip navigation elements explicitly
          const text = (el.textContent || '').toLowerCase().trim();
          const isNavigationElement = text.includes('skip to content') || 
                                    text.includes('skip to main') ||
                                    text.includes('skip navigation') ||
                                    el.getAttribute('href') === '#main-content' ||
                                    el.className.includes('skip-link') ||
                                    el.className.includes('sr-only');
          
          // Only consider elements that look like consent buttons
          const isConsentButton = text.includes('agree') || 
                                text.includes('accept') || 
                                text.includes('continue') || 
                                text.includes('confirm') ||
                                text.includes('proceed') ||
                                text.includes('ok') ||
                                text.includes('allow');
          
          if (isInFooter && hasRedBackground && rect.width > 50 && rect.height > 20 && !isNavigationElement) {
            redElements.push({
              tag: el.tagName,
              text: el.textContent?.trim() || '',
              className: el.className,
              background: style.backgroundColor,
              position: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
              isNavigationElement,
              isConsentButton
            });
            
            // Only click if it looks like a consent button (not just any red element)
            if (isConsentButton) {
              try {
                el.click();
                return { 
                  success: true, 
                  clicked: el.textContent?.trim() || el.tagName,
                  allRedElements: redElements
                };
              } catch (e) {
                // Continue to next element
              }
            }
          }
        }
        
        return { success: false, allRedElements: redElements };
      });
      
      logger.debug('Red elements click result:', JSON.stringify(redElementsResult, null, 2));
      
      // Log detailed information about what was found
      if (redElementsResult.allRedElements && redElementsResult.allRedElements.length > 0) {
        logger.debug('All red elements found:');
        redElementsResult.allRedElements.forEach((el, index) => {
          logger.debug(`  ${index + 1}. ${el.tag} - "${el.text}" - Nav: ${el.isNavigationElement}, Consent: ${el.isConsentButton}`);
        });
      } else {
        logger.debug('No red elements found in footer area');
      }
      
      if (redElementsResult.success) {
        await this.page.waitForTimeout(3000);
        const currentUrl = this.page.url();
        if (!currentUrl.includes('disneytermsofuse.com')) {
          logger.info('Successfully clicked red footer element!');
          return;
        }
      }
      
      // STRATEGY 5: Ultra-comprehensive element detection with scoring
      logger.debug('Performing ultra-comprehensive button search with scoring...');
      const agreeButtonClicked = await this.page.evaluate(() => {
        // Look for all possible clickable elements
        const clickableSelectors = [
          'button', 'a', 'input[type="submit"]', 'div[onclick]', '[role="button"]', 
          '.btn', '.button', 'span[onclick]', 'div[role="button"]', '*[data-testid*="button"]',
          '*[data-testid*="agree"]', '*[data-testid*="continue"]', '*[data-testid*="accept"]'
        ];
        let foundElements = [];
        
        for (const selector of clickableSelectors) {
          const elements = Array.from(document.querySelectorAll(selector));
          for (const element of elements) {
            const style = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            const text = (element.textContent || '').toLowerCase().trim();
            
            // Check if element is actually clickable and visible
            const isActuallyClickable = element.tagName === 'BUTTON' || 
                                      element.tagName === 'A' || 
                                      element.tagName === 'INPUT' ||
                                      element.getAttribute('onclick') ||
                                      element.getAttribute('role') === 'button' ||
                                      style.cursor === 'pointer';
            
            const isVisible = rect.width > 0 && rect.height > 0 && 
                            style.visibility !== 'hidden' && 
                            style.display !== 'none';
            
            // Score elements based on how likely they are to be the AGREE button
            let score = 0;
            
            // High priority: contains both "agree" and "continue", or "confirm" and "choices"
            if ((text.includes('agree') && text.includes('continue')) || 
                (text.includes('confirm') && text.includes('choices'))) {
              score += 100;
            }
            // Medium priority: contains "agree", "confirm", "accept", or key action words
            else if (text.includes('agree') || text.includes('accept') || text.includes('i agree') || 
                     text.includes('confirm') || text.includes('confirm my choices')) {
              score += 50;
            }
            // Low priority: contains "continue", "next", "choices"
            else if (text.includes('continue') || text.includes('next') || text.includes('proceed') || 
                     text.includes('choices')) {
              score += 25;
            }
            
            // Additional scoring factors
            if (rect.bottom > window.innerHeight * 0.7) score += 10; // In footer area
            if (style.backgroundColor.includes('red') || style.backgroundColor.includes('rgb(255,')) score += 15; // Red background
            if (element.className.toLowerCase().includes('btn') || element.className.toLowerCase().includes('button')) score += 5;
            
            // Negative scoring to avoid wrong elements
            if (text.includes('terms of use') || text.includes('privacy') || text.includes('policy')) score -= 50;
            if (element.className.includes('df-terms-of-use')) score -= 100; // Specifically avoid this class
            
            // Skip navigation elements completely
            if (text.includes('skip to content') || text.includes('skip to main') || 
                text.includes('skip navigation') || element.getAttribute('href') === '#main-content' ||
                element.className.includes('skip-link') || element.className.includes('sr-only')) {
              score = -1000; // Ensure these never get selected
            }
            
            foundElements.push({
              element: element.tagName,
              className: element.className,
              id: element.id,
              text: text,
              backgroundColor: style.backgroundColor,
              position: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
              isActuallyClickable,
              isVisible,
              score,
              cursor: style.cursor
            });
          }
        }
        
        // Sort by score (highest first) and only consider visible, clickable elements
        const validElements = foundElements.filter(el => el.isActuallyClickable && el.isVisible && el.score > 0);
        validElements.sort((a, b) => b.score - a.score);
        
        if (validElements.length > 0) {
          const bestElement = validElements[0];
          // Find the actual DOM element to click
          const allElements = Array.from(document.querySelectorAll('*'));
          for (const element of allElements) {
            if (element.tagName === bestElement.element && 
                element.className === bestElement.className &&
                (element.textContent || '').toLowerCase().trim() === bestElement.text) {
              element.click();
              return {
                clicked: true,
                clickedElement: bestElement,
                allFoundElements: foundElements,
                validElements: validElements
              };
            }
          }
        }
        
        return { 
          clicked: false, 
          allFoundElements: foundElements,
          validElements: validElements
        };
      });
      
      logger.debug('Agree button click attempt result:', JSON.stringify(agreeButtonClicked, null, 2));
      
      if (agreeButtonClicked.clicked) {
        logger.debug('Successfully clicked footer element, waiting for navigation...');
        await this.page.waitForTimeout(3000);
        
        // Check if URL changed - if not, try coordinate-based clicking
        const currentUrl = this.page.url();
        if (currentUrl.includes('disneytermsofuse.com')) {
          logger.debug('URL did not change after click, trying coordinate-based approach...');
          
          // Try clicking on the red footer area by coordinates
          const redFooterCoordinates = await this.page.evaluate(() => {
            // Look for elements with red backgrounds at the bottom
            const elements = Array.from(document.querySelectorAll('*'));
            for (const element of elements) {
              const style = window.getComputedStyle(element);
              const rect = element.getBoundingClientRect();
              
              if ((style.backgroundColor.includes('red') || 
                   style.backgroundColor.includes('rgb(255,') ||
                   style.backgroundColor.includes('rgb(204,') || // Disney red variants
                   element.className.toLowerCase().includes('footer') ||
                   element.className.toLowerCase().includes('bottom')) &&
                  rect.bottom > window.innerHeight * 0.7 &&
                  rect.width > 200) {
                return {
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2,
                  element: element.tagName,
                  className: element.className,
                  backgroundColor: style.backgroundColor
                };
              }
            }
            
            // Fallback: click in the bottom center where the button should be
            return {
              x: window.innerWidth / 2,
              y: window.innerHeight * 0.9,
              element: 'FALLBACK',
              className: 'bottom-center-click'
            };
          });
          
          logger.debug('Attempting coordinate-based click:', JSON.stringify(redFooterCoordinates, null, 2));
          
          // Click at the coordinates
          await this.page.mouse.click(redFooterCoordinates.x, redFooterCoordinates.y);
          await this.page.waitForTimeout(3000);
          
          // Check if this worked
          const urlAfterCoordinateClick = this.page.url();
          if (!urlAfterCoordinateClick.includes('disneytermsofuse.com')) {
            logger.debug('Coordinate-based click succeeded!');
            return;
          }
        } else {
          return;
        }
      }
      
      // First, let's debug what clickable elements are actually on the page after scrolling
      const allButtons = await this.page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], a, [role="button"], div[onclick], div[style*="cursor"], .clickable, .btn'));
        return buttons.map((btn, index) => {
          const rect = btn.getBoundingClientRect();
          const style = window.getComputedStyle(btn);
          return {
            index,
            tagName: btn.tagName,
            text: btn.textContent?.trim().substring(0, 50),
            value: btn.value || '',
            className: btn.className,
            id: btn.id,
            type: btn.type || '',
            visible: btn.offsetHeight > 0 && btn.offsetWidth > 0,
            inViewport: rect.top >= 0 && rect.bottom <= window.innerHeight,
            atBottom: rect.bottom > window.innerHeight * 0.8,
            backgroundColor: style.backgroundColor,
            cursor: style.cursor,
            position: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
          };
        });
      });
      logger.debug('All buttons on Disney Terms page (after scroll):', JSON.stringify(allButtons, null, 2));
      
      // Multiple selectors for the agree button (including footer-specific selectors)
      const agreeSelectors = [
        // Footer-specific buttons (red button at bottom)
        'footer button',
        '.footer button',
        '#footer button',
        '.terms-footer button',
        '.bottom-bar button',
        'div[style*="background"] button',
        'div[style*="red"] button',
        // Standard agree button variations
        'button:contains("AGREE AND CONTINUE")',
        'button:contains("Agree and Continue")',
        'button:contains("AGREE")',
        'button:contains("Continue")',
        'input[type="submit"][value*="AGREE"]',
        'input[type="submit"][value*="Continue"]',
        'button[data-testid*="agree"]',
        '.agree-button',
        '#agree-button',
        '[type="submit"]',
        'button[type="submit"]'
      ];
      
      let clicked = false;
      
      // Try standard button selectors first
      for (const selector of agreeSelectors) {
        try {
          const elements = await this.page.$$(selector);
          for (const element of elements) {
            const isVisible = await element.isIntersectingViewport();
            if (isVisible) {
              await element.click();
              clicked = true;
              logger.debug(`Clicked agree button: ${selector}`);
              break;
            }
          }
          if (clicked) break;
        } catch (error) {
          continue;
        }
      }
      
      // If no standard selector worked, try comprehensive text-based approach
      if (!clicked) {
        logger.debug('Trying comprehensive text-based button detection...');
        const agreeClicked = await this.page.evaluate(() => {
          // Get all clickable elements
          const elements = Array.from(document.querySelectorAll('*'));
          const clickableElements = elements.filter(el => {
            const isButton = el.tagName === 'BUTTON' || 
                           el.tagName === 'INPUT' || 
                           el.tagName === 'A' || 
                           el.getAttribute('role') === 'button' ||
                           el.onclick ||
                           el.style.cursor === 'pointer';
            const isVisible = el.offsetHeight > 0 && el.offsetWidth > 0;
            return isButton && isVisible;
          });
          
          for (const element of clickableElements) {
            const text = element.textContent?.toLowerCase() || '';
            const value = (element.value || '').toLowerCase();
            const ariaLabel = (element.getAttribute('aria-label') || '').toLowerCase();
            
            // Look for agree, continue, accept, submit terms
            if (text.includes('agree') || text.includes('continue') || text.includes('accept') ||
                value.includes('agree') || value.includes('continue') || value.includes('accept') ||
                ariaLabel.includes('agree') || ariaLabel.includes('continue') || ariaLabel.includes('accept') ||
                (text.includes('submit') && text.includes('terms'))) {
              
              try {
                element.click();
                return { 
                  text: element.textContent?.substring(0, 100), 
                  value: element.value, 
                  tagName: element.tagName,
                  className: element.className
                };
              } catch (e) {
                // Try clicking parent element if direct click fails
                try {
                  if (element.parentElement) {
                    element.parentElement.click();
                    return { 
                      text: element.textContent?.substring(0, 100), 
                      value: element.value, 
                      tagName: element.tagName + ' (parent)',
                      className: element.className
                    };
                  }
                } catch (e2) {
                  // Continue to next element
                }
              }
            }
          }
          return null;
        });
        
        if (agreeClicked) {
          clicked = true;
          logger.debug(`Clicked button via comprehensive search: ${JSON.stringify(agreeClicked)}`);
        }
      }
      
      // If still no success, try clicking the last visible button (often the primary action)
      if (!clicked) {
        logger.debug('Trying to click the last visible button as fallback...');
        const lastButtonClicked = await this.page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], [role="button"]'))
            .filter(btn => btn.offsetHeight > 0 && btn.offsetWidth > 0);
          
          if (buttons.length > 0) {
            const lastButton = buttons[buttons.length - 1];
            try {
              lastButton.click();
              return { 
                text: lastButton.textContent?.substring(0, 100), 
                tagName: lastButton.tagName,
                className: lastButton.className
              };
            } catch (e) {
              return null;
            }
          }
          return null;
        });
        
        if (lastButtonClicked) {
          clicked = true;
          logger.debug(`Clicked last visible button as fallback: ${JSON.stringify(lastButtonClicked)}`);
        }
      }
      
      if (!clicked) {
        // Take a screenshot for debugging
        await this.page.screenshot({ 
          path: '/tmp/disney-terms-buttons-debug.png',
          fullPage: true 
        });
        logger.debug('Disney terms button debug screenshot saved to /tmp/disney-terms-buttons-debug.png');
        throw new Error('Could not find any clickable button on Disney terms page');
      }
      
      // Wait for navigation after clicking agree
      logger.debug('Waiting for navigation after clicking terms button...');
      await this.page.waitForTimeout(3000);
      
    } catch (error) {
      throw new Error(`Disney terms handling failed: ${error.message}`);
    }
  }

  /**
   * Handle direct Disney login page (without iframe)
   */
  async handleDirectDisneyLogin(credentials) {
    try {
      logger.debug('Handling direct Disney login page...');
      
      // Wait for email field on main page - try multiple selectors
      const emailSelectors = [
        'input[type="email"]',
        'input[name="email"]', 
        'input[placeholder*="email" i]',
        'input[placeholder="Email"]',
        'input[type="text"]',
        'input'
      ];
      
      let emailInput = null;
      for (const selector of emailSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 2000 });
          emailInput = selector;
          logger.debug(`Found email input with selector: ${selector}`);
          break;
        } catch (e) {
          logger.debug(`Email selector failed: ${selector}`);
        }
      }
      
      if (!emailInput) {
        throw new Error('Could not find email input field');
      }

      // Enter email
      logger.debug('Entering email on direct page...');
      await this.page.type(emailInput, credentials.email, {
        delay: 100
      });

      // Click continue or submit
      const continueSelectors = [
        'button[type="submit"]',
        'button[data-testid="continue"]',
        'input[type="submit"]',
        'button:contains("Continue")'
      ];

      let submitted = false;
      for (const selector of continueSelectors) {
        try {
          await this.page.click(selector);
          submitted = true;
          break;
        } catch (error) {
          continue;
        }
      }

      if (!submitted) {
        throw new Error('Could not find email submit button on direct page');
      }

      // Wait for password field
      await this.page.waitForSelector('input[type="password"]', {
        timeout: 10000
      });

      // Enter password
      logger.debug('Entering password on direct page...');
      await this.page.type('input[type="password"]', credentials.password, {
        delay: 100
      });

      // Submit login form
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button[data-testid="sign-in"]'
      ];

      submitted = false;
      for (const selector of submitSelectors) {
        try {
          await this.page.click(selector);
          submitted = true;
          break;
        } catch (error) {
          continue;
        }
      }

      if (!submitted) {
        throw new Error('Could not find login submit button on direct page');
      }

      logger.debug('Login form submitted on direct page');

    } catch (error) {
      throw new Error(`Direct Disney login failed: ${error.message}`);
    }
  }

  /**
   * Check for 2FA requirement
   */
  async check2FA() {
    try {
      // Wait briefly for potential 2FA prompt
      await this.page.waitForTimeout(3000);

      const twoFASelectors = [
        'input[name="verificationCode"]',
        'input[placeholder*="verification" i]',
        'input[placeholder*="code" i]',
        '[data-testid="verification-code"]'
      ];

      for (const selector of twoFASelectors) {
        const element = await this.page.$(selector);
        if (element) {
          return true;
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Wait for successful login
   */
  async waitForLoginSuccess() {
    try {
      // Wait for either successful login or error
      await Promise.race([
        // Success indicators
        this.page.waitForSelector('a[data-testid="my-account"]', { timeout: 15000 }),
        this.page.waitForSelector('.user-menu', { timeout: 15000 }),
        this.page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }),
        
        // Or wait for fantasy page URL
        this.page.waitForFunction(
          () => window.location.href.includes('fantasy.espn.com') && 
                !window.location.href.includes('login'),
          { timeout: 15000 }
        )
      ]);

      logger.debug('Login appears successful');
      
    } catch (error) {
      // Check for login errors
      const errorElement = await this.page.$('.error-message, .alert-error, [data-testid="error"]');
      if (errorElement) {
        const errorText = await errorElement.textContent();
        throw new Error(`Login failed: ${errorText}`);
      }
      
      throw new Error('Login timeout - check credentials');
    }
  }

  /**
   * Extract ESPN cookies from the browser
   */
  async extractCookies() {
    try {
      // Get all cookies from ESPN domains
      const cookies = await this.page.cookies();
      
      // Find espn_s2 and SWID cookies
      const espnS2 = cookies.find(cookie => cookie.name === 'espn_s2');
      const swid = cookies.find(cookie => cookie.name === 'SWID');

      if (!espnS2 || !swid) {
        logger.warn('Missing cookies. Found cookies:', cookies.map(c => c.name));
        throw new Error('Failed to extract ESPN authentication cookies. Missing espn_s2 or SWID.');
      }

      // Validate cookie format
      if (espnS2.value.length < 50) {
        throw new Error('espn_s2 cookie appears invalid (too short)');
      }

      if (!swid.value.startsWith('{') || !swid.value.endsWith('}')) {
        throw new Error('SWID cookie appears invalid (wrong format)');
      }

      logger.info('Successfully extracted ESPN cookies');
      logger.debug(`espn_s2 length: ${espnS2.value.length}`);
      logger.debug(`SWID format: ${swid.value.substring(0, 15)}...`);

      // Save all cookies for future use to avoid Disney Terms
      await this.saveCookies(cookies);
      logger.info('Saved cookies for future authentication');

      return {
        success: true,
        tokens: {
          espn_s2: espnS2.value,
          swid: swid.value
        },
        metadata: {
          extracted_at: new Date().toISOString(),
          espn_s2_length: espnS2.value.length,
          swid_format: swid.value.length,
          method: 'puppeteer'
        }
      };

    } catch (error) {
      throw new Error(`Cookie extraction failed: ${error.message}`);
    }
  }

  /**
   * Categorize errors for better handling
   */
  categorizeError(error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('timeout')) {
      return 'TIMEOUT_ERROR';
    } else if (message.includes('2fa') || message.includes('verification')) {
      return '2FA_REQUIRED';
    } else if (message.includes('login') || message.includes('credentials')) {
      return 'LOGIN_ERROR';
    } else if (message.includes('iframe') || message.includes('disney')) {
      return 'IFRAME_ERROR';
    } else if (message.includes('cookie')) {
      return 'COOKIE_EXTRACTION_ERROR';
    } else {
      return 'UNKNOWN_ERROR';
    }
  }

  /**
   * Clean up browser resources
   */
  async cleanup() {
    try {
      if (this.page) {
        await this.page.close();
        this.page = null;
      }
      
      if (this.browser) {
        if (this.options.reuseSession) {
          // Don't close shared browser, just reset timer
          ESPNTokenExtractor.resetBrowserCleanupTimer();
          logger.debug('Page closed, browser session kept alive for reuse');
        } else {
          // Close individual browser instance
          await this.browser.close();
          logger.debug('Individual browser instance closed');
        }
        this.browser = null;
      }
      
      logger.debug('Browser cleanup completed');
    } catch (error) {
      logger.warn('Browser cleanup error:', error);
    }
  }

  /**
   * Validate extracted tokens
   * @param {Object} tokens - Extracted tokens
   */
  static validateTokens(tokens) {
    if (!tokens || !tokens.espn_s2 || !tokens.swid) {
      return {
        valid: false,
        error: 'Missing required tokens'
      };
    }

    // Validate espn_s2 format
    if (tokens.espn_s2.length < 100) {
      return {
        valid: false,
        error: 'espn_s2 token appears too short'
      };
    }

    // Validate SWID format
    if (!tokens.swid.match(/^\{[0-9A-F-]{36}\}$/i)) {
      return {
        valid: false,
        error: 'SWID token format is invalid'
      };
    }

    return {
      valid: true,
      message: 'Tokens appear valid'
    };
  }
}

module.exports = ESPNTokenExtractor;