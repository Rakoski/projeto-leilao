import React, { useState } from 'react';
import { Button } from 'primereact/button';
import './LeilaoDescription.css';

const LeilaoDescription = ({ leilao }) => {
    const [expandida, setExpandida] = useState(false);

    const hasDescricaoDetalhada = () => {
        return leilao.descricaoDetalhada && 
               leilao.descricaoDetalhada.trim() !== '' && 
               leilao.descricaoDetalhada !== leilao.descricaoResumida;
    };

    const shouldShowExpandButton = () => {
        return hasDescricaoDetalhada() && 
               leilao.descricaoDetalhada.length > 300;
    };

    const getDescricaoResumida = () => {
        return leilao.descricaoResumida || 'Nenhuma descrição disponível.';
    };

    const getDescricaoDetalhada = () => {
        if (!hasDescricaoDetalhada()) return '';
        
        if (!expandida && shouldShowExpandButton()) {
            return leilao.descricaoDetalhada.substring(0, 300) + '...';
        }
        
        return leilao.descricaoDetalhada;
    };

    const formatarTexto = (texto) => {
        // Converte quebras de linha em parágrafos
        return texto.split('\n').map((paragrafo, index) => (
            paragrafo.trim() ? (
                <p key={index} className="leilao-description__paragraph">
                    {paragrafo.trim()}
                </p>
            ) : null
        ));
    };

    return (
        <section className="leilao-description">
            <div className="leilao-description__card">
                <h2 className="leilao-description__title">Descrição</h2>
                
                {/* Descrição Resumida */}
                <div className="leilao-description__section">
                    <h3 className="leilao-description__section-title">
                        <i className="pi pi-info-circle"></i>
                        Resumo
                    </h3>
                    <div className="leilao-description__content leilao-description__content--summary">
                        {formatarTexto(getDescricaoResumida())}
                    </div>
                </div>

                {/* Descrição Detalhada */}
                {hasDescricaoDetalhada() && (
                    <div className="leilao-description__section">
                        <h3 className="leilao-description__section-title">
                            <i className="pi pi-file-text"></i>
                            Detalhes
                        </h3>
                        <div className="leilao-description__content leilao-description__content--detailed">
                            {formatarTexto(getDescricaoDetalhada())}
                        </div>
                        
                        {shouldShowExpandButton() && (
                            <div className="leilao-description__expand">
                                <Button
                                    label={expandida ? 'Ver menos' : 'Ver mais'}
                                    icon={expandida ? 'pi pi-chevron-up' : 'pi pi-chevron-down'}
                                    className="p-button-text p-button-sm leilao-description__expand-button"
                                    onClick={() => setExpandida(!expandida)}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Informações Técnicas (se disponível) */}
                {(leilao.especificacoes || leilao.condicao || leilao.localizacao) && (
                    <div className="leilao-description__section">
                        <h3 className="leilao-description__section-title">
                            <i className="pi pi-cog"></i>
                            Informações Técnicas
                        </h3>
                        <div className="leilao-description__specs">
                            {leilao.condicao && (
                                <div className="leilao-description__spec-item">
                                    <span className="leilao-description__spec-label">Condição:</span>
                                    <span className="leilao-description__spec-value">{leilao.condicao}</span>
                                </div>
                            )}
                            
                            {leilao.localizacao && (
                                <div className="leilao-description__spec-item">
                                    <span className="leilao-description__spec-label">Localização:</span>
                                    <span className="leilao-description__spec-value">{leilao.localizacao}</span>
                                </div>
                            )}
                            
                            {leilao.especificacoes && Object.entries(leilao.especificacoes).map(([chave, valor]) => (
                                <div key={chave} className="leilao-description__spec-item">
                                    <span className="leilao-description__spec-value">{valor}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Termos e Condições */}
                {leilao.termosCondicoes && (
                    <div className="leilao-description__section">
                        <h3 className="leilao-description__section-title">
                            <i className="pi pi-shield"></i>
                            Termos e Condições
                        </h3>
                        <div className="leilao-description__terms">
                            {formatarTexto(leilao.termosCondicoes)}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default LeilaoDescription;
