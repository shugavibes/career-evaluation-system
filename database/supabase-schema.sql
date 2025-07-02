-- Career Evaluation System - Supabase Schema
-- Run this in your Supabase SQL editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'team_member',
    position VARCHAR(255),
    google_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    evaluator_type VARCHAR(20) NOT NULL CHECK (evaluator_type IN ('self', 'manager')),
    evaluator_id UUID REFERENCES users(id),
    technical_knowledge INTEGER CHECK (technical_knowledge >= 1 AND technical_knowledge <= 5),
    system_design INTEGER CHECK (system_design >= 1 AND system_design <= 5),
    problem_solving INTEGER CHECK (problem_solving >= 1 AND problem_solving <= 5),
    code_quality INTEGER CHECK (code_quality >= 1 AND code_quality <= 5),
    collaboration INTEGER CHECK (collaboration >= 1 AND collaboration <= 5),
    technical_leadership INTEGER CHECK (technical_leadership >= 1 AND technical_leadership <= 5),
    impact_scope INTEGER CHECK (impact_scope >= 1 AND impact_scope <= 5),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_expectations table
CREATE TABLE IF NOT EXISTS user_expectations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    expectations JSONB NOT NULL,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create sessions table (for local auth compatibility)
CREATE TABLE IF NOT EXISTS sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_slug ON users(slug);
CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_created_at ON evaluations(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Insert initial data

-- Insert system manager
INSERT INTO users (name, slug, email, password_hash, role, position) 
VALUES (
    'System Manager',
    'system-manager',
    'manager@company.com',
    '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', -- password: admin123
    'manager',
    'System Manager'
) ON CONFLICT (email) DO NOTHING;

-- Insert team members
INSERT INTO users (name, slug, email, password_hash, role, position) VALUES 
(
    'Fede Miranda',
    'fede-miranda',
    'fede.miranda@company.com',
    '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', -- password: password123
    'team_member',
    'Semi-Senior Engineer'
),
(
    'Jose Biskis',
    'jose-biskis',
    'jose.biskis@company.com',
    '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
    'team_member',
    'Senior Engineer'
),
(
    'Santi Musso',
    'santi-musso',
    'santi.musso@company.com',
    '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
    'team_member',
    'Junior Engineer'
),
(
    'Alton Bell',
    'alton-bell',
    'alton.bell@company.com',
    '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
    'team_member',
    'Tech Lead'
),
(
    'Javi Mermet',
    'javi-mermet',
    'javi.mermet@company.com',
    '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
    'team_member',
    'Senior Engineer'
),
(
    'Leo Paini',
    'leo-paini',
    'leo.paini@company.com',
    '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
    'team_member',
    'Senior Engineer'
),
(
    'Fede Cano',
    'fede-cano',
    'fede.cano@company.com',
    '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
    'team_member',
    'Tech Lead'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample expectations for Fede Miranda and Jose Biskis
INSERT INTO user_expectations (user_id, expectations, updated_by) 
SELECT 
    u.id,
    '{
        "actions": {
            "technical_knowledge": [
                "Dominar tecnologías de desarrollo frontend modernas",
                "Implementar soluciones eficientes y escalables",
                "Mantener código limpio y bien documentado"
            ],
            "system_design": [
                "Diseñar componentes reutilizables y modulares",
                "Participar en arquitectura de aplicaciones",
                "Optimizar rendimiento de aplicaciones"
            ],
            "problem_solving": [
                "Resolver problemas técnicos de manera independiente",
                "Investigar y proponer soluciones innovadoras",
                "Analizar y depurar código complejo"
            ],
            "impact_scope": [
                "Contribuir al éxito del equipo de desarrollo",
                "Influir en decisiones técnicas del proyecto",
                "Mejorar procesos de desarrollo"
            ]
        },
        "leadership": [
            "Mentorear desarrolladores junior",
            "Liderar iniciativas técnicas pequeñas",
            "Ser referente en tecnologías frontend"
        ],
        "competencies": {
            "ownership": [
                "Ser responsable de la calidad del código que produce",
                "Tomar ownership de features completas",
                "Responsabilizarse por la experiencia de usuario"
            ],
            "quality": [
                "Asegurar estándares de calidad en el código",
                "Implementar testing adecuado",
                "Mantener documentation actualizada"
            ],
            "honesty": [
                "Comunicar limitaciones y necesidades de ayuda",
                "Dar feedback constructivo al equipo",
                "Ser transparente en estimaciones y progress"
            ],
            "kindness": [
                "Colaborar de manera respetuosa con el equipo",
                "Ayudar a otros desarrolladores cuando sea necesario",
                "Mantener un ambiente de trabajo positivo"
            ]
        },
        "results": [
            "Completar features asignadas en tiempo y forma",
            "Reducir bugs en producción",
            "Contribuir a la mejora continua del equipo"
        ]
    }'::jsonb,
    (SELECT id FROM users WHERE role = 'manager' LIMIT 1)
FROM users u 
WHERE u.slug = 'fede-miranda'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO user_expectations (user_id, expectations, updated_by) 
SELECT 
    u.id,
    '{
        "actions": {
            "technical_knowledge": [
                "Dominar múltiples tecnologías y frameworks",
                "Mantenerse actualizado con las últimas tendencias",
                "Ser experto en arquitectura de software"
            ],
            "system_design": [
                "Diseñar sistemas escalables y robustos",
                "Definir arquitectura de aplicaciones complejas",
                "Establecer patrones de desarrollo"
            ],
            "problem_solving": [
                "Resolver problemas complejos de manera eficiente",
                "Anticipar y prevenir problemas potenciales",
                "Optimizar rendimiento y escalabilidad"
            ],
            "impact_scope": [
                "Impactar positivamente en múltiples proyectos",
                "Influir en decisiones técnicas estratégicas",
                "Mejorar procesos y herramientas del equipo"
            ]
        },
        "leadership": [
            "Liderar proyectos técnicos importantes",
            "Mentorear desarrolladores semi-senior y junior",
            "Ser referente técnico en el equipo"
        ],
        "competencies": {
            "ownership": [
                "Ser responsable de la arquitectura de sistemas críticos",
                "Liderar iniciativas de mejora técnica",
                "Ownership de la calidad técnica del equipo"
            ],
            "quality": [
                "Establecer estándares de calidad de código",
                "Implementar mejores prácticas de desarrollo",
                "Asegurar robustez y mantenibilidad"
            ],
            "honesty": [
                "Comunicar riesgos técnicos y dependencias",
                "Dar feedback honesto sobre estimaciones",
                "Ser transparente sobre limitaciones técnicas"
            ],
            "kindness": [
                "Mentorear con paciencia y empatía",
                "Crear un ambiente de aprendizaje positivo",
                "Apoyar el crecimiento del equipo"
            ]
        },
        "results": [
            "Entregar proyectos complejos exitosamente",
            "Reducir deuda técnica del sistema",
            "Mejorar la productividad del equipo"
        ]
    }'::jsonb,
    (SELECT id FROM users WHERE role = 'manager' LIMIT 1)
FROM users u 
WHERE u.slug = 'jose-biskis'
ON CONFLICT (user_id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_expectations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust based on your authentication needs)
-- For now, allow all operations (you can restrict later)
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on evaluations" ON evaluations FOR ALL USING (true);  
CREATE POLICY "Allow all operations on user_expectations" ON user_expectations FOR ALL USING (true);
CREATE POLICY "Allow all operations on sessions" ON sessions FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_expectations_updated_at BEFORE UPDATE ON user_expectations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 