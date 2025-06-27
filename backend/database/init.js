const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'evaluation.db');

function initializeDatabase() {
    const db = new sqlite3.Database(dbPath);
    
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    db.exec(schema, (err) => {
        if (err) {
            console.error('Error initializing database:', err);
        } else {
            console.log('Database initialized successfully');
        }
    });
    
    return db;
}

function getDatabase() {
    const dbExists = fs.existsSync(dbPath);
    
    if (!dbExists) {
        return initializeDatabase();
    }
    
    return new sqlite3.Database(dbPath);
}

module.exports = { getDatabase, initializeDatabase }; 