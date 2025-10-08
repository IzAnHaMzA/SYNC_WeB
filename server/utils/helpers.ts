import { Request } from 'express';
import { IUser } from '../models/User.js';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * Helper function to format error messages
 */
export const formatError = (error: any): string => {
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

/**
 * Helper function to validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Helper function to validate username
 */
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9._]{3,30}$/;
  return usernameRegex.test(username);
};

/**
 * Helper function to sanitize user data
 */
export const sanitizeUser = (user: any) => {
  const sanitized = user.toObject ? user.toObject() : user;
  delete sanitized.password;
  return sanitized;
};

