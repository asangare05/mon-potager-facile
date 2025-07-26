import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Assurez-vous que cette URL est correcte
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    console.log("Token utilisé pour la requête:", token);
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;