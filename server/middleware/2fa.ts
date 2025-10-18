import { Request, Response, NextFunction } from 'express';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { mockDb } from '../mock-db.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

// 2FA configuration
const twoFactorConfig = {
  issuer: 'INSTOK',
  algorithm: 'sha256',
  digits: 6,
  period: 30,
  window: 2 // Allow 2 time steps before/after current time
};

// Generate 2FA secret for user
export const generate2FASecret = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        error: 'Authentication Error',
        message: 'User not authenticated'
      });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `${req.user.username} (${twoFactorConfig.issuer})`,
      issuer: twoFactorConfig.issuer,
      length: 32
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    // Store secret temporarily (in production, store in database)
    // For now, we'll store it in the user object
    const { data: user } = await mockDb.getUserById(userId);
    if (user) {
      user.temp2FASecret = secret.base32;
    }

    res.json({
      success: true,
      secret: secret.base32,
      qrCode: qrCodeUrl,
      manualEntryKey: secret.base32,
      message: '2FA secret generated. Scan QR code with authenticator app or enter manual key.'
    });

  } catch (error) {
    console.error('Error generating 2FA secret:', error);
    res.status(500).json({
      error: '2FA Setup Error',
      message: 'Failed to generate 2FA secret'
    });
  }
};

// Verify 2FA token and enable 2FA
export const verifyAndEnable2FA = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    const userId = req.user?.id;

    if (!userId || !token) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'User ID and token are required'
      });
    }

    // Get user and temporary secret
    const { data: user } = await mockDb.getUserById(userId);
    if (!user || !user.temp2FASecret) {
      return res.status(400).json({
        error: '2FA Setup Error',
        message: 'No temporary 2FA secret found. Please generate a new one.'
      });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.temp2FASecret,
      encoding: 'base32',
      token: token,
      window: twoFactorConfig.window
    });

    if (!verified) {
      return res.status(400).json({
        error: '2FA Verification Error',
        message: 'Invalid 2FA token. Please try again.'
      });
    }

    // Enable 2FA for user
    user.twoFactorEnabled = true;
    user.twoFactorSecret = user.temp2FASecret;
    delete user.temp2FASecret;

    // Store backup codes
    const backupCodes = generateBackupCodes();
    user.backupCodes = backupCodes;

    res.json({
      success: true,
      message: '2FA enabled successfully',
      backupCodes: backupCodes,
      warning: 'Save these backup codes in a secure location. They can only be used once.'
    });

  } catch (error) {
    console.error('Error verifying 2FA token:', error);
    res.status(500).json({
      error: '2FA Setup Error',
      message: 'Failed to verify 2FA token'
    });
  }
};

// Verify 2FA token for login
export const verify2FAToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { token, userId } = req.body;

    if (!token || !userId) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Token and user ID are required'
      });
    }

    // Get user
    const { data: user } = await mockDb.getUserById(userId);
    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return res.status(400).json({
        error: '2FA Error',
        message: '2FA not enabled for this user'
      });
    }

    // Check if it's a backup code
    if (user.backupCodes && user.backupCodes.includes(token)) {
      // Remove used backup code
      user.backupCodes = user.backupCodes.filter((code: string) => code !== token);
      
      res.json({
        success: true,
        message: '2FA verified with backup code',
        backupCodeUsed: true
      });
      return;
    }

    // Verify TOTP token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: twoFactorConfig.window
    });

    if (!verified) {
      return res.status(400).json({
        error: '2FA Verification Error',
        message: 'Invalid 2FA token'
      });
    }

    res.json({
      success: true,
      message: '2FA verified successfully'
    });

  } catch (error) {
    console.error('Error verifying 2FA token:', error);
    res.status(500).json({
      error: '2FA Verification Error',
      message: 'Failed to verify 2FA token'
    });
  }
};

// Disable 2FA
export const disable2FA = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { password, token } = req.body;
    const userId = req.user?.id;

    if (!userId || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Password is required to disable 2FA'
      });
    }

    // Get user
    const { data: user } = await mockDb.getUserById(userId);
    if (!user || !user.twoFactorEnabled) {
      return res.status(400).json({
        error: '2FA Error',
        message: '2FA is not enabled for this user'
      });
    }

    // Verify password (in production, use proper password verification)
    // For now, we'll skip password verification in mock mode
    if (process.env.NODE_ENV === 'production' && user.password !== password) {
      return res.status(400).json({
        error: 'Authentication Error',
        message: 'Invalid password'
      });
    }

    // If token is provided, verify it
    if (token && user.twoFactorSecret) {
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: token,
        window: twoFactorConfig.window
      });

      if (!verified) {
        return res.status(400).json({
          error: '2FA Verification Error',
          message: 'Invalid 2FA token'
        });
      }
    }

    // Disable 2FA
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    user.backupCodes = undefined;

    res.json({
      success: true,
      message: '2FA disabled successfully'
    });

  } catch (error) {
    console.error('Error disabling 2FA:', error);
    res.status(500).json({
      error: '2FA Disable Error',
      message: 'Failed to disable 2FA'
    });
  }
};

