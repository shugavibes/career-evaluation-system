const http = require('http');

console.log('🔍 Verifying server startup...');

// Test if server responds to health check
function testHealthCheck() {
    return new Promise((resolve, reject) => {
        const req = http.get('http://localhost:3001/api/health', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const health = JSON.parse(data);
                    if (health.status === 'OK') {
                        console.log('✅ Health check passed:', health);
                        resolve(true);
                    } else {
                        console.log('❌ Health check failed:', health);
                        resolve(false);
                    }
                } catch (error) {
                    console.log('❌ Invalid health response:', data);
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            console.log('❌ Connection failed:', error.message);
            resolve(false);
        });

        req.setTimeout(5000, () => {
            req.destroy();
            console.log('❌ Health check timed out');
            resolve(false);
        });
    });
}

async function verify() {
    console.log('Testing health endpoint...');
    
    for (let attempt = 1; attempt <= 5; attempt++) {
        console.log(`Attempt ${attempt}/5...`);
        
        const success = await testHealthCheck();
        if (success) {
            console.log('🎉 Server verification successful!');
            process.exit(0);
        }
        
        if (attempt < 5) {
            console.log('⏳ Waiting 2 seconds before retry...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    console.log('💥 Server verification failed after 5 attempts');
    console.log('🔧 Troubleshooting tips:');
    console.log('  - Check if server is running: npm start');
    console.log('  - Check server logs for errors');
    console.log('  - Verify port 3001 is available');
    console.log('  - Check environment variables');
    process.exit(1);
}

verify(); 