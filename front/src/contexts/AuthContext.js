import React, { createContext, useContext, useState, useEffect } from 'react';
import AutenticacaoService from '../services/AutenticacaoService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const autenticacaoService = new AutenticacaoService();

    useEffect(() => {
        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
            } catch (error) {
                console.error('Erro ao parsear dados do usuário:', error);
                localStorage.removeItem('usuario');
            }
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await autenticacaoService.login(credentials);
            
            if (response.status === 200 && response.data.token) {
                const userData = response.data;
                setUser(userData);
                localStorage.setItem('usuario', JSON.stringify(userData));
                return { success: true, data: userData };
            } else {
                return { success: false, error: 'Credenciais inválidas' };
            }
        } catch (error) {
            console.error('Erro no login:', error);
            return { 
                success: false, 
                error: error.response?.data?.mensagem || 'Erro interno do servidor'
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('usuario');
    };

    const isAuthenticated = () => {
        return !!user && !!user.token;
    };

    const getToken = () => {
        return user?.token;
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated,
        getToken,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
