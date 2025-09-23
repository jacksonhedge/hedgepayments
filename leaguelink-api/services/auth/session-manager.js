/**
 * Session Manager
 * Handles Plaid-style authentication flow with Redis storage
 * Manages link tokens, public tokens, and access tokens
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const { v4: uuidv4 } = require('uuid');
const { getRedisClient } = require('../cache/redis-client');
const logger = require('../../utils/logger');

class SessionManager {
  constructor() {
    this.redis = getRedisClient();
    this.jwtSecret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
    this.encryptionKey = process.env.ENCRYPTION_KEY || 'fallback-key-change-in-production';
    
    // Token expiration times (in seconds)
    this.expirations = {
      linkToken: 15 * 60,        // 15 minutes
      publicToken: 30 * 60,      // 30 minutes  
      accessToken: 90 * 24 * 60 * 60, // 90 days
      sessionData: 24 * 60 * 60  // 24 hours
    };

    if (this.jwtSecret === 'fallback-secret-change-in-production') {
      logger.warn('Using fallback JWT secret - set JWT_SECRET environment variable in production!');
    }
  }

  /**
   * Store link token data
   * @param {string} linkToken - Link token ID
   * @param {Object} data - Link token data (client_id, redirect_uri, etc.)
   */
  async storeLinkToken(linkToken, data) {
    try {
      const tokenData = {
        ...data,
        created_at: new Date().toISOString(),
        token_type: 'link_token'
      };

      const key = `link_token:${linkToken}`;
      await this.redis.set(key, tokenData, this.expirations.linkToken);
      
      logger.debug(`Stored link token: ${linkToken}`);
      return true;

    } catch (error) {
      logger.error('Failed to store link token:', error);
      throw new Error('Failed to store link token');
    }
  }

  /**
   * Get link token data
   * @param {string} linkToken - Link token ID
   */
  async getLinkToken(linkToken) {
    try {
      const key = `link_token:${linkToken}`;
      const data = await this.redis.get(key);
      
      if (!data) {
        logger.debug(`Link token not found: ${linkToken}`);
        return null;
      }

      // Check if expired
      const createdAt = new Date(data.created_at);
      const expiresAt = new Date(createdAt.getTime() + (this.expirations.linkToken * 1000));
      
      if (new Date() > expiresAt) {
        await this.redis.del(key);
        logger.debug(`Link token expired: ${linkToken}`);
        return null;
      }

      return data;

    } catch (error) {
      logger.error('Failed to get link token:', error);
      return null;
    }
  }

  /**
   * Store ESPN authentication tokens securely
   * @param {string} publicToken - Public token ID
   * @param {Object} espnTokens - ESPN tokens (espn_s2, swid)
   * @param {Object} metadata - Additional metadata
   */
  async storeESPNTokens(publicToken, espnTokens, metadata = {}) {
    try {
      // Encrypt sensitive ESPN tokens
      const encryptedTokens = {
        espn_s2: this.encrypt(espnTokens.espn_s2),
        swid: this.encrypt(espnTokens.swid)
      };

      const tokenData = {
        platform: 'espn',
        encrypted_tokens: encryptedTokens,
        metadata: {
          ...metadata,
          created_at: new Date().toISOString(),
          last_used: new Date().toISOString()
        },
        token_type: 'public_token'
      };

      const key = `public_token:${publicToken}`;
      await this.redis.set(key, tokenData, this.expirations.publicToken);
      
      logger.info(`Stored ESPN tokens for public token: ${publicToken}`);
      return true;

    } catch (error) {
      logger.error('Failed to store ESPN tokens:', error);
      throw new Error('Failed to store ESPN tokens');
    }
  }

  /**
   * Get ESPN tokens by public token
   * @param {string} publicToken - Public token ID
   */
  async getESPNTokens(publicToken) {
    try {
      const key = `public_token:${publicToken}`;
      const data = await this.redis.get(key);
      
      if (!data) {
        logger.debug(`Public token not found: ${publicToken}`);
        return null;
      }

      // Decrypt ESPN tokens
      const decryptedTokens = {
        espn_s2: this.decrypt(data.encrypted_tokens.espn_s2),
        swid: this.decrypt(data.encrypted_tokens.swid)
      };

      return {
        platform: data.platform,
        tokens: decryptedTokens,
        metadata: data.metadata
      };

    } catch (error) {
      logger.error('Failed to get ESPN tokens:', error);
      return null;
    }
  }

  /**
   * Store access token mapping
   * @param {string} accessToken - JWT access token
   * @param {string} itemId - Item ID
   * @param {Object} tokens - ESPN tokens
   */
  async storeAccessMapping(accessToken, itemId, tokens) {
    try {
      // Encrypt ESPN tokens for long-term storage
      const encryptedTokens = {
        espn_s2: this.encrypt(tokens.espn_s2),
        swid: this.encrypt(tokens.swid)
      };

      const accessData = {
        item_id: itemId,
        platform: 'espn',
        encrypted_tokens: encryptedTokens,
        created_at: new Date().toISOString(),
        last_used: new Date().toISOString(),
        token_type: 'access_token'
      };

      const key = `access_token:${accessToken}`;
      await this.redis.set(key, accessData, this.expirations.accessToken);
      
      logger.info(`Stored access token mapping for item: ${itemId}`);
      return true;

    } catch (error) {
      logger.error('Failed to store access mapping:', error);
      throw new Error('Failed to store access token mapping');
    }
  }

  /**
   * Get tokens from access token
   * @param {string} accessToken - JWT access token
   */
  async getTokensFromAccess(accessToken) {
    try {
      // Verify JWT token first
      const decoded = jwt.verify(accessToken, this.jwtSecret);
      
      if (decoded.type !== 'espn_access') {
        throw new Error('Invalid access token type');
      }

      const key = `access_token:${accessToken}`;
      const data = await this.redis.get(key);
      
      if (!data) {
        logger.debug(`Access token not found: ${accessToken.substring(0, 20)}...`);
        return null;
      }

      // Update last used timestamp
      data.last_used = new Date().toISOString();
      await this.redis.set(key, data, this.expirations.accessToken);

      // Decrypt ESPN tokens
      const decryptedTokens = {
        espn_s2: this.decrypt(data.encrypted_tokens.espn_s2),
        swid: this.decrypt(data.encrypted_tokens.swid)
      };

      return {
        platform: data.platform,
        tokens: decryptedTokens,
        item_id: data.item_id,
        metadata: {
          created_at: data.created_at,
          last_used: data.last_used
        }
      };

    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        logger.debug('Invalid JWT access token');
        return null;
      } else if (error.name === 'TokenExpiredError') {
        logger.debug('JWT access token expired');
        return null;
      }
      
      logger.error('Failed to get tokens from access token:', error);
      return null;
    }
  }

  /**
   * Store authentication session data
   * @param {string} sessionId - Session ID
   * @param {Object} sessionData - Session data
   */
  async storeAuthSession(sessionId, sessionData) {
    try {
      const data = {
        ...sessionData,
        created_at: new Date().toISOString(),
        last_update: new Date().toISOString(),
        status: sessionData.status || 'pending'
      };

      const key = `auth_session:${sessionId}`;
      await this.redis.set(key, data, this.expirations.sessionData);
      
      logger.debug(`Stored auth session: ${sessionId}`);
      return true;

    } catch (error) {
      logger.error('Failed to store auth session:', error);
      throw new Error('Failed to store authentication session');
    }
  }

  /**
   * Get authentication session data
   * @param {string} sessionId - Session ID
   */
  async getAuthSession(sessionId) {
    try {
      const key = `auth_session:${sessionId}`;
      const data = await this.redis.get(key);
      
      if (!data) {
        logger.debug(`Auth session not found: ${sessionId}`);
        return null;
      }

      return data;

    } catch (error) {
      logger.error('Failed to get auth session:', error);
      return null;
    }
  }

  /**
   * Update authentication session
   * @param {string} sessionId - Session ID
   * @param {Object} updates - Updates to apply
   */
  async updateAuthSession(sessionId, updates) {
    try {
      const existing = await this.getAuthSession(sessionId);
      
      if (!existing) {
        throw new Error('Session not found');
      }

      const updated = {
        ...existing,
        ...updates,
        last_update: new Date().toISOString()
      };

      const key = `auth_session:${sessionId}`;
      await this.redis.set(key, updated, this.expirations.sessionData);
      
      logger.debug(`Updated auth session: ${sessionId}`);
      return true;

    } catch (error) {
      logger.error('Failed to update auth session:', error);
      throw new Error('Failed to update authentication session');
    }
  }

  /**
   * Delete authentication session
   * @param {string} sessionId - Session ID
   */
  async deleteAuthSession(sessionId) {
    try {
      const key = `auth_session:${sessionId}`;
      const result = await this.redis.del(key);
      
      logger.debug(`Deleted auth session: ${sessionId}`);
      return result > 0;

    } catch (error) {
      logger.error('Failed to delete auth session:', error);
      return false;
    }
  }

  /**
   * Revoke access token
   * @param {string} accessToken - JWT access token
   */
  async revokeAccessToken(accessToken) {
    try {
      const key = `access_token:${accessToken}`;
      const result = await this.redis.del(key);
      
      logger.info(`Revoked access token`);
      return result > 0;

    } catch (error) {
      logger.error('Failed to revoke access token:', error);
      return false;
    }
  }

  /**
   * Clean up expired tokens
   */
  async cleanupExpiredTokens() {
    try {
      const patterns = [
        'link_token:*',
        'public_token:*',
        'auth_session:*'
      ];

      let totalCleaned = 0;

      for (const pattern of patterns) {
        const keys = await this.redis.keys(pattern);
        
        for (const key of keys) {
          const data = await this.redis.get(key);
          
          if (data && data.created_at) {
            const createdAt = new Date(data.created_at);
            const maxAge = this.getMaxAgeForKey(key);
            const expiresAt = new Date(createdAt.getTime() + maxAge);
            
            if (new Date() > expiresAt) {
              await this.redis.del(key);
              totalCleaned++;
            }
          }
        }
      }

      if (totalCleaned > 0) {
        logger.info(`Cleaned up ${totalCleaned} expired tokens`);
      }

      return totalCleaned;

    } catch (error) {
      logger.error('Failed to cleanup expired tokens:', error);
      return 0;
    }
  }

  /**
   * Get max age for a key based on its type
   */
  getMaxAgeForKey(key) {
    if (key.startsWith('link_token:')) return this.expirations.linkToken * 1000;
    if (key.startsWith('public_token:')) return this.expirations.publicToken * 1000;
    if (key.startsWith('auth_session:')) return this.expirations.sessionData * 1000;
    return 24 * 60 * 60 * 1000; // 24 hours default
  }

  /**
   * Get session statistics
   */
  async getStats() {
    try {
      const patterns = [
        'link_token:*',
        'public_token:*', 
        'access_token:*',
        'auth_session:*'
      ];

      const stats = {};

      for (const pattern of patterns) {
        const keys = await this.redis.keys(pattern);
        const type = pattern.replace(':*', '');
        stats[type] = keys.length;
      }

      return stats;

    } catch (error) {
      logger.error('Failed to get session stats:', error);
      return {};
    }
  }

  /**
   * Generate secure tokens
   */
  generateLinkToken() {
    return `link_${uuidv4()}`;
  }

  generatePublicToken() {
    return `public_${uuidv4()}`;
  }

  generateItemId() {
    return `item_${uuidv4()}`;
  }

  generateAccessToken(itemId) {
    return jwt.sign(
      { 
        item_id: itemId, 
        type: 'espn_access',
        iat: Math.floor(Date.now() / 1000)
      },
      this.jwtSecret,
      { expiresIn: '90d' }
    );
  }

  /**
   * Encrypt sensitive data
   * @param {string} text - Text to encrypt
   */
  encrypt(text) {
    try {
      return crypto.AES.encrypt(text, this.encryptionKey).toString();
    } catch (error) {
      logger.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt sensitive data
   * @param {string} encryptedText - Encrypted text
   */
  decrypt(encryptedText) {
    try {
      const bytes = crypto.AES.decrypt(encryptedText, this.encryptionKey);
      return bytes.toString(crypto.enc.Utf8);
    } catch (error) {
      logger.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Health check for session manager
   */
  async healthCheck() {
    try {
      const redisHealth = await this.redis.healthCheck();
      const stats = await this.getStats();

      return {
        status: redisHealth.healthy ? 'healthy' : 'unhealthy',
        redis: redisHealth,
        active_sessions: stats,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error('Session manager health check failed:', error);
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = SessionManager;