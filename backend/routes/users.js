const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database/init');

// Get all users
router.get('/', (req, res) => {
    const db = getDatabase();
    
    db.all('SELECT * FROM users ORDER BY name', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Get user by slug
router.get('/:slug', (req, res) => {
    const db = getDatabase();
    const { slug } = req.params;
    
    db.get('SELECT * FROM users WHERE slug = ?', [slug], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(row);
    });
});

module.exports = router; 