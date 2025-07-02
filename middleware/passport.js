const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../lib/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user exists with this Google ID
        let user = await db.get('SELECT * FROM users WHERE google_id = ?', [profile.id]);
        
        if (user) {
            return done(null, user);
        }

        // Check if user exists with this email
        user = await db.get('SELECT * FROM users WHERE email = ?', [profile.emails[0].value]);
        
        if (user) {
            // Link Google account to existing user
            await db.run(
                'UPDATE users SET google_id = ?, avatar_url = ?, auth_provider = ? WHERE id = ?',
                [profile.id, profile.photos[0]?.value, 'google', user.id]
            );
            
            user.google_id = profile.id;
            user.avatar_url = profile.photos[0]?.value;
            user.auth_provider = 'google';
            
            return done(null, user);
        }

        // Create new user
        const displayName = profile.displayName;
        const email = profile.emails[0].value;
        const slug = displayName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        // Ensure unique slug
        let uniqueSlug = slug;
        let counter = 1;
        while (await db.get('SELECT id FROM users WHERE slug = ?', [uniqueSlug])) {
            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }

        const result = await db.run(`
            INSERT INTO users (
                name, slug, email, google_id, avatar_url, auth_provider, role, position
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            displayName,
            uniqueSlug,
            email,
            profile.id,
            profile.photos[0]?.value,
            'google',
            'team_member', // Default role
            'Software Engineer' // Default position
        ]);

        const newUser = await db.get('SELECT * FROM users WHERE id = ?', [result.id]);
        return done(null, newUser);
        
    } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
    }
}));

// JWT Strategy for API authentication
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        const user = await db.get('SELECT * FROM users WHERE id = ?', [payload.id]);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport; 