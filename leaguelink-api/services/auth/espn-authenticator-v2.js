/**
 * ESPN Authenticator Service V2
 * Simplified ESPN authentication using the new token extractor
 * Provides clean Plaid-style authentication flow
 */

const ESPNTokenExtractor = require('./espn-token-extractor');
const SessionManager = require('./session-manager');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');

class ESPNAuthenticator {
    constructor(options = {}) {
        this.tokenExtractor = new ESPNTokenExtractor({
            headless: options.headless !== false,
            timeout: options.timeout || 30000,
            ...options
        });
        this.sessionManager = new SessionManager();
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
     * Submit credentials and extract ESPN cookies
     */
    async submitCredentials(sessionId, credentials) {
        try {
            logger.info(`Starting ESPN authentication for session: ${sessionId}`);

            // Update session status
            await this.sessionManager.updateAuthSession(sessionId, {
                status: 'extracting_tokens'
            });

            // Use the token extractor to get ESPN cookies
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

            // Generate public token
            const publicToken = this.sessionManager.generatePublicToken();
            
            // Store ESPN tokens securely with encryption
            await this.sessionManager.storeESPNTokens(publicToken, extractionResult.tokens, {
                session_id: sessionId,
                extracted_at: extractionResult.metadata?.extracted_at || new Date().toISOString(),
                method: 'puppeteer_v2',
                espn_s2_length: extractionResult.metadata?.espn_s2_length,
                swid_format: extractionResult.metadata?.swid_format
            });

            // Update session as completed
            await this.sessionManager.updateAuthSession(sessionId, {
                status: 'completed',
                public_token: publicToken,
                tokens_validated: true
            });

            logger.info(`ESPN authentication successful for session: ${sessionId}`);

            return {
                success: true,
                public_token: publicToken,
                platform: 'espn',
                message: 'Authentication successful - ESPN cookies extracted',
                tokens_extracted: true,
                metadata: {
                    extraction_method: 'automated_puppeteer',
                    token_validation: validation.message,
                    session_id: sessionId
                }
            };

        } catch (error) {
            logger.error(`ESPN authentication failed for session ${sessionId}:`, error);
            
            await this.sessionManager.updateAuthSession(sessionId, {
                status: 'error',
                error: error.message
            });

            return {
                success: false,
                error: error.message,
                type: this.categorizeError(error),
                session_id: sessionId
            };
        }
    }

    /**
     * Get authentication session status (for polling)
     */
    async getSessionStatus(sessionId) {
        try {
            const session = await this.sessionManager.getAuthSession(sessionId);
            
            if (!session) {
                return {
                    found: false,
                    error: 'Session not found or expired'
                };
            }

            return {
                found: true,
                status: session.status,
                last_update: session.last_update,
                error: session.error || null,
                platform: session.platform || 'espn'
            };
        } catch (error) {
            logger.error(`Failed to get session status for ${sessionId}:`, error);
            return {
                found: false,
                error: 'Failed to retrieve session status'
            };
        }
    }

    /**
     * Exchange public token for access token
     */
    async exchangePublicToken(publicToken, clientId, clientSecret) {
        try {
            // Validate client credentials (basic validation for development)
            if (!this.validateClient(clientId, clientSecret)) {
                throw new Error('Invalid client credentials');
            }

            // Get ESPN tokens from public token
            const tokenData = await this.sessionManager.getESPNTokens(publicToken);
            if (!tokenData) {
                throw new Error('Public token expired or invalid');
            }

            // Generate permanent access token and item ID
            const itemId = this.sessionManager.generateItemId();
            const accessToken = this.sessionManager.generateAccessToken(itemId);

            // Store access token mapping
            await this.sessionManager.storeAccessMapping(accessToken, itemId, tokenData.tokens);

            logger.info(`Token exchange successful for item: ${itemId}`);

            return {
                success: true,
                access_token: accessToken,
                item_id: itemId,
                platform: 'espn',
                request_id: uuidv4()
            };

        } catch (error) {
            logger.error('Token exchange failed:', error);
            throw error;
        }
    }

    /**
     * Validate ESPN tokens by testing API access
     */
    async validateTokens(tokens, testLeagueId = null) {
        try {
            // Format validation first
            const formatValidation = ESPNTokenExtractor.validateTokens(tokens);
            if (!formatValidation.valid) {
                return formatValidation;
            }

            // TODO: Test actual API access if testLeagueId provided
            if (testLeagueId) {
                // This would use the ESPN API client to test access
                // const apiClient = new ESPNAPIClient();
                // const testResult = await apiClient.validateTokens(tokens, testLeagueId);
                // return testResult;
            }

            return {
                valid: true,
                message: 'Tokens appear valid (format check passed)'
            };

        } catch (error) {
            logger.error('Token validation failed:', error);
            return {
                valid: false,
                error: error.message
            };
        }
    }

    /**
     * Clean up expired sessions and browser resources
     */
    async cleanup() {
        try {
            await this.sessionManager.cleanupExpiredTokens();
            logger.info('ESPN authenticator cleanup completed');
        } catch (error) {
            logger.error('ESPN authenticator cleanup failed:', error);
        }
    }

    /**
     * Get authentication statistics
     */
    async getStats() {
        try {
            return await this.sessionManager.getStats();
        } catch (error) {
            logger.error('Failed to get auth stats:', error);
            return {};
        }
    }

    /**
     * Health check for the authenticator
     */
    async healthCheck() {
        try {
            const sessionHealth = await this.sessionManager.healthCheck();
            
            return {
                status: sessionHealth.status,
                components: {
                    session_manager: sessionHealth,
                    token_extractor: {
                        status: 'available',
                        headless_mode: this.tokenExtractor.options.headless
                    }
                },
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            logger.error('Authenticator health check failed:', error);
            return {
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    // Helper methods

    /**
     * Basic client validation for development
     */
    validateClient(clientId, clientSecret = null) {
        // In development, accept clients starting with 'client_'
        if (process.env.NODE_ENV === 'development') {
            return clientId && clientId.startsWith('client_');
        }

        // In production, validate against actual client credentials
        const validClientId = process.env.CLIENT_ID;
        const validClientSecret = process.env.CLIENT_SECRET;

        if (!validClientId || !validClientSecret) {
            logger.warn('CLIENT_ID and CLIENT_SECRET not configured');
            return false;
        }

        return clientId === validClientId && 
               (clientSecret === null || clientSecret === validClientSecret);
    }

    /**
     * Categorize errors for better handling
     */
    categorizeError(error) {
        const message = error.message?.toLowerCase() || '';
        
        if (message.includes('timeout')) {
            return 'TIMEOUT_ERROR';
        } else if (message.includes('2fa') || message.includes('verification')) {
            return '2FA_REQUIRED';
        } else if (message.includes('credentials') || message.includes('login')) {
            return 'INVALID_CREDENTIALS';
        } else if (message.includes('token') || message.includes('cookie')) {
            return 'TOKEN_EXTRACTION_ERROR';
        } else if (message.includes('validation')) {
            return 'TOKEN_VALIDATION_ERROR';
        } else {
            return 'AUTHENTICATION_ERROR';
        }
    }
}

module.exports = ESPNAuthenticator;