import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import FeedbackService from '../../services/FeedbackService';
import FeedbackForm from '../../components/feedback-form/FeedbackForm';
import { LoadingState, EmptyState, ErrorState } from '../../components/estados-ui/EstadosUI';
import { useAuth } from '../../contexts/AuthContext';
import { formatarData, formatarMensagemErro, garantirArray } from '../../utils';
import './Feedbacks.css';

const Feedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [feedbackFormVisible, setFeedbackFormVisible] = useState(false);
    const [leilaoParaAvaliar, setLeilaoParaAvaliar] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [viewMode, setViewMode] = useState('recebidos'); // 'recebidos' ou 'enviados'
    
    const toast = useRef(null);
    const feedbackService = new FeedbackService();
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated() && user?.id) {
            loadFeedbacks();
        }
    }, [viewMode, user]);

    const loadFeedbacks = async () => {
        if (!isAuthenticated() || !user?.id) {
            setError('Usuário não autenticado');
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const response = await feedbackService.buscarPorPessoa(user.id);
            const feedbacksData = response.data?.content || response.data || [];
            
            // Filtrar por tipo de visualização
            const feedbacksFiltrados = feedbacksData.filter(feedback => {
                if (viewMode === 'recebidos') {
                    return feedback.vendedorId === user.id;
                } else {
                    return feedback.compradorId === user.id;
                }
            });
            
            setFeedbacks(garantirArray(feedbacksFiltrados));
            setTotalRecords(feedbacksFiltrados.length);
        } catch (error) {
            const errorMessage = formatarMensagemErro(error, 'Erro ao carregar feedbacks');
            setError(errorMessage);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: errorMessage,
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const abrirFormularioFeedback = (leilao) => {
        setLeilaoParaAvaliar(leilao);
        setFeedbackFormVisible(true);
    };

    const onFeedbackSuccess = () => {
        loadFeedbacks();
        toast.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Feedback enviado com sucesso!',
            life: 3000
        });
    };

    // Templates das colunas
    const notaBodyTemplate = (rowData) => {
        return (
            <div className="rating-display">
                <Rating 
                    value={rowData.nota} 
                    readOnly 
                    cancel={false}
                    stars={5}
                />
                <span className="nota-numero">({rowData.nota}/5)</span>
            </div>
        );
    };

    const comentarioBodyTemplate = (rowData) => {
        if (!rowData.comentario) {
            return <span className="no-comment">Sem comentário</span>;
        }
        
        return (
            <div className="comentario-cell">
                <p className="comentario-preview">
                    {rowData.comentario.length > 100 
                        ? `${rowData.comentario.substring(0, 100)}...`
                        : rowData.comentario
                    }
                </p>
            </div>
        );
    };

    const dataBodyTemplate = (rowData) => {
        return formatarData(rowData.dataAvaliacao);
    };

    const pessoaBodyTemplate = (rowData) => {
        const pessoa = viewMode === 'recebidos' ? rowData.comprador : rowData.vendedor;
        
        return (
            <div className="pessoa-info">
                <Avatar 
                    label={pessoa?.nome?.charAt(0)} 
                    shape="circle" 
                    size="normal"
                    className="pessoa-avatar"
                />
                <div className="pessoa-details">
                    <span className="pessoa-nome">{pessoa?.nome}</span>
                    <small className="pessoa-email">{pessoa?.email}</small>
                </div>
            </div>
        );
    };

    const leilaoBodyTemplate = (rowData) => {
        return (
            <div className="leilao-info">
                <span className="leilao-titulo">{rowData.leilao?.titulo}</span>
                <small className="leilao-categoria">{rowData.leilao?.categoria?.nome}</small>
            </div>
        );
    };

    const header = (
        <div className="table-header">
            <div className="header-title">
                <h2>Meus Feedbacks</h2>
                <span className="total-records">
                    {totalRecords} {totalRecords === 1 ? 'feedback' : 'feedbacks'} 
                    {viewMode === 'recebidos' ? ' recebidos' : ' enviados'}
                </span>
            </div>
            <div className="header-actions">
                <div className="view-toggle">
                    <Button
                        label="Recebidos"
                        onClick={() => setViewMode('recebidos')}
                        className={viewMode === 'recebidos' ? 'p-button-primary' : 'p-button-outlined'}
                    />
                    <Button
                        label="Enviados" 
                        onClick={() => setViewMode('enviados')}
                        className={viewMode === 'enviados' ? 'p-button-primary' : 'p-button-outlined'}
                    />
                </div>
            </div>
        </div>
    );

    // Verificação de segurança
    const feedbacksSeguro = Array.isArray(feedbacks) ? feedbacks : [];

    // Verificação de autenticação
    if (!isAuthenticated()) {
        return (
            <ErrorState 
                title="Acesso Negado"
                error="Você precisa estar logado para acessar esta página"
                showRetry={false}
            />
        );
    }

    if (error && feedbacksSeguro.length === 0) {
        return (
            <div className="feedbacks-container">
                <Toast ref={toast} />
                <ErrorState 
                    title="Erro ao carregar feedbacks"
                    error={error}
                    onRetry={loadFeedbacks}
                />
            </div>
        );
    }

    return (
        <div className="feedbacks-container">
            <Toast ref={toast} />
            
            {/* Estatísticas */}
            {viewMode === 'recebidos' && feedbacksSeguro.length > 0 && (
                <div className="feedback-stats">
                    <Card>
                        <div className="stats-content">
                            <div className="stat-item">
                                <span className="stat-label">Média de Avaliação</span>
                                <div className="stat-value">
                                    <Rating 
                                        value={Math.round(feedbacksSeguro.reduce((acc, f) => acc + f.nota, 0) / feedbacksSeguro.length)} 
                                        readOnly 
                                        cancel={false}
                                    />
                                    <span className="media-numero">
                                        {(feedbacksSeguro.reduce((acc, f) => acc + f.nota, 0) / feedbacksSeguro.length).toFixed(1)}/5
                                    </span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Total de Avaliações</span>
                                <span className="stat-number">{feedbacksSeguro.length}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            <Divider />

            {/* Conteúdo principal */}
            {loading && feedbacksSeguro.length === 0 ? (
                <LoadingState message="Carregando feedbacks..." />
            ) : feedbacksSeguro.length === 0 && !loading ? (
                <EmptyState 
                    icon="pi pi-star"
                    title={`Nenhum feedback ${viewMode === 'recebidos' ? 'recebido' : 'enviado'}`}
                    message={
                        viewMode === 'recebidos' 
                            ? "Você ainda não recebeu nenhuma avaliação."
                            : "Você ainda não enviou nenhuma avaliação."
                    }
                    showAction={false}
                />
            ) : (
                <div className="card">
                    <DataTable 
                        value={feedbacksSeguro} 
                        loading={loading}
                        header={header}
                        responsiveLayout="scroll"
                        paginator 
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} feedbacks"
                        emptyMessage="Nenhum feedback encontrado"
                        stripedRows
                        showGridlines
                    >
                        <Column 
                            header={viewMode === 'recebidos' ? 'Avaliador' : 'Avaliado'} 
                            body={pessoaBodyTemplate} 
                            style={{ width: '250px' }}
                        />
                        <Column header="Leilão" body={leilaoBodyTemplate} style={{ width: '200px' }} />
                        <Column header="Nota" body={notaBodyTemplate} style={{ width: '150px' }} />
                        <Column header="Comentário" body={comentarioBodyTemplate} />
                        <Column header="Data" body={dataBodyTemplate} style={{ width: '120px' }} />
                    </DataTable>
                </div>
            )}

            {/* Formulário de Feedback */}
            <FeedbackForm
                visible={feedbackFormVisible}
                onHide={() => setFeedbackFormVisible(false)}
                leilaoId={leilaoParaAvaliar?.id}
                vendedorId={leilaoParaAvaliar?.vendedorId}
                compradorId={user?.id}
                leilaoTitulo={leilaoParaAvaliar?.titulo}
                onSuccess={onFeedbackSuccess}
            />
        </div>
    );
};

export default Feedbacks;
