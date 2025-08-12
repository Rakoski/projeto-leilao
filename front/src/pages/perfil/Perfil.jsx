import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import PerfilService from "../../services/PerfilService";


const Perfil = () => {
    const [perfis, setPerfis] = useState([]);
    const [perfil, setPerfil] = useState({ nome: "" });
    const [dialogVisible, setDialogVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);

    const perfilService = new PerfilService();

    useEffect(() => {
        carregarPerfis();
    }, []);

    const carregarPerfis = async () => {
        setLoading(true);
        try {
            const data = await perfilService.buscarTodos();
            console.log(data);
            setPerfis(data.data.content);
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao buscar os perfis!",
            });
        } finally {
            setLoading(false);
        }
    };

    const abrirNovo = () => {
        setPerfil({ nome: "" });
        setDialogVisible(true);
        setIsEdit(false);
    };

    const esconderDialog = () => {
        setDialogVisible(false);
    };

    const salvarPerfil = async () => {
        try {
            if (isEdit) {
                await perfilService.alterar(perfil);
                toast.current.show({ severity: "success", summary: "Atualizado", detail: "Perfil atualizado com sucesso!" });
            } else {
                await perfilService.inserir(perfil);
                toast.current.show({ severity: "success", summary: "Criado", detail: "Perfil criado com sucesso!" });
            }
            carregarPerfis();
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao salvar perfil",
            });
        } finally {
            esconderDialog();
        }
    };

    const editarPerfil = (perfil) => {
        setPerfil({ ...perfil });
        setDialogVisible(true);
        setIsEdit(true);
    };

    const confirmarExclusaoPerfil = (perfil) => {
        confirmDialog({
            message: `Remover o perfil "${perfil.nome}"?`,
            header: "Confirmação",
            icon: "pi pi-exclamation-triangle",
            accept: () => excluirPerfil(perfil),
        });
    };

    const excluirPerfil = async (perfil) => {
        try {
            await perfilService.excluir(perfil.id);
            toast.current.show({ severity: "warn", summary: "Removido", detail: "Perfil removido com sucesso" });
            carregarPerfis();
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao remover o perfil",
            });
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => editarPerfil(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger"
                    onClick={() => confirmarExclusaoPerfil(rowData)}
                />
            </>
        );
    };

    const dialogFooter = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={esconderDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-text" onClick={salvarPerfil} />
        </div>
    );

    return (
        <div className="p-grid p-justify-center">
            <Toast ref={toast} />
            <ConfirmDialog acceptLabel="Sim" rejectLabel="Não" />

            <Button label="Novo Perfil" icon="pi pi-plus" className="p-button-success" onClick={abrirNovo} />

            <DataTable
                value={perfis}
                loading={loading}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
            >
                <Column field="nome" header="Nome"></Column>
                <Column body={actionBodyTemplate} header="Ações"></Column>
            </DataTable>

            <Dialog
                visible={dialogVisible}
                style={{ width: "50vw" }}
                header={isEdit ? "Editar Perfil" : "Novo Perfil"}
                modal
                footer={dialogFooter}
                onHide={esconderDialog}
            >
                <div className="field">
                    <label htmlFor="nome">Nome: </label>
                    <InputText
                        id="nome"
                        value={perfil.nome}
                        onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })}
                        required
                        className="w-full"
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default Perfil;