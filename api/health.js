export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        return res.json({ 
            status: 'OK', 
            timestamp: new Date().toISOString(),
            message: 'Career Evaluation System API is running'
        });
    }

    res.status(405).json({ error: 'Method not allowed' });
} 