// Generate new backup codes
export const generateNewBackupCodes = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication Error',
        message: 'User not authenticated'
      });
    }

    // Get user
    const { data: user } = await mockDb.getUserById(userId);
    if (!user || !user.twoFactorEnabled) {
      return res.status(400).json({
        error: '2FA Error',
        message: '2FA is not enabled for this user'
      });
    }

    // Generate new backup codes
    const backupCodes = generateBackupCodes();
    user.backupCodes = backupCodes;

    res.json({
      success: true,
      message: 'New backup codes generated',
      backupCodes: backupCodes,
      warning: 'Save these backup codes in a secure location. They can only be used once.'
    });

  } catch (error) {
    console.error('Error generating backup codes:', error);
    res.status(500).json({
      error: 'Backup Code Error',
      message: 'Failed to generate backup codes'
    });
  }
};

// Check 2FA status
export const check2FAStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication Error',
        message: 'User not authenticated'
      });
    }

    // Get user
    const { data: user } = await mockDb.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User Error',
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      twoFactorEnabled: user.twoFactorEnabled || false,
      backupCodesCount: user.backupCodes ? user.backupCodes.length : 0
    });

  } catch (error) {
    console.error('Error checking 2FA status:', error);
    res.status(500).json({
      error: '2FA Status Error',
      message: 'Failed to check 2FA status'
    });
  }
};

// Middleware to require 2FA for sensitive operations
export const require2FA = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({
      error: 'Authentication Error',
      message: 'User not authenticated'
    });
  }

  // Get user
  mockDb.getUserById(userId).then(({ data: user }) => {
    if (!user) {
      return res.status(404).json({
        error: 'User Error',
        message: 'User not found'
      });
    }

    if (user.twoFactorEnabled) {
      const token = req.headers['x-2fa-token'] as string;
      
      if (!token) {
        return res.status(403).json({
          error: '2FA Required',
          message: '2FA token is required for this operation'
        });
      }

      // Verify token
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: token,
        window: twoFactorConfig.window
      });

      if (!verified) {
        return res.status(403).json({
          error: '2FA Verification Error',
          message: 'Invalid 2FA token'
        });
      }
    }

    next();
  }).catch(error => {
    console.error('Error in require2FA middleware:', error);
    res.status(500).json({
      error: '2FA Middleware Error',
      message: 'Failed to verify 2FA status'
    });
  });
};

// Generate backup codes
function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    codes.push(code);
  }
  return codes;
}

// SMS 2FA (placeholder for future implementation)
export const sendSMS2FA = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { phoneNumber } = req.body;
    const userId = req.user?.id;

    if (!userId || !phoneNumber) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'User ID and phone number are required'
      });
    }

    // Generate SMS code
    const smsCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In production, integrate with SMS service (Twilio, AWS SNS, etc.)
    console.log(`SMS 2FA code for ${phoneNumber}: ${smsCode}`);
    
    // Store code temporarily (in production, use Redis with expiration)
    const { data: user } = await mockDb.getUserById(userId);
    if (user) {
      user.tempSMSCode = smsCode;
      user.tempSMSCodeExpiry = Date.now() + 300000; // 5 minutes
    }

    res.json({
      success: true,
      message: 'SMS code sent successfully',
      expiresIn: 300 // 5 minutes
    });

  } catch (error) {
    console.error('Error sending SMS 2FA:', error);
    res.status(500).json({
      error: 'SMS 2FA Error',
      message: 'Failed to send SMS code'
    });
  }
};

// Verify SMS 2FA
export const verifySMS2FA = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { code } = req.body;
    const userId = req.user?.id;

    if (!userId || !code) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'User ID and code are required'
      });
    }

    // Get user
    const { data: user } = await mockDb.getUserById(userId);
    if (!user || !user.tempSMSCode || !user.tempSMSCodeExpiry) {
      return res.status(400).json({
        error: 'SMS 2FA Error',
        message: 'No SMS code found or expired'
      });
    }

    // Check if code is expired
    if (Date.now() > user.tempSMSCodeExpiry) {
      return res.status(400).json({
        error: 'SMS 2FA Error',
        message: 'SMS code has expired'
      });
    }

    // Verify code
    if (user.tempSMSCode !== code) {
      return res.status(400).json({
        error: 'SMS 2FA Error',
        message: 'Invalid SMS code'
      });
    }

    // Clear temporary code
    user.tempSMSCode = undefined;
    user.tempSMSCodeExpiry = undefined;

    res.json({
      success: true,
      message: 'SMS code verified successfully'
    });

  } catch (error) {
    console.error('Error verifying SMS 2FA:', error);
    res.status(500).json({
      error: 'SMS 2FA Error',
      message: 'Failed to verify SMS code'
    });
  }
};

export default {
  generate2FASecret,
  verifyAndEnable2FA,
  verify2FAToken,
  disable2FA,
  generateNewBackupCodes,
  check2FAStatus,
  require2FA,
  sendSMS2FA,
  verifySMS2FA
};
