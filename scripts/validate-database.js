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

console.log('\n🔍 Career Evaluation System - Database Validation Report');
console.log('='.repeat(60));

async function validateDatabase() {
    try {
        // 1. Users Validation
        log('cyan', '\n📊 1. USERS ANALYSIS');
        console.log('-'.repeat(40));
        
        const users = await query('SELECT * FROM users ORDER BY role DESC, position');
        const managers = users.filter(u => u.role === 'manager');
        const teamMembers = users.filter(u => u.role === 'team_member');
        
        log('green', `✅ Total Users: ${users.length}`);
        log('blue', `   👨‍💼 Managers: ${managers.length}`);
        log('blue', `   👥 Team Members: ${teamMembers.length}`);
        
        // Check OAuth readiness
        const oauthColumns = await query("PRAGMA table_info(users)");
        const hasOAuth = oauthColumns.some(col => col.name === 'google_id');
        log(hasOAuth ? 'green' : 'yellow', `${hasOAuth ? '✅' : '⚠️ '} OAuth Integration: ${hasOAuth ? 'Ready' : 'Not configured'}`);
        
        // List all users
        console.log('\n   User Details:');
        users.forEach(user => {
            const authType = user.auth_provider || 'local';
            console.log(`   • ${user.name} (${user.position}) - ${user.role} [${authType}]`);
        });

        // 2. Evaluations Validation
        log('cyan', '\n📋 2. EVALUATIONS ANALYSIS');
        console.log('-'.repeat(40));
        
        const evaluations = await query(`
            SELECT u.name, u.id as user_id, e.evaluator_type, e.created_at, 
                   e.technical_knowledge, e.system_design, e.problem_solving,
                   e.code_quality, e.collaboration, e.technical_leadership, e.impact_scope
            FROM users u 
            LEFT JOIN evaluations e ON u.id = e.user_id 
            WHERE u.role = 'team_member'
            ORDER BY u.name, e.created_at DESC
        `);
        
        const evalsByUser = {};
        teamMembers.forEach(user => {
            evalsByUser[user.name] = {
                self: evaluations.filter(e => e.user_id === user.id && e.evaluator_type === 'self').length,
                manager: evaluations.filter(e => e.user_id === user.id && e.evaluator_type === 'manager').length,
                total: evaluations.filter(e => e.user_id === user.id).length
            };
        });
        
        log('green', `✅ Total Evaluations: ${evaluations.filter(e => e.evaluator_type).length}`);
        
        console.log('\n   Evaluation Status by User:');
        Object.entries(evalsByUser).forEach(([name, counts]) => {
            const selfStatus = counts.self > 0 ? '✅' : '❌';
            const managerStatus = counts.manager > 0 ? '✅' : '❌';
            const completionStatus = counts.self > 0 && counts.manager > 0 ? 'Complete' : 
                                   counts.total > 0 ? 'Partial' : 'Pending';
            
            console.log(`   • ${name}: Self ${selfStatus} Manager ${managerStatus} (${counts.total} total) - ${completionStatus}`);
        });

        // 3. Expectations Validation
        log('cyan', '\n🎯 3. EXPECTATIONS ANALYSIS');
        console.log('-'.repeat(40));
        
        const expectations = await query(`
            SELECT u.name, ue.id, 
                   LENGTH(ue.technical_knowledge) as tech_length,
                   LENGTH(ue.leadership) as leadership_length,
                   LENGTH(ue.results) as results_length,
                   ue.created_at, ue.updated_at
            FROM users u 
            LEFT JOIN user_expectations ue ON u.id = ue.user_id 
            WHERE u.role = 'team_member'
            ORDER BY u.name
        `);
        
        const withExpectations = expectations.filter(e => e.id).length;
        const withoutExpectations = teamMembers.length - withExpectations;
        
        log('green', `✅ Users with Expectations: ${withExpectations}/${teamMembers.length}`);
        log(withoutExpectations > 0 ? 'yellow' : 'green', `${withoutExpectations > 0 ? '⚠️ ' : '✅ '}Users without Expectations: ${withoutExpectations}`);
        
        console.log('\n   Expectations Details:');
        expectations.forEach(exp => {
            if (exp.id) {
                const totalContent = (exp.tech_length || 0) + (exp.leadership_length || 0) + (exp.results_length || 0);
                console.log(`   • ${exp.name}: ${totalContent} chars total (Updated: ${new Date(exp.updated_at).toLocaleDateString()})`);
            } else {
                console.log(`   • ${exp.name}: ❌ No expectations set`);
            }
        });

        // 4. Data Integrity Checks
        log('cyan', '\n🔧 4. DATA INTEGRITY CHECKS');
        console.log('-'.repeat(40));
        
        // Check for orphaned evaluations
        const orphanedEvals = await query(`
            SELECT COUNT(*) as count FROM evaluations e 
            LEFT JOIN users u ON e.user_id = u.id 
            WHERE u.id IS NULL
        `);
        
        // Check for orphaned expectations
        const orphanedExpectations = await query(`
            SELECT COUNT(*) as count FROM user_expectations ue 
            LEFT JOIN users u ON ue.user_id = u.id 
            WHERE u.id IS NULL
        `);
        
        // Check for duplicate evaluations (same user, same type, same day)
        const duplicateEvals = await query(`
            SELECT user_id, evaluator_type, DATE(created_at) as eval_date, COUNT(*) as count
            FROM evaluations 
            GROUP BY user_id, evaluator_type, DATE(created_at)
            HAVING COUNT(*) > 1
        `);
        
        log(orphanedEvals[0].count === 0 ? 'green' : 'red', `${orphanedEvals[0].count === 0 ? '✅' : '❌'} Orphaned Evaluations: ${orphanedEvals[0].count}`);
        log(orphanedExpectations[0].count === 0 ? 'green' : 'red', `${orphanedExpectations[0].count === 0 ? '✅' : '❌'} Orphaned Expectations: ${orphanedExpectations[0].count}`);
        log(duplicateEvals.length === 0 ? 'green' : 'yellow', `${duplicateEvals.length === 0 ? '✅' : '⚠️ '} Duplicate Evaluations: ${duplicateEvals.length}`);

        // 5. Recent Activity
        log('cyan', '\n📈 5. RECENT ACTIVITY (Last 7 Days)');
        console.log('-'.repeat(40));
        
        const recentEvals = await query(`
            SELECT COUNT(*) as count FROM evaluations 
            WHERE created_at >= datetime('now', '-7 days')
        `);
        
        const recentExpectations = await query(`
            SELECT COUNT(*) as count FROM user_expectations 
            WHERE updated_at >= datetime('now', '-7 days')
        `);
        
        log('blue', `📊 Recent Evaluations: ${recentEvals[0].count}`);
        log('blue', `🎯 Recent Expectation Updates: ${recentExpectations[0].count}`);

        // 6. Production Readiness
        log('cyan', '\n🚀 6. PRODUCTION READINESS');
        console.log('-'.repeat(40));
        
        const checks = [
            { name: 'Database Schema', status: true, message: 'All tables present' },
            { name: 'OAuth Columns', status: hasOAuth, message: hasOAuth ? 'Ready for Google OAuth' : 'Need OAuth migration' },
            { name: 'Manager Account', status: managers.length > 0, message: `${managers.length} manager(s) configured` },
            { name: 'Team Members', status: teamMembers.length > 0, message: `${teamMembers.length} team member(s)` },
            { name: 'Sample Data', status: evaluations.filter(e => e.evaluator_type).length > 0, message: 'Evaluations exist' }
        ];
        
        checks.forEach(check => {
            log(check.status ? 'green' : 'red', `${check.status ? '✅' : '❌'} ${check.name}: ${check.message}`);
        });

        // 7. Recommendations
        log('cyan', '\n💡 7. RECOMMENDATIONS');
        console.log('-'.repeat(40));
        
        if (withoutExpectations > 0) {
            log('yellow', `⚠️  Set expectations for ${withoutExpectations} team members without them`);
        }
        
        const usersWithoutEvals = Object.entries(evalsByUser).filter(([name, counts]) => counts.total === 0).length;
        if (usersWithoutEvals > 0) {
            log('yellow', `⚠️  Encourage ${usersWithoutEvals} team members to complete evaluations`);
        }
        
        if (duplicateEvals.length > 0) {
            log('yellow', `⚠️  Review and clean up ${duplicateEvals.length} duplicate evaluation entries`);
        }
        
        const allGood = withoutExpectations === 0 && usersWithoutEvals === 0 && duplicateEvals.length === 0;
        if (allGood) {
            log('green', '✅ Database is in excellent condition for production deployment!');
        }

        console.log('\n' + '='.repeat(60));
        log('cyan', '🎯 Database validation complete!');
        console.log('');

    } catch (error) {
        log('red', `❌ Error during validation: ${error.message}`);
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

// Run validation
validateDatabase(); 