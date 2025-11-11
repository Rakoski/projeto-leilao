import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import './LeilaoInfo.css';

const LeilaoInfo = ({ leilao }) => {
    const navigate = useNavigate();

    const formatarMoeda = (valor) => {
        if (!valor || valor === 0) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const calcularProximoLance = () => {
        const maiorLance = leilao.maiorLance || leilao.lanceMinimo || 0;
        const incremento = leilao.incremento || 0;
        return maiorLance + incremento;
    };

    const handleEntrarParaDarLance = () => {
        navigate('/login', { 
            state: { 
                returnTo: `/leiloes/${leilao.id}`,
                message: 'Faça login para participar do leilão'
            }
        });
    };

    const isLeilaoAtivo = () => {
        return leilao.status === 'ABERTO';
    };

    const getTempoRestante = () => {
        if (!leilao.dataFim) return null;
        
        const agora = new Date();
        const fim = new Date(leilao.dataFim);
        const diferenca = fim.getTime() - agora.getTime();
        
        if (diferenca <= 0) return 'Encerrado';
        
        const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
        
        if (dias > 0) {
            return `${dias}d ${horas}h ${minutos}m`;
        } else if (horas > 0) {
            return `${horas}h ${minutos}m`;
        } else {
            return `${minutos}m`;
        }
    };

    return (
        <aside className="leilao-info">
            <div className="leilao-info__card">
                <h3 className="leilao-info__title">Informações do Leilão</h3>
                
                <div className="leilao-info__section">
                    <div className="leilao-info__item leilao-info__item--highlight">
                        <label className="leilao-info__label">Maior lance atual</label>
                        <span className="leilao-info__value leilao-info__value--price">
                            {formatarMoeda(leilao.maiorLance || leilao.lanceMinimo)}
                        </span>
                    </div>
                    
                    <div className="leilao-info__item">
                        <label className="leilao-info__label">Lance mínimo</label>
                        <span className="leilao-info__value">
                            {formatarMoeda(leilao.lanceMinimo)}
                        </span>
                    </div>
                    
                    <div className="leilao-info__item">
                        <label className="leilao-info__label">Incremento mínimo</label>
                        <span className="leilao-info__value">
                            {formatarMoeda(leilao.incremento)}
                        </span>
                    </div>
                    
                    {isLeilaoAtivo() && (
                        <div className="leilao-info__item leilao-info__item--next-bid">
                            <label className="leilao-info__label">Próximo lance mínimo</label>
                            <span className="leilao-info__value leilao-info__value--next">
                                {formatarMoeda(calcularProximoLance())}
                            </span>
                        </div>
                    )}
                </div>

                {getTempoRestante() && getTempoRestante() !== 'Encerrado' && (
                    <div className="leilao-info__section">
                        <div className="leilao-info__countdown">
                            <i className="pi pi-clock"></i>
                            <div>
                                <span className="leilao-info__countdown-label">Tempo restante</span>
                                <span className="leilao-info__countdown-value">{getTempoRestante()}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="leilao-info__section">
                    <div className="leilao-info__stats">
                        <div className="leilao-info__stat">
                            <i className="pi pi-users"></i>
                            <div>
                                <span className="leilao-info__stat-value">
                                    {leilao.totalLances || 0}
                                </span>
                                <span className="leilao-info__stat-label">Lances</span>
                            </div>
                        </div>
                        
                        <div className="leilao-info__stat">
                            <i className="pi pi-eye"></i>
                            <div>
                                <span className="leilao-info__stat-value">
                                    {leilao.visualizacoes || 0}
                                </span>
                                <span className="leilao-info__stat-label">Visualizações</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="leilao-info__actions">
                    {isLeilaoAtivo() ? (
                        <Button
                            label="Entrar para dar lance"
                            icon="pi pi-sign-in"
                            className="p-button-primary p-button-lg leilao-info__bid-button"
                            onClick={handleEntrarParaDarLance}
                        />
                    ) : (
                        <Button
                            label={`Leilão ${leilao.status.toLowerCase()}`}
                            icon="pi pi-lock"
                            className="p-button-secondary p-button-lg"
                            disabled
                        />
                    )}
                </div>

                {leilao.vendedor && (
                    <div className="leilao-info__vendor">
                        <h4 className="leilao-info__vendor-title">Vendedor</h4>
                        <div className="leilao-info__vendor-info">
                            <div className="leilao-info__vendor-avatar">
                                <i className="pi pi-user"></i>
                            </div>
                            <div>
                                <span className="leilao-info__vendor-name">
                                    {leilao.vendedor.nome || 'Vendedor'}
                                </span>
                                {leilao.vendedor.avaliacao && (
                                    <div className="leilao-info__vendor-rating">
                                        <i className="pi pi-star-fill"></i>
                                        <span>{leilao.vendedor.avaliacao.toFixed(1)}</span>
                                        <span className="leilao-info__vendor-reviews">
                                            ({leilao.vendedor.totalAvaliacoes || 0} avaliações)
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default LeilaoInfo;
