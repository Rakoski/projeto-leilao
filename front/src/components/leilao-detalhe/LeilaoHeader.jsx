import React from 'react';
import { Chip } from 'primereact/chip';
import './LeilaoHeader.css';

const LeilaoHeader = ({ leilao }) => {
    const formatarPeriodo = (dataInicio, dataFim) => {
        const opcoes = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/Sao_Paulo'
        };

        const inicio = new Date(dataInicio).toLocaleDateString('pt-BR', opcoes);
        const fim = new Date(dataFim).toLocaleDateString('pt-BR', opcoes);

        return `${inicio} → ${fim}`;
    };

    const getStatusClass = (status) => {
        const statusMap = {
            'ABERTO': 'status-aberto',
            'FECHADO': 'status-fechado',
            'ENCERRADO': 'status-encerrado',
            'CANCELADO': 'status-cancelado',
            'AGUARDANDO': 'status-aguardando'
        };
        return statusMap[status] || 'status-default';
    };

    const getStatusLabel = (status) => {
        const statusLabels = {
            'ABERTO': 'Em andamento',
            'FECHADO': 'Fechado',
            'ENCERRADO': 'Encerrado',
            'CANCELADO': 'Cancelado',
            'AGUARDANDO': 'Aguardando abertura'
        };
        return statusLabels[status] || status;
    };

    return (
        <header className="leilao-header">
            <div className="leilao-header__content">
                <div className="leilao-header__main">
                    <h1 className="leilao-header__titulo">{leilao.titulo}</h1>
                    
                    <div className="leilao-header__meta">
                        <div className="leilao-header__categoria">
                            <i className="pi pi-tag"></i>
                            <span>{leilao.categoria?.nome || 'Categoria não informada'}</span>
                        </div>
                        
                        <Chip 
                            label={getStatusLabel(leilao.status)}
                            className={`leilao-header__status ${getStatusClass(leilao.status)}`}
                        />
                    </div>
                </div>

                <div className="leilao-header__periodo">
                    <div className="leilao-header__periodo-item">
                        <i className="pi pi-calendar"></i>
                        <div>
                            <span className="leilao-header__periodo-label">Período do leilão:</span>
                            <span className="leilao-header__periodo-valor">
                                {formatarPeriodo(leilao.dataInicio, leilao.dataFim)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default LeilaoHeader;
