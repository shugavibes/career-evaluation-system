const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database/init');
const bcrypt = require('bcryptjs'); 

// Middleware to check leader password for leader evaluations
const checkLeaderAuth = async (req, res, next) => {
    if (req.body.evaluator_type === 'leader') {
        const password = req.headers.authorization?.replace('Bearer ', '');
        const leaderPassword = process.env.LEADER_PASSWORD || 'leader123';
        
        if (!password || password !== leaderPassword) {
            return res.status(401).json({ error: 'Unauthorized: Invalid leader password' });
        }
    }
    next();
};

// Create new evaluation
router.post('/', checkLeaderAuth, (req, res) => {
    const db = getDatabase();
    const {
        user_id,
        evaluator_type,
        technical_knowledge,
        system_design,
        problem_solving,
        code_quality,
        collaboration,
        technical_leadership,
        impact_scope
    } = req.body;

    // Validate required fields
    if (!user_id || !evaluator_type) {
        return res.status(400).json({ error: 'user_id and evaluator_type are required' });
    }

    // Check if evaluation already exists for this user and evaluator type
    db.get(
        'SELECT id FROM evaluations WHERE user_id = ? AND evaluator_type = ?',
        [user_id, evaluator_type],
        (err, existing) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (existing) {
                // Update existing evaluation
                db.run(`
                    UPDATE evaluations SET 
                        technical_knowledge = ?,
                        system_design = ?,
                        problem_solving = ?,
                        code_quality = ?,
                        collaboration = ?,
                        technical_leadership = ?,
                        impact_scope = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                `, [
                    technical_knowledge,
                    system_design,
                    problem_solving,
                    code_quality,
                    collaboration,
                    technical_leadership,
                    impact_scope,
                    existing.id
                ], function(err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({ id: existing.id, message: 'Evaluation updated successfully' });
                });
            } else {
                // Create new evaluation
                db.run(`
                    INSERT INTO evaluations (
                        user_id, evaluator_type, technical_knowledge, system_design,
                        problem_solving, code_quality, collaboration, technical_leadership,
                        impact_scope
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    user_id, evaluator_type, technical_knowledge, system_design,
                    problem_solving, code_quality, collaboration, technical_leadership,
                    impact_scope
                ], function(err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.status(201).json({ id: this.lastID, message: 'Evaluation created successfully' });
                });
            }
        }
    );
});

// Get latest evaluations for a user (both self and leader)
router.get('/:userSlug/latest', (req, res) => {
    const db = getDatabase();
    const { userSlug } = req.params;

    // First get the user ID from the slug
    db.get('SELECT id FROM users WHERE slug = ?', [userSlug], (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = user.id;
        const query = `
            SELECT e.*, u.name, u.slug, u.role
            FROM evaluations e
            JOIN users u ON e.user_id = u.id
            WHERE e.user_id = ?
            AND e.id IN (
                SELECT MAX(id) 
                FROM evaluations 
                WHERE user_id = ? 
                GROUP BY evaluator_type
            )
            ORDER BY e.evaluator_type
        `;

        db.all(query, [userId, userId], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            const result = {
                self: rows.find(r => r.evaluator_type === 'self') || null,
                leader: rows.find(r => r.evaluator_type === 'leader') || null
            };
            
            res.json(result);
        });
    });
});

// Get evaluation history for a user
router.get('/:userSlug/history', (req, res) => {
    const db = getDatabase();
    const { userSlug } = req.params;

    // First get the user ID from the slug
    db.get('SELECT id FROM users WHERE slug = ?', [userSlug], (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = user.id;
        db.all(`
            SELECT e.*, u.name, u.slug, u.role
            FROM evaluations e
            JOIN users u ON e.user_id = u.id
            WHERE e.user_id = ?
            ORDER BY e.created_at DESC
        `, [userId], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
    });
});

// Update existing evaluation
router.put('/:id', checkLeaderAuth, (req, res) => {
    const db = getDatabase();
    const { id } = req.params;
    const {
        technical_knowledge,
        system_design,
        problem_solving,
        code_quality,
        collaboration,
        technical_leadership,
        impact_scope
    } = req.body;

    db.run(`
        UPDATE evaluations SET 
            technical_knowledge = ?,
            system_design = ?,
            problem_solving = ?,
            code_quality = ?,
            collaboration = ?,
            technical_leadership = ?,
            impact_scope = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `, [
        technical_knowledge,
        system_design,
        problem_solving,
        code_quality,
        collaboration,
        technical_leadership,
        impact_scope,
        id
    ], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Evaluation not found' });
        }
        res.json({ message: 'Evaluation updated successfully' });
    });
});

module.exports = router; 