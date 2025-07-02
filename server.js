const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database for demo purposes
const users = [
    {
        id: 1,
        name: "Fede Miranda",
        slug: "fede-miranda",
        role: "Semi-Senior Engineer",
        created_at: "2024-01-15T10:00:00Z",
        expectations: {
            actions: {
                technical_knowledge: [
                    "Dominar tecnologías de desarrollo frontend modernas",
                    "Implementar soluciones eficientes y escalables",
                    "Mantener código limpio y bien documentado"
                ],
                system_design: [
                    "Diseñar componentes reutilizables y modulares",
                    "Participar en arquitectura de aplicaciones",
                    "Optimizar rendimiento de aplicaciones"
                ],
                problem_solving: [
                    "Resolver problemas técnicos de manera independiente",
                    "Investigar y proponer soluciones innovadoras",
                    "Analizar y depurar código complejo"
                ],
                impact_scope: [
                    "Contribuir al éxito del equipo de desarrollo",
                    "Influir en decisiones técnicas del proyecto",
                    "Mejorar procesos de desarrollo"
                ]
            },
            leadership: [
                "Mentorear desarrolladores junior",
                "Liderar iniciativas técnicas pequeñas",
                "Ser referente en tecnologías frontend"
            ],
            competencies: {
                ownership: [
                    "Ser responsable de la calidad del código que produce",
                    "Tomar ownership de features completas",
                    "Responsabilizarse por la experiencia de usuario"
                ],
                quality: [
                    "Asegurar estándares de calidad en el código",
                    "Implementar testing adecuado",
                    "Mantener documentation actualizada"
                ],
                honesty: [
                    "Comunicar limitaciones y necesidades de ayuda",
                    "Dar feedback constructivo al equipo",
                    "Ser transparente en estimaciones y progress"
                ],
                kindness: [
                    "Colaborar de manera respetuosa con el equipo",
                    "Ayudar a otros desarrolladores cuando sea necesario",
                    "Mantener un ambiente de trabajo positivo"
                ]
            },
            results: [
                "Completar features asignadas en tiempo y forma",
                "Reducir bugs en producción",
                "Contribuir a la mejora continua del equipo"
            ]
        }
    },
    {
        id: 2,
        name: "Jose Biskis",
        slug: "jose-biskis", 
        role: "Senior Engineer",
        created_at: "2024-01-15T10:00:00Z",
        expectations: {
            actions: {
                technical_knowledge: [
                    "Dominar múltiples tecnologías y frameworks",
                    "Mantenerse actualizado con las últimas tendencias",
                    "Ser experto en arquitectura de software"
                ],
                system_design: [
                    "Diseñar sistemas escalables y robustos",
                    "Definir arquitectura de aplicaciones complejas",
                    "Establecer patrones de desarrollo"
                ],
                problem_solving: [
                    "Resolver problemas complejos de manera eficiente",
                    "Anticipar y prevenir problemas potenciales",
                    "Optimizar rendimiento y escalabilidad"
                ],
                impact_scope: [
                    "Impactar positivamente en múltiples proyectos",
                    "Influir en decisiones técnicas estratégicas",
                    "Mejorar procesos y herramientas del equipo"
                ]
            },
            leadership: [
                "Liderar proyectos técnicos importantes",
                "Mentorear desarrolladores semi-senior y junior",
                "Ser referente técnico en el equipo"
            ],
            competencies: {
                ownership: [
                    "Ser responsable de la arquitectura de sistemas críticos",
                    "Liderar iniciativas de mejora técnica",
                    "Ownership de la calidad técnica del equipo"
                ],
                quality: [
                    "Establecer estándares de calidad de código",
                    "Implementar mejores prácticas de desarrollo",
                    "Asegurar robustez y mantenibilidad"
                ],
                honesty: [
                    "Comunicar riesgos técnicos y dependencias",
                    "Dar feedback honesto sobre estimaciones",
                    "Ser transparente sobre limitaciones técnicas"
                ],
                kindness: [
                    "Mentorear con paciencia y empatía",
                    "Crear un ambiente de aprendizaje positivo",
                    "Apoyar el crecimiento del equipo"
                ]
            },
            results: [
                "Entregar proyectos complejos exitosamente",
                "Reducir deuda técnica del sistema",
                "Mejorar la productividad del equipo"
            ]
        }
    },
    {
        id: 3,
        name: "Santi Musso",
        slug: "santi-musso",
        role: "Junior Engineer", 
        created_at: "2024-01-15T10:00:00Z",
        expectations: {
            actions: {
                technical_knowledge: [
                    "Aprender tecnologías fundamentales de desarrollo",
                    "Implementar features básicas con supervisión",
                    "Desarrollar habilidades de debugging"
                ],
                system_design: [
                    "Entender arquitectura básica de aplicaciones",
                    "Implementar componentes simples",
                    "Seguir patrones establecidos"
                ],
                problem_solving: [
                    "Resolver problemas básicos de manera independiente",
                    "Saber cuándo pedir ayuda",
                    "Investigar y aprender de errores"
                ],
                impact_scope: [
                    "Contribuir positivamente al equipo",
                    "Completar tareas asignadas",
                    "Participar activamente en ceremonias"
                ]
            },
            leadership: [
                "Desarrollar habilidades de comunicación",
                "Participar en discusiones técnicas",
                "Mostrar iniciativa en el aprendizaje"
            ],
            competencies: {
                ownership: [
                    "Ser responsable de las tareas asignadas",
                    "Tomar ownership del propio aprendizaje",
                    "Buscar feedback proactivamente"
                ],
                quality: [
                    "Seguir estándares de código establecidos",
                    "Aprender y aplicar mejores prácticas",
                    "Asegurar que el código funcione correctamente"
                ],
                honesty: [
                    "Comunicar cuando no entiende algo",
                    "Pedir ayuda cuando es necesario",
                    "Ser honesto sobre el progreso"
                ],
                kindness: [
                    "Ser receptivo al feedback",
                    "Colaborar positivamente con el equipo",
                    "Mostrar respeto por las ideas de otros"
                ]
            },
            results: [
                "Completar tareas básicas de desarrollo",
                "Demostrar crecimiento técnico constante",
                "Participar activamente en el equipo"
            ]
        }
    },
    {
        id: 4,
        name: "Alton Bell",
        slug: "alton-bell",
        role: "Tech Lead",
        created_at: "2024-01-15T10:00:00Z",
        expectations: {
            actions: {
                technical_knowledge: [
                    "Ser experto en múltiples tecnologías y dominios",
                    "Mantenerse al día con innovaciones tecnológicas",
                    "Definir stack tecnológico del equipo"
                ],
                system_design: [
                    "Diseñar arquitecturas complejas y escalables",
                    "Definir estándares y patrones de desarrollo",
                    "Planificar evolución técnica del producto"
                ],
                problem_solving: [
                    "Resolver problemas técnicos complejos",
                    "Anticipar y mitigar riesgos técnicos",
                    "Optimizar rendimiento y escalabilidad"
                ],
                impact_scope: [
                    "Impactar en la estrategia técnica de la empresa",
                    "Influir en múltiples equipos y proyectos",
                    "Definir roadmap técnico"
                ]
            },
            leadership: [
                "Liderar técnicamente al equipo de desarrollo",
                "Mentorear a todos los niveles del equipo",
                "Ser el referente técnico de la organización"
            ],
            competencies: {
                ownership: [
                    "Ser responsable de la visión técnica del producto",
                    "Ownership de la calidad y arquitectura general",
                    "Liderar iniciativas estratégicas"
                ],
                quality: [
                    "Establecer y mantener estándares de excelencia",
                    "Asegurar calidad técnica en todos los proyectos",
                    "Promover cultura de calidad en el equipo"
                ],
                honesty: [
                    "Comunicar riesgos y limitaciones técnicas",
                    "Dar feedback directo y constructivo",
                    "Ser transparente en decisiones técnicas"
                ],
                kindness: [
                    "Liderar con empatía y respeto",
                    "Crear ambiente de crecimiento para el equipo",
                    "Apoyar el desarrollo profesional de cada miembro"
                ]
            },
            results: [
                "Entregar productos técnicamente excelentes",
                "Desarrollar un equipo técnico sólido",
                "Lograr objetivos estratégicos del producto"
            ]
        }
    },
    {
        id: 5,
        name: "Javi Mermet",  
        slug: "javi-mermet",
        role: "Senior Engineer",
        created_at: "2024-01-15T10:00:00Z",
        expectations: {
            actions: {
                technical_knowledge: [
                    "Dominar tecnologías backend y base de datos",
                    "Implementar APIs robustas y escalables",
                    "Ser experto en optimización de performance"
                ],
                system_design: [
                    "Diseñar microservicios y arquitecturas distribuidas",
                    "Definir estrategias de datos y persistencia",
                    "Crear sistemas fault-tolerant"
                ],
                problem_solving: [
                    "Resolver problemas de escalabilidad y performance",
                    "Optimizar queries y procesos batch",
                    "Debuggear issues en producción"
                ],
                impact_scope: [
                    "Mejorar la infraestructura y arquitectura backend",
                    "Influir en decisiones de arquitectura de datos",
                    "Optimizar costos de infraestructura"
                ]
            },
            leadership: [
                "Liderar iniciativas de arquitectura backend",
                "Mentorear desarrolladores en tecnologías backend",
                "Ser referente en escalabilidad y performance"
            ],
            competencies: {
                ownership: [
                    "Ser responsable de la estabilidad del backend",
                    "Ownership de la arquitectura de datos",
                    "Liderar mejoras de performance"
                ],
                quality: [
                    "Asegurar robustez y confiabilidad del sistema",
                    "Implementar monitoring y alertas efectivas",
                    "Mantener high availability"
                ],
                honesty: [
                    "Comunicar limitaciones de capacidad del sistema",
                    "Ser transparente sobre trade-offs técnicos",
                    "Reportar issues de performance proactivamente"
                ],
                kindness: [
                    "Compartir conocimientos backend con el equipo",
                    "Ayudar en troubleshooting de manera paciente",
                    "Colaborar efectivamente con equipos frontend"
                ]
            },
            results: [
                "Mantener 99.9% uptime del sistema",
                "Reducir latencias y mejorar performance",
                "Escalar el sistema para crecimiento del negocio"
            ]
        }
    },
    {
        id: 6,
        name: "Leo Paini",
        slug: "leo-paini", 
        role: "Senior Engineer",
        created_at: "2024-01-15T10:00:00Z",
        expectations: {
            actions: {
                technical_knowledge: [
                    "Dominar DevOps y infraestructura como código",
                    "Implementar CI/CD pipelines robustos",
                    "Ser experto en containerización y orquestación"
                ],
                system_design: [
                    "Diseñar infraestructura escalable y resiliente",
                    "Definir estrategias de deployment y rollback",
                    "Crear arquitecturas cloud-native"
                ],
                problem_solving: [
                    "Resolver problemas de infraestructura y deployment",
                    "Optimizar procesos de CI/CD",
                    "Automatizar tareas operacionales"
                ],
                impact_scope: [
                    "Mejorar la eficiencia del equipo de desarrollo",
                    "Reducir time-to-market de features",
                    "Optimizar costos de infraestructura"
                ]
            },
            leadership: [
                "Liderar iniciativas de DevOps y automatización",
                "Mentorear al equipo en prácticas DevOps",
                "Ser referente en infraestructura y deployment"
            ],
            competencies: {
                ownership: [
                    "Ser responsable de la infraestructura y deployment",
                    "Ownership de la estabilidad del ambiente productivo",
                    "Liderar mejoras en procesos de desarrollo"
                ],
                quality: [
                    "Asegurar deployments confiables y seguros",
                    "Implementar monitoring y observabilidad",
                    "Mantener documentación de infraestructura"
                ],
                honesty: [
                    "Comunicar riesgos de infraestructura",
                    "Ser transparente sobre limitaciones de deployment",
                    "Reportar issues de seguridad proactivamente"
                ],
                kindness: [
                    "Ayudar al equipo con problemas de deployment",
                    "Enseñar mejores prácticas DevOps",
                    "Colaborar en la resolución de incidents"
                ]
            },
            results: [
                "Lograr deployment frequency de múltiples veces por día",
                "Reducir MTTR (Mean Time To Recovery)",
                "Mejorar developer experience y productividad"
            ]
        }
    },
    {
        id: 7,
        name: "Fede Cano",
        slug: "fede-cano",
        role: "Tech Lead", 
        created_at: "2024-01-15T10:00:00Z",
        expectations: {
            actions: {
                technical_knowledge: [
                    "Poder implementar la nueva app",
                    "Hacer la nueva librería",
                    "Dominar el stack tecnológico completo"
                ],
                system_design: [
                    "Poder definir la nueva plataforma",
                    "Hacer la arquitectura para que sea escalable",
                    "Diseñar sistemas complejos y robustos"
                ],
                problem_solving: [
                    "Poder avanzar sin tener todas las dudas resueltas",
                    "Poder entender la documentación",
                    "Resolver problemas técnicos complejos de manera independiente"
                ],
                impact_scope: [
                    "Entender como le cambia la vida a los admins y al negocio esta nueva app",
                    "Impactar positivamente en múltiples áreas del negocio",
                    "Definir la dirección técnica del producto"
                ]
            },
            leadership: [
                "Ser referente de front",
                "Liderar técnicamente al equipo de desarrollo",
                "Mentorear y desarrollar talento técnico"
            ],
            competencies: {
                ownership: [
                    "Ser el principal responsable del look and feel de los productos de atlas",
                    "Ownership de la experiencia de usuario completa",
                    "Responsabilizarse por la calidad técnica del producto"
                ],
                quality: [
                    "Que tengamos un producto de primer nivel y una experiencia de usuarios 7 estrellas",
                    "Establecer y mantener estándares de excelencia",
                    "Asegurar calidad en todos los aspectos del desarrollo"
                ],
                honesty: [
                    "Que puedas pedir ayuda, dar feedback y exigir calidad al equipo con transparencia, buena onda y claridad",
                    "Comunicar riesgos y limitaciones de manera directa",
                    "Ser transparente en todas las decisiones técnicas"
                ],
                kindness: [
                    "Que hables y te dirijas a los demás de buena manera en buenos y malos momentos",
                    "Liderar con empatía y respeto",
                    "Crear un ambiente de trabajo positivo y colaborativo"
                ]
            },
            results: [
                "Tener un CSAT del producto de 5 para fin de año",
                "Entregar la nueva plataforma exitosamente",
                "Desarrollar un equipo técnico de alto rendimiento"
            ]
        }
    }
];

