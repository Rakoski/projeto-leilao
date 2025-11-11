import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Divider } from 'primereact/divider';
import { TabView, TabPanel } from 'primereact/tabview';
import LeilaoService from '../../services/LeilaoService';
import CategoriaService from '../../services/CategoriaService';
import LeilaoFiltros from '../../components/leilao-filtros/LeilaoFiltros';
import ImagemUpload from '../../components/imagem-upload/ImagemUpload';
import { LoadingState, EmptyState, ErrorState, SearchEmptyState } from '../../components/estados-ui/EstadosUI';
import { useFormValidation, validationRules } from '../../hooks/useFormValidation';
import { useAuth } from '../../contexts/AuthContext';
import { 
    formatarMoeda, 
    formatarData,
    getStatusSeverity, 
    getStatusDisplayText, 
    podeAbrirLeilao, 
    podeCancelarLeilao, 
    podeEncerrarLeilao,
    obterNomeCategoria,
    formatarMensagemErro,
    garantirArray
} from '../../utils';
import toast from 'react-hot-toast';
import './Leiloes.css';

const Leiloes = () => {
    const [leiloes, setLeiloes] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingDialog, setLoadingDialog] = useState(false);
    const [error, setError] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [imagemDialogVisible, setImagemDialogVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [filtros, setFiltros] = useState({});
    const [totalRecords, setTotalRecords] = useState(0);
    const [leilaoSelecionado, setLeilaoSelecionado] = useState(null);
    
    const toast = useRef(null);
    const leilaoService = new LeilaoService();
    const categoriaService = new CategoriaService();
    const { user, isAuthenticated } = useAuth();

    // Validação do formulário
    const leilaoValidationRules = {
        titulo: [
            validationRules.required('Título é obrigatório'),
            validationRules.minLength(3, 'Título deve ter pelo menos 3 caracteres'),
            validationRules.maxLength(100, 'Título deve ter no máximo 100 caracteres')
        ],
        categoria: [
            validationRules.required('Categoria é obrigatória')
        ],
        lanceMinimo: [
            validationRules.required('Lance mínimo é obrigatório'),
            validationRules.minValue(0.01, 'Lance mínimo deve ser maior que zero')
        ],
        valorIncremento: [
            validationRules.required('Valor do incremento é obrigatório'),
            validationRules.minValue(0.01, 'Valor do incremento deve ser maior que zero')
        ],
        dataHoraInicio: [
            validationRules.required('Data de início é obrigatória')
        ],
        dataHoraFim: [
            validationRules.required('Data de fim é obrigatória'),
            validationRules.custom(
                (value, allValues) => !value || !allValues.dataHoraInicio || new Date(value) > new Date(allValues.dataHoraInicio),
                'Data de fim deve ser posterior à data de início'
            )
        ]
    };

    const {
        values: leilao,
        errors: leilaoErrors,
        touched: leilaoTouched,
        isValid: leilaoIsValid,
        setValue: setLeilaoValue,
        setFieldTouched: setLeilaoFieldTouched,
        validateAll: validateLeilao,
        reset: resetLeilao,
        setValues: setLeilaoValues
    } = useFormValidation({
        titulo: '',
        descricao: '',
        precoInicial: null,
        lanceMinimo: null,
        valorIncremento: null,
        dataHoraInicio: null,
        dataHoraFim: null,
        categoria: null
    }, leilaoValidationRules);

    useEffect(() => {
        if (isAuthenticated()) {
            loadLeiloes();
            loadCategorias();
        }
    }, []);

    const loadLeiloes = async (filtrosAplicados = {}) => {
        if (!isAuthenticated()) {
            setError('Usuário não autenticado');
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const response = await leilaoService.buscarComFiltros(filtrosAplicados);
            // Extrair array do objeto paginado
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
                life: 3000
            });
            console.error('Erro ao carregar leilões:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategorias = async () => {
        try {
            const response = await categoriaService.buscarTodos();
            // Trata tanto formato paginado quanto array simples
            const categoriasData = response.data?.content || response.data || [];
            setCategorias(garantirArray(categoriasData));
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            setCategorias([]); // Garante que categorias seja sempre um array
            // Não exibe erro para categorias pois não é crítico
        }
    };

    const handleFilter = (novosFiltros) => {
        setFiltros(novosFiltros);
        loadLeiloes(novosFiltros);
    };

    const handleClearFilters = () => {
        setFiltros({});
        loadLeiloes({});
    };

    const openNew = () => {
        resetLeilao();
        setEditMode(false);
        setDialogVisible(true);
    };

    const openImagemDialog = (leilaoData) => {
        setLeilaoSelecionado(leilaoData);
        setImagemDialogVisible(true);
    };

    const editLeilao = (leilaoData) => {
        console.log('Editando leilão:', leilaoData);
        setLeilaoValues({
            ...leilaoData,
            dataHoraInicio: leilaoData.dataHoraInicio ? new Date(leilaoData.dataHoraInicio) : null,
            dataHoraFim: leilaoData.dataHoraFim ? new Date(leilaoData.dataHoraFim) : null,
            categoria: leilaoData.categoria || null
        });
        setEditMode(true);
        setDialogVisible(true);
    };

    const saveLeilao = async () => {
        // Validação completa do formulário
        if (!validateLeilao()) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Corrija os erros no formulário antes de salvar',
                life: 3000
            });
            return;
        }

        setLoadingDialog(true);
        
        try {
            const leilaoData = {
                ...leilao,
                dataHoraInicio: leilao.dataHoraInicio?.toISOString(),
                dataHoraFim: leilao.dataHoraFim?.toISOString(),
                categoriaId: leilao.categoria?.id || leilao.categoria, // Extrai apenas o ID da categoria
                categoria: undefined // Remove o objeto categoria completo
            };

            // Remove campos undefined para não enviar no payload
            Object.keys(leilaoData).forEach(key => {
                if (leilaoData[key] === undefined) {
                    delete leilaoData[key];
                }
            });

            console.log('Dados sendo enviados para o backend:', leilaoData);

            if (editMode) {
                await leilaoService.atualizar(leilao.id, leilaoData);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Leilão atualizado com sucesso!',
                    life: 3000
                });
            } else {
                await leilaoService.inserir(leilaoData);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Leilão criado com sucesso!',
                    life: 3000
                });
            }
            
            setDialogVisible(false);
            loadLeiloes(filtros);
        } catch (error) {
            const errorMessage = formatarMensagemErro(
                error, 
                editMode ? 'Erro ao atualizar leilão' : 'Erro ao criar leilão'
            );
            
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: errorMessage,
                life: 5000
            });
            console.error('Erro ao salvar leilão:', error);
        } finally {
            setLoadingDialog(false);
        }
    };

    const deleteLeilao = (leilaoData) => {
        confirmDialog({
            message: `Tem certeza que deseja excluir o leilão "${leilaoData.titulo}"?`,
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await leilaoService.excluir(leilaoData.id);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Leilão excluído com sucesso!',
                        life: 3000
                    });
                    loadLeiloes(filtros);
                } catch (error) {
                    const errorMessage = formatarMensagemErro(error, 'Erro ao excluir leilão');
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: errorMessage,
                        life: 5000
                    });
                    console.error('Erro ao excluir leilão:', error);
                }
            }
        });
    };

    const changeStatus = async (leilaoData, action) => {
        try {
            let successMessage = '';
            switch (action) {
                case 'abrir':
                    await leilaoService.abrirLeilao(leilaoData.id);
                    successMessage = 'Leilão aberto com sucesso!';
                    break;
                case 'encerrar':
                    await leilaoService.encerrarLeilao(leilaoData.id);
                    successMessage = 'Leilão encerrado com sucesso!';
                    break;
                case 'cancelar':
                    await leilaoService.cancelarLeilao(leilaoData.id);
                    successMessage = 'Leilão cancelado com sucesso!';
                    break;
                default:
                    return;
            }
            
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: successMessage,
                life: 3000
            });
            loadLeiloes(filtros);
        } catch (error) {
            const errorMessage = formatarMensagemErro(error, `Erro ao ${action} leilão`);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: errorMessage,
                life: 5000
            });
            console.error(`Erro ao ${action} leilão:`, error);
        }
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <Tag 
                value={getStatusDisplayText(rowData.status)} 
                severity={getStatusSeverity(rowData.status)}
            />
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="action-buttons">
                <Button 
                    icon="pi pi-eye" 
                    className="p-button-info p-button-sm"
                    onClick={() => editLeilao(rowData)}
                    tooltip="Visualizar/Editar"
                />
                <Button 
                    icon="pi pi-images" 
                    className="p-button-secondary p-button-sm"
                    onClick={() => openImagemDialog(rowData)}
                    tooltip="Gerenciar Imagens"
                />
                <Button 
                    icon="pi pi-trash" 
                    className="p-button-danger p-button-sm"
                    onClick={() => deleteLeilao(rowData)}
                    tooltip="Excluir"
                />
                {podeAbrirLeilao(rowData.status) && (
                    <Button 
                        icon="pi pi-play" 
                        className="p-button-success p-button-sm"
                        onClick={() => changeStatus(rowData, 'abrir')}
                        tooltip="Abrir Leilão"
                    />
                )}
                {podeEncerrarLeilao(rowData.status) && (
                    <Button 
                        icon="pi pi-stop" 
                        className="p-button-warning p-button-sm"
                        onClick={() => changeStatus(rowData, 'encerrar')}
                        tooltip="Encerrar Leilão"
                    />
                )}
                {podeCancelarLeilao(rowData.status) && (
                    <Button 
                        icon="pi pi-times" 
                        className="p-button-danger p-button-sm"
                        onClick={() => changeStatus(rowData, 'cancelar')}
                        tooltip="Cancelar Leilão"
                    />
                )}
            </div>
        );
    };



    const header = (
        <div className="table-header">
            <div className="header-title">
                <h2>Gerenciar Leilões</h2>
                <span className="total-records">
                    {totalRecords} {totalRecords === 1 ? 'leilão' : 'leilões'} 
                    {Object.keys(filtros).length > 0 && ' (filtrado)'}
                </span>
            </div>
            <div className="header-actions">
                <Button 
                    label="Novo Leilão" 
                    icon="pi pi-plus" 
                    onClick={openNew}
                    className="p-button-success"
                />
            </div>
        </div>
    );

    const dialogFooter = (
        <div>
            <Button 
                label="Cancelar" 
                icon="pi pi-times" 
                onClick={() => setDialogVisible(false)} 
                className="p-button-text"
                disabled={loadingDialog}
            />
            <Button 
                label="Salvar" 
                icon="pi pi-check" 
                onClick={saveLeilao} 
                loading={loadingDialog}
                disabled={!leilaoIsValid}
                autoFocus 
            />
        </div>
    );

    // Verificação de segurança para garantir que leiloes é sempre um array
    const leiloesSeguro = Array.isArray(leiloes) ? leiloes : [];

    // Renderização condicional baseada no estado
    if (!isAuthenticated()) {
        return (
            <ErrorState 
                title="Acesso Negado"
                error="Você precisa estar logado para acessar esta página"
                showRetry={false}
            />
        );
    }

    if (error && leiloesSeguro.length === 0) {
        return (
            <div className="leiloes-container">
                <Toast ref={toast} />
                <ErrorState 
                    title="Erro ao carregar leilões"
                    error={error}
                    onRetry={() => loadLeiloes(filtros)}
                />
            </div>
        );
    }

    return (
        <div className="leiloes-container">
            <Toast ref={toast} />
            <ConfirmDialog />
            
            {/* Filtros */}
            <LeilaoFiltros 
                categorias={categorias}
                onFilter={handleFilter}
                loading={loading}
                initialFilters={filtros}
            />

            <Divider />

            {/* Conteúdo principal */}
            {loading && leiloesSeguro.length === 0 ? (
                <LoadingState message="Carregando leilões..." />
            ) : leiloesSeguro.length === 0 && !loading ? (
                Object.keys(filtros).some(key => filtros[key] !== null && filtros[key] !== '') ? (
                    <SearchEmptyState 
                        searchTerm="os filtros aplicados"
                        onClearSearch={handleClearFilters}
                        onNewItem={openNew}
                        itemType="leilão"
                    />
                ) : (
                    <EmptyState 
                        icon="pi pi-shopping-cart"
                        title="Nenhum leilão encontrado"
                        message="Você ainda não criou nenhum leilão. Comece criando seu primeiro leilão!"
                        actionLabel="Criar Primeiro Leilão"
                        onAction={openNew}
                        showAction={true}
                    />
                )
            ) : (
                <div className="card">
                    <DataTable 
                        value={leiloesSeguro} 
                        loading={loading}
                        header={header}
                        responsiveLayout="scroll"
                        paginator 
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} leilões"
                        emptyMessage="Nenhum leilão encontrado"
                        stripedRows
                        showGridlines
                    >
                        <Column field="titulo" header="Título" sortable />
                        <Column field="categoriaNome" header="Categoria" body={(rowData) => obterNomeCategoria(rowData)} sortable />
                        <Column field="lanceMinimo" header="Lance Mínimo" body={(rowData) => formatarMoeda(rowData.lanceMinimo)} sortable />
                        <Column field="valorIncremento" header="Incremento" body={(rowData) => formatarMoeda(rowData.valorIncremento)} sortable />
                        <Column field="dataHoraInicio" header="Data Início" body={(rowData) => formatarData(rowData.dataHoraInicio)} sortable />
                        <Column field="dataHoraFim" header="Data Fim" body={(rowData) => formatarData(rowData.dataHoraFim)} sortable />
                        <Column field="status" header="Status" body={statusBodyTemplate} sortable />
                        <Column body={actionBodyTemplate} header="Ações" style={{ width: '200px' }} />
                    </DataTable>
                </div>
            )}

            <Dialog 
                visible={dialogVisible} 
                style={{ width: '700px' }} 
                header={editMode ? 'Editar Leilão' : 'Novo Leilão'} 
                modal 
                footer={dialogFooter} 
                onHide={() => !loadingDialog && setDialogVisible(false)}
                closable={!loadingDialog}
            >
                <div className="form-grid">
                    <div className="field">
                        <label htmlFor="titulo">Título *</label>
                        <InputText 
                            id="titulo"
                            value={leilao.titulo || ''} 
                            onChange={(e) => setLeilaoValue('titulo', e.target.value)}
                            onBlur={() => setLeilaoFieldTouched('titulo')}
                            className={leilaoErrors.titulo && leilaoTouched.titulo ? 'p-invalid' : ''}
                            disabled={loadingDialog}
                        />
                        {leilaoErrors.titulo && leilaoTouched.titulo && (
                            <small className="p-error">{leilaoErrors.titulo}</small>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="categoria">Categoria *</label>
                        <Dropdown 
                            id="categoria"
                            value={leilao.categoria} 
                            options={categorias} 
                            onChange={(e) => setLeilaoValue('categoria', e.value)}
                            onBlur={() => setLeilaoFieldTouched('categoria')}
                            optionLabel="nome" 
                            placeholder="Selecione uma categoria"
                            className={leilaoErrors.categoria && leilaoTouched.categoria ? 'p-invalid' : ''}
                            disabled={loadingDialog}
                        />
                        {leilaoErrors.categoria && leilaoTouched.categoria && (
                            <small className="p-error">{leilaoErrors.categoria}</small>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="lanceMinimo">Lance Mínimo *</label>
                        <InputNumber 
                            id="lanceMinimo"
                            value={leilao.lanceMinimo} 
                            onValueChange={(e) => setLeilaoValue('lanceMinimo', e.value)}
                            onBlur={() => setLeilaoFieldTouched('lanceMinimo')}
                            mode="currency" 
                            currency="BRL" 
                            locale="pt-BR"
                            className={leilaoErrors.lanceMinimo && leilaoTouched.lanceMinimo ? 'p-invalid' : ''}
                            disabled={loadingDialog}
                        />
                        {leilaoErrors.lanceMinimo && leilaoTouched.lanceMinimo && (
                            <small className="p-error">{leilaoErrors.lanceMinimo}</small>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="valorIncremento">Valor do Incremento *</label>
                        <InputNumber 
                            id="valorIncremento"
                            value={leilao.valorIncremento} 
                            onValueChange={(e) => setLeilaoValue('valorIncremento', e.value)}
                            onBlur={() => setLeilaoFieldTouched('valorIncremento')}
                            mode="currency" 
                            currency="BRL" 
                            locale="pt-BR"
                            className={leilaoErrors.valorIncremento && leilaoTouched.valorIncremento ? 'p-invalid' : ''}
                            disabled={loadingDialog}
                        />
                        {leilaoErrors.valorIncremento && leilaoTouched.valorIncremento && (
                            <small className="p-error">{leilaoErrors.valorIncremento}</small>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="dataHoraInicio">Data de Início *</label>
                        <Calendar 
                            id="dataHoraInicio"
                            value={leilao.dataHoraInicio} 
                            onChange={(e) => setLeilaoValue('dataHoraInicio', e.value)}
                            onBlur={() => setLeilaoFieldTouched('dataHoraInicio')}
                            showTime 
                            dateFormat="dd/mm/yy"
                            className={leilaoErrors.dataHoraInicio && leilaoTouched.dataHoraInicio ? 'p-invalid' : ''}
                            disabled={loadingDialog}
                        />
                        {leilaoErrors.dataHoraInicio && leilaoTouched.dataHoraInicio && (
                            <small className="p-error">{leilaoErrors.dataHoraInicio}</small>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="dataHoraFim">Data de Fim *</label>
                        <Calendar 
                            id="dataHoraFim"
                            value={leilao.dataHoraFim} 
                            onChange={(e) => setLeilaoValue('dataHoraFim', e.value)}
                            onBlur={() => setLeilaoFieldTouched('dataHoraFim')}
                            showTime 
                            dateFormat="dd/mm/yy"
                            className={leilaoErrors.dataHoraFim && leilaoTouched.dataHoraFim ? 'p-invalid' : ''}
                            disabled={loadingDialog}
                        />
                        {leilaoErrors.dataHoraFim && leilaoTouched.dataHoraFim && (
                            <small className="p-error">{leilaoErrors.dataHoraFim}</small>
                        )}
                    </div>

                    <div className="field field-full">
                        <label htmlFor="descricao">Descrição</label>
                        <InputTextarea 
                            id="descricao"
                            value={leilao.descricao || ''} 
                            onChange={(e) => setLeilaoValue('descricao', e.target.value)}
                            rows={4}
                            disabled={loadingDialog}
                        />
                    </div>

                </div>
            </Dialog>

            {/* Dialog de Imagens */}
            <Dialog 
                visible={imagemDialogVisible} 
                style={{ width: '90vw', height: '80vh' }} 
                header={`Imagens - ${leilaoSelecionado?.titulo || 'Leilão'}`} 
                modal 
                maximizable
                onHide={() => setImagemDialogVisible(false)}
            >
                {leilaoSelecionado && (
                    <ImagemUpload 
                        leilaoId={leilaoSelecionado.id}
                        disabled={loadingDialog}
                    />
                )}
            </Dialog>
        </div>
    );
};

export default Leiloes;
