const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'career-evaluation.db');

class Database {
    constructor() {
        this.db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error('Error connecting to database:', err.message);
                process.exit(1);
            }
            console.log('📊 Connected to SQLite database');
        });
    }

    // Promisify database operations
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.db.close(err => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    // User methods
    async getUserByEmail(email) {
        return this.get('SELECT * FROM users WHERE email = ?', [email]);
    }

    async getUserBySlug(slug) {
        const user = await this.get('SELECT * FROM users WHERE slug = ?', [slug]);
        if (user) {
            // Get expectations
            const expectations = await this.getUserExpectations(user.id);
            user.expectations = expectations;
        }
        return user;
    }

    async getAllUsers() {
        const users = await this.all('SELECT * FROM users ORDER BY position, name');
        
        // Add expectations to each user
        for (const user of users) {
            user.expectations = await this.getUserExpectations(user.id);
        }
        
        return users;
    }

    async getUserExpectations(userId) {
        const expectations = await this.get(
            'SELECT * FROM user_expectations WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1',
            [userId]
        );

        if (!expectations) return null;

        // Parse JSON fields
        return {
            actions: {
                technical_knowledge: JSON.parse(expectations.technical_knowledge || '[]'),
                system_design: JSON.parse(expectations.system_design || '[]'),
                problem_solving: JSON.parse(expectations.problem_solving || '[]'),
                impact_scope: JSON.parse(expectations.impact_scope || '[]'),
            },
            leadership: JSON.parse(expectations.leadership || '[]'),
            competencies: {
                ownership: JSON.parse(expectations.ownership || '[]'),
                quality: JSON.parse(expectations.quality || '[]'),
                honesty: JSON.parse(expectations.honesty || '[]'),
                kindness: JSON.parse(expectations.kindness || '[]'),
            },
            results: JSON.parse(expectations.results || '[]')
        };
    }

    async updateUserExpectations(userId, expectations, createdBy) {
        const expectationsData = {
            technical_knowledge: JSON.stringify(expectations.actions.technical_knowledge),
            system_design: JSON.stringify(expectations.actions.system_design),
            problem_solving: JSON.stringify(expectations.actions.problem_solving),
            impact_scope: JSON.stringify(expectations.actions.impact_scope),
            leadership: JSON.stringify(expectations.leadership),
            ownership: JSON.stringify(expectations.competencies.ownership),
            quality: JSON.stringify(expectations.competencies.quality),
            honesty: JSON.stringify(expectations.competencies.honesty),
            kindness: JSON.stringify(expectations.competencies.kindness),
            results: JSON.stringify(expectations.results)
        };

        // Check if expectations exist
        const existing = await this.get('SELECT id FROM user_expectations WHERE user_id = ?', [userId]);
        
        if (existing) {
            // Update existing
            return this.run(`
                UPDATE user_expectations SET 
                    technical_knowledge = ?, system_design = ?, problem_solving = ?,
                    impact_scope = ?, leadership = ?, ownership = ?, quality = ?,
                    honesty = ?, kindness = ?, results = ?, created_by = ?
                WHERE user_id = ?
            `, [
                expectationsData.technical_knowledge, expectationsData.system_design,
                expectationsData.problem_solving, expectationsData.impact_scope,
                expectationsData.leadership, expectationsData.ownership,
                expectationsData.quality, expectationsData.honesty,
                expectationsData.kindness, expectationsData.results,
                createdBy, userId
            ]);
        } else {
            // Insert new
            return this.run(`
                INSERT INTO user_expectations (
                    user_id, technical_knowledge, system_design, problem_solving,
                    impact_scope, leadership, ownership, quality, honesty, kindness, results, created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                userId, expectationsData.technical_knowledge, expectationsData.system_design,
                expectationsData.problem_solving, expectationsData.impact_scope,
                expectationsData.leadership, expectationsData.ownership,
                expectationsData.quality, expectationsData.honesty,
                expectationsData.kindness, expectationsData.results, createdBy
            ]);
        }
    }

    // Evaluation methods
    async getLatestEvaluations(userId) {
        const self = await this.get(`
            SELECT * FROM evaluations 
            WHERE user_id = ? AND evaluator_type = 'self' 
            ORDER BY created_at DESC LIMIT 1
        `, [userId]);

        const manager = await this.get(`
            SELECT * FROM evaluations 
            WHERE user_id = ? AND evaluator_type = 'manager' 
            ORDER BY created_at DESC LIMIT 1
        `, [userId]);

        return { self, manager };
    }

    async saveEvaluation(evaluation) {
        return this.run(`
            INSERT INTO evaluations (
                user_id, evaluator_type, evaluator_id, technical_knowledge, system_design,
                problem_solving, code_quality, collaboration, technical_leadership, impact_scope, comments
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            evaluation.user_id, evaluation.evaluator_type, evaluation.evaluator_id,
            evaluation.technical_knowledge, evaluation.system_design, evaluation.problem_solving,
            evaluation.code_quality, evaluation.collaboration, evaluation.technical_leadership,
            evaluation.impact_scope, evaluation.comments
        ]);
    }

    // Session methods
    async createSession(userId, token, expiresAt) {
        return this.run(
            'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)',
            [userId, token, expiresAt]
        );
    }

    async getSession(token) {
        return this.get(
            'SELECT s.*, u.* FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ? AND s.expires_at > datetime("now")',
            [token]
        );
    }

    async deleteSession(token) {
        return this.run('DELETE FROM sessions WHERE token = ?', [token]);
    }

    async cleanExpiredSessions() {
        return this.run('DELETE FROM sessions WHERE expires_at <= datetime("now")');
    }
}

module.exports = new Database(); 