// In-memory database for demo purposes
let evaluations = [];

module.exports = (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { slug } = req.query;

    if (req.method === 'GET') {
        // Get evaluations for specific user
        const userEvaluations = evaluations.filter(e => e.user_slug === slug);
        return res.json(userEvaluations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
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