import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import './LeilaoBids.css';

const LeilaoBids = ({ lances }) => {
    const [expandido, setExpandido] = useState(false);

    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const formatarData = (data) => {
        return new Date(data).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/Sao_Paulo'
        });
    };

    const obterIniciais = (nome) => {
        if (!nome) return '??';
        const palavras = nome.trim().split(' ');
        if (palavras.length >= 2) {
            return (palavras[0][0] + palavras[1][0]).toUpperCase();
        }
        return palavras[0].substring(0, 2).toUpperCase();
    };

    const mascarNome = (nome) => {
        if (!nome || nome.length < 3) return nome;
        return nome.substring(0, 2) + '*'.repeat(nome.length - 2);
    };

    // Ordenar lances por valor (maior primeiro) e depois por data (mais recente primeiro)
    const lancesOrdenados = [...lances].sort((a, b) => {
        if (b.valor !== a.valor) {
            return b.valor - a.valor; // Maior valor primeiro
        }
        return new Date(b.dataLance) - new Date(a.dataLance); // Mais recente primeiro
    });

    const lancesExibidos = expandido ? lancesOrdenados : lancesOrdenados;

    const valorBodyTemplate = (rowData) => {
        const isVencedor = rowData.valor === Math.max(...lances.map(l => l.valor));
        return (
            <span className={`leilao-bids__valor ${isVencedor ? 'leilao-bids__valor--vencedor' : ''}`}>
                {formatarMoeda(rowData.valor)}
                {isVencedor && <i className="pi pi-crown leilao-bids__crown"></i>}
            </span>
        );
    };

    const usuarioBodyTemplate = (rowData) => {
        const iniciais = obterIniciais(rowData.usuario?.nome);
        const nome = mascarNome(rowData.usuario?.nome || 'Anônimo');
        
        return (
            <div className="leilao-bids__usuario">
                <div className="leilao-bids__avatar">
                    {iniciais}
                </div>
                <span className="leilao-bids__nome">{nome}</span>
            </div>
        );
    };

    const dataBodyTemplate = (rowData) => {
        return (
            <span className="leilao-bids__data">
                {formatarData(rowData.dataLance)}
            </span>
        );
    };

    if (!lances || lances.length === 0) {
        return (
            <section className="leilao-bids">
                <div className="leilao-bids__card">
                    <h3 className="leilao-bids__title">Histórico de Lances</h3>
                    <div className="leilao-bids__empty">
                        <i className="pi pi-inbox"></i>
                        <p>Ainda não há lances para este leilão.</p>
                        <span>Seja o primeiro a dar um lance!</span>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="leilao-bids">
            <div className="leilao-bids__card">
                <div className="leilao-bids__header">
                    <h3 className="leilao-bids__title">
                        Histórico de Lances
                        <span className="leilao-bids__count">({lances.length})</span>
                    </h3>
                    <div className="leilao-bids__stats">
                        <div className="leilao-bids__stat">
                            <span className="leilao-bids__stat-label">Maior lance:</span>
                            <span className="leilao-bids__stat-value">
                                {formatarMoeda(Math.max(...lances.map(l => l.valor)))}
                            </span>
                        </div>
                        <div className="leilao-bids__stat">
                            <span className="leilao-bids__stat-label">Total de participantes:</span>
                            <span className="leilao-bids__stat-value">
                                {new Set(lances.map(l => l.usuario?.id)).size}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="leilao-bids__table-container">
                    <DataTable 
                        value={lancesExibidos}
                        className="leilao-bids__table"
                        stripedRows
                        size="small"
                        emptyMessage="Nenhum lance encontrado"
                        paginator={false}
                        responsive
                    >
                        <Column 
                            field="valor" 
                            header="Valor" 
                            body={valorBodyTemplate}
                            style={{ width: '25%' }}
                            sortable
                        />
                        <Column 
                            field="usuario" 
                            header="Participante" 
                            body={usuarioBodyTemplate}
                            style={{ width: '40%' }}
                        />
                        <Column 
                            field="dataLance" 
                            header="Data e Hora" 
                            body={dataBodyTemplate}
                            style={{ width: '35%' }}
                            sortable
                        />
                    </DataTable>
                </div>

                {lances.length > 10 && (
                    <div className="leilao-bids__actions">
                        <Button
                            label={expandido ? `Ver menos (mostrando ${lancesExibidos.length})` : `Ver todos os ${lances.length} lances`}
                            icon={expandido ? 'pi pi-chevron-up' : 'pi pi-chevron-down'}
                            className="p-button-text p-button-sm leilao-bids__expand-button"
                            onClick={() => setExpandido(!expandido)}
                        />
                    </div>
                )}

                <div className="leilao-bids__footer">
                    <p className="leilao-bids__disclaimer">
                        <i className="pi pi-info-circle"></i>
                        Os nomes dos participantes são mascarados para preservar a privacidade.
                        Apenas os administradores podem ver as informações completas.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default LeilaoBids;
