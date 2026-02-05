import axios from 'axios';

async function testSignup() {
    const url = 'http://localhost:3000/api/auth/sign-up/email';
    const payload = {
        email: `debug-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Debug User',
        callbackURL: '/dashboard'
    };

    console.log(`Sending request to ${url} with payload:`, payload);

    try {
        const response = await axios.post(url, payload);
        console.log('Success:', response.status, response.data);
    } catch (error: any) {
        if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
}

testSignup();
