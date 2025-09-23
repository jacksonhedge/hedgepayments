/**
 * Authentication Routes
 * Plaid-style authentication endpoints with automated cookie extraction
 */

const express = require('express');
const ESPNAuthenticator = require('../../services/auth/espn-authenticator-v2');
const rateLimit = require('express-rate-limit');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');

const router = express.Router();
const espnAuth = new ESPNAuthenticator();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 auth attempts per IP
    message: 'Too many authentication attempts'
});

// Input validation schemas
const linkSchema = Joi.object({
    platform: Joi.string().valid('espn', 'yahoo', 'sleeper').required(),
    client_id: Joi.string().required(),
    redirect_uri: Joi.string().uri().required()
});

const credentialsSchema = Joi.object({
    session_id: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required()
});

const exchangeSchema = Joi.object({
    public_token: Joi.string().required(),
    client_id: Joi.string().required(),
    secret: Joi.string().required()
});

/**
 * @route   POST /api/v1/auth/link
 * @desc    Initialize platform connection - returns auth URL (Plaid-style)
 * @body    { platform, client_id, redirect_uri }
 */
router.post('/link', authLimiter, async (req, res) => {
    try {
        // Validate input
        const { error, value } = linkSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: 'INVALID_REQUEST',
                error_message: error.details[0].message
            });
        }

        const { platform, client_id, redirect_uri } = value;

        // Validate client credentials
        const isValidClient = await validateClient(client_id);
        if (!isValidClient) {
            return res.status(401).json({
                error: 'INVALID_CLIENT',
                error_message: 'Invalid client_id'
            });
        }

        // Initialize authentication session based on platform
        let result;
        if (platform === 'espn') {
            result = await espnAuth.initializeConnection(client_id, redirect_uri);
        } else {
            return res.status(400).json({
                error: 'PLATFORM_NOT_SUPPORTED',
                error_message: `Platform ${platform} is not yet supported`
            });
        }

        logger.info(`Initialized ${platform} auth session for client ${client_id}`);

        res.json({
            link_token: result.link_token,
            auth_url: result.auth_url,
            expiration: result.expiration,
            platform: platform
        });

    } catch (error) {
        logger.error('Link endpoint error:', error);
        res.status(500).json({
            error: 'INTERNAL_ERROR',
            error_message: 'Authentication initialization failed'
        });
    }
});

/**
 * @route   GET /api/v1/auth/espn/login
 * @desc    Serves the ESPN login page (popup window)
 * @query   session - Session ID from link token
 */
router.get('/espn/login', async (req, res) => {
    const { session } = req.query;
    
    if (!session) {
        return res.status(400).send('Invalid session');
    }

    try {
        // Initialize browser and prepare login form
        await espnAuth.handleESPNLogin(session, req.headers['user-agent']);

        // Serve the beautiful popup HTML
        const path = require('path');
        const fs = require('fs');
        const popupPath = path.join(__dirname, '../../client/auth-popup.html');
        
        if (fs.existsSync(popupPath)) {
            let html = fs.readFileSync(popupPath, 'utf8');
            // Inject the session ID into the HTML
            html = html.replace('new URLSearchParams(window.location.search).get(\'session\')', `'${session}'`);
            res.send(html);
        } else {
            // Fallback to inline HTML if file not found
            res.send(generateLoginPopupHTML(session));
        }

    } catch (error) {
        logger.error('ESPN login setup error:', error);
        res.status(500).send('Login initialization failed');
    }
});

/**
 * @route   POST /api/v1/auth/espn/credentials
 * @desc    Submit ESPN login credentials and extract cookies automatically
 * @body    { session_id, email, password }
 */
