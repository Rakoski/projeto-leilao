import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Paginator } from 'primereact/paginator';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import LeilaoService from '../../services/LeilaoService';
import CategoriaService from '../../services/CategoriaService';
import PublicoLayout from '../../components/layout/PublicoLayout';
import { 
    formatarMoeda, 
    formatarData,
    getStatusDisplayText,
    obterNomeCategoria,
    formatarMensagemErro,
    garantirArray
} from '../../utils';
import './LeiloesPublicos.css';

const LeiloesPublicos = () => {
    const [leiloes, setLeiloes] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filtros e busca
    const [busca, setBusca] = useState('');
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
    const [ordenacao, setOrdenacao] = useState('terminaEm');
    const [mostrarEncerrados, setMostrarEncerrados] = useState(false);
    
    // Paginação
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(12);
    const [totalRecords, setTotalRecords] = useState(0);
    
    const toast = useRef(null);
    const leilaoService = new LeilaoService();
    const categoriaService = new CategoriaService();

    const ordenacaoOptions = [
        { label: 'Termina em breve', value: 'terminaEm' },
        { label: 'Mais recentes', value: 'maisRecentes' },
        { label: 'Menor preço', value: 'menorPreco' },
        { label: 'Maior preço', value: 'maiorPreco' }
    ];

    useEffect(() => {
        loadCategorias();
    }, []);

    useEffect(() => {
        loadLeiloes();
    }, [busca, categoriaSelecionada, ordenacao, mostrarEncerrados, first, rows]);

    const loadCategorias = async () => {
        try {
            const response = await categoriaService.buscarPublicas();
            const categoriasData = response.data?.content || response.data || [];
            setCategorias(garantirArray(categoriasData));
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            setCategorias([]);
        }
    };

    const loadLeiloes = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const filtros = {
                titulo: busca || null,
                categoriaId: categoriaSelecionada?.id || null,
                status: mostrarEncerrados ? null : 'ABERTO',
                page: Math.floor(first / rows),
                size: rows,
                sort: getOrderByField()
            };

            // Remove filtros nulos/vazios
            Object.keys(filtros).forEach(key => {
                if (filtros[key] === null || filtros[key] === undefined || filtros[key] === '') {
                    delete filtros[key];
                }
            });

            const response = await leilaoService.buscarPublicos(filtros);
            const leiloesData = response.data?.content || response.data || [];
            
            setLeiloes(garantirArray(leiloesData));
            setTotalRecords(response.data?.totalElements || leiloesData.length || 0);
        } catch (error) {
            const errorMessage = formatarMensagemErro(error, 'Erro ao carregar leilões');
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

    const getOrderByField = () => {
        switch (ordenacao) {
            case 'terminaEm':
                return 'dataHoraFim,asc';
            case 'maisRecentes':
                return 'dataHoraInicio,desc';
            case 'menorPreco':
                return 'lanceMinimo,asc';
            case 'maiorPreco':
                return 'lanceMinimo,desc';
            default:
                return 'dataHoraFim,asc';
        }
    };

    const handleBuscaChange = (e) => {
        setBusca(e.target.value);
        setFirst(0); // Reset pagination
    };

    const handleCategoriaChange = (e) => {
        setCategoriaSelecionada(e.value);
        setFirst(0); // Reset pagination
    };

    const handleOrdenacaoChange = (e) => {
        setOrdenacao(e.value);
        setFirst(0); // Reset pagination
    };

    const handleMostrarEncerradosChange = () => {
        setMostrarEncerrados(!mostrarEncerrados);
        setFirst(0); // Reset pagination
    };

    const clearFilters = () => {
        setBusca('');
        setCategoriaSelecionada(null);
        setOrdenacao('terminaEm');
        setMostrarEncerrados(false);
        setFirst(0);
    };

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const renderLeilaoCard = (leilao) => {
        const isEncerrado = leilao.status === 'ENCERRADO' || leilao.status === 'CANCELADO';
        const tempoRestante = getTempoRestante(leilao.dataHoraFim);

        return (
            <div key={leilao.id} className="leilao-card-wrapper" role="listitem">
                <Card className={`leilao-card ${isEncerrado ? 'encerrado' : ''}`}>
                    <div className="leilao-image-container">
                        {leilao.imagemPrincipal ? (
                            <img 
                                src={leilao.imagemPrincipal} 
                                alt={`Imagem do leilão ${leilao.titulo}`}
                                className="leilao-image"
                                loading="lazy"
                            />
                        ) : (
                            <div className="leilao-no-image" aria-label="Sem imagem disponível">
                                <i className="pi pi-image" style={{ fontSize: '2rem', color: '#ccc' }}></i>
                                <span>Sem imagem</span>
                            </div>
                        )}
                        
                        <div className="leilao-status-overlay">
                            <Tag 
                                value={getStatusDisplayText(leilao.status)} 
                                severity={isEncerrado ? 'danger' : 'success'}
                            />
                        </div>
                    </div>
                    
                    <div className="leilao-content">
                        <h3 className="leilao-titulo">{leilao.titulo}</h3>
                        
                        <div className="leilao-categoria">
                            <i className="pi pi-tag"></i>
                            <span>{obterNomeCategoria(leilao)}</span>
                        </div>
                        
                        <div className="leilao-periodo">
                            <div className="periodo-item">
                                <i className="pi pi-calendar"></i>
                                <span>
                                    <strong>Início:</strong> {formatarData(leilao.dataHoraInicio)}
                                </span>
                            </div>
                            <div className="periodo-item">
                                <i className="pi pi-clock"></i>
                                <span>
                                    <strong>Término:</strong> {formatarData(leilao.dataHoraFim)}
                                </span>
                            </div>
                            {!isEncerrado && tempoRestante && (
                                <div className="tempo-restante">
                                    <i className="pi pi-hourglass"></i>
                                    <span className="destaque">{tempoRestante}</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="leilao-preco">
                            <span className="preco-label">Lance mínimo:</span>
                            <span className="preco-valor">{formatarMoeda(leilao.lanceMinimo)}</span>
                        </div>
                        
                        <Button 
                            label="Ver detalhes" 
                            icon="pi pi-eye"
                            className="p-button-outlined w-full"
                            onClick={() => window.location.href = `/leiloes/${leilao.id}`}
                            aria-label={`Ver detalhes do leilão ${leilao.titulo}`}
                        />
                    </div>
                </Card>
            </div>
        );
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
        
        if (dias > 0) return `${dias}d ${horas}h`;
        if (horas > 0) return `${horas}h ${minutos}m`;
        return `${minutos}m`;
    };

    const renderSkeletonCards = () => {
        return Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="leilao-card-wrapper">
                <Card className="leilao-card">
                    <div className="leilao-image-container">
                        <Skeleton width="100%" height="200px" />
                    </div>
                    <div className="leilao-content">
                        <Skeleton width="80%" height="1.5rem" className="mb-2" />
                        <Skeleton width="60%" height="1rem" className="mb-2" />
                        <Skeleton width="100%" height="3rem" className="mb-2" />
                        <Skeleton width="70%" height="1.2rem" className="mb-3" />
                        <Skeleton width="100%" height="2.5rem" />
                    </div>
                </Card>
            </div>
        ));
    };

    const renderEmptyState = () => {
        const hasFilters = busca || categoriaSelecionada || mostrarEncerrados;
        
        return (
            <div className="empty-state" role="region" aria-live="polite">
                <div className="empty-icon">
                    <i className="pi pi-search" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                </div>
                <h2>
                    {hasFilters ? 'Nenhum leilão encontrado' : 'Nenhum leilão disponível'}
                </h2>
                <p>
                    {hasFilters 
                        ? 'Tente ajustar os filtros de busca para encontrar leilões.'
                        : 'Não há leilões disponíveis no momento. Volte mais tarde!'
                    }
                </p>
                {hasFilters && (
                    <Button 
                        label="Limpar filtros" 
                        icon="pi pi-filter-slash"
                        className="p-button-outlined"
                        onClick={clearFilters}
                    />
                )}
            </div>
        );
    };

    const renderErrorState = () => (
        <div className="error-state" role="region" aria-live="assertive">
            <div className="error-icon">
                <i className="pi pi-exclamation-triangle" style={{ fontSize: '4rem', color: '#e24c4c' }}></i>
            </div>
            <h2>Ops! Algo deu errado</h2>
            <p>{error}</p>
            <Button 
                label="Tentar novamente" 
                icon="pi pi-refresh"
                onClick={loadLeiloes}
            />
        </div>
    );

    return (
        <PublicoLayout>
            <div className="leiloes-publicos-container">
                <Toast ref={toast} />
            
            <header className="leiloes-header">
                <div className="header-content">
                    <h1>Leilões Online</h1>
                    <p>Encontre os melhores leilões em andamento</p>
                </div>
            </header>

            <main className="leiloes-main">
                <section className="filtros-section" role="search" aria-label="Filtros de busca">
                    <div className="filtros-container">
                        <div className="busca-container">
                            <span className="p-input-icon-left w-full">
                                <i className="pi pi-search" />
                                <InputText
                                    value={busca}
                                    onChange={handleBuscaChange}
                                    placeholder="Buscar por título do leilão..."
                                    className="w-full"
                                    aria-label="Campo de busca por título"
                                />
                            </span>
                        </div>

                        <div className="filtros-row">
                            <div className="filtro-item">
                                <label htmlFor="categoria-filter">Categoria:</label>
                                <Dropdown
                                    id="categoria-filter"
                                    value={categoriaSelecionada}
                                    options={categorias}
                                    onChange={handleCategoriaChange}
                                    optionLabel="nome"
                                    placeholder="Todas as categorias"
                                    className="w-full"
                                    showClear
                                />
                            </div>

                            <div className="filtro-item">
                                <label htmlFor="ordenacao-filter">Ordenar por:</label>
                                <Dropdown
                                    id="ordenacao-filter"
                                    value={ordenacao}
                                    options={ordenacaoOptions}
                                    onChange={handleOrdenacaoChange}
                                    className="w-full"
                                />
                            </div>

                            <div className="filtro-item filtro-checkbox">
                                <div className="field-checkbox">
                                    <input
                                        id="mostrar-encerrados"
                                        type="checkbox"
                                        checked={mostrarEncerrados}
                                        onChange={handleMostrarEncerradosChange}
                                        className="p-checkbox"
                                    />
                                    <label htmlFor="mostrar-encerrados">
                                        Incluir leilões encerrados
                                    </label>
                                </div>
                            </div>
                        </div>

                        {(busca || categoriaSelecionada || mostrarEncerrados) && (
                            <div className="filtros-actions">
                                <Button
                                    label="Limpar filtros"
                                    icon="pi pi-filter-slash"
                                    className="p-button-outlined p-button-sm"
                                    onClick={clearFilters}
                                />
                            </div>
                        )}
                    </div>
                </section>

                <Divider />

                <section className="resultados-section">
                    {loading && leiloes.length === 0 ? (
                        <div className="leiloes-grid" role="list" aria-label="Carregando leilões">
                            {renderSkeletonCards()}
                        </div>
                    ) : error && leiloes.length === 0 ? (
                        renderErrorState()
                    ) : leiloes.length === 0 ? (
                        renderEmptyState()
                    ) : (
                        <>
                            <div className="resultados-info">
                                <span>
                                    {totalRecords} {totalRecords === 1 ? 'leilão encontrado' : 'leilões encontrados'}
                                </span>
                            </div>

                            <div className="leiloes-grid" role="list" aria-label="Lista de leilões">
                                {leiloes.map(renderLeilaoCard)}
                            </div>

                            {totalRecords > rows && (
                                <div className="paginacao-container">
                                    <Paginator
                                        first={first}
                                        rows={rows}
                                        totalRecords={totalRecords}
                                        rowsPerPageOptions={[6, 12, 24]}
                                        onPageChange={onPageChange}
                                        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
                                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} leilões"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </section>
            </main>
        </div>
        </PublicoLayout>
    );
};

export default LeiloesPublicos;
