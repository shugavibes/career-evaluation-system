# Google OAuth Integration Setup Guide

## 🔧 Setup Instructions

### 1. Google Cloud Console Configuration

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create or Select Project**:
   - Create a new project or select an existing one
   - Note your project ID

3. **Enable Google+ API**:
   - Go to APIs & Services > Library
   - Search for "Google+ API" and enable it

4. **Create OAuth 2.0 Credentials**:
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Configure consent screen if prompted
   - Application type: Web application
   - Name: "Career Evaluation System"

5. **Configure Authorized Origins**:
   ```
   Development:
   http://localhost:3000
   http://localhost:3001
   
   Production:
   https://your-domain.com
   ```

6. **Configure Redirect URIs**:
   ```
   Development:
   http://localhost:3001/auth/google/callback
   
   Production:
   https://your-domain.com/auth/google/callback
   ```

7. **Copy Credentials**:
   - Copy Client ID and Client Secret
   - Keep these secure!

### 2. Environment Configuration

1. **Copy environment template**:
   ```bash
   cp environment.example .env
   ```

2. **Update `.env` file**:
   ```env
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-actual-google-client-id
   GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
   
   # React App (Frontend)
   REACT_APP_GOOGLE_CLIENT_ID=your-actual-google-client-id
   ```

### 3. Database Migration

The system will automatically migrate your existing database to support Google OAuth:

```bash
npm run init-db
```

**Migration includes**:
- Adding `google_id` column for OAuth user linking
- Adding `avatar_url` column for profile pictures  
- Adding `auth_provider` column to track login method
- Making `password_hash` nullable for OAuth-only users

### 4. Development Testing

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test Google Login**:
   - Navigate to http://localhost:3000/login
   - Click "Continue with Google" button
   - Complete OAuth flow
   - Should redirect to appropriate dashboard

## 🔒 Security Considerations

### OAuth Flow Security
- All OAuth tokens are validated server-side
- JWT tokens are generated for authenticated users
- Session management includes expiration
- CSRF protection through state parameters

### User Linking Strategy
1. **Existing User**: If email matches existing user, link Google account
2. **New User**: Create new user with Google profile information
3. **Default Role**: New Google users get `team_member` role
4. **Manual Promotion**: Managers must manually promote to manager role

### Data Privacy
- Only basic profile information is stored (name, email, avatar)
- Google tokens are not stored permanently
- Users can still use password login alongside Google

## 🎯 User Experience

### Login Page Features
- **Dual Login Options**: Traditional email/password + Google OAuth
- **Visual Separation**: Clear divider between login methods
- **Error Handling**: Comprehensive error messages for OAuth failures
- **Loading States**: Visual feedback during authentication

### First-Time Google Users
1. **Automatic Account Creation**:
   - Name from Google profile
   - Email from Google account
   - Avatar URL from Google photos
   - Default position: "Software Engineer"
   - Default role: "team_member"

2. **Slug Generation**:
   - Auto-generated from display name
   - Handles duplicates with numbering
   - URL-safe formatting

### Account Linking
- **Same Email**: Automatically links Google to existing account
- **Different Email**: Creates separate account
- **Manual Linking**: Users can contact admin to merge accounts

## 🚀 Production Deployment

### Environment Variables
```env
NODE_ENV=production
GOOGLE_CLIENT_ID=prod-client-id
GOOGLE_CLIENT_SECRET=prod-client-secret
GOOGLE_CALLBACK_URL=https://your-domain.com/auth/google/callback
FRONTEND_URL=https://your-domain.com
```

### SSL Requirements
- Google OAuth requires HTTPS in production
- Ensure SSL certificates are properly configured
- Update redirect URIs in Google Console

### Database Backup
- Backup database before deploying OAuth changes
- Test migration on staging environment first
- Monitor logs during first production OAuth attempts

## 🛠️ Troubleshooting

### Common Issues

1. **"OAuth Error: invalid_client"**
   - Check Client ID and Secret in .env
   - Verify redirect URI matches Google Console exactly
   - Ensure no trailing slashes in URLs

2. **"OAuth Error: redirect_uri_mismatch"**
   - Update redirect URIs in Google Console
   - Check for HTTP vs HTTPS mismatch
   - Verify port numbers match

3. **"User creation failed"**
   - Check database permissions
   - Verify schema migration completed
   - Check for unique constraint violations

4. **Frontend not loading Google button**
   - Verify REACT_APP_GOOGLE_CLIENT_ID is set
   - Check browser console for JavaScript errors
   - Ensure Google Identity Services script loads

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=oauth:*
```

### Testing OAuth Flow
1. **Clear browser cache and cookies**
2. **Use incognito/private browsing**
3. **Test with different Google accounts**
4. **Verify both new user creation and existing user linking**

## 📊 Monitoring

### Key Metrics to Monitor
- OAuth success/failure rates
- New user registrations via Google
- Account linking events
- Authentication errors

### Log Events
- Google OAuth attempts
- User creation/linking
- Authentication failures
- Token generation/validation

## 🔄 Maintenance

### Regular Tasks
- Monitor Google Cloud Console for API usage
- Review OAuth consent screen compliance
- Update client secrets periodically
- Check for Google API deprecations

### User Management
- Review new Google users and assign appropriate roles
- Handle account linking requests
- Monitor for suspicious OAuth activity
- Regular cleanup of expired sessions 