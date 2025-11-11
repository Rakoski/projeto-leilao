import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Divider } from 'primereact/divider';
import { TabView, TabPanel } from 'primereact/tabview';
import { Chip } from 'primereact/chip';
import PessoaService from '../../services/PessoaService';
import PerfilService from '../../services/PerfilService';
import { LoadingState, EmptyState, ErrorState, SearchEmptyState } from '../../components/estados-ui/EstadosUI';
import { useFormValidation, validationRules } from '../../hooks/useFormValidation';
import { useAuth } from '../../contexts/AuthContext';
import { formatarMensagemErro, garantirArray } from '../../utils';
import './Pessoas.css';

const Pessoas = () => {
    const [pessoas, setPessoas] = useState([]);
    const [perfis, setPerfis] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingDialog, setLoadingDialog] = useState(false);
    const [error, setError] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [perfilDialogVisible, setPerfilDialogVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [filtros, setFiltros] = useState({});
    const [totalRecords, setTotalRecords] = useState(0);
    const [pessoaSelecionada, setPessoaSelecionada] = useState(null);
    const [perfisDisponiveis, setPerfisDisponiveis] = useState([]);
    
    const toast = useRef(null);
    const pessoaService = new PessoaService();
    const perfilService = new PerfilService();
    const { user, isAuthenticated } = useAuth();

    // Validação do formulário de pessoa
    const pessoaValidationRules = {
        nome: [
            validationRules.required('Nome é obrigatório'),
            validationRules.minLength(3, 'Nome deve ter pelo menos 3 caracteres'),
            validationRules.maxLength(100, 'Nome deve ter no máximo 100 caracteres')
        ],
        email: [
            validationRules.required('Email é obrigatório'),
            validationRules.email('Email inválido')
        ],
        senha: [
            validationRules.required('Senha é obrigatória'),
            validationRules.minLength(6, 'Senha deve ter no mínimo 6 caracteres')
        ]
    };

    const {
        values: pessoa,
        errors: pessoaErrors,
        touched: pessoaTouched,
        isValid: pessoaIsValid,
        setValue: setPessoaValue,
        setFieldTouched: setPessoaFieldTouched,
        validateAll: validatePessoa,
        reset: resetPessoa,
        setValues: setPessoaValues
    } = useFormValidation({
        nome: '',
        email: '',
        senha: '',
        ativo: true
    }, pessoaValidationRules);

    useEffect(() => {
        if (isAuthenticated()) {
            loadPessoas();
            loadPerfis();
        }
    }, []);

    const loadPessoas = async (filtrosAplicados = {}) => {
        if (!isAuthenticated()) {
            setError('Usuário não autenticado');
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const response = await pessoaService.buscarComFiltros(filtrosAplicados);
            // Extrair array do objeto paginado
            const pessoasData = response.data?.content || response.data || [];
            setPessoas(garantirArray(pessoasData));
            setTotalRecords(response.data?.totalElements || pessoasData.length || 0);
        } catch (error) {
            const errorMessage = formatarMensagemErro(error, 'Erro ao carregar pessoas');
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

    const loadPerfis = async () => {
        try {
            const response = await perfilService.buscarTodos();
            const perfisData = response.data?.content || response.data || [];
            setPerfis(garantirArray(perfisData));
        } catch (error) {
            console.error('Erro ao carregar perfis:', error);
            setPerfis([]);
        }
    };

    const handleFilter = () => {
        const novosFiltros = {
            nome: filtros.nome || null,
            email: filtros.email || null,
            ativo: filtros.ativo
        };
        setFiltros(novosFiltros);
        loadPessoas(novosFiltros);
    };

    const handleClearFilters = () => {
        setFiltros({});
        loadPessoas({});
    };

    const openNew = () => {
        resetPessoa();
        setEditMode(false);
        setDialogVisible(true);
    };

    const editPessoa = (pessoaData) => {
        setPessoaValues({
            ...pessoaData,
            senha: '' // Não carregar senha existente
        });
        setEditMode(true);
        setDialogVisible(true);
    };

    const savePessoa = async () => {
        if (!validatePessoa()) {
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
            if (editMode) {
                const dadosAtualizacao = {
                    nome: pessoa.nome,
                    email: pessoa.email,
                    ativo: pessoa.ativo
                };
                
                if (pessoa.senha) {
                    dadosAtualizacao.senha = pessoa.senha;
                }

                await pessoaService.atualizar(pessoa.id, dadosAtualizacao);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Pessoa atualizada com sucesso!',
                    life: 3000
                });
            } else {
                await pessoaService.inserir(pessoa);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Pessoa criada com sucesso!',
                    life: 3000
                });
            }
            
            setDialogVisible(false);
            loadPessoas(filtros);
        } catch (error) {
            const errorMessage = formatarMensagemErro(
                error, 
                editMode ? 'Erro ao atualizar pessoa' : 'Erro ao criar pessoa'
            );
            
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: errorMessage,
                life: 5000
            });
        } finally {
            setLoadingDialog(false);
        }
    };

    const deletePessoa = (pessoaData) => {
        confirmDialog({
            message: `Tem certeza que deseja excluir "${pessoaData.nome}"?`,
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await pessoaService.excluir(pessoaData.id);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Pessoa excluída com sucesso!',
                        life: 3000
                    });
                    loadPessoas(filtros);
                } catch (error) {
                    const errorMessage = formatarMensagemErro(error, 'Erro ao excluir pessoa');
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: errorMessage,
                        life: 5000
                    });
                }
            }
        });
    };

    const openPerfilDialog = (pessoaData) => {
        setPessoaSelecionada(pessoaData);
        // Filtrar perfis que a pessoa ainda não possui
        const perfisUsuario = pessoaData.pessoaPerfil?.map(pp => pp.perfil.id) || [];
        const perfisNaoAssociados = perfis.filter(p => !perfisUsuario.includes(p.id));
        setPerfisDisponiveis(perfisNaoAssociados);
        setPerfilDialogVisible(true);
    };

    const adicionarPerfil = async (perfil) => {
        try {
            await pessoaService.adicionarPerfil(pessoaSelecionada.id, perfil.id);
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Perfil adicionado com sucesso!',
                life: 3000
            });
            loadPessoas(filtros);
            setPerfilDialogVisible(false);
        } catch (error) {
            const errorMessage = formatarMensagemErro(error, 'Erro ao adicionar perfil');
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: errorMessage,
                life: 5000
            });
        }
    };

    const removerPerfil = async (pessoaId, perfilId) => {
        confirmDialog({
            message: 'Tem certeza que deseja remover este perfil?',
            header: 'Confirmar Remoção',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await pessoaService.removerPerfil(pessoaId, perfilId);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Perfil removido com sucesso!',
                        life: 3000
                    });
                    loadPessoas(filtros);
                } catch (error) {
                    const errorMessage = formatarMensagemErro(error, 'Erro ao remover perfil');
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: errorMessage,
                        life: 5000
                    });
                }
            }
        });
    };

    // Templates das colunas
    const statusBodyTemplate = (rowData) => {
        return (
            <Tag 
                value={rowData.ativo ? 'Ativo' : 'Inativo'} 
                severity={rowData.ativo ? 'success' : 'danger'}
            />
        );
    };

    const perfisBodyTemplate = (rowData) => {
        const perfisUsuario = rowData.pessoaPerfil || [];
        return (
            <div className="perfis-chips">
                {perfisUsuario.map(pp => (
                    <Chip 
                        key={pp.perfil.id}
                        label={pp.perfil.nome}
                        className="perfil-chip"
                    />
                ))}
                {perfisUsuario.length === 0 && (
                    <span className="no-perfis">Nenhum perfil</span>
                )}
            </div>
        );
    };

    const actionBodyTemplate = (rowData) => {
        const isCurrentUser = user?.id === rowData.id;
        const canEdit = user?.perfis?.includes('ADMIN') || isCurrentUser;
        const canDelete = user?.perfis?.includes('ADMIN') && !isCurrentUser;

        return (
            <div className="action-buttons">
                {canEdit && (
                    <Button 
                        icon="pi pi-pencil" 
                        className="p-button-info p-button-sm"
                        onClick={() => editPessoa(rowData)}
                        tooltip="Editar"
                    />
                )}
                {user?.perfis?.includes('ADMIN') && (
                    <Button 
                        icon="pi pi-users" 
                        className="p-button-warning p-button-sm"
                        onClick={() => openPerfilDialog(rowData)}
                        tooltip="Gerenciar Perfis"
                    />
                )}
                {canDelete && (
                    <Button 
                        icon="pi pi-trash" 
                        className="p-button-danger p-button-sm"
                        onClick={() => deletePessoa(rowData)}
                        tooltip="Excluir"
                    />
                )}
            </div>
        );
    };

    const header = (
        <div className="table-header">
            <div className="header-title">
                <h2>Gerenciar Pessoas</h2>
                <span className="total-records">
                    {totalRecords} {totalRecords === 1 ? 'pessoa' : 'pessoas'} 
                    {Object.keys(filtros).some(key => filtros[key]) && ' (filtrado)'}
                </span>
            </div>
            <div className="header-actions">
                <Button 
                    label="Nova Pessoa" 
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
                onClick={savePessoa} 
                loading={loadingDialog}
                disabled={!pessoaIsValid}
                autoFocus 
            />
        </div>
    );

    const perfilDialogFooter = (
        <div>
            <Button 
                label="Fechar" 
                icon="pi pi-times" 
                onClick={() => setPerfilDialogVisible(false)} 
                className="p-button-text"
            />
        </div>
    );

    // Verificação de segurança
    const pessoasSeguro = Array.isArray(pessoas) ? pessoas : [];

    // Verificação de permissão
    if (!isAuthenticated() || !user?.perfis?.includes('ADMIN')) {
        return (
            <ErrorState 
                title="Acesso Negado"
                error="Apenas administradores podem acessar esta página"
                showRetry={false}
            />
        );
    }

    if (error && pessoasSeguro.length === 0) {
        return (
            <div className="pessoas-container">
                <Toast ref={toast} />
                <ErrorState 
                    title="Erro ao carregar pessoas"
                    error={error}
                    onRetry={() => loadPessoas(filtros)}
                />
            </div>
        );
    }

    return (
        <div className="pessoas-container">
            <Toast ref={toast} />
            <ConfirmDialog />
            
            {/* Filtros */}
            <div className="filtros-card">
                <div className="filtros-content">
                    <div className="filtros-grid">
                        <div className="field">
                            <InputText
                                placeholder="Buscar por nome"
                                value={filtros.nome || ''}
                                onChange={(e) => setFiltros({...filtros, nome: e.target.value})}
                                onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                            />
                        </div>
                        <div className="field">
                            <InputText
                                placeholder="Buscar por email"
                                value={filtros.email || ''}
                                onChange={(e) => setFiltros({...filtros, email: e.target.value})}
                                onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                            />
                        </div>
                        <div className="field">
                            <Dropdown
                                value={filtros.ativo}
                                options={[
                                    { label: 'Todos', value: null },
                                    { label: 'Ativo', value: true },
                                    { label: 'Inativo', value: false }
                                ]}
                                onChange={(e) => setFiltros({...filtros, ativo: e.value})}
                                placeholder="Status"
                            />
                        </div>
                    </div>
                    <div className="filtros-actions">
                        <Button 
                            label="Buscar" 
                            icon="pi pi-search" 
                            onClick={handleFilter}
                            loading={loading}
                        />
                        <Button 
                            label="Limpar" 
                            icon="pi pi-times" 
                            onClick={handleClearFilters}
                            className="p-button-outlined"
                        />
                    </div>
                </div>
            </div>

            <Divider />

            {/* Conteúdo principal */}
            {loading && pessoasSeguro.length === 0 ? (
                <LoadingState message="Carregando pessoas..." />
            ) : pessoasSeguro.length === 0 && !loading ? (
                Object.keys(filtros).some(key => filtros[key]) ? (
                    <SearchEmptyState 
                        searchTerm="os filtros aplicados"
                        onClearSearch={handleClearFilters}
                        onNewItem={openNew}
                        itemType="pessoa"
                    />
                ) : (
                    <EmptyState 
                        icon="pi pi-users"
                        title="Nenhuma pessoa encontrada"
                        message="Comece adicionando a primeira pessoa!"
                        actionLabel="Adicionar Primeira Pessoa"
                        onAction={openNew}
                        showAction={true}
                    />
                )
            ) : (
                <div className="card">
                    <DataTable 
                        value={pessoasSeguro} 
                        loading={loading}
                        header={header}
                        responsiveLayout="scroll"
                        paginator 
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} pessoas"
                        emptyMessage="Nenhuma pessoa encontrada"
                        stripedRows
                        showGridlines
                    >
                        <Column field="nome" header="Nome" sortable />
                        <Column field="email" header="Email" sortable />
                        <Column field="ativo" header="Status" body={statusBodyTemplate} sortable />
                        <Column header="Perfis" body={perfisBodyTemplate} style={{ width: '200px' }} />
                        <Column body={actionBodyTemplate} header="Ações" style={{ width: '150px' }} />
                    </DataTable>
                </div>
            )}

            {/* Dialog de Pessoa */}
            <Dialog 
                visible={dialogVisible} 
                style={{ width: '500px' }} 
                header={editMode ? 'Editar Pessoa' : 'Nova Pessoa'} 
                modal 
                footer={dialogFooter} 
                onHide={() => !loadingDialog && setDialogVisible(false)}
                closable={!loadingDialog}
            >
                <div className="form-grid">
                    <div className="field">
                        <label htmlFor="nome">Nome *</label>
                        <InputText 
                            id="nome"
                            value={pessoa.nome || ''} 
                            onChange={(e) => setPessoaValue('nome', e.target.value)}
                            onBlur={() => setPessoaFieldTouched('nome')}
                            className={pessoaErrors.nome && pessoaTouched.nome ? 'p-invalid' : ''}
                            disabled={loadingDialog}
                        />
                        {pessoaErrors.nome && pessoaTouched.nome && (
                            <small className="p-error">{pessoaErrors.nome}</small>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="email">Email *</label>
                        <InputText 
                            id="email"
                            value={pessoa.email || ''} 
                            onChange={(e) => setPessoaValue('email', e.target.value)}
                            onBlur={() => setPessoaFieldTouched('email')}
                            className={pessoaErrors.email && pessoaTouched.email ? 'p-invalid' : ''}
                            disabled={loadingDialog}
                        />
                        {pessoaErrors.email && pessoaTouched.email && (
                            <small className="p-error">{pessoaErrors.email}</small>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="senha">
                            {editMode ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'}
                        </label>
                        <InputText 
                            id="senha"
                            type="password"
                            value={pessoa.senha || ''} 
                            onChange={(e) => setPessoaValue('senha', e.target.value)}
                            onBlur={() => setPessoaFieldTouched('senha')}
                            className={pessoaErrors.senha && pessoaTouched.senha ? 'p-invalid' : ''}
                            disabled={loadingDialog}
                        />
                        {pessoaErrors.senha && pessoaTouched.senha && (
                            <small className="p-error">{pessoaErrors.senha}</small>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="ativo">Status</label>
                        <Dropdown
                            id="ativo"
                            value={pessoa.ativo}
                            options={[
                                { label: 'Ativo', value: true },
                                { label: 'Inativo', value: false }
                            ]}
                            onChange={(e) => setPessoaValue('ativo', e.value)}
                            disabled={loadingDialog}
                        />
                    </div>
                </div>
            </Dialog>

            {/* Dialog de Perfis */}
            <Dialog 
                visible={perfilDialogVisible} 
                style={{ width: '600px' }} 
                header={`Perfis de ${pessoaSelecionada?.nome}`} 
                modal 
                footer={perfilDialogFooter} 
                onHide={() => setPerfilDialogVisible(false)}
            >
                {pessoaSelecionada && (
                    <TabView>
                        <TabPanel header="Perfis Atuais" leftIcon="pi pi-user">
                            <div className="perfis-atuais">
                                {pessoaSelecionada.pessoaPerfil?.length > 0 ? (
                                    <div className="perfis-list">
                                        {pessoaSelecionada.pessoaPerfil.map(pp => (
                                            <div key={pp.perfil.id} className="perfil-item">
                                                <Chip label={pp.perfil.nome} />
                                                <Button
                                                    icon="pi pi-times"
                                                    className="p-button-danger p-button-sm p-button-text"
                                                    onClick={() => removerPerfil(pessoaSelecionada.id, pp.perfil.id)}
                                                    tooltip="Remover perfil"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-perfis">
                                        <i className="pi pi-user" style={{ fontSize: '2rem', color: '#ccc' }} />
                                        <p>Nenhum perfil associado</p>
                                    </div>
                                )}
                            </div>
                        </TabPanel>
                        
                        <TabPanel header="Adicionar Perfil" leftIcon="pi pi-plus">
                            <div className="adicionar-perfis">
                                {perfisDisponiveis.length > 0 ? (
                                    <div className="perfis-disponiveis">
                                        {perfisDisponiveis.map(perfil => (
                                            <div key={perfil.id} className="perfil-disponivel">
                                                <Chip label={perfil.nome} />
                                                <Button
                                                    icon="pi pi-plus"
                                                    className="p-button-success p-button-sm"
                                                    onClick={() => adicionarPerfil(perfil)}
                                                    tooltip="Adicionar perfil"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-perfis-disponiveis">
                                        <i className="pi pi-check" style={{ fontSize: '2rem', color: '#28a745' }} />
                                        <p>Todos os perfis já foram associados a esta pessoa</p>
                                    </div>
                                )}
                            </div>
                        </TabPanel>
                    </TabView>
                )}
            </Dialog>
        </div>
    );
};

export default Pessoas;