let evaluations = [];

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'Career Evaluation System API is running'
    });
});

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from local development server!' });
});

// Users API
app.get('/api/users', (req, res) => {
    res.json(users);
});

app.get('/api/users/:slug', (req, res) => {
    const { slug } = req.params;
    const user = users.find(u => u.slug === slug);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
});

// Evaluations API
app.get('/api/evaluations', (req, res) => {
    res.json(evaluations);
});

app.get('/api/evaluations/:slug', (req, res) => {
    const { slug } = req.params;
    const userEvaluations = evaluations.filter(e => e.user_slug === slug);
    res.json(userEvaluations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
});

app.get('/api/evaluations/:slug/latest', (req, res) => {
    const { slug } = req.params;
    const userEvaluations = evaluations.filter(e => e.user_slug === slug);
    
    const latestSelf = userEvaluations
        .filter(e => e.evaluator_type === 'self')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
    
    const latestManager = userEvaluations
        .filter(e => e.evaluator_type === 'manager')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

    res.json({
        self: latestSelf || null,
        manager: latestManager || null
    });
});

app.get('/api/evaluations/:slug/history', (req, res) => {
    const { slug } = req.params;
    const userEvaluations = evaluations.filter(e => e.user_slug === slug);
    res.json(userEvaluations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
});

app.post('/api/evaluations/:slug', (req, res) => {
    const { slug } = req.params;
    const evaluation = {
        id: evaluations.length + 1,
        user_slug: slug,
        ...req.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    evaluations.push(evaluation);
    res.status(201).json(evaluation);
});

app.listen(port, () => {
    console.log(`🚀 Local development server running at http://localhost:${port}`);
    console.log(`📊 API available at http://localhost:${port}/api/*`);
});

module.exports = app; 