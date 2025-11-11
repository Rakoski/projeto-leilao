import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    const navigate = useNavigate();

    const handleVoltar = () => {
        navigate('/');
    };

    const handleVerLeiloes = () => {
        navigate('/leiloes');
    };

    return (
        <main className="not-found">
            <div className="not-found__container">
                <div className="not-found__content">
                    <div className="not-found__icon">
                        <i className="pi pi-exclamation-triangle"></i>
                    </div>
                    
                    <div className="not-found__text">
                        <h1 className="not-found__title">Leilão não encontrado</h1>
                        <p className="not-found__message">
                            O leilão que você está procurando não existe ou pode ter sido removido.
                        </p>
                        <p className="not-found__suggestion">
                            Que tal explorar outros leilões disponíveis?
                        </p>
                    </div>

                    <div className="not-found__actions">
                        <Button
                            label="Ver todos os leilões"
                            icon="pi pi-search"
                            className="p-button-primary not-found__button"
                            onClick={handleVerLeiloes}
                        />
                        <Button
                            label="Voltar ao início"
                            icon="pi pi-home"
                            className="p-button-secondary not-found__button"
                            onClick={handleVoltar}
                        />
                    </div>

                    <div className="not-found__help">
                        <h3 className="not-found__help-title">Possíveis causas:</h3>
                        <ul className="not-found__help-list">
                            <li>O link pode estar incorreto ou desatualizado</li>
                            <li>O leilão pode ter sido encerrado e removido</li>
                            <li>Pode haver um problema temporário no servidor</li>
                            <li>O leilão pode estar restrito a usuários específicos</li>
                        </ul>
                    </div>

                    <div className="not-found__contact">
                        <p className="not-found__contact-text">
                            Se você acredita que isso é um erro, entre em contato conosco.
                        </p>
                        <div className="not-found__contact-info">
                            <span>
                                <i className="pi pi-envelope"></i>
                                suporte@leiloes.com
                            </span>
                            <span>
                                <i className="pi pi-phone"></i>
                                (11) 1234-5678
                            </span>
                        </div>
                    </div>
                </div>

                <div className="not-found__illustration">
                    <div className="not-found__shape not-found__shape--1"></div>
                    <div className="not-found__shape not-found__shape--2"></div>
                    <div className="not-found__shape not-found__shape--3"></div>
                </div>
            </div>
        </main>
    );
};

export default NotFound;
