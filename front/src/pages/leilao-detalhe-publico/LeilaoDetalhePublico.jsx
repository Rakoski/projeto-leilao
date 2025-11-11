import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Skeleton } from 'primereact/skeleton';
import { Divider } from 'primereact/divider';
import { Galleria } from 'primereact/galleria';
import LeilaoService from '../../services/LeilaoService';
import PublicoLayout from '../../components/layout/PublicoLayout';
import { 
    formatarMoeda, 
    formatarData,
    getStatusDisplayText,
    getStatusSeverity,
    obterNomeCategoria,
    formatarMensagemErro
} from '../../utils';
import './LeilaoDetalhePublico.css';

const LeilaoDetalhePublico = () => {
    const [leilao, setLeilao] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { id } = useParams();
    const toast = useRef(null);
    const leilaoService = new LeilaoService();

    useEffect(() => {
        if (id) {
            loadLeilao();
        }
    }, [id]);

    const loadLeilao = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await leilaoService.buscarPublicoPorId(id);
            setLeilao(response.data);
        } catch (error) {
            const errorMessage = formatarMensagemErro(error, 'Erro ao carregar leilão');
            setError(errorMessage);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: errorMessage,
                life: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    const getTempoRestante = (dataFim) => {
        if (!dataFim) return null;
        
        const agora = new Date();
        const fim = new Date(dataFim);
        const diferenca = fim - agora;
        
        if (diferenca <= 0) return 'Encerrado';
        
        const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
        
        if (dias > 0) return `${dias}d ${horas}h ${minutos}m`;
        if (horas > 0) return `${horas}h ${minutos}m`;
        return `${minutos}m`;
    };

    const renderGalleria = () => {
        if (!leilao?.imagens?.length) {
            return (
                <div className="sem-imagens">
                    <i className="pi pi-image" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                    <p>Nenhuma imagem disponível</p>
                </div>
            );
        }

        const itemTemplate = (item) => {
            return <img src={item.url} alt={item.descricao || 'Imagem do leilão'} className="galleria-image" />;
        };

        const thumbnailTemplate = (item) => {
            return <img src={item.url} alt={item.descricao || 'Miniatura'} className="galleria-thumbnail" />;
        };

        return (
            <Galleria
                value={leilao.imagens}
                item={itemTemplate}
                thumbnail={thumbnailTemplate}
                numVisible={4}
                responsiveOptions={[
                    { breakpoint: '1024px', numVisible: 3 },
                    { breakpoint: '768px', numVisible: 2 },
                    { breakpoint: '560px', numVisible: 1 }
                ]}
                showThumbnails={leilao.imagens.length > 1}
                showIndicators={false}
                changeItemOnIndicatorHover
                className="leilao-galleria"
            />
        );
    };

    if (loading) {
        return (
            <div className="leilao-detalhe-publico-container">
                <Toast ref={toast} />
                <div className="leilao-detalhe-content">
                    <div className="voltar-container">
                        <Skeleton width="120px" height="40px" />
                    </div>
                    
                    <div className="leilao-header-skeleton">
                        <Skeleton width="60%" height="2rem" className="mb-2" />
                        <Skeleton width="200px" height="1.5rem" />
                    </div>

                    <div className="leilao-main-skeleton">
                        <div className="leilao-images-skeleton">
                            <Skeleton width="100%" height="400px" />
                        </div>
                        
                        <div className="leilao-info-skeleton">
                            <Skeleton width="100%" height="150px" className="mb-3" />
                            <Skeleton width="100%" height="100px" className="mb-3" />
                            <Skeleton width="100%" height="80px" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !leilao) {
        return (
            <div className="leilao-detalhe-publico-container">
                <Toast ref={toast} />
                <div className="error-state">
                    <div className="error-icon">
                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '4rem', color: '#ef4444' }}></i>
                    </div>
                    <h2>Leilão não encontrado</h2>
                    <p>{error || 'O leilão que você está procurando não existe ou não está mais disponível.'}</p>
                    <div className="error-actions">
                        <Button 
                            label="Voltar aos leilões" 
                            icon="pi pi-arrow-left"
                            onClick={() => window.location.href = '/'}
                            className="p-button-outlined"
                        />
                        <Button 
                            label="Tentar novamente" 
                            icon="pi pi-refresh"
                            onClick={loadLeilao}
                        />
                    </div>
                </div>
            </div>
        );
    }

    const isEncerrado = leilao.status === 'ENCERRADO' || leilao.status === 'CANCELADO';
    const tempoRestante = getTempoRestante(leilao.dataHoraFim);

    return (
        <PublicoLayout>
            <div className="leilao-detalhe-publico-container">
                <Toast ref={toast} />
            
            <div className="leilao-detalhe-content">
                <div className="voltar-container">
                    <Button 
                        label="Voltar aos leilões" 
                        icon="pi pi-arrow-left"
                        className="p-button-outlined"
                        onClick={() => window.location.href = '/'}
                    />
                </div>

                <header className="leilao-header">
                    <div className="titulo-container">
                        <h1>{leilao.titulo}</h1>
                        <Tag 
                            value={getStatusDisplayText(leilao.status)} 
                            severity={getStatusSeverity(leilao.status)}
                            className="status-tag"
                        />
                    </div>
                    
                    <div className="categoria-info">
                        <i className="pi pi-tag"></i>
                        <span>{obterNomeCategoria(leilao)}</span>
                    </div>
                </header>

                <main className="leilao-main">
                    <div className="leilao-images">
                        {renderGalleria()}
                    </div>
                    
                    <div className="leilao-info">
                        <Card title="Informações do Leilão" className="info-card">
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Lance Mínimo:</label>
                                    <span className="valor-destaque">{formatarMoeda(leilao.lanceMinimo)}</span>
                                </div>
                                
                                <div className="info-item">
                                    <label>Incremento:</label>
                                    <span>{formatarMoeda(leilao.valorIncremento)}</span>
                                </div>
                                
                                <div className="info-item">
                                    <label>Data de Início:</label>
                                    <span>{formatarData(leilao.dataHoraInicio)}</span>
                                </div>
                                
                                <div className="info-item">
                                    <label>Data de Término:</label>
                                    <span>{formatarData(leilao.dataHoraFim)}</span>
                                </div>
                                
                                {!isEncerrado && tempoRestante && (
                                    <div className="info-item tempo-restante-info">
                                        <label>Tempo Restante:</label>
                                        <span className="tempo-destaque">{tempoRestante}</span>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {leilao.descricao && (
                            <Card title="Descrição" className="descricao-card">
                                <p className="descricao-texto">{leilao.descricao}</p>
                            </Card>
                        )}

                        <Card title="Como Participar" className="participacao-card">
                            <div className="participacao-info">
                                <p>Para participar deste leilão, você precisa:</p>
                                <ul>
                                    <li>Criar uma conta na plataforma</li>
                                    <li>Fazer login no sistema</li>
                                    <li>Acessar a página de lances do leilão</li>
                                    <li>Dar seus lances respeitando o valor mínimo e incremento</li>
                                </ul>
                                
                                <div className="participacao-actions">
                                    <Button 
                                        label="Fazer Login" 
                                        icon="pi pi-sign-in"
                                        onClick={() => window.location.href = '/login'}
                                        className="p-button-success"
                                    />
                                    <Button 
                                        label="Criar Conta" 
                                        icon="pi pi-user-plus"
                                        onClick={() => window.location.href = '/cadastro'}
                                        className="p-button-outlined"
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                </main>
            </div>
            </div>
        </PublicoLayout>
    );
};

export default LeilaoDetalhePublico;
