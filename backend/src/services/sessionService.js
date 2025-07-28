const crypto = require('crypto');
const User = require('../models/User');

class SessionService {
  // Generate unique session ID
  static generateSessionId() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Extract device information from request
  static getDeviceInfo(req) {
    const userAgent = req.get('User-Agent') || '';
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
    
    // Parse browser and platform from user agent
    let browser = 'Unknown';
    let platform = 'Unknown';
    
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    
    if (userAgent.includes('Windows')) platform = 'Windows';
    else if (userAgent.includes('Mac')) platform = 'macOS';
    else if (userAgent.includes('Linux')) platform = 'Linux';
    else if (userAgent.includes('Android')) platform = 'Android';
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) platform = 'iOS';
    
    return {
      userAgent,
      platform,
      browser,
      ipAddress
    };
  }

  // Add new session to user
  static async addSession(userId, sessionId, deviceInfo) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // Check if session already exists
    const existingSession = user.activeSessions.find(s => s.sessionId === sessionId);
    if (existingSession) {
      // Update existing session
      existingSession.lastActivityAt = new Date();
      existingSession.isActive = true;
    } else {
      // Check session limits
      const activeSessions = user.activeSessions.filter(s => s.isActive);
      if (activeSessions.length >= user.maxConcurrentSessions) {
        // Remove oldest session and add to recent sessions
        const oldestSession = activeSessions.sort((a, b) => a.loginAt - b.loginAt)[0];
        const sessionDuration = Math.floor((new Date() - new Date(oldestSession.loginAt)) / (1000 * 60));
        
        // Add to recent sessions
        user.recentSessions.push({
          sessionId: oldestSession.sessionId,
          deviceInfo: oldestSession.deviceInfo,
          loginAt: oldestSession.loginAt,
          logoutAt: new Date(),
          duration: sessionDuration,
          isActive: false
        });
        
        // Keep only last 10 recent sessions
        if (user.recentSessions.length > 10) {
          user.recentSessions = user.recentSessions.slice(-10);
        }
        
        oldestSession.isActive = false;
      }

      // Add new session
      user.activeSessions.push({
        sessionId,
        deviceInfo,
        loginAt: new Date(),
        lastActivityAt: new Date(),
        isActive: true
      });
    }

    user.sessionCount += 1;
    user.lastLoginAt = new Date();
    user.isActive = true;
    user.updatedAt = new Date();

    await user.save();
    return user;
  }

  // Remove session from user
  static async removeSession(userId, sessionId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const session = user.activeSessions.find(s => s.sessionId === sessionId);
    if (session) {
      const sessionDuration = Math.floor((new Date() - new Date(session.loginAt)) / (1000 * 60));
      
      // Add to recent sessions
      user.recentSessions.push({
        sessionId: session.sessionId,
        deviceInfo: session.deviceInfo,
        loginAt: session.loginAt,
        logoutAt: new Date(),
        duration: sessionDuration,
        isActive: false
      });
      
      // Keep only last 10 recent sessions
      if (user.recentSessions.length > 10) {
        user.recentSessions = user.recentSessions.slice(-10);
      }
      
      session.isActive = false;
      session.lastActivityAt = new Date();
    }

    // Check if this was the last active session
    const activeSessions = user.activeSessions.filter(s => s.isActive);
    if (activeSessions.length === 0) {
      user.isActive = false;
      user.lastLogoutAt = new Date();
    }

    user.updatedAt = new Date();
    await user.save();
    return user;
  }

  // Remove all sessions for user (force logout all devices)
  static async removeAllSessions(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.activeSessions.forEach(session => {
      session.isActive = false;
      session.lastActivityAt = new Date();
    });

    user.isActive = false;
    user.lastLogoutAt = new Date();
    user.updatedAt = new Date();

    await user.save();
    return user;
  }

  // Update session activity
  static async updateSessionActivity(userId, sessionId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const session = user.activeSessions.find(s => s.sessionId === sessionId);
    if (session && session.isActive) {
      session.lastActivityAt = new Date();
      await user.save();
    }

    return user;
  }

  // Get active sessions for user
  static async getActiveSessions(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    return user.activeSessions.filter(s => s.isActive);
  }

  // Get recent sessions for user
  static async getRecentSessions(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    return user.recentSessions.sort((a, b) => new Date(b.logoutAt) - new Date(a.logoutAt));
  }

  // Clean up expired sessions
  static async cleanupExpiredSessions() {
    const users = await User.find({ 'activeSessions.isActive': true });
    const now = new Date();

    for (const user of users) {
      let hasChanges = false;
      
      user.activeSessions.forEach(session => {
        if (session.isActive) {
          const lastActivity = new Date(session.lastActivityAt);
          const timeoutMs = user.sessionTimeoutMinutes * 60 * 1000;
          
          if (now - lastActivity > timeoutMs) {
            session.isActive = false;
            session.lastActivityAt = now;
            hasChanges = true;
          }
        }
      });

      if (hasChanges) {
        // Check if any sessions are still active
        const activeSessions = user.activeSessions.filter(s => s.isActive);
        if (activeSessions.length === 0) {
          user.isActive = false;
          user.lastLogoutAt = now;
        }
        
        user.updatedAt = now;
        await user.save();
      }
    }
  }

  // Validate session
  static async validateSession(userId, sessionId) {
    const user = await User.findById(userId);
    if (!user) return false;

    const session = user.activeSessions.find(s => s.sessionId === sessionId);
    if (!session || !session.isActive) return false;

    // Check if session has expired
    const now = new Date();
    const lastActivity = new Date(session.lastActivityAt);
    const timeoutMs = user.sessionTimeoutMinutes * 60 * 1000;

    if (now - lastActivity > timeoutMs) {
      session.isActive = false;
      await user.save();
      return false;
    }

    // Update last activity
    session.lastActivityAt = now;
    await user.save();
    return true;
  }
}

module.exports = SessionService; 