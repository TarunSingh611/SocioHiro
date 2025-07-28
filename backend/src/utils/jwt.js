const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

class JWTService {
  // Generate JWT token for user
  static generateToken(user, sessionId = null) {
    const payload = {
      userId: user._id,
      username: user.username,
      instagramId: user.instagramId,
      facebookId: user.facebookId,
      accountType: user.accountType,
      sessionId: sessionId
    };

    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN 
    });
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Extract token from Authorization header
  static extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization header must start with Bearer');
    }
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }

  // Decode token without verification (for debugging)
  static decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = JWTService; 