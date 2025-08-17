import React, { useState, useEffect } from "react";
import './Login.css';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import toast from 'react-hot-toast';

const Login = () => {
    const { login, isAuthenticated, loading } = useAuth();
    const [credentials, setCredentials] = useState({ email: '', senha: '' });
    const [loginLoading, setLoginLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        if (isAuthenticated() && !loading) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, loading, navigate, from]);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setError(''); // Limpar erro ao digitar
    }

    const handleLogin = async () => {
        if (!credentials.email || !credentials.senha) {
            setError('Preencha todos os campos');
            return;
        }

        setLoginLoading(true);
        setError('');

        try {
            const result = await login(credentials);
            
            if (result.success) {
                toast.success(`Bem-vindo, ${result.data.nome}!`);
                navigate(from, { replace: true });
            } else {
                setError(result.error);
                toast.error(result.error);
            }
        } catch (error) {
            const errorMessage = 'Erro inesperado. Tente novamente.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoginLoading(false);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    }

    if (loading) {
        return (
            <div className="loading-container">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                
                {error && (
                    <Message severity="error" text={error} className="login-error" />
                )}
                
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <InputText 
                        id="email"
                        value={credentials.email} 
                        name="email" 
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        disabled={loginLoading}
                        className={error ? 'p-invalid' : ''}
                    />
                </div>
                
                <div className="field">
                    <label htmlFor="senha">Senha</label>
                    <Password 
                        id="senha"
                        value={credentials.senha} 
                        name="senha" 
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        disabled={loginLoading}
                        feedback={false}
                        toggleMask
                        className={error ? 'p-invalid' : ''}
                    />
                </div>
                
                <Button 
                    label={loginLoading ? 'Entrando...' : 'Entrar'} 
                    onClick={handleLogin}
                    disabled={loginLoading}
                    loading={loginLoading}
                    className="login-button"
                />
            </div>
        </div>
    );
}

export default Login;