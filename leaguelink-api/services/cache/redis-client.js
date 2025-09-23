/**
 * Redis Client Service
 * Provides Redis connection and common operations for LeagueLink
 */

const Redis = require('ioredis');
const logger = require('../../utils/logger');

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    
    this.connect();
  }

  async connect() {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      
      logger.info(`Connecting to Redis: ${redisUrl}`);
      
      this.client = new Redis(redisUrl, {
        retryDelayOnFailover: 100,
        enableOfflineQueue: false,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        family: 4, // Use IPv4
      });

      // Connection event handlers
      this.client.on('connect', () => {
        logger.info('Redis connected successfully');
        this.isConnected = true;
        this.reconnectAttempts = 0;
      });

      this.client.on('ready', () => {
        logger.info('Redis is ready to receive commands');
      });

      this.client.on('error', (error) => {
        logger.error('Redis connection error:', error);
        this.isConnected = false;
      });

      this.client.on('close', () => {
        logger.warn('Redis connection closed');
        this.isConnected = false;
      });

      this.client.on('reconnecting', () => {
        this.reconnectAttempts++;
        logger.info(`Redis reconnecting... Attempt ${this.reconnectAttempts}`);
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          logger.error('Max reconnection attempts reached');
          this.client.disconnect();
        }
      });

      // Attempt initial connection
      await this.client.connect();
      
    } catch (error) {
      logger.error('Failed to initialize Redis client:', error);
      throw error;
    }
  }

  /**
   * Check if Redis is connected and healthy
   */
  async healthCheck() {
    try {
      if (!this.isConnected || !this.client) {
        return { status: 'disconnected', healthy: false };
      }

      const pong = await this.client.ping();
      
      if (pong === 'PONG') {
        return { status: 'connected', healthy: true };
      }
      
      return { status: 'error', healthy: false, message: 'Ping failed' };
      
    } catch (error) {
      logger.error('Redis health check failed:', error);
      return { status: 'error', healthy: false, message: error.message };
    }
  }

  /**
   * Set a key-value pair with optional expiration
   * @param {string} key - Redis key
   * @param {any} value - Value to store (will be JSON stringified)
   * @param {number} expiration - Expiration in seconds (optional)
   */
  async set(key, value, expiration = null) {
    try {
      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      
      if (expiration) {
        await this.client.setex(key, expiration, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
      
      logger.debug(`Redis SET: ${key} (expires: ${expiration ? expiration + 's' : 'never'})`);
      return true;
      
    } catch (error) {
      logger.error(`Redis SET error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get value by key
   * @param {string} key - Redis key
   * @param {boolean} parseJson - Whether to parse as JSON (default: true)
   */
  async get(key, parseJson = true) {
    try {
      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      const value = await this.client.get(key);
      
      if (value === null) {
        return null;
      }
      
      if (parseJson) {
        try {
          return JSON.parse(value);
        } catch (parseError) {
          // If parsing fails, return as string
          return value;
        }
      }
      
      logger.debug(`Redis GET: ${key}`);
      return value;
      
    } catch (error) {
      logger.error(`Redis GET error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Delete a key
   * @param {string} key - Redis key to delete
   */
  async del(key) {
    try {
      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      const result = await this.client.del(key);
      logger.debug(`Redis DEL: ${key} (deleted: ${result})`);
      return result;
      
    } catch (error) {
      logger.error(`Redis DEL error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Check if key exists
   * @param {string} key - Redis key
   */
  async exists(key) {
    try {
      if (!this.isConnected) {
        return false;
      }

      const result = await this.client.exists(key);
      return result === 1;
      
    } catch (error) {
      logger.error(`Redis EXISTS error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Set expiration for existing key
   * @param {string} key - Redis key
   * @param {number} seconds - Expiration in seconds
   */
  async expire(key, seconds) {
    try {
      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      const result = await this.client.expire(key, seconds);
      logger.debug(`Redis EXPIRE: ${key} (${seconds}s) - result: ${result}`);
      return result === 1;
      
    } catch (error) {
      logger.error(`Redis EXPIRE error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get keys matching pattern
   * @param {string} pattern - Pattern to match (e.g., "auth_session:*")
   */
  async keys(pattern) {
    try {
      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      const keys = await this.client.keys(pattern);
      logger.debug(`Redis KEYS: ${pattern} - found ${keys.length} keys`);
      return keys;
      
    } catch (error) {
      logger.error(`Redis KEYS error for pattern ${pattern}:`, error);
      throw error;
    }
  }

  /**
   * Hash operations for storing objects
   */
  async hset(key, field, value) {
    try {
      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      const result = await this.client.hset(key, field, serializedValue);
      logger.debug(`Redis HSET: ${key}.${field}`);
      return result;
      
    } catch (error) {
      logger.error(`Redis HSET error for ${key}.${field}:`, error);
      throw error;
    }
  }

  async hget(key, field, parseJson = true) {
    try {
      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      const value = await this.client.hget(key, field);
      
      if (value === null) {
        return null;
      }
      
      if (parseJson) {
        try {
          return JSON.parse(value);
        } catch (parseError) {
          return value;
        }
      }
      
      logger.debug(`Redis HGET: ${key}.${field}`);
      return value;
      
    } catch (error) {
      logger.error(`Redis HGET error for ${key}.${field}:`, error);
      throw error;
    }
  }

  async hgetall(key, parseJson = true) {
    try {
      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      const hash = await this.client.hgetall(key);
      
      if (!hash || Object.keys(hash).length === 0) {
        return null;
      }
      
      if (parseJson) {
        const parsed = {};
        for (const [field, value] of Object.entries(hash)) {
          try {
            parsed[field] = JSON.parse(value);
          } catch (parseError) {
            parsed[field] = value;
          }
        }
        return parsed;
      }
      
      logger.debug(`Redis HGETALL: ${key}`);
      return hash;
      
    } catch (error) {
      logger.error(`Redis HGETALL error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Increment a counter
   * @param {string} key - Redis key
   * @param {number} increment - Amount to increment (default: 1)
   */
  async incr(key, increment = 1) {
    try {
      if (!this.isConnected) {
        throw new Error('Redis not connected');
      }

      const result = increment === 1 
        ? await this.client.incr(key)
        : await this.client.incrby(key, increment);
        
      logger.debug(`Redis INCR: ${key} +${increment} = ${result}`);
      return result;
      
    } catch (error) {
      logger.error(`Redis INCR error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get Redis info and stats
   */
  async info() {
    try {
      if (!this.isConnected) {
        return { connected: false };
      }

      const info = await this.client.info();
      const keyspace = await this.client.info('keyspace');
      
      return {
        connected: true,
        info: info,
        keyspace: keyspace,
        memory: await this.client.memory('usage')
      };
      
    } catch (error) {
      logger.error('Redis INFO error:', error);
      return { connected: false, error: error.message };
    }
  }

  /**
   * Gracefully disconnect from Redis
   */
  async disconnect() {
    try {
      if (this.client) {
        await this.client.disconnect();
        logger.info('Redis client disconnected');
      }
    } catch (error) {
      logger.error('Error disconnecting Redis:', error);
    }
  }

  /**
   * Get the raw Redis client for advanced operations
   */
  getClient() {
    return this.client;
  }
}

// Export singleton instance
let redisClient = null;

function getRedisClient() {
  if (!redisClient) {
    redisClient = new RedisClient();
  }
  return redisClient;
}

module.exports = {
  RedisClient,
  getRedisClient
};