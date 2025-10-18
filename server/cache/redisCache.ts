import Redis from 'ioredis';
import { mockDb } from '../mock-db.js';

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000
};

// Create Redis client
let redis: Redis | null = null;

// Initialize Redis connection
export const initializeRedis = async (): Promise<boolean> => {
  try {
    if (process.env.REDIS_URL) {
      redis = new Redis(process.env.REDIS_URL, redisConfig);
    } else {
      redis = new Redis(redisConfig);
    }

    redis.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    redis.on('error', (error) => {
      console.error('❌ Redis connection error:', error);
    });

    redis.on('close', () => {
      console.log('🔌 Redis connection closed');
    });

    // Test connection
    await redis.ping();
    return true;
  } catch (error) {
    console.warn('⚠️ Redis not available, using in-memory cache:', error);
    redis = null;
    return false;
  }
};

// Cache configuration
const cacheConfig = {
  // TTL (Time To Live) in seconds
  ttl: {
    user: 3600, // 1 hour
    post: 1800, // 30 minutes
    feed: 300, // 5 minutes
    comments: 900, // 15 minutes
    followers: 1800, // 30 minutes
    search: 600, // 10 minutes
    session: 86400, // 24 hours
    rateLimit: 60, // 1 minute
    temporary: 300 // 5 minutes
  },
  
  // Key prefixes
  prefix: {
    user: 'user:',
    post: 'post:',
    feed: 'feed:',
    comments: 'comments:',
    followers: 'followers:',
    search: 'search:',
    session: 'session:',
    rateLimit: 'rate_limit:',
    temp: 'temp:'
  }
};

// Cache interface
interface CacheOptions {
  ttl?: number;
  serialize?: boolean;
}

// Cache service class
export class CacheService {
  private redis: Redis | null;
  private memoryCache: Map<string, { value: any; expiry: number }> = new Map();

  constructor() {
    this.redis = redis;
  }

