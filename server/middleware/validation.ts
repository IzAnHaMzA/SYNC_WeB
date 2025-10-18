import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import DOMPurify from 'isomorphic-dompurify';
import { escape } from 'html-escaper';
import validator from 'validator';

// Custom validation schemas
const validationSchemas = {
  // User registration validation
  register: Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.alphanum': 'Username must contain only alphanumeric characters',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters',
        'any.required': 'Username is required'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password cannot exceed 128 characters',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'Password is required'
      }),
    fullName: Joi.string()
      .min(2)
      .max(100)
      .pattern(/^[a-zA-Z\s'-]+$/)
      .required()
      .messages({
        'string.min': 'Full name must be at least 2 characters long',
        'string.max': 'Full name cannot exceed 100 characters',
        'string.pattern.base': 'Full name can only contain letters, spaces, hyphens, and apostrophes',
        'any.required': 'Full name is required'
      })
  }),

  // User login validation
  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  }),

  // Post creation validation
  post: Joi.object({
    caption: Joi.string()
      .max(2200)
      .allow('')
      .messages({
        'string.max': 'Caption cannot exceed 2200 characters'
      }),
    location: Joi.string()
      .max(100)
      .allow('')
      .messages({
        'string.max': 'Location cannot exceed 100 characters'
      }),
    tags: Joi.array()
      .items(Joi.string().max(50))
      .max(30)
      .messages({
        'array.max': 'Maximum 30 tags allowed',
        'string.max': 'Each tag cannot exceed 50 characters'
      }),
    mentions: Joi.array()
      .items(Joi.string().alphanum().max(30))
      .max(20)
      .messages({
        'array.max': 'Maximum 20 mentions allowed',
        'string.alphanum': 'Mentions must be alphanumeric',
        'string.max': 'Each mention cannot exceed 30 characters'
      })
  }),

  // Comment validation
  comment: Joi.object({
    content: Joi.string()
      .min(1)
      .max(500)
      .required()
      .messages({
        'string.min': 'Comment cannot be empty',
        'string.max': 'Comment cannot exceed 500 characters',
        'any.required': 'Comment content is required'
      })
  }),

  // Message validation
  message: Joi.object({
    content: Joi.string()
      .min(1)
      .max(1000)
      .required()
      .messages({
        'string.min': 'Message cannot be empty',
        'string.max': 'Message cannot exceed 1000 characters',
        'any.required': 'Message content is required'
      }),
    receiverId: Joi.string()
      .required()
      .messages({
        'any.required': 'Receiver ID is required'
      })
  }),

  // Search validation
  search: Joi.object({
    query: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.min': 'Search query cannot be empty',
        'string.max': 'Search query cannot exceed 100 characters',
        'any.required': 'Search query is required'
      }),
    type: Joi.string()
      .valid('users', 'posts', 'hashtags')
      .default('users')
      .messages({
        'any.only': 'Search type must be users, posts, or hashtags'
      })
  }),

  // Profile update validation
  profile: Joi.object({
    fullName: Joi.string()
      .min(2)
      .max(100)
      .pattern(/^[a-zA-Z\s'-]+$/)
      .messages({
        'string.min': 'Full name must be at least 2 characters long',
        'string.max': 'Full name cannot exceed 100 characters',
        'string.pattern.base': 'Full name can only contain letters, spaces, hyphens, and apostrophes'
      }),
    bio: Joi.string()
      .max(150)
      .allow('')
      .messages({
        'string.max': 'Bio cannot exceed 150 characters'
      }),
    website: Joi.string()
      .uri()
      .allow('')
      .messages({
        'string.uri': 'Please provide a valid website URL'
      }),
    location: Joi.string()
      .max(100)
      .allow('')
      .messages({
        'string.max': 'Location cannot exceed 100 characters'
      })
  })
};

// Input sanitization functions
export const sanitizeInput = {
  // Sanitize HTML content
  html: (input: string): string => {
    if (typeof input !== 'string') return '';
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br'],
      ALLOWED_ATTR: []
    });
  },

  // Escape HTML entities
  escape: (input: string): string => {
    if (typeof input !== 'string') return '';
    return escape(input);
  },

  // Sanitize SQL injection attempts
  sql: (input: string): string => {
    if (typeof input !== 'string') return '';
    return input
      .replace(/['"`;]/g, '') // Remove quotes and semicolons
      .replace(/--/g, '') // Remove SQL comments
      .replace(/\/\*/g, '') // Remove block comments
      .replace(/\*\//g, '');
  },

  // Sanitize XSS attempts
  xss: (input: string): string => {
    if (typeof input !== 'string') return '';
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/<iframe\b[^>]*>/gi, '') // Remove iframe tags
      .replace(/<object\b[^>]*>/gi, '') // Remove object tags
      .replace(/<embed\b[^>]*>/gi, ''); // Remove embed tags
  },

  // Sanitize file names
  filename: (input: string): string => {
    if (typeof input !== 'string') return '';
    return input
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
  },

  // Sanitize URLs
  url: (input: string): string => {
    if (typeof input !== 'string') return '';
    try {
      const url = new URL(input);
      // Only allow http and https protocols
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        return url.toString();
      }
      return '';
    } catch {
      return '';
    }
  },

  // Sanitize email addresses
  email: (input: string): string => {
    if (typeof input !== 'string') return '';
    return validator.normalizeEmail(input) || '';
  },

  // Sanitize usernames
  username: (input: string): string => {
    if (typeof input !== 'string') return '';
    return input
      .toLowerCase()
      .replace(/[^a-z0-9._]/g, '') // Only allow alphanumeric, dots, underscores
      .replace(/\.{2,}/g, '.') // Replace multiple dots with single
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .replace(/^[._]|[._]$/g, ''); // Remove leading/trailing dots/underscores
  }
};

