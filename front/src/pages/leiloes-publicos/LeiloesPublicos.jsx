import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Accordion, AccordionTab } from 'primereact/accordion';
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
    garantirArray,
    STATUS_OPTIONS,
    gerarOpcoesCategoria,
    isDataValida,
    compararDatas
} from '../../utils';
import './LeiloesPublicos.css';

const LeiloesPublicos = () => {
    const [leiloes, setLeiloes] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filtros e busca
    const [filtros, setFiltros] = useState({
        titulo: '',
        status: null,
        categoriaId: null,
        dataHoraInicioFrom: null,
        dataHoraInicioTo: null,
        dataHoraFimFrom: null,
        dataHoraFimTo: null,
        lanceMinFrom: null,
        lanceMinTo: null
    });
    const [ordenacao, setOrdenacao] = useState('terminaEm');
    const [mostrarEncerrados, setMostrarEncerrados] = useState(false);
    const [filtrosAtivos, setFiltrosAtivos] = useState(0);
    
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

    const statusOptions = STATUS_OPTIONS;
    const categoriaOptions = gerarOpcoesCategoria(categorias);

    useEffect(() => {
        loadCategorias();
    }, []);

    useEffect(() => {
        const ativos = Object.values(filtros).filter(value => 
            value !== null && value !== undefined && value !== ''
        ).length;
        setFiltrosAtivos(ativos);
    }, [filtros]);

    useEffect(() => {
        loadLeiloes();
    }, [filtros, ordenacao, mostrarEncerrados, first, rows]);

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
            const { sortBy, sortDir } = getOrderByField();
            const filtrosRequest = {
                ...filtros,
                status: mostrarEncerrados ? filtros.status : 'ABERTO',
                page: Math.floor(first / rows),
                size: rows,
                sortBy,
                sortDir
            };

            // Remove filtros nulos/vazios
            Object.keys(filtrosRequest).forEach(key => {
                const value = filtrosRequest[key];
                if (value === null || value === undefined || value === '') {
                    delete filtrosRequest[key];
                }
            });

            const response = await leilaoService.buscarPublicos(filtrosRequest);
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
                return { sortBy: 'dataHoraFim', sortDir: 'ASC' };
            case 'maisRecentes':
                return { sortBy: 'dataHoraInicio', sortDir: 'DESC' };
            case 'menorPreco':
                return { sortBy: 'lanceMinimo', sortDir: 'ASC' };
            case 'maiorPreco':
                return { sortBy: 'lanceMinimo', sortDir: 'DESC' };
            default:
                return { sortBy: 'dataHoraFim', sortDir: 'ASC' };
        }
    };

    const handleFiltroChange = (campo, valor) => {
        const novosFiltros = { ...filtros, [campo]: valor };
        setFiltros(novosFiltros);
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
        setFiltros({
            titulo: '',
            status: null,
            categoriaId: null,
            dataHoraInicioFrom: null,
            dataHoraInicioTo: null,
            dataHoraFimFrom: null,
            dataHoraFimTo: null,
            lanceMinFrom: null,
            lanceMinTo: null
        });
        setOrdenacao('terminaEm');
        setMostrarEncerrados(false);
        setFirst(0);
    };

    const validarIntervaloData = (dataInicio, dataFim) => {
        if (isDataValida(dataInicio) && isDataValida(dataFim) && compararDatas(dataInicio, dataFim) >= 0) {
            return 'A data de início deve ser anterior à data de fim';
        }
        return null;
    };

    const validarIntervaloValor = (valorMin, valorMax) => {
        if (valorMin && valorMax && valorMin > valorMax) {
            return 'O valor mínimo deve ser menor que o valor máximo';
        }
        return null;
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
        const hasFilters = filtrosAtivos > 0 || mostrarEncerrados;
        
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
                    <div className="filtros-card">
                        <div className="filtros-header">
                            <h3>
                                <i className="pi pi-filter mr-2"></i>
                                Filtros {filtrosAtivos > 0 && <span className="filtros-count">({filtrosAtivos})</span>}
                            </h3>
                            <div className="filtros-actions-header">
                                <Button 
                                    label="Limpar" 
                                    icon="pi pi-times" 
                                    onClick={clearFilters}
                                    className="p-button-outlined p-button-sm"
                                    disabled={filtrosAtivos === 0 && !mostrarEncerrados}
                                />
                            </div>
                        </div>

                        <div className="filtros-grid">
                            {/* Filtros básicos sempre visíveis */}
                            <div className="field">
                                <label htmlFor="titulo">Título do Leilão</label>
                                <InputText 
                                    id="titulo"
                                    value={filtros.titulo}
                                    onChange={(e) => handleFiltroChange('titulo', e.target.value)}
                                    placeholder="Digite o título..."
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="status">Status</label>
                                <Dropdown 
                                    id="status"
                                    value={filtros.status}
                                    options={statusOptions}
                                    onChange={(e) => handleFiltroChange('status', e.value)}
                                    placeholder="Todos os status"
                                    showClear
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="categoria">Categoria</label>
                                <Dropdown 
                                    id="categoria"
                                    value={filtros.categoriaId}
                                    options={categoriaOptions}
                                    onChange={(e) => handleFiltroChange('categoriaId', e.value)}
                                    placeholder="Todas as categorias"
                                    showClear
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="ordenacao-filter">Ordenar por:</label>
                                <Dropdown
                                    id="ordenacao-filter"
                                    value={ordenacao}
                                    options={ordenacaoOptions}
                                    onChange={handleOrdenacaoChange}
                                />
                            </div>

                            <div className="field field-checkbox">
                                <div className="checkbox-container">
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

                        {/* Filtros avançados em accordion */}
                        <Accordion className="filtros-avancados">
                            <AccordionTab header="Filtros Avançados">
                                <div className="filtros-grid">
                                    <div className="field-group">
                                        <h4>Período de Início do Leilão</h4>
                                        <div className="field-row">
                                            <div className="field">
                                                <label htmlFor="dataInicioFrom">De</label>
                                                <Calendar 
                                                    id="dataInicioFrom"
                                                    value={filtros.dataHoraInicioFrom}
                                                    onChange={(e) => handleFiltroChange('dataHoraInicioFrom', e.value)}
                                                    showTime
                                                    dateFormat="dd/mm/yy"
                                                    placeholder="Data início"
                                                />
                                            </div>
                                            <div className="field">
                                                <label htmlFor="dataInicioTo">Até</label>
                                                <Calendar 
                                                    id="dataInicioTo"
                                                    value={filtros.dataHoraInicioTo}
                                                    onChange={(e) => handleFiltroChange('dataHoraInicioTo', e.value)}
                                                    showTime
                                                    dateFormat="dd/mm/yy"
                                                    placeholder="Data fim"
                                                />
                                            </div>
                                        </div>
                                        {validarIntervaloData(filtros.dataHoraInicioFrom, filtros.dataHoraInicioTo) && (
                                            <small className="p-error">
                                                {validarIntervaloData(filtros.dataHoraInicioFrom, filtros.dataHoraInicioTo)}
                                            </small>
                                        )}
                                    </div>

                                    <div className="field-group">
                                        <h4>Período de Fim do Leilão</h4>
                                        <div className="field-row">
                                            <div className="field">
                                                <label htmlFor="dataFimFrom">De</label>
                                                <Calendar 
                                                    id="dataFimFrom"
                                                    value={filtros.dataHoraFimFrom}
                                                    onChange={(e) => handleFiltroChange('dataHoraFimFrom', e.value)}
                                                    showTime
                                                    dateFormat="dd/mm/yy"
                                                    placeholder="Data início"
                                                />
                                            </div>
                                            <div className="field">
                                                <label htmlFor="dataFimTo">Até</label>
                                                <Calendar 
                                                    id="dataFimTo"
                                                    value={filtros.dataHoraFimTo}
                                                    onChange={(e) => handleFiltroChange('dataHoraFimTo', e.value)}
                                                    showTime
                                                    dateFormat="dd/mm/yy"
                                                    placeholder="Data fim"
                                                />
                                            </div>
                                        </div>
                                        {validarIntervaloData(filtros.dataHoraFimFrom, filtros.dataHoraFimTo) && (
                                            <small className="p-error">
                                                {validarIntervaloData(filtros.dataHoraFimFrom, filtros.dataHoraFimTo)}
                                            </small>
                                        )}
                                    </div>

                                    <div className="field-group">
                                        <h4>Faixa de Lance Mínimo</h4>
                                        <div className="field-row">
                                            <div className="field">
                                                <label htmlFor="lanceMinFrom">Valor Mínimo</label>
                                                <InputNumber 
                                                    id="lanceMinFrom"
                                                    value={filtros.lanceMinFrom}
                                                    onValueChange={(e) => handleFiltroChange('lanceMinFrom', e.value)}
                                                    mode="currency"
                                                    currency="BRL"
                                                    locale="pt-BR"
                                                    placeholder="R$ 0,00"
                                                />
                                            </div>
                                            <div className="field">
                                                <label htmlFor="lanceMinTo">Valor Máximo</label>
                                                <InputNumber 
                                                    id="lanceMinTo"
                                                    value={filtros.lanceMinTo}
                                                    onValueChange={(e) => handleFiltroChange('lanceMinTo', e.value)}
                                                    mode="currency"
                                                    currency="BRL"
                                                    locale="pt-BR"
                                                    placeholder="R$ 0,00"
                                                />
                                            </div>
                                        </div>
                                        {validarIntervaloValor(filtros.lanceMinFrom, filtros.lanceMinTo) && (
                                            <small className="p-error">
                                                {validarIntervaloValor(filtros.lanceMinFrom, filtros.lanceMinTo)}
                                            </small>
                                        )}
                                    </div>
                                </div>
                            </AccordionTab>
                        </Accordion>
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
