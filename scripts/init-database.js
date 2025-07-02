const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'career-evaluation.db');
const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Create database and run schema
const db = new sqlite3.Database(dbPath);

console.log('🗄️  Initializing database...');

// Check and create/migrate schema
db.serialize(() => {
    // Check if users table exists and if it has OAuth columns
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
        if (err) {
            console.error('Error checking table existence:', err.message);
            return;
        }

        if (!row) {
            // Table doesn't exist, create from schema
            console.log('📋 Creating database tables...');
            const schema = fs.readFileSync(schemaPath, 'utf8');
            const statements = schema.split(';').filter(stmt => stmt.trim());
            
            statements.forEach(statement => {
                if (statement.trim()) {
                    db.run(statement, (err) => {
                        if (err) {
                            console.error('Error executing statement:', statement);
                            console.error(err.message);
                        }
                    });
                }
            });
        } else {
            // Check if we need to migrate to OAuth schema
            db.all("PRAGMA table_info(users)", (err, columns) => {
                if (err) {
                    console.error('Error checking table schema:', err.message);
                    return;
                }

                const hasGoogleId = columns.some(col => col.name === 'google_id');
                
                if (!hasGoogleId) {
                    console.log('🔄 Migrating database schema for Google OAuth...');
                    
                    // Add OAuth columns
                    db.run("ALTER TABLE users ADD COLUMN google_id TEXT", (err) => {
                        if (err && !err.message.includes('duplicate column')) {
                            console.error('Error adding google_id column:', err.message);
                        }
                    });
                    
                    db.run("ALTER TABLE users ADD COLUMN avatar_url TEXT", (err) => {
                        if (err && !err.message.includes('duplicate column')) {
                            console.error('Error adding avatar_url column:', err.message);
                        }
                    });
                    
                    db.run("ALTER TABLE users ADD COLUMN auth_provider TEXT DEFAULT 'local'", (err) => {
                        if (err && !err.message.includes('duplicate column')) {
                            console.error('Error adding auth_provider column:', err.message);
                        }
                    });
                    
                                         console.log('✅ Schema migration completed');
                } else {
                    console.log('✅ Database schema is up to date');
                }
                
                // Start seeding after schema check/migration
                setTimeout(seedUsers, 100);
            });
        }
    });

    // Seed users with expectations
    const seedUsers = async () => {
        console.log('👥 Seeding users...');
        
        // Create default manager
        const managerPassword = await bcrypt.hash('manager123', 10);
        db.run(`
            INSERT INTO users (name, slug, email, password_hash, role, position) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, ['System Manager', 'system-manager', 'manager@company.com', managerPassword, 'manager', 'Engineering Manager']);

        // Create team members
        const teamMembers = [
            {
                name: "Fede Miranda",
                slug: "fede-miranda",
                email: "fede.miranda@company.com",
                position: "Semi-Senior Engineer"
            },
            {
                name: "Jose Biskis",
                slug: "jose-biskis",
                email: "jose.biskis@company.com",
                position: "Senior Engineer"
            },
            {
                name: "Santi Musso",
                slug: "santi-musso",
                email: "santi.musso@company.com",
                position: "Junior Engineer"
            },
            {
                name: "Alton Bell",
                slug: "alton-bell",
                email: "alton.bell@company.com",
                position: "Tech Lead"
            },
            {
                name: "Javi Mermet",
                slug: "javi-mermet",
                email: "javi.mermet@company.com",
                position: "Senior Engineer"
            },
            {
                name: "Leo Paini",
                slug: "leo-paini",
                email: "leo.paini@company.com",
                position: "Senior Engineer"
            },
            {
                name: "Fede Cano",
                slug: "fede-cano",
                email: "fede.cano@company.com",
                position: "Tech Lead"
            }
        ];

        const defaultPassword = await bcrypt.hash('password123', 10);

        for (const member of teamMembers) {
            db.run(`
                INSERT INTO users (name, slug, email, password_hash, role, position) 
                VALUES (?, ?, ?, ?, ?, ?)
            `, [member.name, member.slug, member.email, defaultPassword, 'team_member', member.position]);
        }

        console.log('📋 Seeding expectations...');
        
        // Seed expectations for each user
        const expectations = {
            "fede-miranda": {
                technical_knowledge: JSON.stringify(["Dominar tecnologías de desarrollo frontend modernas", "Implementar soluciones eficientes y escalables", "Mantener código limpio y bien documentado"]),
                system_design: JSON.stringify(["Diseñar componentes reutilizables y modulares", "Participar en arquitectura de aplicaciones", "Optimizar rendimiento de aplicaciones"]),
                problem_solving: JSON.stringify(["Resolver problemas técnicos de manera independiente", "Investigar y proponer soluciones innovadoras", "Analizar y depurar código complejo"]),
                impact_scope: JSON.stringify(["Contribuir al éxito del equipo de desarrollo", "Influir en decisiones técnicas del proyecto", "Mejorar procesos de desarrollo"]),
                leadership: JSON.stringify(["Mentorear desarrolladores junior", "Liderar iniciativas técnicas pequeñas", "Ser referente en tecnologías frontend"]),
                ownership: JSON.stringify(["Ser responsable de la calidad del código que produce", "Tomar ownership de features completas", "Responsabilizarse por la experiencia de usuario"]),
                quality: JSON.stringify(["Asegurar estándares de calidad en el código", "Implementar testing adecuado", "Mantener documentation actualizada"]),
                honesty: JSON.stringify(["Comunicar limitaciones y necesidades de ayuda", "Dar feedback constructivo al equipo", "Ser transparente en estimaciones y progress"]),
                kindness: JSON.stringify(["Colaborar de manera respetuosa con el equipo", "Ayudar a otros desarrolladores cuando sea necesario", "Mantener un ambiente de trabajo positivo"]),
                results: JSON.stringify(["Completar features asignadas en tiempo y forma", "Reducir bugs en producción", "Contribuir a la mejora continua del equipo"])
            },
            "fede-cano": {
                technical_knowledge: JSON.stringify(["Poder implementar la nueva app", "Hacer la nueva librería", "Dominar el stack tecnológico completo"]),
                system_design: JSON.stringify(["Poder definir la nueva plataforma", "Hacer la arquitectura para que sea escalable", "Diseñar sistemas complejos y robustos"]),
                problem_solving: JSON.stringify(["Poder avanzar sin tener todas las dudas resueltas", "Poder entender la documentación", "Resolver problemas técnicos complejos de manera independiente"]),
                impact_scope: JSON.stringify(["Entender como le cambia la vida a los admins y al negocio esta nueva app", "Impactar positivamente en múltiples áreas del negocio", "Definir la dirección técnica del producto"]),
                leadership: JSON.stringify(["Ser referente de front", "Liderar técnicamente al equipo de desarrollo", "Mentorear y desarrollar talento técnico"]),
                ownership: JSON.stringify(["Ser el principal responsable del look and feel de los productos de atlas", "Ownership de la experiencia de usuario completa", "Responsabilizarse por la calidad técnica del producto"]),
                quality: JSON.stringify(["Que tengamos un producto de primer nivel y una experiencia de usuarios 7 estrellas", "Establecer y mantener estándares de excelencia", "Asegurar calidad en todos los aspectos del desarrollo"]),
                honesty: JSON.stringify(["Que puedas pedir ayuda, dar feedback y exigir calidad al equipo con transparencia, buena onda y claridad", "Comunicar riesgos y limitaciones de manera directa", "Ser transparente en todas las decisiones técnicas"]),
                kindness: JSON.stringify(["Que hables y te dirijas a los demás de buena manera en buenos y malos momentos", "Liderar con empatía y respeto", "Crear un ambiente de trabajo positivo y colaborativo"]),
                results: JSON.stringify(["Tener un CSAT del producto de 5 para fin de año", "Entregar la nueva plataforma exitosamente", "Desarrollar un equipo técnico de alto rendimiento"])
            }
            // Add more expectations as needed
        };

        // Insert expectations
        db.all("SELECT id, slug FROM users WHERE role = 'team_member'", (err, users) => {
            if (err) {
                console.error('Error fetching users:', err);
                return;
            }

            users.forEach(user => {
                if (expectations[user.slug]) {
                    const exp = expectations[user.slug];
                    db.run(`
                        INSERT INTO user_expectations (
                            user_id, technical_knowledge, system_design, problem_solving, 
                            impact_scope, leadership, ownership, quality, honesty, kindness, results, created_by
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, [
                        user.id, exp.technical_knowledge, exp.system_design, exp.problem_solving,
                        exp.impact_scope, exp.leadership, exp.ownership, exp.quality, 
                        exp.honesty, exp.kindness, exp.results, 1 // Created by manager
                    ]);
                }
            });

            console.log('✅ Database initialization complete!');
            console.log('');
            console.log('🔐 Default credentials:');
            console.log('   Manager: manager@company.com / manager123');
            console.log('   Team Members: [email]@company.com / password123');
            console.log('');
            console.log('📍 Database location:', dbPath);
            
            db.close();
        });
    };

    seedUsers();
}); 