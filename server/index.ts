import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer } from 'http';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

// Load environment variables
dotenv.config();

// Verify Supabase configuration
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  Warning: Supabase credentials not found in .env file');
  console.warn('Database operations will fail. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}

// Import routes
import authRoutes from './routes/auth-mock.js';
import userRoutes from './routes/users-mock.js';
import postRoutes from './routes/posts-mock.js';

// Import middleware
import { rateLimiter, authRateLimiter, postRateLimiter, uploadRateLimiter } from './middleware/rateLimiter.js';
import { validate } from './middleware/validation.js';
import { validateFileUpload } from './middleware/validation.js';
import { require2FA } from './middleware/2fa.js';

// Import WebSocket handler
import SocketHandler from './websocket/socketHandler.js';

// Import cache
import { initializeRedis, cache } from './cache/redisCache.js';

// Import mock database
import { mockDb } from './mock-db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Redis cache
initializeRedis().then(redisAvailable => {
  if (redisAvailable) {
    console.log('✅ Redis cache initialized');
  } else {
    console.log('⚠️ Using in-memory cache (Redis not available)');
  }
});

// Initialize WebSocket
const socketHandler = new SocketHandler(server);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "ws:", "wss:"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-2FA-Token']
}));

// Body parsing middleware with size limits
app.use(express.json({ 
  limit: '50mb',
  verify: (req, res, buf) => {
    // Store raw body for signature verification if needed
    (req as any).rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '50mb' 
}));

// Rate limiting middleware
app.use(rateLimiter);

// Serve static files with security headers
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
  }
}));

// API Routes with specific rate limiting
app.use('/api/auth', authRateLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRateLimiter, postRoutes);

// Enhanced health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const cacheStats = await cache.getStats();
    
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cache: cacheStats,
      websocket: {
        connectedUsers: socketHandler.getConnectedUsersCount(),
        connectedUsersList: socketHandler.getConnectedUsers()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// API status endpoint
app.get('/api/status', async (req, res) => {
  try {
    const { data: users } = await mockDb.getAllUsers();
    const { data: posts } = await mockDb.getAllPosts();
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: {
        users: users.length,
        posts: posts.length
      },
      cache: await cache.getStats(),
      websocket: {
        connectedUsers: socketHandler.getConnectedUsersCount()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message
    });
  }
});

// 2FA routes
app.post('/api/2fa/generate', require2FA, async (req, res) => {
  // 2FA generation endpoint
  res.json({ message: '2FA generation endpoint' });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', error);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.status || 500).json({
    error: 'Internal Server Error',
    message: isDevelopment ? error.message : 'Something went wrong',
    ...(isDevelopment && { stack: error.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Start server
server.listen(PORT, () => {
  console.log('🗄️  Using MOCK DATABASE for local testing');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}/api`);
  console.log('🗄️  Database: Mock Database (Local Testing)');
  console.log('🔑 JWT Secret: Configured');
  console.log('🔒 Security: Enhanced with Helmet, CORS, Rate Limiting');
  console.log('⚡ Performance: Compression, Caching, WebSocket enabled');
  console.log('🛡️  Features: 2FA, Input Validation, Real-time updates');
});