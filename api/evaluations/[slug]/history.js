// In-memory database for demo purposes
let evaluations = [];

module.exports = (req, res) => {
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
        
        // Get evaluation history for specific user
        const userEvaluations = evaluations.filter(e => e.user_slug === slug);
        return res.json(userEvaluations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    }

    res.status(405).json({ error: 'Method not allowed' });
} 