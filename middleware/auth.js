const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const db = require('../lib/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// Rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { error: 'Too many login attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            email: user.email, 
            role: user.role,
            slug: user.slug 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

// Verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Authentication middleware
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.token;
        
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid token.' });
        }

        // Get fresh user data from database
        const user = await db.getUserByEmail(decoded.email);
        if (!user) {
            return res.status(401).json({ error: 'User not found.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid token.' });
    }
};

// Role-based authorization middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Access denied. User not authenticated.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'Access denied. Insufficient permissions.',
                required: roles,
                current: req.user.role 
            });
        }

        next();
    };
};

// Manager-only middleware
const requireManager = authorize('manager');

// Team member or manager middleware
const requireTeamMemberOrManager = authorize('team_member', 'manager');

// Self or manager access (for profile access)
const requireSelfOrManager = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Access denied. User not authenticated.' });
    }

    const targetSlug = req.params.slug || req.params.userSlug;
    
    // Managers can access anyone
    if (req.user.role === 'manager') {
        return next();
    }

    // Team members can only access their own profile
    if (req.user.role === 'team_member' && req.user.slug === targetSlug) {
        return next();
    }

    return res.status(403).json({ 
        error: 'Access denied. You can only access your own profile.' 
    });
};

// Login function
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Get user from database
        const user = await db.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Generate token
        const token = generateToken(user);

        // Create session in database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
        await db.createSession(user.id, token, expiresAt.toISOString());

        // Set cookie and return user info
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Remove sensitive data
        const { password_hash, ...userInfo } = user;

        res.json({
            message: 'Login successful',
            user: userInfo,
            token // Also return token for frontend storage if needed
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Logout function
const logout = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.token;
        
        if (token) {
            // Remove session from database
            await db.deleteSession(token);
        }

        // Clear cookie
        res.clearCookie('token');
        res.json({ message: 'Logout successful' });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Get current user
const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated.' });
        }

        // Remove sensitive data
        const { password_hash, ...userInfo } = req.user;
        res.json({ user: userInfo });

    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Change password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, req.user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Current password is incorrect.' });
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        // Update password in database
        await db.run('UPDATE users SET password_hash = ? WHERE id = ?', [newPasswordHash, req.user.id]);

        res.json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = {
    loginLimiter,
    authenticate,
    authorize,
    requireManager,
    requireTeamMemberOrManager,
    requireSelfOrManager,
    login,
    logout,
    getCurrentUser,
    changePassword,
    generateToken
}; 