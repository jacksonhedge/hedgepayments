/**
 * ESPN API Client - Direct API Access
 * Communicates directly with ESPN's lm-api-reads.fantasy.espn.com endpoints
 * Based on the revolutionary discovery that ESPN has real APIs!
 */

const axios = require('axios');
const logger = require('../../utils/logger');
const { getRedisClient } = require('../cache/redis-client');

class ESPNAPIClient {
  constructor() {
    this.baseUrl = process.env.ESPN_BASE_URL || 'https://lm-api-reads.fantasy.espn.com/apis/v3/games';
    this.timeout = parseInt(process.env.REQUEST_TIMEOUT) || 10000;
    this.redis = getRedisClient();
    
    // ESPN API endpoint definitions
    this.endpoints = {
      football: '/ffl/seasons/{year}/segments/0/leagues/{leagueId}',
      basketball: '/fba/seasons/{year}/segments/0/leagues/{leagueId}'
    };

    // Available views for different data sets
    this.views = {
      roster: 'mRoster',           // Team rosters
      standings: 'mStandings',     // League standings  
      settings: 'mSettings',       // League settings
      teams: 'mTeam',             // Team info
      schedule: 'mSchedule',       // Game schedule
      draft: 'mDraftDetail',       // Draft information
      transactions: 'mTransactions2', // Trades/waiver wire
      scoreboard: 'mScoreboard',   // Current week scores
      matchup: 'mMatchup'          // Matchup details
    };

    // Create axios instance with defaults
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    // Add request/response interceptors
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor for logging and authentication
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`ESPN API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('ESPN API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging and error handling
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`ESPN API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        if (error.response) {
          const { status, data } = error.response;
          logger.error(`ESPN API Error ${status}:`, data);
          
          // Handle specific ESPN error codes
          if (status === 401) {
            error.espnError = 'ESPN_AUTH_EXPIRED';
            error.espnMessage = 'ESPN authentication tokens have expired';
          } else if (status === 403) {
            error.espnError = 'ESPN_ACCESS_DENIED';
            error.espnMessage = 'Access denied to this ESPN league';
          } else if (status === 404) {
            error.espnError = 'ESPN_LEAGUE_NOT_FOUND';
            error.espnMessage = 'ESPN league not found or not accessible';
          } else if (status >= 500) {
            error.espnError = 'ESPN_SERVER_ERROR';
            error.espnMessage = 'ESPN servers are experiencing issues';
          }
        } else if (error.code === 'ECONNABORTED') {
          error.espnError = 'ESPN_TIMEOUT';
          error.espnMessage = 'ESPN API request timed out';
        } else {
          error.espnError = 'ESPN_NETWORK_ERROR';
          error.espnMessage = 'Network error connecting to ESPN';
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Make authenticated request to ESPN API
   * @param {string} endpoint - API endpoint path
   * @param {Object} tokens - ESPN authentication tokens
   * @param {string} sport - Sport type (football/basketball)
   */
  async makeRequest(endpoint, tokens, sport = 'football') {
    try {
      if (!tokens || !tokens.espn_s2 || !tokens.swid) {
        throw new Error('Missing ESPN authentication tokens (espn_s2 or swid)');
      }

      const url = `${this.baseUrl}${endpoint}`;
      
      logger.info(`Making ESPN API request: ${endpoint}`);

      const response = await this.client.get(endpoint, {
        headers: {
          'Cookie': `espn_s2=${tokens.espn_s2}; SWID=${tokens.swid}`,
        }
      });

      return {
        success: true,
        data: response.data,
        status: response.status,
        headers: response.headers
      };

    } catch (error) {
      logger.error(`ESPN API request failed: ${endpoint}`, error.message);
      
      return {
        success: false,
        error: error.espnError || 'ESPN_API_ERROR',
        message: error.espnMessage || error.message,
        status: error.response?.status || 0
      };
    }
  }

  /**
   * Get comprehensive league data
   * @param {string} leagueId - ESPN League ID
   * @param {number} year - Season year
   * @param {Object} tokens - ESPN authentication tokens
   * @param {Array} views - Data views to include
   */
  async getLeagueData(leagueId, year = new Date().getFullYear(), tokens, views = ['mRoster', 'mStandings', 'mSettings', 'mTeam']) {
    const cacheKey = `espn_league:${leagueId}:${year}:${views.join(',')}`;
    
    try {
      // Check cache first (5 minute TTL)
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        logger.debug(`Cache hit for league ${leagueId}`);
        return {
          success: true,
          data: cached,
          cached: true
        };
      }

      const viewParams = views.map(v => `view=${v}`).join('&');
      const endpoint = this.endpoints.football
        .replace('{year}', year)
        .replace('{leagueId}', leagueId) + `?${viewParams}`;

      const result = await this.makeRequest(endpoint, tokens, 'football');
      
      if (result.success) {
        // Cache successful results for 5 minutes
        await this.redis.set(cacheKey, result.data, 300);
      }

      return result;

    } catch (error) {
      logger.error(`Failed to get league data for ${leagueId}:`, error);
      return {
        success: false,
        error: 'LEAGUE_DATA_ERROR',
        message: error.message
      };
    }
  }

  /**
   * Get league roster data only
   */
  async getLeagueRoster(leagueId, year = new Date().getFullYear(), tokens) {
    return this.getLeagueData(leagueId, year, tokens, ['mRoster']);
  }

  /**
   * Get league standings only
   */
  async getLeagueStandings(leagueId, year = new Date().getFullYear(), tokens) {
    return this.getLeagueData(leagueId, year, tokens, ['mStandings']);
  }

  /**
   * Get league settings only
   */
  async getLeagueSettings(leagueId, year = new Date().getFullYear(), tokens) {
    return this.getLeagueData(leagueId, year, tokens, ['mSettings']);
  }

  /**
   * Get live scores and current matchups
   */
  async getLiveScores(leagueId, year = new Date().getFullYear(), tokens) {
    return this.getLeagueData(leagueId, year, tokens, ['mScoreboard', 'mMatchup']);
  }

  /**
   * Get draft information
   */
  async getDraftData(leagueId, year = new Date().getFullYear(), tokens) {
    return this.getLeagueData(leagueId, year, tokens, ['mDraftDetail', 'mSettings']);
  }

  /**
   * Get recent transactions (trades, adds, drops)
   */
  async getTransactions(leagueId, year = new Date().getFullYear(), tokens) {
    return this.getLeagueData(leagueId, year, tokens, ['mTransactions2']);
  }

  /**
   * Get league schedule
   */
  async getSchedule(leagueId, year = new Date().getFullYear(), tokens) {
    return this.getLeagueData(leagueId, year, tokens, ['mSchedule']);
  }

  /**
   * Fetch multiple leagues at once
   * @param {Array} leagueIds - Array of league IDs
   * @param {number} year - Season year
   * @param {Object} tokens - ESPN authentication tokens
   */
  async getMultipleLeagues(leagueIds, year = new Date().getFullYear(), tokens) {
    try {
      if (!Array.isArray(leagueIds) || leagueIds.length === 0) {
        throw new Error('League IDs must be a non-empty array');
      }

      logger.info(`Fetching ${leagueIds.length} ESPN leagues for year ${year}`);

      // Use Promise.allSettled to handle partial failures
      const promises = leagueIds.map(id => 
        this.getLeagueData(id, year, tokens, ['mRoster', 'mStandings', 'mSettings', 'mTeam'])
      );

      const results = await Promise.allSettled(promises);
      
      const successful = [];
      const errors = [];

      results.forEach((result, index) => {
        const leagueId = leagueIds[index];
        
        if (result.status === 'fulfilled' && result.value.success) {
          successful.push({
            leagueId,
            data: result.value.data,
            cached: result.value.cached
          });
        } else {
          errors.push({
            leagueId,
            error: result.status === 'fulfilled' ? result.value.error : 'PROMISE_REJECTED',
            message: result.status === 'fulfilled' ? result.value.message : result.reason?.message
          });
        }
      });

      return {
        success: successful.length > 0,
        leagues: successful,
        errors: errors,
        total_requested: leagueIds.length,
        successful_count: successful.length,
        error_count: errors.length
      };

    } catch (error) {
      logger.error('Failed to fetch multiple leagues:', error);
      return {
        success: false,
        error: 'MULTIPLE_LEAGUES_ERROR',
        message: error.message,
        leagues: [],
        errors: leagueIds.map(id => ({ leagueId: id, error: 'REQUEST_FAILED', message: error.message }))
      };
    }
  }

  /**
   * Validate ESPN authentication tokens
   * @param {Object} tokens - ESPN authentication tokens
   * @param {string} testLeagueId - Optional league ID to test access
   */
  async validateTokens(tokens, testLeagueId = null) {
    try {
      if (!tokens || !tokens.espn_s2 || !tokens.swid) {
        return {
          valid: false,
          error: 'MISSING_TOKENS',
          message: 'Missing espn_s2 or swid tokens'
        };
      }

      // If we have a test league ID, try to access it
      if (testLeagueId) {
        const result = await this.getLeagueSettings(testLeagueId, new Date().getFullYear(), tokens);
        
        if (result.success) {
          return {
            valid: true,
            message: 'Tokens are valid and have league access'
          };
        } else if (result.error === 'ESPN_AUTH_EXPIRED') {
          return {
            valid: false,
            error: 'TOKENS_EXPIRED',
            message: 'ESPN authentication tokens have expired'
          };
        } else {
          return {
            valid: false,
            error: 'ACCESS_DENIED',
            message: 'Tokens are invalid or league is not accessible'
          };
        }
      }

      // Basic token format validation
      const espnS2Valid = tokens.espn_s2.length > 100; // ESPN S2 tokens are typically 250+ chars
      const swidValid = tokens.swid.startsWith('{') && tokens.swid.endsWith('}') && tokens.swid.length > 30;

      if (!espnS2Valid || !swidValid) {
        return {
          valid: false,
          error: 'INVALID_FORMAT',
          message: 'Token format appears invalid'
        };
      }

      return {
        valid: true,
        message: 'Token format appears valid (no league test performed)'
      };

    } catch (error) {
      logger.error('Token validation error:', error);
      return {
        valid: false,
        error: 'VALIDATION_ERROR',
        message: error.message
      };
    }
  }

  /**
   * Clear cached data for a specific league
   */
  async clearCache(leagueId, year = new Date().getFullYear()) {
    try {
      const pattern = `espn_league:${leagueId}:${year}:*`;
      const keys = await this.redis.keys(pattern);
      
      if (keys.length > 0) {
        const pipeline = this.redis.getClient().pipeline();
        keys.forEach(key => pipeline.del(key));
        await pipeline.exec();
        
        logger.info(`Cleared ${keys.length} cached entries for league ${leagueId}`);
      }
      
      return { success: true, cleared: keys.length };
      
    } catch (error) {
      logger.error(`Failed to clear cache for league ${leagueId}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get API health and connection status
   */
  async healthCheck() {
    try {
      // Test basic connectivity to ESPN API
      const testUrl = '/ffl/seasons/2024/segments/0/leagues/0'; // This should return 404 but confirm connectivity
      
      const startTime = Date.now();
      const response = await this.client.get(testUrl).catch(err => err.response);
      const responseTime = Date.now() - startTime;
      
      const redisHealth = await this.redis.healthCheck();

      return {
        status: 'healthy',
        espn_api: {
          reachable: true,
          response_time: responseTime,
          base_url: this.baseUrl
        },
        redis: redisHealth,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error('ESPN API health check failed:', error);
      
      return {
        status: 'unhealthy',
        error: error.message,
        espn_api: {
          reachable: false,
          error: error.espnError || 'NETWORK_ERROR'
        },
        redis: await this.redis.healthCheck(),
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = ESPNAPIClient;