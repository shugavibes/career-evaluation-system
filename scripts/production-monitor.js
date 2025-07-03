const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'career-evaluation.db');

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    cyan: '\x1b[36m'
};

const log = (color, message) => {
    console.log(`${colors[color]}${message}${colors.reset}`);
};

const db = new sqlite3.Database(dbPath);

console.log('\n🔍 Career Evaluation System - Production Monitor');
console.log('='.repeat(55));
console.log(`📅 Report generated: ${new Date().toLocaleString()}`);

async function monitorProduction() {
    try {
        // System Overview
        log('cyan', '\n📊 SYSTEM OVERVIEW');
        console.log('-'.repeat(30));
        
        const users = await query('SELECT COUNT(*) as count FROM users');
        const evaluations = await query('SELECT COUNT(*) as count FROM evaluations');
        const expectations = await query('SELECT COUNT(*) as count FROM user_expectations');
        const sessions = await query('SELECT COUNT(*) as count FROM sessions');
        
        log('blue', `👥 Total Users: ${users[0].count}`);
        log('blue', `📋 Total Evaluations: ${evaluations[0].count}`);
        log('blue', `🎯 Users with Expectations: ${expectations[0].count}`);
        log('blue', `🔐 Active Sessions: ${sessions[0].count}`);
        
        // Recent Activity (Last 24 hours)
        log('cyan', '\n📈 RECENT ACTIVITY (24h)');
        console.log('-'.repeat(30));
        
        const recentEvals = await query(`
            SELECT COUNT(*) as count FROM evaluations 
            WHERE created_at >= datetime('now', '-1 day')
        `);
        
        const recentExpectations = await query(`
            SELECT COUNT(*) as count FROM user_expectations 
            WHERE updated_at >= datetime('now', '-1 day')
        `);
        
        const recentSessions = await query(`
            SELECT COUNT(*) as count FROM sessions 
            WHERE expires_at > datetime('now')
        `);
        
        log('green', `📊 New Evaluations: ${recentEvals[0].count}`);
        log('green', `🎯 Expectation Updates: ${recentExpectations[0].count}`);
        log('green', `🔐 Valid Sessions: ${recentSessions[0].count}`);
        
        // Health Checks
        log('cyan', '\n🏥 HEALTH CHECKS');
        console.log('-'.repeat(30));
        
        // Check for orphaned records
        const orphanedEvals = await query(`
            SELECT COUNT(*) as count FROM evaluations e 
            LEFT JOIN users u ON e.user_id = u.id 
            WHERE u.id IS NULL
        `);
        
        const orphanedExpectations = await query(`
            SELECT COUNT(*) as count FROM user_expectations ue 
            LEFT JOIN users u ON ue.user_id = u.id 
            WHERE u.id IS NULL
        `);
        
        // Check for duplicates
        const duplicates = await query(`
            SELECT COUNT(*) as count FROM (
                SELECT user_id, evaluator_type, DATE(created_at) 
                FROM evaluations 
                GROUP BY user_id, evaluator_type, DATE(created_at)
                HAVING COUNT(*) > 1
            )
        `);
        
        // Database size check
        const dbStats = await query(`
            SELECT 
                page_count * page_size as size_bytes,
                page_count,
                page_size
            FROM pragma_page_count(), pragma_page_size()
        `);
        
        const sizeMB = (dbStats[0].size_bytes / 1024 / 1024).toFixed(2);
        
        log(orphanedEvals[0].count === 0 ? 'green' : 'red', 
            `${orphanedEvals[0].count === 0 ? '✅' : '❌'} Orphaned Evaluations: ${orphanedEvals[0].count}`);
        log(orphanedExpectations[0].count === 0 ? 'green' : 'red', 
            `${orphanedExpectations[0].count === 0 ? '✅' : '❌'} Orphaned Expectations: ${orphanedExpectations[0].count}`);
        log(duplicates[0].count === 0 ? 'green' : 'yellow', 
            `${duplicates[0].count === 0 ? '✅' : '⚠️ '} Duplicate Evaluations: ${duplicates[0].count}`);
        log('blue', `💾 Database Size: ${sizeMB} MB`);
        
        // User Engagement
        log('cyan', '\n👥 USER ENGAGEMENT');
        console.log('-'.repeat(30));
        
        const teamMembers = await query(`
            SELECT COUNT(*) as count FROM users WHERE role = 'team_member'
        `);
        
        const usersWithExpectations = await query(`
            SELECT COUNT(DISTINCT ue.user_id) as count 
            FROM user_expectations ue 
            JOIN users u ON ue.user_id = u.id 
            WHERE u.role = 'team_member'
        `);
        
        const usersWithSelfEvals = await query(`
            SELECT COUNT(DISTINCT e.user_id) as count 
            FROM evaluations e 
            JOIN users u ON e.user_id = u.id 
            WHERE u.role = 'team_member' AND e.evaluator_type = 'self'
        `);
        
        const usersWithManagerEvals = await query(`
            SELECT COUNT(DISTINCT e.user_id) as count 
            FROM evaluations e 
            JOIN users u ON e.user_id = u.id 
            WHERE u.role = 'team_member' AND e.evaluator_type = 'manager'
        `);
        
        const expectationsCoverage = ((usersWithExpectations[0].count / teamMembers[0].count) * 100).toFixed(1);
        const selfEvalCoverage = ((usersWithSelfEvals[0].count / teamMembers[0].count) * 100).toFixed(1);
        const managerEvalCoverage = ((usersWithManagerEvals[0].count / teamMembers[0].count) * 100).toFixed(1);
        
        log('blue', `🎯 Expectations Coverage: ${expectationsCoverage}% (${usersWithExpectations[0].count}/${teamMembers[0].count})`);
        log('blue', `👤 Self-Evaluation Coverage: ${selfEvalCoverage}% (${usersWithSelfEvals[0].count}/${teamMembers[0].count})`);
        log('blue', `👨‍💼 Manager Evaluation Coverage: ${managerEvalCoverage}% (${usersWithManagerEvals[0].count}/${teamMembers[0].count})`);
        
        // Authentication Status
        log('cyan', '\n🔐 AUTHENTICATION STATUS');
        console.log('-'.repeat(30));
        
        const localUsers = await query(`
            SELECT COUNT(*) as count FROM users
        `);
        
        log('blue', `🔑 Email/Password Auth Users: ${localUsers[0].count}`);
        log('blue', `🌐 Google OAuth: Disabled`);
        
        // Alert Conditions
        log('cyan', '\n⚠️  ALERTS');
        console.log('-'.repeat(30));
        
        const alerts = [];
        
        if (orphanedEvals[0].count > 0) {
            alerts.push(`${orphanedEvals[0].count} orphaned evaluations need cleanup`);
        }
        
        if (orphanedExpectations[0].count > 0) {
            alerts.push(`${orphanedExpectations[0].count} orphaned expectations need cleanup`);
        }
        
        if (duplicates[0].count > 0) {
            alerts.push(`${duplicates[0].count} duplicate evaluations detected`);
        }
        
        if (sizeMB > 100) {
            alerts.push(`Database size (${sizeMB} MB) is getting large`);
        }
        
        if (expectationsCoverage < 80) {
            alerts.push(`Low expectations coverage (${expectationsCoverage}%)`);
        }
        
        if (recentEvals[0].count === 0 && recentExpectations[0].count === 0) {
            alerts.push('No activity in the last 24 hours');
        }
        
        if (alerts.length === 0) {
            log('green', '✅ No alerts - system is running smoothly!');
        } else {
            alerts.forEach(alert => {
                log('yellow', `⚠️  ${alert}`);
            });
        }
        
        // Performance Metrics
        log('cyan', '\n⚡ PERFORMANCE METRICS');
        console.log('-'.repeat(30));
        
        const avgEvaluationsPerUser = (evaluations[0].count / teamMembers[0].count).toFixed(1);
        const completionRate = (((usersWithSelfEvals[0].count + usersWithManagerEvals[0].count) / (teamMembers[0].count * 2)) * 100).toFixed(1);
        
        log('blue', `📊 Avg Evaluations per User: ${avgEvaluationsPerUser}`);
        log('blue', `📈 Overall Completion Rate: ${completionRate}%`);
        
        // Summary Status
        log('cyan', '\n🎯 SYSTEM STATUS');
        console.log('-'.repeat(30));
        
        if (alerts.length === 0 && completionRate > 50) {
            log('green', '🟢 HEALTHY - System is operating optimally');
        } else if (alerts.length <= 2 && completionRate > 30) {
            log('yellow', '🟡 WARNING - Minor issues need attention');
        } else {
            log('red', '🔴 CRITICAL - Immediate action required');
        }
        
        console.log('\n' + '='.repeat(55));
        log('cyan', '📊 Monitoring complete!');
        console.log('');
        
        // Return status for programmatic use
        return {
            status: alerts.length === 0 && completionRate > 50 ? 'healthy' : 
                   alerts.length <= 2 && completionRate > 30 ? 'warning' : 'critical',
            alerts: alerts,
            metrics: {
                totalUsers: users[0].count,
                totalEvaluations: evaluations[0].count,
                expectationsCoverage: parseFloat(expectationsCoverage),
                completionRate: parseFloat(completionRate),
                databaseSizeMB: parseFloat(sizeMB)
            }
        };
        
    } catch (error) {
        log('red', `❌ Error during monitoring: ${error.message}`);
        return { status: 'error', error: error.message };
    } finally {
        db.close();
    }
}

// Helper function to promisify database queries
function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// Run monitoring
if (require.main === module) {
    monitorProduction();
}

module.exports = { monitorProduction }; 