router.post('/espn/credentials', authLimiter, async (req, res) => {
    try {
        // Validate input
        const { error, value } = credentialsSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: 'INVALID_REQUEST',
                error_message: error.details[0].message
            });
        }

        const { session_id, email, password } = value;

        logger.info(`Processing ESPN credentials for session ${session_id} using Puppeteer extraction`);

        // Submit credentials and extract cookies using Puppeteer
        const result = await espnAuth.submitCredentials(session_id, {
            email,
            password
        });

        if (result.success) {
            res.json({
                success: true,
                public_token: result.public_token,
                platform: result.platform,
                message: result.message,
                tokens_extracted: result.tokens_extracted,
                extraction_method: 'automated_puppeteer',
                metadata: result.metadata
            });
        } else {
            const statusCode = result.requires2FA ? 428 : 400; // 428 = Precondition Required
            
            res.status(statusCode).json({
                success: false,
                error: result.error || 'AUTHENTICATION_FAILED',
                error_message: result.message || 'Login failed',
                error_type: result.type,
                requires_2fa: result.requires2FA || false,
                session_id: result.session_id
            });
        }

    } catch (error) {
        logger.error('Credentials submission error:', error);
        res.status(500).json({
            error: 'INTERNAL_ERROR',
            error_message: error.message || 'Authentication failed',
            error_type: 'SERVER_ERROR'
        });
    }
});

/**
 * @route   POST /api/v1/auth/exchange
 * @desc    Exchange public token for access token (Plaid-style)
 * @body    { public_token, client_id, secret }
 */
router.post('/exchange', async (req, res) => {
    try {
        // Validate input
        const { error, value } = exchangeSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: 'INVALID_REQUEST',
                error_message: error.details[0].message
            });
        }

        const { public_token, client_id, secret } = value;

        logger.info(`Processing token exchange for client ${client_id}`);

        // Exchange public token for access token using the new authenticator
        const result = await espnAuth.exchangePublicToken(public_token, client_id, secret);

        if (result.success) {
            res.json({
                access_token: result.access_token,
                item_id: result.item_id,
                request_id: result.request_id,
                platform: result.platform
            });
        } else {
            throw new Error(result.error || 'Token exchange failed');
        }

    } catch (error) {
        logger.error('Token exchange error:', error);
        
        if (error.message.includes('expired') || error.message.includes('invalid')) {
            res.status(400).json({
                error: 'INVALID_PUBLIC_TOKEN',
                error_message: 'Public token expired or invalid'
            });
        } else if (error.message.includes('credentials')) {
            res.status(401).json({
                error: 'INVALID_CREDENTIALS',
                error_message: 'Invalid client credentials'
            });
        } else {
            res.status(500).json({
                error: 'INTERNAL_ERROR',
                error_message: 'Token exchange failed'
            });
        }
    }
});

/**
 * @route   GET /api/v1/auth/status/:sessionId
 * @desc    Check authentication status (for polling)
 */
router.get('/status/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        logger.debug(`Checking status for session: ${sessionId}`);
        
        const sessionStatus = await espnAuth.getSessionStatus(sessionId);
        
        if (!sessionStatus.found) {
            return res.status(404).json({
                error: 'SESSION_NOT_FOUND',
                error_message: sessionStatus.error || 'Session expired or invalid'
            });
        }

        res.json({
            session_id: sessionId,
            status: sessionStatus.status,
            platform: sessionStatus.platform,
            last_update: sessionStatus.last_update,
            error: sessionStatus.error || null
        });

    } catch (error) {
        logger.error('Status check error:', error);
        res.status(500).json({
            error: 'INTERNAL_ERROR',
            error_message: 'Status check failed'
        });
    }
});

