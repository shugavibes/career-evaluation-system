# Database Monitoring & Verification Guide

## 📊 Current Database Status

Based on the validation report, here's your current database status:

### ✅ **What's Working Well**
- **Database Structure**: All tables properly configured with OAuth support
- **Data Integrity**: No orphaned records or data corruption
- **Authentication**: Ready for both local and Google OAuth
- **Manager Setup**: 1 manager configured (System Manager)
- **Team Members**: 7 team members with proper roles and positions
- **Backup System**: Automatic backup creation during maintenance

### ⚠️ **Areas Needing Attention**
- **Expectations Coverage**: Only 2/7 team members have expectations set (28.6%)
- **Evaluation Completion**: Low overall completion rate (14.3%)
- **User Engagement**: Most team members haven't started their evaluations yet

## 🛠️ Database Monitoring Tools

I've created several tools to help you monitor and maintain your database:

### 1. **Comprehensive Validation** (`scripts/validate-database.js`)
```bash
node scripts/validate-database.js
```
**Use this to:**
- Get a complete health check of your database
- Verify data integrity before deployment
- Check user engagement and completion rates
- Identify potential issues early

### 2. **Production Monitoring** (`scripts/production-monitor.js`)
```bash
node scripts/production-monitor.js
```
**Use this to:**
- Monitor system health in production
- Track user engagement metrics
- Get alerts for issues that need attention
- Monitor database size and performance

### 3. **Duplicate Cleanup** (`scripts/cleanup-duplicates.js`)
```bash
node scripts/cleanup-duplicates.js
```
**Use this to:**
- Clean up duplicate evaluations (already done)
- Create automatic backups before cleanup
- Maintain data quality

### 4. **Manual SQL Queries** (`scripts/database-queries.sql`)
```bash
sqlite3 database/career-evaluation.db < scripts/database-queries.sql
```
**Use this to:**
- Run specific queries to investigate data
- Get detailed reports on user activity
- Check evaluation history and trends

## 📋 Regular Monitoring Checklist

### **Daily Checks** (Production)
- [ ] Run production monitor: `node scripts/production-monitor.js`
- [ ] Check for critical alerts (orphaned records, duplicates)
- [ ] Monitor user activity levels
- [ ] Verify database size isn't growing too fast

### **Weekly Checks**
- [ ] Run full validation: `node scripts/validate-database.js`
- [ ] Review user engagement metrics
- [ ] Check completion rates by team member
- [ ] Clean up any duplicate records if found

### **Monthly Checks**
- [ ] Create manual database backup
- [ ] Review overall system health trends
- [ ] Check authentication method distribution
- [ ] Plan for database optimizations if needed

## 🎯 Key Metrics to Track

### **Health Indicators**
- **Data Integrity**: 0 orphaned records, 0 duplicates ✅
- **Database Size**: Currently 0.06 MB (very healthy)
- **System Status**: Monitor for GREEN/YELLOW/RED status

### **User Engagement**
- **Expectations Coverage**: Currently 28.6% (Goal: >80%)
- **Self-Evaluation Rate**: Currently 14.3% (Goal: >90%)
- **Manager Evaluation Rate**: Currently 14.3% (Goal: >90%)
- **Overall Completion**: Currently 14.3% (Goal: >70%)

### **Activity Metrics**
- **Recent Evaluations**: Track daily/weekly submission trends
- **User Logins**: Monitor authentication activity
- **Expectation Updates**: Track when managers update expectations

## 🚀 Production Deployment Readiness

### ✅ **Ready for Production**
- Database schema is complete and optimized
- OAuth integration is configured and tested
- All monitoring tools are in place
- Data backup and recovery procedures established
- No data integrity issues

### 📝 **Recommended Next Steps**
1. **Set expectations** for the 5 remaining team members
2. **Encourage team members** to complete their self-evaluations
3. **Train managers** on completing manager evaluations
4. **Deploy monitoring** as part of your production workflow

## 🔧 Quick Database Commands

### **Check User Status**
```sql
SELECT name, position, role, 
       CASE WHEN ue.id IS NOT NULL THEN '✓' ELSE '✗' END as has_expectations
FROM users u 
LEFT JOIN user_expectations ue ON u.id = ue.user_id 
WHERE role = 'team_member';
```

### **Check Evaluation Progress**
```sql
SELECT u.name,
       COUNT(CASE WHEN e.evaluator_type = 'self' THEN 1 END) as self_evals,
       COUNT(CASE WHEN e.evaluator_type = 'manager' THEN 1 END) as manager_evals
FROM users u 
LEFT JOIN evaluations e ON u.id = e.user_id 
WHERE u.role = 'team_member'
GROUP BY u.id, u.name;
```

### **Recent Activity**
```sql
SELECT 'Evaluations' as type, COUNT(*) as count, MAX(created_at) as latest
FROM evaluations 
WHERE created_at >= datetime('now', '-7 days')
UNION ALL
SELECT 'Expectations' as type, COUNT(*) as count, MAX(updated_at) as latest  
FROM user_expectations 
WHERE updated_at >= datetime('now', '-7 days');
```

## 📊 Understanding the Data Flow

### **Users Table**
- Contains all team members and managers
- Supports both local authentication and Google OAuth
- Tracks roles, positions, and authentication methods

### **Evaluations Table**
- Stores all evaluation responses (self and manager)
- Tracks evaluation history over time
- Links to users via `user_id`

### **User_Expectations Table**
- Contains personalized expectations for each team member
- Set by managers, visible to team members
- Updated as roles and responsibilities evolve

### **Sessions Table**
- Manages user authentication sessions
- Supports both JWT and OAuth flows
- Automatically cleans up expired sessions

## 🛡️ Data Security & Backup

### **Automatic Backups**
- Cleanup scripts create automatic backups
- Stored in `database/` directory with timestamps
- JSON format for easy restoration if needed

### **Manual Backup**
```bash
# Create a full database backup
cp database/career-evaluation.db database/backup-$(date +%Y%m%d-%H%M%S).db

# Export to SQL format
sqlite3 database/career-evaluation.db .dump > database/backup-$(date +%Y%m%d-%H%M%S).sql
```

### **Security Considerations**
- Database contains sensitive evaluation data
- Ensure proper file permissions in production
- Consider encryption for production databases
- Regular backup rotation and secure storage

## 📈 Production Scaling Considerations

### **Current Capacity**
- 8 users, 2 evaluations, 0.06 MB database
- SQLite can easily handle 1000+ users
- Current setup is very lightweight

### **When to Consider Migration**
- Database size > 1 GB
- Concurrent users > 100
- Complex reporting requirements
- Multi-tenant needs

Your database is in excellent condition for production deployment. The monitoring tools will help you maintain data quality and user engagement as your team grows! 