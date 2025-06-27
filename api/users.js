// In-memory database for demo purposes (since SQLite doesn't work well in Vercel serverless)
const users = [
    {
        id: 1,
        name: "Fede Miranda",
        slug: "fede-miranda",
        role: "Semi-Senior Engineer",
        created_at: "2024-01-15T10:00:00Z"
    },
    {
        id: 2,
        name: "Jose Biskis",
        slug: "jose-biskis", 
        role: "Senior Engineer",
        created_at: "2024-01-15T10:00:00Z"
    },
    {
        id: 3,
        name: "Santi Musso",
        slug: "santi-musso",
        role: "Junior Engineer", 
        created_at: "2024-01-15T10:00:00Z"
    },
    {
        id: 4,
        name: "Alton Bell",
        slug: "alton-bell",
        role: "Tech Lead",
        created_at: "2024-01-15T10:00:00Z"
    },
    {
        id: 5,
        name: "Javi Mermet",  
        slug: "javi-mermet",
        role: "Senior Engineer",
        created_at: "2024-01-15T10:00:00Z"
    },
    {
        id: 6,
        name: "Leo Paini",
        slug: "leo-paini", 
        role: "Senior Engineer",
        created_at: "2024-01-15T10:00:00Z"
    },
    {
        id: 7,
        name: "Fede Cano",
        slug: "fede-cano",
        role: "Tech Lead", 
        created_at: "2024-01-15T10:00:00Z"
    }
];

module.exports = (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        // Get specific user by slug from query parameter
        const { slug } = req.query;
        
        if (slug) {
            const user = users.find(u => u.slug === slug);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.json(user);
        }
        
        // Get all users
        return res.json(users);
    }

    res.status(405).json({ error: 'Method not allowed' });
} 