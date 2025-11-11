import React from "react";
import { Button } from 'primereact/button';
import './PublicoLayout.css';

const PublicoLayout = ({ children }) => {
    return (
        <div className="publico-layout-container">
            <header className="publico-header">
                <div className="publico-header-content">
                    <div className="logo-container">
                        <h1 className="logo-text">
                            <i className="pi pi-shopping-cart"></i>
                            Leilões Online
                        </h1>
                    </div>
                    <nav className="publico-nav">
                        <Button 
                            label="Fazer Login" 
                            icon="pi pi-sign-in"
                            className="p-button-outlined p-button-sm"
                            onClick={() => window.location.href = '/login'}
                        />
                        <Button 
                            label="Criar Conta" 
                            icon="pi pi-user-plus"
                            className="p-button-sm"
                            onClick={() => window.location.href = '/cadastro'}
                        />
                    </nav>
                </div>
            </header>
            
            <main className="publico-main-content">
                {children}
            </main>
            
            <footer className="publico-footer">
                <div className="publico-footer-content">
                    <div className="footer-section">
                        <h3>Leilões Online</h3>
                        <p>Sua plataforma de leilões digitais</p>
                    </div>
                    <div className="footer-section">
                        <h4>Links Úteis</h4>
                        <ul>
                            <li><a href="/">Leilões</a></li>
                            <li><a href="/login">Entrar</a></li>
                            <li><a href="/cadastro">Cadastrar</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Contato</h4>
                        <p>Email: contato@leiloes.com</p>
                        <p>Telefone: (11) 9999-9999</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 Leilões Online. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default PublicoLayout;
