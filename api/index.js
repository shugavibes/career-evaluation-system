const app = require('./server');

module.exports = (req, res) => {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Forward the request to the Express app
    app(req, res);
}; 