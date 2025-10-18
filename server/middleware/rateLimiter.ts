import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';

// In-memory rate limiter for development
const rateLimiterMemory = new RateLimiterMemory({
  keyPrefix: 'rl_mem',
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
});

// Redis rate limiter for production
let rateLimiterRedis: RateLimiterRedis | null = null;

// Initialize Redis rate limiter if Redis is available
if (process.env.REDIS_URL) {
  const redis = new Redis(process.env.REDIS_URL);
  rateLimiterRedis = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: 'rl_redis',
    points: 100,
    duration: 60,
  });
}

// Rate limiting configurations for different endpoints
const rateLimitConfigs = {
  // Authentication endpoints - stricter limits
  auth: {
    points: 5, // 5 requests
    duration: 900, // per 15 minutes
    blockDuration: 900, // block for 15 minutes
  },
  
  // Post creation - moderate limits
  posts: {
    points: 10, // 10 requests
    duration: 300, // per 5 minutes
    blockDuration: 300, // block for 5 minutes
  },
  
  // File uploads - very strict limits
  uploads: {
    points: 3, // 3 requests
    duration: 3600, // per hour
    blockDuration: 3600, // block for 1 hour
  },
  
  // General API - standard limits
  general: {
    points: 100, // 100 requests
    duration: 60, // per minute
    blockDuration: 60, // block for 1 minute
  },
  
  // Search endpoints - moderate limits
  search: {
    points: 20, // 20 requests
    duration: 60, // per minute
    blockDuration: 60, // block for 1 minute
  }
};

// Create rate limiters for each configuration
const rateLimiters: { [key: string]: RateLimiterMemory | RateLimiterRedis } = {};

Object.keys(rateLimitConfigs).forEach(key => {
  const config = rateLimitConfigs[key as keyof typeof rateLimitConfigs];
  
  if (rateLimiterRedis) {
    rateLimiters[key] = new RateLimiterRedis({
      storeClient: rateLimiterRedis['storeClient'],
      keyPrefix: `rl_${key}`,
      points: config.points,
      duration: config.duration,
      blockDuration: config.blockDuration,
    });
  } else {
    rateLimiters[key] = new RateLimiterMemory({
      keyPrefix: `rl_${key}`,
      points: config.points,
      duration: config.duration,
      blockDuration: config.blockDuration,
    });
  }
});

// Helper function to get client identifier
const getClientId = (req: Request): string => {
  // Use user ID if authenticated, otherwise use IP
  const userId = (req as any).user?.id;
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  return userId ? `user:${userId}` : `ip:${ip}`;
};

// Helper function to determine rate limit type based on route
const getRateLimitType = (req: Request): string => {
  const path = req.path;
  
  if (path.includes('/auth/')) {
    return 'auth';
  } else if (path.includes('/posts') && req.method === 'POST') {
    return 'posts';
  } else if (path.includes('/upload') || req.method === 'POST' && req.headers['content-type']?.includes('multipart/form-data')) {
    return 'uploads';
  } else if (path.includes('/search')) {
    return 'search';
  } else {
    return 'general';
  }
};

// Main rate limiting middleware
export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rateLimitType = getRateLimitType(req);
    const clientId = getClientId(req);
    const rateLimiter = rateLimiters[rateLimitType];
    
    if (!rateLimiter) {
      return next();
    }

    const key = `${rateLimitType}:${clientId}`;
    
    try {
      await rateLimiter.consume(key);
      next();
    } catch (rejRes: any) {
      const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
      
      // Set rate limit headers
      res.set({
        'Retry-After': String(secs),
        'X-RateLimit-Limit': String(rateLimitConfigs[rateLimitType as keyof typeof rateLimitConfigs].points),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(new Date(Date.now() + rejRes.msBeforeNext).toISOString()),
      });

      // Log rate limit violation
      console.warn(`🚫 Rate limit exceeded for ${clientId} on ${rateLimitType}: ${req.method} ${req.path}`);
      
      return res.status(429).json({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again in ${secs} seconds.`,
        retryAfter: secs,
        limitType: rateLimitType
      });
    }
  } catch (error) {
    console.error('Rate limiter error:', error);
    // If rate limiter fails, allow request to proceed
    next();
  }
};

// Specific rate limiters for different endpoints
export const authRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  // Create a modified request object for auth rate limiting
  const modifiedReq = { ...req, path: '/auth/' };
  return rateLimiter(modifiedReq as Request, res, next);
};

export const postRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  // Create a modified request object for post rate limiting
  const modifiedReq = { ...req, path: '/posts' };
  return rateLimiter(modifiedReq as Request, res, next);
};

export const uploadRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  // Create a modified request object for upload rate limiting
  const modifiedReq = { ...req, path: '/upload' };
  return rateLimiter(modifiedReq as Request, res, next);
};

export const searchRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  // Create a modified request object for search rate limiting
  const modifiedReq = { ...req, path: '/search' };
  return rateLimiter(modifiedReq as Request, res, next);
};

// Advanced rate limiting with sliding window
export const slidingWindowRateLimiter = (windowMs: number, maxRequests: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const clientId = getClientId(req);
    const key = `sliding:${clientId}`;
    
    try {
      const limiter = new RateLimiterMemory({
        keyPrefix: 'sliding',
        points: maxRequests,
        duration: windowMs / 1000,
      });
      
      await limiter.consume(key);
      next();
    } catch (rejRes: any) {
      const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
      
      res.set({
        'Retry-After': String(secs),
        'X-RateLimit-Limit': String(maxRequests),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(new Date(Date.now() + rejRes.msBeforeNext).toISOString()),
      });
      
      return res.status(429).json({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again in ${secs} seconds.`,
        retryAfter: secs
      });
    }
  };
};

// Burst rate limiter for handling traffic spikes
export const burstRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const clientId = getClientId(req);
  const key = `burst:${clientId}`;
  
  const limiter = new RateLimiterMemory({
    keyPrefix: 'burst',
    points: 20, // Allow 20 requests
    duration: 10, // in 10 seconds
    blockDuration: 60, // block for 1 minute
  });
  
  limiter.consume(key)
    .then(() => next())
    .catch((rejRes: any) => {
      const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
      
      res.set({
        'Retry-After': String(secs),
        'X-RateLimit-Limit': '20',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(new Date(Date.now() + rejRes.msBeforeNext).toISOString()),
      });
      
      return res.status(429).json({
        error: 'Burst Rate Limit Exceeded',
        message: `Too many requests in a short time. Try again in ${secs} seconds.`,
        retryAfter: secs
      });
    });
};

// IP-based rate limiter for anonymous users
export const ipRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const key = `ip:${ip}`;
  
  const limiter = new RateLimiterMemory({
    keyPrefix: 'ip',
    points: 50, // 50 requests
    duration: 300, // per 5 minutes
    blockDuration: 300, // block for 5 minutes
  });
  
  limiter.consume(key)
    .then(() => next())
    .catch((rejRes: any) => {
      const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
      
      res.set({
        'Retry-After': String(secs),
        'X-RateLimit-Limit': '50',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(new Date(Date.now() + rejRes.msBeforeNext).toISOString()),
      });
      
      return res.status(429).json({
        error: 'IP Rate Limit Exceeded',
        message: `Too many requests from this IP. Try again in ${secs} seconds.`,
        retryAfter: secs
      });
    });
};

export default rateLimiter;
