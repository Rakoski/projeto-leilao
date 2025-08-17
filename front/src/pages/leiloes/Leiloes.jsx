import React, { useState, useEffect } from 'react';
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
import LeilaoService from '../../services/LeilaoService';
import CategoriaService from '../../services/CategoriaService';
import toast from 'react-hot-toast';
import './Leiloes.css';

const Leiloes = () => {
    const [leiloes, setLeiloes] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [leilao, setLeilao] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredLeiloes, setFilteredLeiloes] = useState([]);

    const leilaoService = new LeilaoService();
    const categoriaService = new CategoriaService();

    useEffect(() => {
        loadLeiloes();
        loadCategorias();
    }, []);

    useEffect(() => {
        filterLeiloes();
    }, [leiloes, searchTerm]);

    const loadLeiloes = async () => {
        setLoading(true);
        try {
            const response = await leilaoService.buscarTodos();
            setLeiloes(response.data || []);
        } catch (error) {
            toast.error('Erro ao carregar leilões');
            console.error('Erro ao carregar leilões:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategorias = async () => {
        try {
            const response = await categoriaService.buscarTodos();
            setCategorias(response.data || []);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        }
    };

    const filterLeiloes = () => {
        if (!searchTerm) {
            setFilteredLeiloes(leiloes);
        } else {
            const filtered = leiloes.filter(leilao =>
                leilao.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                leilao.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredLeiloes(filtered);
        }
    };

    const openNew = () => {
        setLeilao({
            titulo: '',
            descricao: '',
            precoInicial: null,
            lanceMinimo: null,
            valorIncremento: null,
            dataHoraInicio: null,
            dataHoraFim: null,
            categoria: null
        });
        setEditMode(false);
        setDialogVisible(true);
    };

    const editLeilao = (leilaoData) => {
        console.log('Editando leilão:', leilaoData);
        setLeilao({
            ...leilaoData,
            dataHoraInicio: leilaoData.dataHoraInicio ? new Date(leilaoData.dataHoraInicio) : null,
            dataHoraFim: leilaoData.dataHoraFim ? new Date(leilaoData.dataHoraFim) : null,
            categoria: leilaoData.categoria || null
        });
        setEditMode(true);
        setDialogVisible(true);
    };

    const saveLeilao = async () => {
        // Validações básicas
        console.log("leilao:", leilao);
        if (!leilao.titulo || !leilao.categoria || !leilao.lanceMinimo || !leilao.valorIncremento || !leilao.dataHoraInicio || !leilao.dataHoraFim) {
            toast.error('Preencha todos os campos obrigatórios');
            return;
        }

        if (leilao.dataHoraInicio >= leilao.dataHoraFim) {
            toast.error('A data de início deve ser anterior à data de fim');
            return;
        }

        try {
            const leilaoData = {
                ...leilao,
                dataHoraInicio: leilao.dataHoraInicio?.toISOString(),
                dataHoraFim: leilao.dataHoraFim?.toISOString()
            };

            if (editMode) {
                await leilaoService.atualizar(leilao.id, leilaoData);
                toast.success('Leilão atualizado com sucesso!');
            } else {
                await leilaoService.inserir(leilaoData);
                toast.success('Leilão criado com sucesso!');
            }
            
            setDialogVisible(false);
            loadLeiloes();
        } catch (error) {
            toast.error(editMode ? 'Erro ao atualizar leilão' : 'Erro ao criar leilão');
            console.error('Erro ao salvar leilão:', error);
        }
    };

    const deleteLeilao = (leilaoData) => {
        confirmDialog({
            message: `Tem certeza que deseja excluir o leilão "${leilaoData.titulo}"?`,
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await leilaoService.excluir(leilaoData.id);
                    toast.success('Leilão excluído com sucesso!');
                    loadLeiloes();
                } catch (error) {
                    toast.error('Erro ao excluir leilão');
                    console.error('Erro ao excluir leilão:', error);
                }
            }
        });
    };

    const changeStatus = async (leilaoData, action) => {
        try {
            switch (action) {
                case 'abrir':
                    await leilaoService.abrirLeilao(leilaoData.id);
                    toast.success('Leilão aberto com sucesso!');
                    break;
                case 'encerrar':
                    await leilaoService.encerrarLeilao(leilaoData.id);
                    toast.success('Leilão encerrado com sucesso!');
                    break;
                case 'cancelar':
                    await leilaoService.cancelarLeilao(leilaoData.id);
                    toast.success('Leilão cancelado com sucesso!');
                    break;
                default:
                    return;
            }
            loadLeiloes();
        } catch (error) {
            toast.error(`Erro ao ${action} leilão`);
            console.error(`Erro ao ${action} leilão:`, error);
        }
    };

    const statusBodyTemplate = (rowData) => {
        const getSeverity = (status) => {
            switch (status) {
                case 'ATIVO': return 'success';
                case 'INATIVO': return 'warning';
                case 'ENCERRADO': return 'info';
                case 'CANCELADO': return 'danger';
                default: return 'secondary';
            }
        };

        return (
            <Tag 
                value={rowData.status} 
                severity={getSeverity(rowData.status)}
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
                    icon="pi pi-trash" 
                    className="p-button-danger p-button-sm"
                    onClick={() => deleteLeilao(rowData)}
                    tooltip="Excluir"
                />
                {rowData.status === 'INATIVO' && (
                    <Button 
                        icon="pi pi-play" 
                        className="p-button-success p-button-sm"
                        onClick={() => changeStatus(rowData, 'abrir')}
                        tooltip="Abrir Leilão"
                    />
                )}
                {rowData.status === 'ATIVO' && (
                    <>
                        <Button 
                            icon="pi pi-stop" 
                            className="p-button-warning p-button-sm"
                            onClick={() => changeStatus(rowData, 'encerrar')}
                            tooltip="Encerrar Leilão"
                        />
                        <Button 
                            icon="pi pi-times" 
                            className="p-button-danger p-button-sm"
                            onClick={() => changeStatus(rowData, 'cancelar')}
                            tooltip="Cancelar Leilão"
                        />
                    </>
                )}
            </div>
        );
    };

    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(rowData.precoInicial);
    };

    const dateBodyTemplate = (rowData, field) => {
        const date = rowData[field];
        return date ? new Date(date).toLocaleDateString('pt-BR') : '-';
    };

    const header = (
        <div className="table-header">
            <h2>Gerenciar Leilões</h2>
            <div className="header-actions">
                <span className="p-input-icon-left search-input">
                    <i className="pi pi-search" />
                    <InputText 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        placeholder="Buscar leilões..." 
                    />
                </span>
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
            />
            <Button 
                label="Salvar" 
                icon="pi pi-check" 
                onClick={saveLeilao} 
                autoFocus 
            />
        </div>
    );

    return (
        <div className="leiloes-container">
            <Toast />
            <ConfirmDialog />
            
            <div className="card">
                <DataTable 
                    value={filteredLeiloes} 
                    loading={loading}
                    header={header}
                    responsiveLayout="scroll"
                    paginator 
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} leilões"
                    emptyMessage="Nenhum leilão encontrado"
                >
                    <Column field="titulo" header="Título" sortable />
                    <Column field="categoria" header="Categoria" sortable />
                    <Column field="lanceMinimo" header="Lance Mínimo" body={(rowData) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rowData.lanceMinimo)} sortable />
                    <Column field="valorIncremento" header="Incremento" body={(rowData) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rowData.valorIncremento)} sortable />
                    <Column field="dataHoraInicio" header="Data Início" body={(rowData) => dateBodyTemplate(rowData, 'dataHoraInicio')} sortable />
                    <Column field="dataHoraFim" header="Data Fim" body={(rowData) => dateBodyTemplate(rowData, 'dataHoraFim')} sortable />
                    <Column field="status" header="Status" body={statusBodyTemplate} sortable />
                    <Column body={actionBodyTemplate} header="Ações" style={{ width: '200px' }} />
                </DataTable>
            </div>

            <Dialog 
                visible={dialogVisible} 
                style={{ width: '700px' }} 
                header={editMode ? 'Editar Leilão' : 'Novo Leilão'} 
                modal 
                footer={dialogFooter} 
                onHide={() => setDialogVisible(false)}
            >
                <div className="form-grid">
                    <div className="field">
                        <label htmlFor="titulo">Título *</label>
                        <InputText 
                            id="titulo"
                            value={leilao.titulo || ''} 
                            onChange={(e) => setLeilao({...leilao, titulo: e.target.value})} 
                            required 
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="categoria">Categoria *</label>
                        <Dropdown 
                            id="categoria"
                            value={leilao.categoria} 
                            options={categorias} 
                            onChange={(e) => setLeilao({...leilao, categoria: e.value})} 
                            optionLabel="nome" 
                            placeholder="Selecione uma categoria"
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="lanceMinimo">Lance Mínimo *</label>
                        <InputNumber 
                            id="lanceMinimo"
                            value={leilao.lanceMinimo} 
                            onValueChange={(e) => setLeilao({...leilao, lanceMinimo: e.value})} 
                            mode="currency" 
                            currency="BRL" 
                            locale="pt-BR"
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="valorIncremento">Valor do Incremento *</label>
                        <InputNumber 
                            id="valorIncremento"
                            value={leilao.valorIncremento} 
                            onValueChange={(e) => setLeilao({...leilao, valorIncremento: e.value})} 
                            mode="currency" 
                            currency="BRL" 
                            locale="pt-BR"
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="dataHoraInicio">Data de Início *</label>
                        <Calendar 
                            id="dataHoraInicio"
                            value={leilao.dataHoraInicio} 
                            onChange={(e) => setLeilao({...leilao, dataHoraInicio: e.value})} 
                            showTime 
                            dateFormat="dd/mm/yy" 
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="dataHoraFim">Data de Fim *</label>
                        <Calendar 
                            id="dataHoraFim"
                            value={leilao.dataHoraFim} 
                            onChange={(e) => setLeilao({...leilao, dataHoraFim: e.value})} 
                            showTime 
                            dateFormat="dd/mm/yy" 
                            required
                        />
                    </div>

                    <div className="field field-full">
                        <label htmlFor="descricao">Descrição</label>
                        <InputTextarea 
                            id="descricao"
                            value={leilao.descricao || ''} 
                            onChange={(e) => setLeilao({...leilao, descricao: e.target.value})} 
                            rows={4} 
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Leiloes;
