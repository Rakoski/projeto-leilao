import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import CategoriaService from '../../services/CategoriaService';
import { garantirArray } from '../../utils';
import toast from 'react-hot-toast';
import './Categorias.css';

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [categoria, setCategoria] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCategorias, setFilteredCategorias] = useState([]);

    const categoriaService = new CategoriaService();

    useEffect(() => {
        loadCategorias();
    }, []);

    useEffect(() => {
        filterCategorias();
    }, [categorias, searchTerm]);

    const loadCategorias = async () => {
        setLoading(true);
        try {
            const response = await categoriaService.buscarTodos();
            // Extrair array do objeto paginado se necessário
            const categoriasData = response.data?.content || response.data || [];
            setCategorias(garantirArray(categoriasData));
        } catch (error) {
            toast.error('Erro ao carregar categorias');
            console.error('Erro ao carregar categorias:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterCategorias = () => {
        if (!searchTerm) {
            setFilteredCategorias(categorias);
        } else {
            const filtered = categorias.filter(categoria =>
                categoria.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                categoria.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCategorias(filtered);
        }
    };

    const openNew = () => {
        setCategoria({
            nome: '',
            descricao: ''
        });
        setEditMode(false);
        setDialogVisible(true);
    };

    const editCategoria = (categoriaData) => {
        setCategoria({ ...categoriaData });
        setEditMode(true);
        setDialogVisible(true);
    };

    const saveCategoria = async () => {
        try {
            if (!categoria.nome || categoria.nome.trim() === '') {
                toast.error('Nome da categoria é obrigatório');
                return;
            }

            if (editMode) {
                await categoriaService.atualizar(categoria.id, categoria);
                toast.success('Categoria atualizada com sucesso!');
            } else {
                await categoriaService.inserir(categoria);
                toast.success('Categoria criada com sucesso!');
            }
            
            setDialogVisible(false);
            loadCategorias();
        } catch (error) {
            toast.error(editMode ? 'Erro ao atualizar categoria' : 'Erro ao criar categoria');
            console.error('Erro ao salvar categoria:', error);
        }
    };

    const deleteCategoria = (categoriaData) => {
        confirmDialog({
            message: `Tem certeza que deseja excluir a categoria "${categoriaData.nome}"?`,
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await categoriaService.excluir(categoriaData.id);
                    toast.success('Categoria excluída com sucesso!');
                    loadCategorias();
                } catch (error) {
                    toast.error('Erro ao excluir categoria');
                    console.error('Erro ao excluir categoria:', error);
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
                    onClick={() => editCategoria(rowData)}
                    tooltip="Editar"
                />
                <Button 
                    icon="pi pi-trash" 
                    className="p-button-danger p-button-sm"
                    onClick={() => deleteCategoria(rowData)}
                    tooltip="Excluir"
                />
            </div>
        );
    };

    const dateBodyTemplate = (rowData) => {
        return rowData.dataCriacao ? 
            new Date(rowData.dataCriacao).toLocaleDateString('pt-BR') : '-';
    };

    const criadorBodyTemplate = (rowData) => {
        return rowData.criador?.nome || '-';
    };

    const header = (
        <div className="table-header">
            <h2>Gerenciar Categorias</h2>
            <div className="header-actions">
                <span className="p-input-icon-left search-input">
                    <i className="pi pi-search" />
                    <InputText 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        placeholder="Buscar categorias..." 
                    />
                </span>
                <Button 
                    label="Nova Categoria" 
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
            />
            <Button 
                label="Salvar" 
                icon="pi pi-check" 
                onClick={saveCategoria} 
                autoFocus 
            />
        </div>
    );

    return (
        <div className="categorias-container">
            <Toast />
            <ConfirmDialog />
            
            <div className="card">
                <DataTable 
                    value={filteredCategorias} 
                    loading={loading}
                    header={header}
                    responsiveLayout="scroll"
                    paginator 
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} categorias"
                    emptyMessage="Nenhuma categoria encontrada"
                >
                    <Column field="nome" header="Nome" sortable />
                    <Column field="descricao" header="Descrição" sortable />
                    <Column field="criador" header="Criador" body={criadorBodyTemplate} sortable />
                    <Column field="dataCriacao" header="Data Criação" body={dateBodyTemplate} sortable />
                    <Column body={actionBodyTemplate} header="Ações" style={{ width: '120px' }} />
                </DataTable>
            </div>

            <Dialog 
                visible={dialogVisible} 
                style={{ width: '500px' }} 
                header={editMode ? 'Editar Categoria' : 'Nova Categoria'} 
                modal 
                footer={dialogFooter} 
                onHide={() => setDialogVisible(false)}
            >
                <div className="form-container">
                    <div className="field">
                        <label htmlFor="nome">Nome *</label>
                        <InputText 
                            id="nome"
                            value={categoria.nome || ''} 
                            onChange={(e) => setCategoria({...categoria, nome: e.target.value})} 
                            required 
                            className={!categoria.nome ? 'p-invalid' : ''}
                        />
                        {!categoria.nome && (
                            <small className="p-error">Nome é obrigatório</small>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="descricao">Descrição</label>
                        <InputTextarea 
                            id="descricao"
                            value={categoria.descricao || ''} 
                            onChange={(e) => setCategoria({...categoria, descricao: e.target.value})} 
                            rows={4} 
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Categorias;
