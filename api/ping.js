module.exports = (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Handle the ping request
    if (req.method === 'GET') {
        res.status(200).send('pong');
        return;
    }
    
    // Handle unsupported methods
    res.status(405).json({ error: 'Method not allowed' });
}; 