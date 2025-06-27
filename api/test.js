module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ message: 'Test API is working', timestamp: new Date().toISOString() });
}; 