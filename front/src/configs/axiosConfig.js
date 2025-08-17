import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor para adicionar token
api.interceptors.request.use(
    config => {
        const usuario = localStorage.getItem('usuario');
        if (usuario) {
            try {
                const userData = JSON.parse(usuario);
                if (userData?.token) {
                    config.headers.Authorization = `Bearer ${userData.token}`;
                }
            } catch (error) {
                console.error('Erro ao parsear dados do usuário:', error);
                localStorage.removeItem('usuario');
            }
        }
        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor para lidar com erros de autenticação
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('usuario');
            window.location.href = '/login';
            toast.error('Sessão expirada. Faça login novamente.');
        } else if (error.response?.status === 403) {
            toast.error('Acesso negado.');
        } else if (error.response?.status >= 500) {
            toast.error('Erro interno do servidor.');
        }
        return Promise.reject(error);
    }
);

export default api;