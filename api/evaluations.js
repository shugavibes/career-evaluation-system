// In-memory database for demo purposes
let evaluations = [];

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { slug } = req.query;

    if (req.method === 'GET') {
        if (slug) {
            // Get evaluations for specific user
            const userEvaluations = evaluations.filter(e => e.user_slug === slug);
            
            if (req.url.includes('/latest')) {
                // Get latest evaluations
                const latestSelf = userEvaluations
                    .filter(e => e.evaluation_type === 'self')
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
                
                const latestLeader = userEvaluations
                    .filter(e => e.evaluation_type === 'leader')
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

                return res.json({
                    self: latestSelf || null,
                    leader: latestLeader || null
                });
            }
            
            if (req.url.includes('/history')) {
                // Get evaluation history
                return res.json(userEvaluations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
            }
        }
        
        return res.json(evaluations);
    }

    if (req.method === 'POST') {
        const evaluation = {
            id: evaluations.length + 1,
            user_slug: slug,
            ...req.body,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        evaluations.push(evaluation);
        return res.status(201).json(evaluation);
    }

    res.status(405).json({ error: 'Method not allowed' });
} 