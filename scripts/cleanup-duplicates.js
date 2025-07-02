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

console.log('\n🧹 Career Evaluation System - Duplicate Cleanup');
console.log('='.repeat(50));

async function cleanupDuplicates() {
    try {
        // First, let's identify duplicates
        log('cyan', '\n📊 IDENTIFYING DUPLICATES');
        console.log('-'.repeat(30));
        
        const duplicates = await query(`
            SELECT 
                u.name,
                e.user_id, 
                e.evaluator_type, 
                DATE(e.created_at) as eval_date, 
                COUNT(*) as count,
                GROUP_CONCAT(e.id ORDER BY e.created_at DESC) as evaluation_ids,
                GROUP_CONCAT(e.created_at ORDER BY e.created_at DESC) as timestamps
            FROM evaluations e
            JOIN users u ON e.user_id = u.id
            GROUP BY e.user_id, e.evaluator_type, DATE(e.created_at)
            HAVING COUNT(*) > 1
            ORDER BY u.name, e.evaluator_type
        `);
        
        if (duplicates.length === 0) {
            log('green', '✅ No duplicates found! Database is clean.');
            return;
        }
        
        log('yellow', `⚠️  Found ${duplicates.length} sets of duplicates:`);
        duplicates.forEach(dup => {
            const ids = dup.evaluation_ids.split(',');
            const timestamps = dup.timestamps.split(',');
            console.log(`   • ${dup.name}: ${dup.count} ${dup.evaluator_type} evaluations on ${dup.eval_date}`);
            console.log(`     IDs: ${ids.join(', ')} (keeping: ${ids[0]}, removing: ${ids.slice(1).join(', ')})`);
        });
        
        // Ask for confirmation (in a real scenario, you'd want user input)
        log('cyan', '\n🔧 CLEANUP PLAN');
        console.log('-'.repeat(30));
        
        let totalToRemove = 0;
        const removalPlan = [];
        
        duplicates.forEach(dup => {
            const ids = dup.evaluation_ids.split(',');
            const idsToRemove = ids.slice(1); // Keep the first (most recent), remove the rest
            totalToRemove += idsToRemove.length;
            
            removalPlan.push({
                user: dup.name,
                type: dup.evaluator_type,
                date: dup.eval_date,
                keeping: ids[0],
                removing: idsToRemove
            });
        });
        
        log('yellow', `📋 Will remove ${totalToRemove} duplicate evaluations, keeping the most recent of each type.`);
        
        // Create backup first
        log('cyan', '\n💾 CREATING BACKUP');
        console.log('-'.repeat(30));
        
        const backupData = await query('SELECT * FROM evaluations');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(__dirname, '..', 'database', `evaluations-backup-${timestamp}.json`);
        
        const fs = require('fs');
        fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
        log('green', `✅ Backup created: ${backupPath}`);
        
        // Perform cleanup
        log('cyan', '\n🗑️  REMOVING DUPLICATES');
        console.log('-'.repeat(30));
        
        for (const plan of removalPlan) {
            for (const idToRemove of plan.removing) {
                await query('DELETE FROM evaluations WHERE id = ?', [idToRemove]);
                log('blue', `   🗑️  Removed evaluation ID ${idToRemove} (${plan.user} - ${plan.type} - ${plan.date})`);
            }
        }
        
        // Verify cleanup
        log('cyan', '\n✅ VERIFICATION');
        console.log('-'.repeat(30));
        
        const remainingDuplicates = await query(`
            SELECT 
                u.name,
                e.user_id, 
                e.evaluator_type, 
                DATE(e.created_at) as eval_date, 
                COUNT(*) as count
            FROM evaluations e
            JOIN users u ON e.user_id = u.id
            GROUP BY e.user_id, e.evaluator_type, DATE(e.created_at)
            HAVING COUNT(*) > 1
        `);
        
        if (remainingDuplicates.length === 0) {
            log('green', '✅ All duplicates successfully removed!');
        } else {
            log('red', `❌ Still found ${remainingDuplicates.length} duplicates. Manual review needed.`);
        }
        
        // Show final stats
        const finalEvalCount = await query('SELECT COUNT(*) as count FROM evaluations');
        log('blue', `📊 Final evaluation count: ${finalEvalCount[0].count}`);
        log('green', `💾 Backup location: ${backupPath}`);
        
        console.log('\n' + '='.repeat(50));
        log('cyan', '🎯 Cleanup complete!');
        console.log('');
        
    } catch (error) {
        log('red', `❌ Error during cleanup: ${error.message}`);
        console.error(error);
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

// Run cleanup
cleanupDuplicates(); 