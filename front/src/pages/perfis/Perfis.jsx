import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import PerfilService from '../../services/PerfilService';
import { LoadingState, EmptyState, ErrorState } from '../../components/estados-ui/EstadosUI';
import { useFormValidation, validationRules } from '../../hooks/useFormValidation';
import { useAuth } from '../../contexts/AuthContext';
import { formatarMensagemErro, garantirArray } from '../../utils';
import './Perfis.css';

const Perfis = () => {
    const [perfis, setPerfis] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingDialog, setLoadingDialog] = useState(false);
    const [error, setError] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    
    const toast = useRef(null);
    const perfilService = new PerfilService();
    const { user, isAuthenticated } = useAuth();

    // Validação do formulário
    const perfilValidationRules = {
        nome: [
            validationRules.required('Nome é obrigatório'),
            validationRules.minLength(3, 'Nome deve ter pelo menos 3 caracteres'),
            validationRules.maxLength(50, 'Nome deve ter no máximo 50 caracteres')
        ]
    };

    const {
        values: perfil,
        errors: perfilErrors,
        touched: perfilTouched,
        isValid: perfilIsValid,
        setValue: setPerfilValue,
        setFieldTouched: setPerfilFieldTouched,
        validateAll: validatePerfil,
        reset: resetPerfil,
        setValues: setPerfilValues
    } = useFormValidation({
        nome: '',
        observacao: ''
    }, perfilValidationRules);

    useEffect(() => {
        if (isAuthenticated()) {
            loadPerfis();
        }
    }, []);

    const loadPerfis = async () => {
        if (!isAuthenticated()) {
            setError('Usuário não autenticado');
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const response = await perfilService.buscarTodos();
            const perfisData = response.data?.content || response.data || [];
            setPerfis(garantirArray(perfisData));
        } catch (error) {
            const errorMessage = formatarMensagemErro(error, 'Erro ao carregar perfis');
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

    const openNew = () => {
        resetPerfil();
        setEditMode(false);
        setDialogVisible(true);
    };

    const editPerfil = (perfilData) => {
        setPerfilValues(perfilData);
        setEditMode(true);
        setDialogVisible(true);
    };

    const savePerfil = async () => {
        if (!validatePerfil()) {
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
                await perfilService.atualizar(perfil.id, perfil);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Perfil atualizado com sucesso!',
                    life: 3000
                });
            } else {
                await perfilService.inserir(perfil);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Perfil criado com sucesso!',
                    life: 3000
                });
            }
            
            setDialogVisible(false);
            loadPerfis();
        } catch (error) {
            const errorMessage = formatarMensagemErro(
                error, 
                editMode ? 'Erro ao atualizar perfil' : 'Erro ao criar perfil'
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

    const deletePerfil = (perfilData) => {
        confirmDialog({
            message: `Tem certeza que deseja excluir o perfil "${perfilData.nome}"?`,
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await perfilService.excluir(perfilData.id);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Perfil excluído com sucesso!',
                        life: 3000
                    });
                    loadPerfis();
                } catch (error) {
                    const errorMessage = formatarMensagemErro(error, 'Erro ao excluir perfil');
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

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="action-buttons">
                <Button 
                    icon="pi pi-pencil" 
                    className="p-button-info p-button-sm"
                    onClick={() => editPerfil(rowData)}
                    tooltip="Editar"
                />
                <Button 
                    icon="pi pi-trash" 
                    className="p-button-danger p-button-sm"
                    onClick={() => deletePerfil(rowData)}
                    tooltip="Excluir"
                />
            </div>
        );
    };

    const header = (
        <div className="table-header">
            <div className="header-title">
                <h2>Gerenciar Perfis</h2>
                <span className="total-records">
                    {perfis.length} {perfis.length === 1 ? 'perfil' : 'perfis'}
                </span>
            </div>
            <div className="header-actions">
                <Button 
                    label="Novo Perfil" 
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
                onClick={savePerfil} 
                loading={loadingDialog}
                disabled={!perfilIsValid}
                autoFocus 
            />
        </div>
    );

    // Verificação de segurança
    const perfisSeguro = Array.isArray(perfis) ? perfis : [];

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

    if (error && perfisSeguro.length === 0) {
        return (
            <div className="perfis-container">
                <Toast ref={toast} />
                <ErrorState 
                    title="Erro ao carregar perfis"
                    error={error}
                    onRetry={loadPerfis}
                />
            </div>
        );
    }

    return (
        <div className="perfis-container">
            <Toast ref={toast} />
            <ConfirmDialog />
            
            {/* Conteúdo principal */}
            {loading && perfisSeguro.length === 0 ? (
                <LoadingState message="Carregando perfis..." />
            ) : perfisSeguro.length === 0 && !loading ? (
                <EmptyState 
                    icon="pi pi-shield"
                    title="Nenhum perfil encontrado"
                    message="Comece criando o primeiro perfil de usuário!"
                    actionLabel="Criar Primeiro Perfil"
                    onAction={openNew}
                    showAction={true}
                />
            ) : (
                <div className="card">
                    <DataTable 
                        value={perfisSeguro} 
                        loading={loading}
                        header={header}
                        responsiveLayout="scroll"
                        stripedRows
                        showGridlines
                        emptyMessage="Nenhum perfil encontrado"
                    >
                        <Column field="nome" header="Nome" sortable />
                        <Column field="observacao" header="Observação" />
                        <Column body={actionBodyTemplate} header="Ações" style={{ width: '120px' }} />
                    </DataTable>
                </div>
            )}

            {/* Dialog de Perfil */}
            <Dialog 
                visible={dialogVisible} 
                style={{ width: '500px' }} 
                header={editMode ? 'Editar Perfil' : 'Novo Perfil'} 
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
                            value={perfil.nome || ''} 
                            onChange={(e) => setPerfilValue('nome', e.target.value)}
                            onBlur={() => setPerfilFieldTouched('nome')}
                            className={perfilErrors.nome && perfilTouched.nome ? 'p-invalid' : ''}
                            disabled={loadingDialog}
                            placeholder="Ex: ADMIN, VENDEDOR, COMPRADOR"
                        />
                        {perfilErrors.nome && perfilTouched.nome && (
                            <small className="p-error">{perfilErrors.nome}</small>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="observacao">Observação</label>
                        <InputTextarea 
                            id="observacao"
                            value={perfil.observacao || ''} 
                            onChange={(e) => setPerfilValue('observacao', e.target.value)}
                            rows={3}
                            disabled={loadingDialog}
                            placeholder="Descrição do perfil e suas permissões..."
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Perfis;
