const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./middleware/passport');
const { db } = require('./lib/supabase');
const auth = require('./middleware/auth');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Log startup information for Supabase
console.log('🚀 Starting Career Evaluation System with Supabase...');
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📋 Port: ${port}`);
console.log(`🗃️  Database: Supabase PostgreSQL`);

// Trust proxy for deployment platforms
app.set('trust proxy', 1);

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

// Clean expired sessions periodically
setInterval(() => {
    db.cleanExpiredSessions().catch(console.error);
}, 60 * 60 * 1000); // Every hour

// API Routes

// Multiple health check endpoints for deployment platforms
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Career Evaluation System with Supabase is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

app.get('/status', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Detailed health check with database - for manual testing
app.get('/api/health/detailed', async (req, res) => {
    const startTime = Date.now();
    
    try {
        // Test Supabase connection
        await db.testConnection();
        
        const responseTime = Date.now() - startTime;
        
        res.status(200).json({ 
            status: 'OK', 
            timestamp: new Date().toISOString(),
            message: 'Career Evaluation System API is running',
            database: 'Supabase Connected',
            environment: process.env.NODE_ENV || 'development',
            port: port,
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            responseTime: `${responseTime}ms`,
            version: '2.0.0',
            nodejs: process.version,
            platform: process.platform,
            arch: process.arch
        });
    } catch (error) {
        console.error('Health check failed:', error);
        
        const responseTime = Date.now() - startTime;
        
        res.status(503).json({
            status: 'ERROR',
            timestamp: new Date().toISOString(),
            message: 'Service unavailable',
            database: 'Supabase Failed',
            error: error.message,
            environment: process.env.NODE_ENV || 'development',
            port: port,
            uptime: process.uptime(),
            responseTime: `${responseTime}ms`,
            details: {
                stack: error.stack,
                code: error.code
            }
        });
    }
});

// Authentication routes
app.post('/api/auth/login', auth.loginLimiter, auth.login);
app.post('/api/auth/logout', auth.logout);
app.get('/api/auth/me', auth.authenticate, auth.getCurrentUser);
app.post('/api/auth/change-password', auth.authenticate, auth.changePassword);

// Google OAuth routes (only if OAuth is configured)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    app.get('/auth/google/callback', 
        passport.authenticate('google', { failureRedirect: '/login?error=oauth_failed' }),
        async (req, res) => {
            try {
                // Generate JWT token for the user
                const token = auth.generateToken(req.user);
                
                // Redirect to frontend with token
                res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}`);
            } catch (error) {
                console.error('OAuth callback error:', error);
                res.redirect('/login?error=oauth_callback_failed');
            }
        }
    );
} else {
    // Provide fallback routes when OAuth is not configured
    app.get('/auth/google', (req, res) => {
        res.status(501).json({ error: 'Google OAuth not configured' });
    });
    
    app.get('/auth/google/callback', (req, res) => {
        res.status(501).json({ error: 'Google OAuth not configured' });
    });
}

