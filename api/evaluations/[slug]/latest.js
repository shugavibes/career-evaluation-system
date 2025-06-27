// In-memory database for demo purposes
let evaluations = [];

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        const { slug } = req.query;
        
        // Get evaluations for specific user
        const userEvaluations = evaluations.filter(e => e.user_slug === slug);
        
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

    res.status(405).json({ error: 'Method not allowed' });
} 