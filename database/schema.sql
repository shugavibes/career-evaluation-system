-- Users table with role-based access
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT, -- Nullable for Google OAuth users
    google_id TEXT UNIQUE, -- Google OAuth ID
    avatar_url TEXT, -- Profile picture from Google
    auth_provider TEXT DEFAULT 'local' CHECK (auth_provider IN ('local', 'google')),
    role TEXT NOT NULL CHECK (role IN ('team_member', 'manager')),
    position TEXT NOT NULL, -- Tech Lead, Senior Engineer, etc.
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User expectations table
CREATE TABLE user_expectations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    technical_knowledge TEXT, -- JSON array
    system_design TEXT,       -- JSON array
    problem_solving TEXT,     -- JSON array
    impact_scope TEXT,        -- JSON array
    leadership TEXT,          -- JSON array
    ownership TEXT,           -- JSON array
    quality TEXT,             -- JSON array
    honesty TEXT,             -- JSON array
    kindness TEXT,            -- JSON array
    results TEXT,             -- JSON array
    created_by INTEGER,       -- Manager who created/updated
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users (id)
);

-- Evaluations table (enhanced)
CREATE TABLE evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    evaluator_type TEXT NOT NULL CHECK (evaluator_type IN ('self', 'manager')),
    evaluator_id INTEGER, -- Who performed the evaluation
    technical_knowledge INTEGER CHECK (technical_knowledge BETWEEN 0 AND 5),
    system_design INTEGER CHECK (system_design BETWEEN 0 AND 5),
    problem_solving INTEGER CHECK (problem_solving BETWEEN 0 AND 5),
    code_quality INTEGER CHECK (code_quality BETWEEN 0 AND 5),
    collaboration INTEGER CHECK (collaboration BETWEEN 0 AND 5),
    technical_leadership INTEGER CHECK (technical_leadership BETWEEN 0 AND 5),
    impact_scope INTEGER CHECK (impact_scope BETWEEN 0 AND 5),
    comments TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (evaluator_id) REFERENCES users (id)
);

-- Sessions table for authentication
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_users_slug ON users(slug);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_evaluations_user_id ON evaluations(user_id);
CREATE INDEX idx_evaluations_evaluator_type ON evaluations(evaluator_type);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- Triggers for updated_at
CREATE TRIGGER update_users_timestamp 
    AFTER UPDATE ON users
    FOR EACH ROW
    BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER update_expectations_timestamp 
    AFTER UPDATE ON user_expectations
    FOR EACH ROW
    BEGIN
        UPDATE user_expectations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER update_evaluations_timestamp 
    AFTER UPDATE ON evaluations
    FOR EACH ROW
    BEGIN
        UPDATE evaluations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END; 