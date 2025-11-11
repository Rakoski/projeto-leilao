import React from 'react';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Header.css';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Logout realizado com sucesso!');
        navigate('/login');
    };

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => navigate('/')
        },
        {
            label: 'Leilões',
            icon: 'pi pi-list',
            command: () => navigate('/leiloes')
        },
        {
            label: 'Categorias',
            icon: 'pi pi-tags',
            command: () => navigate('/categorias')
        },
        {
            label: 'Feedbacks',
            icon: 'pi pi-star',
            command: () => navigate('/feedbacks')
        },
        ...(user?.perfis?.includes('ADMIN') ? [
            {
                label: 'Pessoas',
                icon: 'pi pi-users',
                command: () => navigate('/pessoas')
            },
            {
                label: 'Perfis',
                icon: 'pi pi-shield',
                command: () => navigate('/perfis')
            }
        ] : []),
        {
            label: 'Perfil',
            icon: 'pi pi-user',
            command: () => navigate('/perfil')
        }
    ];

    const end = (
        <div className="header-end">
            <span className="user-name">Olá, {user?.nome}!</span>
            <Button 
                label="Sair" 
                icon="pi pi-sign-out" 
                onClick={handleLogout}
                className="p-button-outlined"
                size="small"
            />
        </div>
    );

    return (
        <div className="header-container">
            <Menubar model={items} end={end} />
        </div>
    );
}

export default Header;