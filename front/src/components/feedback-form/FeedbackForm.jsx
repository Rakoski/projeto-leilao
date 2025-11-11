import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import FeedbackService from '../../services/FeedbackService';
import './FeedbackForm.css';

const FeedbackForm = ({ 
    visible, 
    onHide, 
    leilaoId, 
    vendedorId, 
    compradorId,
    leilaoTitulo,
    onSuccess 
}) => {
    const [nota, setNota] = useState(0);
    const [comentario, setComentario] = useState('');
    const [loading, setLoading] = useState(false);
    
    const feedbackService = new FeedbackService();

    const salvarFeedback = async () => {
        if (nota === 0) {
            Toast.current?.show({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Selecione uma nota de 1 a 5 estrelas',
                life: 3000
            });
            return;
        }

        setLoading(true);
        try {
            const dados = {
                leilaoId,
                vendedorId,
                compradorId,
                nota,
                comentario: comentario.trim()
            };

            await feedbackService.criarFeedback(dados);
            
            Toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Feedback enviado com sucesso!',
                life: 3000
            });

            // Reset form
            setNota(0);
            setComentario('');
            
            if (onSuccess) {
                onSuccess();
            }
            onHide();
        } catch (error) {
            console.error('Erro ao enviar feedback:', error);
            Toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: error.response?.data?.message || 'Erro ao enviar feedback',
                life: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    const dialogFooter = (
        <div>
            <Button
                label="Cancelar"
                icon="pi pi-times"
                onClick={onHide}
                className="p-button-text"
                disabled={loading}
            />
            <Button
                label="Enviar Feedback"
                icon="pi pi-check"
                onClick={salvarFeedback}
                loading={loading}
                disabled={nota === 0}
                autoFocus
            />
        </div>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: '500px' }}
            header="Avaliar Vendedor"
            modal
            footer={dialogFooter}
            onHide={onHide}
            closable={!loading}
        >
            <div className="feedback-form">
                <div className="leilao-info">
                    <h4>Leilão: {leilaoTitulo}</h4>
                    <p>Avalie sua experiência com este vendedor</p>
                </div>

                <div className="field">
                    <label htmlFor="nota">Nota *</label>
                    <div className="rating-container">
                        <Rating
                            id="nota"
                            value={nota}
                            onChange={(e) => setNota(e.value)}
                            stars={5}
                            cancel={false}
                            disabled={loading}
                        />
                        <span className="rating-text">
                            {nota === 0 && 'Selecione uma nota'}
                            {nota === 1 && 'Muito ruim'}
                            {nota === 2 && 'Ruim'}
                            {nota === 3 && 'Regular'}
                            {nota === 4 && 'Bom'}
                            {nota === 5 && 'Excelente'}
                        </span>
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="comentario">Comentário (opcional)</label>
                    <InputTextarea
                        id="comentario"
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        rows={4}
                        placeholder="Conte como foi sua experiência com este vendedor..."
                        maxLength={500}
                        disabled={loading}
                    />
                    <small className="char-count">
                        {comentario.length}/500 caracteres
                    </small>
                </div>
            </div>
        </Dialog>
    );
};

export default FeedbackForm;