  // Set cache value
  async set(key: string, value: any, options: CacheOptions = {}): Promise<boolean> {
    try {
      const ttl = options.ttl || cacheConfig.ttl.temporary;
      const serializedValue = options.serialize !== false ? JSON.stringify(value) : value;

      if (this.redis) {
        await this.redis.setex(key, ttl, serializedValue);
        return true;
      } else {
        // Fallback to memory cache
        this.memoryCache.set(key, {
          value: serializedValue,
          expiry: Date.now() + (ttl * 1000)
        });
        return true;
      }
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  // Get cache value
  async get(key: string, options: CacheOptions = {}): Promise<any> {
    try {
      if (this.redis) {
        const value = await this.redis.get(key);
        if (value === null) return null;
        return options.serialize !== false ? JSON.parse(value) : value;
      } else {
        // Fallback to memory cache
        const cached = this.memoryCache.get(key);
        if (!cached) return null;
        
        if (Date.now() > cached.expiry) {
          this.memoryCache.delete(key);
          return null;
        }
        
        return options.serialize !== false ? JSON.parse(cached.value) : cached.value;
      }
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Delete cache value
  async del(key: string): Promise<boolean> {
    try {
      if (this.redis) {
        await this.redis.del(key);
        return true;
      } else {
        this.memoryCache.delete(key);
        return true;
      }
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  // Delete multiple keys
  async delPattern(pattern: string): Promise<number> {
    try {
      if (this.redis) {
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
        return keys.length;
      } else {
        // Fallback to memory cache
        let deleted = 0;
        for (const key of this.memoryCache.keys()) {
          if (key.includes(pattern.replace('*', ''))) {
            this.memoryCache.delete(key);
            deleted++;
          }
        }
        return deleted;
      }
    } catch (error) {
      console.error('Cache delete pattern error:', error);
      return 0;
    }
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    try {
      if (this.redis) {
        const result = await this.redis.exists(key);
        return result === 1;
      } else {
        const cached = this.memoryCache.get(key);
        if (!cached) return false;
        
        if (Date.now() > cached.expiry) {
          this.memoryCache.delete(key);
          return false;
        }
        
        return true;
      }
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  // Set expiration for key
  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      if (this.redis) {
        await this.redis.expire(key, ttl);
        return true;
      } else {
        const cached = this.memoryCache.get(key);
        if (cached) {
          cached.expiry = Date.now() + (ttl * 1000);
        }
        return true;
      }
    } catch (error) {
      console.error('Cache expire error:', error);
      return false;
    }
  }

  // Increment counter
  async incr(key: string, ttl?: number): Promise<number> {
    try {
      if (this.redis) {
        const result = await this.redis.incr(key);
        if (ttl) {
          await this.redis.expire(key, ttl);
        }
        return result;
      } else {
        const cached = this.memoryCache.get(key);
        const current = cached ? parseInt(cached.value) : 0;
        const newValue = current + 1;
        
        this.memoryCache.set(key, {
          value: newValue.toString(),
          expiry: ttl ? Date.now() + (ttl * 1000) : Date.now() + (cacheConfig.ttl.temporary * 1000)
        });
        
        return newValue;
      }
    } catch (error) {
      console.error('Cache incr error:', error);
      return 0;
    }
  }

  // Get cache statistics
  async getStats(): Promise<any> {
    try {
      if (this.redis) {
        const info = await this.redis.info('memory');
        const keyspace = await this.redis.info('keyspace');
        
        return {
          type: 'redis',
          memory: info,
          keyspace: keyspace,
          connected: true
        };
      } else {
        return {
          type: 'memory',
          size: this.memoryCache.size,
          connected: false
        };
      }
    } catch (error) {
      console.error('Cache stats error:', error);
      return {
        type: 'error',
        error: error.message,
        connected: false
      };
    }
  }
}

// Create cache service instance
export const cache = new CacheService();

// Cache helper functions
export const cacheHelpers = {
  // User cache
  async getUser(userId: string) {
    const key = `${cacheConfig.prefix.user}${userId}`;
    let user = await cache.get(key);
    
    if (!user) {
      const { data } = await mockDb.getUserById(userId);
      if (data) {
        user = data;
        await cache.set(key, user, { ttl: cacheConfig.ttl.user });
      }
    }
    
    return user;
  },

  async setUser(userId: string, user: any) {
    const key = `${cacheConfig.prefix.user}${userId}`;
    await cache.set(key, user, { ttl: cacheConfig.ttl.user });
  },

  async deleteUser(userId: string) {
    const key = `${cacheConfig.prefix.user}${userId}`;
    await cache.del(key);
  },

  // Post cache
  async getPost(postId: string) {
    const key = `${cacheConfig.prefix.post}${postId}`;
    let post = await cache.get(key);
    
    if (!post) {
      const { data: posts } = await mockDb.getAllPosts();
      post = posts.find(p => p.id === postId);
      if (post) {
        await cache.set(key, post, { ttl: cacheConfig.ttl.post });
      }
    }
    
    return post;
  },

  async setPost(postId: string, post: any) {
    const key = `${cacheConfig.prefix.post}${postId}`;
    await cache.set(key, post, { ttl: cacheConfig.ttl.post });
  },

  async deletePost(postId: string) {
    const key = `${cacheConfig.prefix.post}${postId}`;
    await cache.del(key);
  },

  // Feed cache
  async getFeed(userId: string) {
    const key = `${cacheConfig.prefix.feed}${userId}`;
    return await cache.get(key);
  },

  async setFeed(userId: string, feed: any[]) {
    const key = `${cacheConfig.prefix.feed}${userId}`;
    await cache.set(key, feed, { ttl: cacheConfig.ttl.feed });
  },

  async deleteFeed(userId: string) {
    const key = `${cacheConfig.prefix.feed}${userId}`;
    await cache.del(key);
  },

  // Comments cache
  async getComments(postId: string) {
    const key = `${cacheConfig.prefix.comments}${postId}`;
    return await cache.get(key);
  },

  async setComments(postId: string, comments: any[]) {
    const key = `${cacheConfig.prefix.comments}${postId}`;
    await cache.set(key, comments, { ttl: cacheConfig.ttl.comments });
  },

  async deleteComments(postId: string) {
    const key = `${cacheConfig.prefix.comments}${postId}`;
    await cache.del(key);
  },

  // Followers cache
  async getFollowers(userId: string) {
    const key = `${cacheConfig.prefix.followers}${userId}`;
    return await cache.get(key);
  },

  async setFollowers(userId: string, followers: any[]) {
    const key = `${cacheConfig.prefix.followers}${userId}`;
    await cache.set(key, followers, { ttl: cacheConfig.ttl.followers });
  },

  async deleteFollowers(userId: string) {
    const key = `${cacheConfig.prefix.followers}${userId}`;
    await cache.del(key);
  },

  // Search cache
  async getSearch(query: string, type: string) {
    const key = `${cacheConfig.prefix.search}${type}:${query}`;
    return await cache.get(key);
  },

  async setSearch(query: string, type: string, results: any[]) {
    const key = `${cacheConfig.prefix.search}${type}:${query}`;
    await cache.set(key, results, { ttl: cacheConfig.ttl.search });
  },

  // Session cache
  async getSession(sessionId: string) {
    const key = `${cacheConfig.prefix.session}${sessionId}`;
    return await cache.get(key);
  },

  async setSession(sessionId: string, session: any) {
    const key = `${cacheConfig.prefix.session}${sessionId}`;
    await cache.set(key, session, { ttl: cacheConfig.ttl.session });
  },

  async deleteSession(sessionId: string) {
    const key = `${cacheConfig.prefix.session}${sessionId}`;
    await cache.del(key);
  },

  // Rate limit cache
  async getRateLimit(key: string) {
    const cacheKey = `${cacheConfig.prefix.rateLimit}${key}`;
    return await cache.get(cacheKey);
  },

  async setRateLimit(key: string, value: number, ttl: number) {
    const cacheKey = `${cacheConfig.prefix.rateLimit}${key}`;
    await cache.set(cacheKey, value, { ttl });
  },

  async incrRateLimit(key: string, ttl: number) {
    const cacheKey = `${cacheConfig.prefix.rateLimit}${key}`;
    return await cache.incr(cacheKey, ttl);
  },

  // Clear all cache
  async clearAll() {
    if (redis) {
      await redis.flushdb();
    } else {
      this.memoryCache.clear();
    }
  },

  // Clear user-related cache
  async clearUserCache(userId: string) {
    await Promise.all([
      cache.deleteUser(userId),
      cache.deleteFeed(userId),
      cache.deleteFollowers(userId),
      cache.delPattern(`${cacheConfig.prefix.feed}${userId}:*`),
      cache.delPattern(`${cacheConfig.prefix.search}*`)
    ]);
  },

  // Clear post-related cache
  async clearPostCache(postId: string) {
    await Promise.all([
      cache.deletePost(postId),
      cache.deleteComments(postId),
      cache.delPattern(`${cacheConfig.prefix.feed}*`)
    ]);
  }
};

// Cache middleware
export const cacheMiddleware = (ttl: number = cacheConfig.ttl.temporary) => {
  return async (req: any, res: any, next: any) => {
    const key = `middleware:${req.method}:${req.originalUrl}:${req.user?.id || 'anonymous'}`;
    
    // Try to get from cache
    const cached = await cache.get(key);
    if (cached) {
      return res.json(cached);
    }

    // Store original res.json
    const originalJson = res.json;
    
    // Override res.json to cache response
    res.json = function(data: any) {
      cache.set(key, data, { ttl });
      return originalJson.call(this, data);
    };

    next();
  };
};

export default cache;