// Validation middleware factory
export const validate = (schema: keyof typeof validationSchemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationSchema = validationSchemas[schema];
    
    if (!validationSchema) {
      return res.status(500).json({
        error: 'Validation Error',
        message: 'Invalid validation schema'
      });
    }

    const { error, value } = validationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details: errorMessages
      });
    }

    // Sanitize the validated data
    req.body = sanitizeRequestBody(value);
    next();
  };
};

// Sanitize request body
const sanitizeRequestBody = (body: any): any => {
  if (typeof body !== 'object' || body === null) {
    return body;
  }

  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'string') {
      // Apply appropriate sanitization based on field type
      switch (key.toLowerCase()) {
        case 'email':
          sanitized[key] = sanitizeInput.email(value);
          break;
        case 'username':
          sanitized[key] = sanitizeInput.username(value);
          break;
        case 'website':
        case 'url':
          sanitized[key] = sanitizeInput.url(value);
          break;
        case 'caption':
        case 'content':
        case 'bio':
        case 'message':
          sanitized[key] = sanitizeInput.html(sanitizeInput.xss(value));
          break;
        case 'fullname':
        case 'full_name':
        case 'location':
          sanitized[key] = sanitizeInput.escape(value);
          break;
        default:
          sanitized[key] = sanitizeInput.escape(value);
      }
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeInput.escape(item) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeRequestBody(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

// File upload validation
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file && !req.files) {
    return res.status(400).json({
      error: 'File Upload Error',
      message: 'No file provided'
    });
  }

  const file = req.file || (req.files as any)?.[0];
  
  if (!file) {
    return res.status(400).json({
      error: 'File Upload Error',
      message: 'No file provided'
    });
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
  if (!allowedTypes.includes(file.mimetype)) {
    return res.status(400).json({
      error: 'File Upload Error',
      message: 'Invalid file type. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM) are allowed'
    });
  }

  // Validate file size (50MB limit)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return res.status(400).json({
      error: 'File Upload Error',
      message: 'File too large. Maximum size is 50MB'
    });
  }

  // Sanitize filename
  file.originalname = sanitizeInput.filename(file.originalname);

  next();
};

// Query parameter validation
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Query Validation Error',
        message: 'Invalid query parameters',
        details: errorMessages
      });
    }

    req.query = value;
    next();
  };
};

// Path parameter validation
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Parameter Validation Error',
        message: 'Invalid path parameters',
        details: errorMessages
      });
    }

    req.params = value;
    next();
  };
};

export default validate;
