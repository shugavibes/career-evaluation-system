-- Users table for team members
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Evaluations table
CREATE TABLE evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    evaluator_type TEXT NOT NULL CHECK (evaluator_type IN ('self', 'leader')),
    technical_knowledge INTEGER CHECK (technical_knowledge BETWEEN 0 AND 5),
    system_design INTEGER CHECK (system_design BETWEEN 0 AND 5),
    problem_solving INTEGER CHECK (problem_solving BETWEEN 0 AND 5),
    code_quality INTEGER CHECK (code_quality BETWEEN 0 AND 5),
    collaboration INTEGER CHECK (collaboration BETWEEN 0 AND 5),
    technical_leadership INTEGER CHECK (technical_leadership BETWEEN 0 AND 5),
    impact_scope INTEGER CHECK (impact_scope BETWEEN 0 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert initial users
INSERT INTO users (name, slug, role) VALUES
    ('Fede Cano', 'fede-cano', 'Tech Lead'),
    ('Alton Bell', 'alton-bell', 'Tech Lead'),
    ('Fede Miranda', 'fede-miranda', 'Semi-Senior Engineer'),
    ('Jose Biskis', 'jose-biskis', 'Senior Engineer'),
    ('Leo Paini', 'leo-paini', 'Senior Engineer'),
    ('Santi Musso', 'santi-musso', 'Junior Engineer'),
    ('Javi Mermet', 'javi-mermet', 'Senior Engineer'); 