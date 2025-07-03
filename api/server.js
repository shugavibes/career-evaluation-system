const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('../middleware/passport');
const { db } = require('../lib/supabase');
const auth = require('../middleware/auth');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Session configuration for passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Authentication routes
app.post('/api/auth/login', auth.loginLimiter, auth.login);
app.post('/api/auth/logout', auth.logout);
app.get('/api/auth/me', auth.authenticate, auth.getCurrentUser);
app.post('/api/auth/change-password', auth.authenticate, auth.changePassword);

// Users API with role-based access
app.get('/api/users', auth.authenticate, auth.requireTeamMemberOrManager, async (req, res) => {
    try {
        let users;
        
        if (req.user.role === 'manager') {
            users = await db.getAllUsers();
        } else {
            users = await db.all('users', { id: req.user.id });
        }
        
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export the Express API
module.exports = app; 