import axios from 'axios';

// Create a configured axios instance
export const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Direct to API
    withCredentials: true, // Send cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for global error handling (optional but recommended)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors like 401 Unauthorized globally if needed
        if (error.response?.status === 401) {
            // Redirect to login or handle session expiry
            console.warn('Unauthorized access');
        }
        return Promise.reject(error);
    }
);
