import React, { useState, useRef } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Galleria } from 'primereact/galleria';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import ImagemService from '../../services/ImagemService';
import './ImagemUpload.css';

const ImagemUpload = ({ leilaoId, onImagensUpdate, disabled = false }) => {
    const [imagens, setImagens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [imagemSelecionada, setImagemSelecionada] = useState(0);
    
    const toast = useRef(null);
    const imagemService = new ImagemService();

    const carregarImagens = async () => {
        try {
            const response = await imagemService.listarPorLeilao(leilaoId);
            const imagensData = response.data || [];
            setImagens(imagensData);
            if (onImagensUpdate) {
                onImagensUpdate(imagensData);
            }
        } catch (error) {
            console.error('Erro ao carregar imagens:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao carregar imagens',
                life: 3000
            });
        }
    };

    React.useEffect(() => {
        if (leilaoId) {
            carregarImagens();
        }
    }, [leilaoId]);

    const onUpload = async (event) => {
        setLoading(true);
        try {
            const file = event.files[0];
            await imagemService.uploadImagem(leilaoId, file);
            
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Imagem enviada com sucesso!',
                life: 3000
            });
            
            carregarImagens();
        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao enviar imagem',
                life: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    const excluirImagem = (imagem) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir esta imagem?',
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await imagemService.excluirImagem(imagem.id);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Imagem excluída com sucesso!',
                        life: 3000
                    });
                    carregarImagens();
                } catch (error) {
                    console.error('Erro ao excluir imagem:', error);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Erro ao excluir imagem',
                        life: 5000
                    });
                }
            }
        });
    };

    const definirPrincipal = async (imagem) => {
        try {
            await imagemService.definirImagemPrincipal(leilaoId, imagem.id);
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Imagem principal definida!',
                life: 3000
            });
            carregarImagens();
        } catch (error) {
            console.error('Erro ao definir imagem principal:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao definir imagem principal',
                life: 5000
            });
        }
    };

    const itemTemplate = (item) => {
        return (
            <div className="imagem-item">
                <img 
                    src={item.url} 
                    alt={item.nome}
                    style={{ width: '100%', height: '400px', objectFit: 'cover' }} 
                />
                {item.principal && (
                    <Tag 
                        value="Principal" 
                        severity="success" 
                        className="imagem-principal-tag"
                    />
                )}
            </div>
        );
    };

    const thumbnailTemplate = (item) => {
        return (
            <img 
                src={item.url} 
                alt={item.nome}
                style={{ width: '60px', height: '60px', objectFit: 'cover' }} 
            />
        );
    };

    const imagensComAcoes = imagens.map(imagem => ({
        ...imagem,
        acoes: (
            <div className="imagem-acoes">
                {!imagem.principal && (
                    <Button
                        icon="pi pi-star"
                        className="p-button-success p-button-sm"
                        tooltip="Definir como principal"
                        onClick={() => definirPrincipal(imagem)}
                        disabled={disabled}
                    />
                )}
                <Button
                    icon="pi pi-trash"
                    className="p-button-danger p-button-sm"
                    tooltip="Excluir"
                    onClick={() => excluirImagem(imagem)}
                    disabled={disabled}
                />
            </div>
        )
    }));

    return (
        <div className="imagem-upload-container">
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="upload-header">
                <h3>Imagens do Leilão</h3>
                <Button
                    label="Visualizar Galeria"
                    icon="pi pi-images"
                    onClick={() => setDialogVisible(true)}
                    disabled={imagens.length === 0}
                    className="p-button-outlined"
                />
            </div>

            {!disabled && (
                <FileUpload
                    mode="basic"
                    accept="image/*"
                    maxFileSize={5000000} // 5MB
                    onUpload={onUpload}
                    auto
                    chooseLabel="Selecionar Imagem"
                    className="upload-button"
                    disabled={loading}
                />
            )}

            <div className="imagens-grid">
                {imagensComAcoes.map((imagem, index) => (
                    <div key={imagem.id} className="imagem-card">
                        <img 
                            src={imagem.url} 
                            alt={imagem.nome}
                            onClick={() => {
                                setImagemSelecionada(index);
                                setDialogVisible(true);
                            }}
                        />
                        {imagem.principal && (
                            <Tag 
                                value="Principal" 
                                severity="success" 
                                className="imagem-principal-tag"
                            />
                        )}
                        {!disabled && imagem.acoes}
                    </div>
                ))}
            </div>

            {imagens.length === 0 && (
                <div className="empty-images">
                    <i className="pi pi-image" style={{ fontSize: '3rem', color: '#ccc' }} />
                    <p>Nenhuma imagem adicionada</p>
                </div>
            )}

            <Dialog
                visible={dialogVisible}
                style={{ width: '90vw' }}
                header="Galeria de Imagens"
                onHide={() => setDialogVisible(false)}
                maximizable
            >
                {imagens.length > 0 && (
                    <Galleria
                        value={imagens}
                        activeIndex={imagemSelecionada}
                        onItemChange={(e) => setImagemSelecionada(e.index)}
                        item={itemTemplate}
                        thumbnail={thumbnailTemplate}
                        numVisible={5}
                        circular
                        showItemNavigators
                        showThumbnails={imagens.length > 1}
                    />
                )}
            </Dialog>
        </div>
    );
};

export default ImagemUpload;