// Helper function to generate login popup HTML
function generateLoginPopupHTML(sessionId) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Connect ESPN Account - LeagueLink</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .container {
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                padding: 40px;
                width: 100%;
                max-width: 400px;
                text-align: center;
            }
            .logo {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #ee0979, #ff6a00);
                border-radius: 50%;
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 28px;
                font-weight: bold;
            }
            h1 { color: #333; margin-bottom: 10px; font-size: 24px; }
            p { color: #666; margin-bottom: 30px; line-height: 1.5; }
            .form-group { margin-bottom: 20px; text-align: left; }
            label { display: block; margin-bottom: 5px; color: #333; font-weight: 500; }
            input {
                width: 100%;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 16px;
                transition: border-color 0.3s;
            }
            input:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            .btn {
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .btn:hover { 
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
            }
            .btn:disabled { 
                background: #ccc; 
                cursor: not-allowed;
                transform: none;
            }
            .error {
                background: #fee;
                border: 1px solid #fcc;
                color: #c00;
                padding: 12px;
                border-radius: 6px;
                margin-bottom: 20px;
                display: none;
                text-align: left;
            }
            .success {
                background: #e7f5e7;
                border: 1px solid #4caf50;
                color: #2e7d2e;
                padding: 12px;
                border-radius: 6px;
                margin-bottom: 20px;
                display: none;
                text-align: left;
            }
            .loading { display: none; margin-top: 20px; }
            .spinner {
                border: 3px solid #f3f3f3;
                border-top: 3px solid #667eea;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 15px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .secure { 
                font-size: 12px; 
                color: #999; 
                margin-top: 20px; 
                padding-top: 20px; 
                border-top: 1px solid #eee; 
            }
            .espn-logo {
                width: 100px;
                margin: 0 auto 20px;
                opacity: 0.8;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">🏆</div>
            <h1>Connect ESPN Fantasy</h1>
            <p>Sign in with your ESPN account to import your fantasy leagues</p>
            
            <div id="error" class="error"></div>
            <div id="success" class="success"></div>
            
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">ESPN Email Address</label>
                    <input type="email" id="email" name="email" required 
                           placeholder="your@email.com" autocomplete="email">
                </div>
                
                <div class="form-group">
                    <label for="password">ESPN Password</label>
                    <input type="password" id="password" name="password" required 
                           placeholder="••••••••" autocomplete="current-password">
                </div>
                
                <button type="submit" class="btn" id="submitBtn">
                    Connect ESPN Account
                </button>
            </form>
            
            <div id="loading" class="loading">
                <div class="spinner"></div>
                <p style="color: #667eea; font-weight: 500;">Connecting to ESPN...</p>
                <p style="color: #999; font-size: 14px; margin-top: 10px;">This may take a moment</p>
            </div>
            
            <p class="secure">
                🔒 Your credentials are encrypted and never stored.<br>
                We only save session tokens for league access.
            </p>
        </div>

        <script>
            const form = document.getElementById('loginForm');
            const submitBtn = document.getElementById('submitBtn');
            const loading = document.getElementById('loading');
            const errorDiv = document.getElementById('error');
            const successDiv = document.getElementById('success');

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                if (!email || !password) {
                    showError('Please enter both email and password');
                    return;
                }

                // Show loading state
                form.style.display = 'none';
                loading.style.display = 'block';
                hideMessages();

                try {
                    const response = await fetch('/api/v1/auth/espn/credentials', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            session_id: '${sessionId}',
                            email: email,
                            password: password
                        })
                    });

                    const result = await response.json();

                    if (result.success) {
                        showSuccess('Success! ESPN cookies extracted and ready for use.');
                        
                        // Notify parent window and close popup
                        if (window.opener) {
                            window.opener.postMessage({
                                type: 'LEAGUELINK_AUTH_SUCCESS',
                                public_token: result.public_token,
                                platform: result.platform,
                                extraction_method: result.extraction_method,
                                tokens_extracted: result.tokens_extracted
                            }, '*');
                        }
                        
                        setTimeout(() => {
                            window.close();
                        }, 2000);
                        
                    } else {
                        if (result.requires_2fa) {
                            showError('Two-factor authentication is enabled on your ESPN account. Please disable it temporarily and try again.');
                        } else {
                            showError(result.error_message || 'Login failed. Please check your credentials and try again.');
                        }
                        resetForm();
                    }

                } catch (error) {
                    console.error('Auth error:', error);
                    showError('Connection failed. Please try again.');
                    resetForm();
                }
            });

            function showError(message) {
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
                successDiv.style.display = 'none';
            }

            function showSuccess(message) {
                successDiv.textContent = message;
                successDiv.style.display = 'block';
                errorDiv.style.display = 'none';
            }

            function hideMessages() {
                errorDiv.style.display = 'none';
                successDiv.style.display = 'none';
            }

            function resetForm() {
                form.style.display = 'block';
                loading.style.display = 'none';
                document.getElementById('password').value = '';
            }
        </script>
    </body>
    </html>
    `;
}

// Helper functions
async function validateClient(clientId) {
    // Use the ESPNAuthenticator's client validation
    return espnAuth.validateClient(clientId);
}

module.exports = router;