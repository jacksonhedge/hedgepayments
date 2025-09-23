/**
 * LeagueLink Client SDK
 * Client-side integration for Plaid-style fantasy sports authentication
 */

class LeagueLinkClient {
    constructor(clientId, environment = 'sandbox') {
        this.clientId = clientId;
        this.baseUrl = environment === 'production' 
            ? 'https://api.leaguelink.io' 
            : 'http://localhost:3000';
        this.environment = environment;
    }

    /**
     * Initialize platform connection - opens popup for user authentication
     * @param {string} platform - Platform to connect ('espn', 'yahoo', 'sleeper')
     * @param {string} redirectUri - Your app's callback URL
     * @returns {Promise} - Resolves with public_token on success
     */
    async connect(platform, redirectUri) {
        try {
            // Step 1: Initialize connection and get link token
            const linkResponse = await fetch(`${this.baseUrl}/api/v1/auth/link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    platform: platform,
                    client_id: this.clientId,
                    redirect_uri: redirectUri
                })
            });

            if (!linkResponse.ok) {
                const error = await linkResponse.json();
                throw new Error(error.error_message || 'Failed to initialize connection');
            }

            const linkData = await linkResponse.json();

            // Step 2: Open popup window for user authentication
            return new Promise((resolve, reject) => {
                const width = 500;
                const height = 700;
                const left = window.screen.width / 2 - width / 2;
                const top = window.screen.height / 2 - height / 2;

                const popup = window.open(
                    linkData.auth_url,
                    'leaguelink-auth',
                    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
                );

                if (!popup) {
                    reject(new Error('Popup blocked. Please allow popups for this site.'));
                    return;
                }

                // Listen for auth completion
                const messageHandler = (event) => {
                    // Verify origin for security
                    if (!event.origin.includes(this.baseUrl.replace(/^https?:\/\//, ''))) {
                        return;
                    }

                    if (event.data.type === 'LEAGUELINK_AUTH_SUCCESS') {
                        window.removeEventListener('message', messageHandler);
                        popup.close();
                        resolve({
                            public_token: event.data.public_token,
                            platform: event.data.platform,
                            leagues_found: event.data.leagues_found
                        });
                    } else if (event.data.type === 'LEAGUELINK_AUTH_ERROR') {
                        window.removeEventListener('message', messageHandler);
                        popup.close();
                        reject(new Error(event.data.error || 'Authentication failed'));
                    }
                };

                window.addEventListener('message', messageHandler);

                // Handle popup being closed without completion
                const checkClosed = setInterval(() => {
                    if (popup.closed) {
                        clearInterval(checkClosed);
                        window.removeEventListener('message', messageHandler);
                        reject(new Error('Authentication cancelled by user'));
                    }
                }, 1000);

                // Timeout after 5 minutes
                setTimeout(() => {
                    clearInterval(checkClosed);
                    window.removeEventListener('message', messageHandler);
                    if (!popup.closed) {
                        popup.close();
                    }
                    reject(new Error('Authentication timeout'));
                }, 300000);
            });

        } catch (error) {
            throw new Error(`${platform} connection failed: ${error.message}`);
        }
    }

    /**
     * Connect ESPN account specifically
     */
    async connectESPN(redirectUri) {
        return this.connect('espn', redirectUri);
    }

    /**
     * Connect Yahoo account (future implementation)
     */
    async connectYahoo(redirectUri) {
        return this.connect('yahoo', redirectUri);
    }

    /**
     * Connect Sleeper account (future implementation)
     */
    async connectSleeper(redirectUri) {
        return this.connect('sleeper', redirectUri);
    }

    /**
     * Exchange public token for access token
     * @param {string} publicToken - Token from successful authentication
     * @param {string} clientSecret - Your client secret
     * @returns {Promise} - Access token and item info
     */
    async exchangeToken(publicToken, clientSecret) {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/auth/exchange`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    public_token: publicToken,
                    client_id: this.clientId,
                    secret: clientSecret
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error_message || 'Token exchange failed');
            }

            return await response.json();

        } catch (error) {
            throw new Error(`Token exchange failed: ${error.message}`);
        }
    }

    /**
     * Get user's fantasy leagues
     * @param {string} accessToken - Access token from exchange
     * @returns {Promise} - Array of user's leagues
     */
    async getLeagues(accessToken) {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/leagues`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch leagues');
            }

            return await response.json();

        } catch (error) {
            throw new Error(`Leagues fetch failed: ${error.message}`);
        }
    }

    /**
     * Get specific league details
     * @param {string} accessToken - Access token
     * @param {string} leagueId - League ID
     * @returns {Promise} - League details
     */
    async getLeague(accessToken, leagueId) {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/leagues/${leagueId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch league');
            }

            return await response.json();

        } catch (error) {
            throw new Error(`League fetch failed: ${error.message}`);
        }
    }

    /**
     * Get team roster
     * @param {string} accessToken - Access token
     * @param {string} leagueId - League ID
     * @param {string} teamId - Team ID (optional)
     * @returns {Promise} - Team roster
     */
    async getRoster(accessToken, leagueId, teamId = null) {
        const url = teamId 
            ? `${this.baseUrl}/api/v1/leagues/${leagueId}/teams/${teamId}/roster`
            : `${this.baseUrl}/api/v1/leagues/${leagueId}/roster`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch roster');
            }

            return await response.json();

        } catch (error) {
            throw new Error(`Roster fetch failed: ${error.message}`);
        }
    }

    /**
     * Get current matchups
     * @param {string} accessToken - Access token
     * @param {string} leagueId - League ID
     * @param {number} week - Week number (optional)
     * @returns {Promise} - Matchup data
     */
    async getMatchups(accessToken, leagueId, week = null) {
        const url = week 
            ? `${this.baseUrl}/api/v1/leagues/${leagueId}/matchups?week=${week}`
            : `${this.baseUrl}/api/v1/leagues/${leagueId}/matchups`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch matchups');
            }

            return await response.json();

        } catch (error) {
            throw new Error(`Matchups fetch failed: ${error.message}`);
        }
    }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LeagueLinkClient;
} else if (typeof define === 'function' && define.amd) {
    define([], function() {
        return LeagueLinkClient;
    });
} else {
    window.LeagueLinkClient = LeagueLinkClient;
}