// Users API with role-based access
app.get('/api/users', auth.authenticate, auth.requireTeamMemberOrManager, async (req, res) => {
    try {
        let users;
        
        if (req.user.role === 'manager') {
            // Managers can see all users
            users = await db.getAllUsers();
        } else {
            // Team members can only see themselves
            users = await db.all('users', { id: req.user.id });
        }
        
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/users/:slug', auth.authenticate, auth.requireSelfOrManager, async (req, res) => {
    try {
        const { slug } = req.params;
        const user = await db.getUserBySlug(slug);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Remove sensitive data
        const { password_hash, ...userInfo } = user;
        res.json(userInfo);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Expectations API - Manager only for updates
app.put('/api/users/:slug/expectations', auth.authenticate, auth.requireManager, async (req, res) => {
    try {
        const { slug } = req.params;
        const expectations = req.body;

        // Get user
        const user = await db.getUserBySlug(slug);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update expectations
        await db.updateUserExpectations(user.id, expectations, req.user.id);
        
        res.json({ message: 'Expectations updated successfully' });
    } catch (error) {
        console.error('Error updating expectations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Evaluations API
app.get('/api/evaluations/:slug/latest', auth.authenticate, auth.requireSelfOrManager, async (req, res) => {
    try {
        const { slug } = req.params;
        
        // Get user
        const user = await db.getUserBySlug(slug);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const evaluations = await db.getLatestEvaluations(user.id);
        res.json(evaluations);
    } catch (error) {
        console.error('Error fetching evaluations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/evaluations/:slug/history', auth.authenticate, auth.requireSelfOrManager, async (req, res) => {
    try {
        const { slug } = req.params;
        
        // Get user
        const user = await db.getUserBySlug(slug);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const evaluations = await db.getAllEvaluations(user.id);
        res.json(evaluations);
    } catch (error) {
        console.error('Error fetching evaluation history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/evaluations/:slug', auth.authenticate, async (req, res) => {
    try {
        const { slug } = req.params;
        const evaluationData = req.body;

        // Get user
        const user = await db.getUserBySlug(slug);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Determine evaluator type and permissions
        let evaluatorType;
        if (req.user.role === 'manager') {
            evaluatorType = evaluationData.evaluator_type || 'manager';
        } else if (req.user.id === user.id) {
            evaluatorType = 'self';
        } else {
            return res.status(403).json({ error: 'You can only create self-evaluations or manager evaluations' });
        }

        const evaluation = {
            user_id: user.id,
            evaluator_type: evaluatorType,
            evaluator_id: req.user.id,
            technical_knowledge: evaluationData.technical_knowledge,
            system_design: evaluationData.system_design,
            problem_solving: evaluationData.problem_solving,
            code_quality: evaluationData.code_quality,
            collaboration: evaluationData.collaboration,
            technical_leadership: evaluationData.technical_leadership,
            impact_scope: evaluationData.impact_scope,
            comments: evaluationData.comments || null
        };

        const result = await db.saveEvaluation(evaluation);
        
        res.status(201).json({ 
            message: 'Evaluation saved successfully',
            id: result.id 
        });
    } catch (error) {
        console.error('Error saving evaluation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Manager dashboard - Special route for managers to see all team data
app.get('/api/manager/dashboard', auth.authenticate, auth.requireManager, async (req, res) => {
    try {
        const users = await db.getAllUsers();

        // Add expectations and evaluation counts to each user
        for (const user of users) {
            user.expectations = await db.getUserExpectations(user.id);
            
            // Get evaluation counts (simplified for Supabase)
            const allEvaluations = await db.getAllEvaluations(user.id);
            user.self_evaluations = allEvaluations.filter(e => e.evaluator_type === 'self').length;
            user.manager_evaluations = allEvaluations.filter(e => e.evaluator_type === 'manager').length;
            user.last_evaluation = allEvaluations.length > 0 ? allEvaluations[0].created_at : null;
        }

        res.json(users);
    } catch (error) {
        console.error('Error fetching manager dashboard:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Manager routes for user management
app.post('/api/manager/users', auth.authenticate, auth.requireManager, async (req, res) => {
    try {
        const { name, email, position } = req.body;
        
        if (!name || !email || !position) {
            return res.status(400).json({ error: 'Name, email, and position are required' });
        }

        // Generate slug from name
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        // Default password
        const defaultPassword = await require('bcryptjs').hash('password123', 10);

        const userData = {
            name,
            slug,
            email,
            password_hash: defaultPassword,
            role: 'team_member',
            position
        };

        const result = await db.createUser(userData);

        res.status(201).json({ 
            message: 'User created successfully',
            id: result.id,
            defaultPassword: 'password123'
        });
    } catch (error) {
        if (error.code === '23505') { // PostgreSQL unique violation
            res.status(400).json({ error: 'Email or slug already exists' });
        } else {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend/build')));
    
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        // Skip API routes
        if (req.path.startsWith('/api/') || req.path.startsWith('/auth/')) {
            return res.status(404).json({ error: 'Route not found' });
        }
        res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Initialize Supabase connection and start server
async function startServer() {
    try {
        console.log('🔄 Initializing Supabase connection...');
        
        // Check Google OAuth configuration first
        if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
            console.log('🔐 Google OAuth enabled');
        } else {
            console.log('⚠️  Google OAuth not configured (missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)');
        }
        
        // Try to test Supabase connection, but don't fail if it doesn't work immediately
        try {
            await db.testConnection();
            console.log('✅ Supabase connection successful');
        } catch (dbError) {
            console.log('⚠️  Supabase connection failed, will retry later:', dbError.message);
            // Don't fail startup - continue without database for now
        }
        
        // Start server immediately
        const server = app.listen(port, '0.0.0.0', () => {
            console.log(`🚀 Server running at http://0.0.0.0:${port}`);
            console.log(`📊 API available at http://0.0.0.0:${port}/api/*`);
            console.log(`🔐 Authentication enabled`);
            console.log(`📋 Role-based access control active`);
            console.log(`💾 Database: Supabase PostgreSQL ready`);
            console.log(`✅ Server startup complete - ready for requests`);
        });
        
        // Handle server errors
        server.on('error', (error) => {
            console.error('❌ Server error:', error);
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${port} is already in use`);
                process.exit(1);
            }
        });
        
        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('🛑 Received SIGTERM, shutting down gracefully...');
            server.close(() => {
                console.log('✅ Server closed');
                process.exit(0);
            });
        });
        
        return server;
        
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        process.exit(1);
    }
}

// Start the server
if (require.main === module) {
    startServer();
}

module.exports = app; 