-- Career Evaluation System - Database Queries
-- Use these queries with: sqlite3 database/career-evaluation.db

-- 1. Overview: All Users
SELECT 'USERS OVERVIEW' as category;
SELECT name, position, role, auth_provider, created_at FROM users ORDER BY role DESC, position;

-- 2. Evaluations Summary by User
SELECT 'EVALUATIONS SUMMARY' as category;
SELECT 
    u.name,
    COUNT(CASE WHEN e.evaluator_type = 'self' THEN 1 END) as self_evaluations,
    COUNT(CASE WHEN e.evaluator_type = 'manager' THEN 1 END) as manager_evaluations,
    COUNT(e.id) as total_evaluations,
    MAX(e.created_at) as latest_evaluation
FROM users u 
LEFT JOIN evaluations e ON u.id = e.user_id 
WHERE u.role = 'team_member'
GROUP BY u.id, u.name
ORDER BY u.name;

-- 3. Latest Evaluation Scores for Each User
SELECT 'LATEST EVALUATION SCORES' as category;
WITH latest_evals AS (
    SELECT 
        e.*,
        ROW_NUMBER() OVER (PARTITION BY e.user_id, e.evaluator_type ORDER BY e.created_at DESC) as rn
    FROM evaluations e
)
SELECT 
    u.name,
    le.evaluator_type,
    le.technical_knowledge,
    le.system_design,
    le.problem_solving,
    le.code_quality,
    le.collaboration,
    le.technical_leadership,
    le.impact_scope,
    le.created_at
FROM users u
JOIN latest_evals le ON u.id = le.user_id AND le.rn = 1
WHERE u.role = 'team_member'
ORDER BY u.name, le.evaluator_type;

-- 4. Expectations Status
SELECT 'EXPECTATIONS STATUS' as category;
SELECT 
    u.name,
    CASE 
        WHEN ue.id IS NOT NULL THEN 'Has Expectations' 
        ELSE 'No Expectations' 
    END as status,
    ue.created_at as expectations_created,
    ue.updated_at as last_updated
FROM users u 
LEFT JOIN user_expectations ue ON u.id = ue.user_id 
WHERE u.role = 'team_member'
ORDER BY u.name;

-- 5. Expectations Content Length
SELECT 'EXPECTATIONS CONTENT SIZE' as category;
SELECT 
    u.name,
    LENGTH(ue.technical_knowledge) as tech_chars,
    LENGTH(ue.leadership) as leadership_chars,
    LENGTH(ue.results) as results_chars,
    (LENGTH(ue.technical_knowledge) + LENGTH(ue.leadership) + LENGTH(ue.results)) as total_chars
FROM users u 
JOIN user_expectations ue ON u.id = ue.user_id 
ORDER BY total_chars DESC;

-- 6. Recent Activity (Last 30 Days)
SELECT 'RECENT ACTIVITY' as category;
SELECT 
    'Evaluations' as activity_type,
    COUNT(*) as count,
    MIN(created_at) as earliest,
    MAX(created_at) as latest
FROM evaluations 
WHERE created_at >= datetime('now', '-30 days')
UNION ALL
SELECT 
    'Expectation Updates' as activity_type,
    COUNT(*) as count,
    MIN(updated_at) as earliest,
    MAX(updated_at) as latest
FROM user_expectations 
WHERE updated_at >= datetime('now', '-30 days');

-- 7. Database Health Checks
SELECT 'DATA INTEGRITY CHECKS' as category;

-- Check for orphaned records
SELECT 'Orphaned Evaluations' as check_type, COUNT(*) as count
FROM evaluations e 
LEFT JOIN users u ON e.user_id = u.id 
WHERE u.id IS NULL
UNION ALL
SELECT 'Orphaned Expectations' as check_type, COUNT(*) as count
FROM user_expectations ue 
LEFT JOIN users u ON ue.user_id = u.id 
WHERE u.id IS NULL;

-- 8. User Completion Status
SELECT 'USER COMPLETION STATUS' as category;
SELECT 
    u.name,
    CASE WHEN ue.id IS NOT NULL THEN '✓' ELSE '✗' END as has_expectations,
    CASE WHEN self_eval.id IS NOT NULL THEN '✓' ELSE '✗' END as has_self_eval,
    CASE WHEN mgr_eval.id IS NOT NULL THEN '✓' ELSE '✗' END as has_manager_eval,
    CASE 
        WHEN ue.id IS NOT NULL AND self_eval.id IS NOT NULL AND mgr_eval.id IS NOT NULL 
        THEN 'Complete' 
        WHEN ue.id IS NOT NULL OR self_eval.id IS NOT NULL OR mgr_eval.id IS NOT NULL 
        THEN 'Partial' 
        ELSE 'Not Started' 
    END as completion_status
FROM users u
LEFT JOIN user_expectations ue ON u.id = ue.user_id
LEFT JOIN (
    SELECT DISTINCT user_id, id FROM evaluations WHERE evaluator_type = 'self'
) self_eval ON u.id = self_eval.user_id
LEFT JOIN (
    SELECT DISTINCT user_id, id FROM evaluations WHERE evaluator_type = 'manager'
) mgr_eval ON u.id = mgr_eval.user_id
WHERE u.role = 'team_member'
ORDER BY 
    CASE completion_status 
        WHEN 'Complete' THEN 1 
        WHEN 'Partial' THEN 2 
        ELSE 3 
    END, 
    u.name;

-- 9. Evaluation History Timeline
SELECT 'EVALUATION TIMELINE' as category;
SELECT 
    u.name,
    e.evaluator_type,
    DATE(e.created_at) as evaluation_date,
    e.technical_knowledge,
    e.impact_scope
FROM users u
JOIN evaluations e ON u.id = e.user_id
WHERE u.role = 'team_member'
ORDER BY u.name, e.created_at DESC;

-- 10. Table Sizes
SELECT 'TABLE SIZES' as category;
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'evaluations' as table_name, COUNT(*) as record_count FROM evaluations
UNION ALL
SELECT 'user_expectations' as table_name, COUNT(*) as record_count FROM user_expectations
UNION ALL
SELECT 'sessions' as table_name, COUNT(*) as record_count FROM sessions; 