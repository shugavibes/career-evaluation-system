import { EvaluationCriterion } from '../types/types';

export const evaluationCriteria: EvaluationCriterion[] = [
    {
        id: 'technical_knowledge',
        name: 'Technical Knowledge (Ownership)',
        description: 'Depth and breadth of technical expertise in software development, including programming languages, frameworks, and tools.',
        levels: [
            {
                level: 0,
                title: 'Beginner',
                bullets: [
                    'Limited technical knowledge in one or two areas',
                    'Requires constant guidance on basic concepts',
                    'Struggles with fundamental programming principles'
                ]
            },
            {
                level: 1,
                title: 'Learning',
                bullets: [
                    'Basic understanding of core technologies',
                    'Can work on simple tasks with some guidance',
                    'Familiar with primary programming language and basic tools'
                ]
            },
            {
                level: 2,
                title: 'Developing',
                bullets: [
                    'Solid foundation in main technology stack',
                    'Can work independently on standard tasks',
                    'Beginning to explore advanced concepts and patterns'
                ]
            },
            {
                level: 3,
                title: 'Proficient',
                bullets: [
                    'Strong technical skills across multiple areas',
                    'Can handle complex technical challenges',
                    'Stays current with technology trends and best practices'
                ]
            },
            {
                level: 4,
                title: 'Advanced',
                bullets: [
                    'Expert-level knowledge in multiple domains',
                    'Can architect solutions and make technology decisions',
                    'Contributes to technical strategy and innovation'
                ]
            },
            {
                level: 5,
                title: 'Expert',
                bullets: [
                    'Recognized technical expert across the organization',
                    'Drives technical vision and standards',
                    'Mentors others and influences industry practices'
                ]
            }
        ]
    },
    {
        id: 'system_design',
        name: 'System Design (Quality)',
        description: 'Ability to design scalable, maintainable, and efficient software systems and architectures.',
        levels: [
            {
                level: 0,
                title: 'Beginner',
                bullets: [
                    'Limited understanding of system design principles',
                    'Focuses mainly on individual components',
                    'Requires guidance on basic architectural concepts'
                ]
            },
            {
                level: 1,
                title: 'Learning',
                bullets: [
                    'Understands basic design patterns and principles',
                    'Can contribute to simple system designs',
                    'Learning about scalability and performance considerations'
                ]
            },
            {
                level: 2,
                title: 'Developing',
                bullets: [
                    'Can design simple to medium complexity systems',
                    'Understands trade-offs in architectural decisions',
                    'Applies design patterns appropriately'
                ]
            },
            {
                level: 3,
                title: 'Proficient',
                bullets: [
                    'Designs robust, scalable systems',
                    'Considers performance, security, and maintainability',
                    'Can evaluate and improve existing architectures'
                ]
            },
            {
                level: 4,
                title: 'Advanced',
                bullets: [
                    'Designs complex, distributed systems',
                    'Leads architectural decisions for major projects',
                    'Balances technical and business requirements effectively'
                ]
            },
            {
                level: 5,
                title: 'Expert',
                bullets: [
                    'Architect of enterprise-level systems',
                    'Sets architectural standards and practices',
                    'Influences system design across multiple teams'
                ]
            }
        ]
    },
    {
        id: 'problem_solving',
        name: 'Problem Solving (Honesty)',
        description: 'Analytical thinking, debugging skills, and ability to break down complex problems into manageable solutions.',
        levels: [
            {
                level: 0,
                title: 'Beginner',
                bullets: [
                    'Struggles with complex problems',
                    'Needs significant guidance to debug issues',
                    'Relies heavily on others for problem-solving approach'
                ]
            },
            {
                level: 1,
                title: 'Learning',
                bullets: [
                    'Can solve straightforward problems',
                    'Basic debugging skills with simple issues',
                    'Learning to break down complex problems'
                ]
            },
            {
                level: 2,
                title: 'Developing',
                bullets: [
                    'Handles moderate complexity problems independently',
                    'Good debugging skills for most common issues',
                    'Uses systematic approach to problem-solving'
                ]
            },
            {
                level: 3,
                title: 'Proficient',
                bullets: [
                    'Excellent problem-solving skills across various domains',
                    'Can debug complex, multi-layered issues',
                    'Helps others develop problem-solving approaches'
                ]
            },
            {
                level: 4,
                title: 'Advanced',
                bullets: [
                    'Tackles highly complex, ambiguous problems',
                    'Expert debugging skills across systems',
                    'Develops innovative solutions to challenging problems'
                ]
            },
            {
                level: 5,
                title: 'Expert',
                bullets: [
                    'Solves the most challenging organizational problems',
                    'Creates frameworks and methodologies for problem-solving',
                    'Recognized as go-to person for critical issues'
                ]
            }
        ]
    },
    {
        id: 'code_quality',
        name: 'Code Quality & Testing (Quality)',
        description: 'Writing clean, maintainable code with appropriate testing coverage and documentation.',
        levels: [
            {
                level: 0,
                title: 'Beginner',
                bullets: [
                    'Code often requires significant revision',
                    'Limited understanding of testing principles',
                    'Basic documentation skills'
                ]
            },
            {
                level: 1,
                title: 'Learning',
                bullets: [
                    'Code generally follows basic standards',
                    'Writes simple unit tests with guidance',
                    'Documents basic functionality'
                ]
            },
            {
                level: 2,
                title: 'Developing',
                bullets: [
                    'Writes clean, readable code consistently',
                    'Good understanding of testing practices',
                    'Creates helpful documentation and comments'
                ]
            },
            {
                level: 3,
                title: 'Proficient',
                bullets: [
                    'Produces high-quality, maintainable code',
                    'Implements comprehensive testing strategies',
                    'Creates excellent documentation and guides'
                ]
            },
            {
                level: 4,
                title: 'Advanced',
                bullets: [
                    'Sets coding standards and best practices',
                    'Implements advanced testing strategies',
                    'Creates frameworks for code quality improvement'
                ]
            },
            {
                level: 5,
                title: 'Expert',
                bullets: [
                    'Defines organizational standards for code quality',
                    'Innovates in testing and quality assurance',
                    'Influences industry best practices'
                ]
            }
        ]
    },
    {
        id: 'collaboration',
        name: 'Collaboration & Communication (People)',
        description: 'Working effectively with team members, stakeholders, and cross-functional teams.',
        levels: [
            {
                level: 0,
                title: 'Beginner',
                bullets: [
                    'Struggles with team communication',
                    'Difficulty working in collaborative environments',
                    'Limited participation in team discussions'
                ]
            },
            {
                level: 1,
                title: 'Learning',
                bullets: [
                    'Participates in team activities',
                    'Communicates basic needs and progress',
                    'Beginning to contribute to team discussions'
                ]
            },
            {
                level: 2,
                title: 'Developing',
                bullets: [
                    'Good team player with effective communication',
                    'Collaborates well on most projects',
                    'Provides helpful feedback to teammates'
                ]
            },
            {
                level: 3,
                title: 'Proficient',
                bullets: [
                    'Excellent collaborator and communicator',
                    'Facilitates effective team discussions',
                    'Builds strong relationships across teams'
                ]
            },
            {
                level: 4,
                title: 'Advanced',
                bullets: [
                    'Leads cross-functional collaboration',
                    'Excellent communication with all stakeholders',
                    'Mentors others in collaboration skills'
                ]
            },
            {
                level: 5,
                title: 'Expert',
                bullets: [
                    'Sets standards for organizational collaboration',
                    'Influences company culture and communication',
                    'Recognized leader in building effective teams'
                ]
            }
        ]
    },
    {
        id: 'technical_leadership',
        name: 'Technical Leadership',
        description: 'Ability to guide technical decisions, mentor others, and drive technical initiatives.',
        levels: [
            {
                level: 0,
                title: 'Beginner',
                bullets: [
                    'Focuses primarily on individual contributions',
                    'Limited experience in guiding others',
                    'Not yet ready for leadership responsibilities'
                ]
            },
            {
                level: 1,
                title: 'Learning',
                bullets: [
                    'Occasionally helps junior team members',
                    'Beginning to participate in technical discussions',
                    'Shows interest in leadership opportunities'
                ]
            },
            {
                level: 2,
                title: 'Developing',
                bullets: [
                    'Mentors junior developers effectively',
                    'Contributes to technical decision-making',
                    'Takes ownership of small technical initiatives'
                ]
            },
            {
                level: 3,
                title: 'Proficient',
                bullets: [
                    'Strong technical leader within the team',
                    'Guides architectural and technology decisions',
                    'Mentors multiple team members successfully'
                ]
            },
            {
                level: 4,
                title: 'Advanced',
                bullets: [
                    'Leads technical initiatives across multiple teams',
                    'Influences organizational technical strategy',
                    'Develops other technical leaders'
                ]
            },
            {
                level: 5,
                title: 'Expert',
                bullets: [
                    'Recognized technical leader across the organization',
                    'Shapes company-wide technical vision',
                    'Influences industry technical leadership'
                ]
            }
        ]
    },
    {
        id: 'impact_scope',
        name: 'Impact & Scope (Ownership + Quality)',
        description: 'Breadth and depth of impact on projects, teams, and the organization.',
        levels: [
            {
                level: 0,
                title: 'Individual',
                bullets: [
                    'Impact limited to individual tasks',
                    'Work affects only immediate deliverables',
                    'Minimal influence on team outcomes'
                ]
            },
            {
                level: 1,
                title: 'Team Member',
                bullets: [
                    'Contributes to team goals and deliverables',
                    'Impact visible within immediate team',
                    'Supports team success through individual work'
                ]
            },
            {
                level: 2,
                title: 'Team Impact',
                bullets: [
                    'Significant impact on team productivity and success',
                    'Influences team processes and practices',
                    'Work affects multiple projects within the team'
                ]
            },
            {
                level: 3,
                title: 'Multi-Team',
                bullets: [
                    'Impact extends across multiple teams',
                    'Influences department-level initiatives',
                    'Creates solutions that benefit broader organization'
                ]
            },
            {
                level: 4,
                title: 'Organizational',
                bullets: [
                    'Company-wide impact on technology and processes',
                    'Influences organizational strategy and direction',
                    'Creates lasting change across the organization'
                ]
            },
            {
                level: 5,
                title: 'Industry',
                bullets: [
                    'Impact extends beyond the organization',
                    'Influences industry standards and practices',
                    'Recognized thought leader in the field'
                ]
            }
        ]
    }
];

export const criteriaLabels = {
    technical_knowledge: 'Technical Knowledge',
    system_design: 'System Design',
    problem_solving: 'Problem Solving',
    code_quality: 'Code Quality',
    collaboration: 'Collaboration',
    technical_leadership: 'Technical Leadership',
    impact_scope: 'Impact & Scope'
}; 