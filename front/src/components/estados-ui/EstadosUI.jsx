import React from 'react';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import './EstadosUI.css';

export const LoadingState = ({ message = 'Carregando...', size = 'normal' }) => {
    return (
        <div className={`loading-state ${size}`}>
            <ProgressSpinner />
            <p>{message}</p>
        </div>
    );
};

export const EmptyState = ({ 
    icon = 'pi pi-inbox',
    title = 'Nenhum resultado encontrado',
    message = 'Não há dados para exibir no momento.',
    actionLabel,
    onAction,
    showAction = false
}) => {
    return (
        <Card className="empty-state">
            <div className="empty-content">
                <i className={`${icon} empty-icon`}></i>
                <h3>{title}</h3>
                <p>{message}</p>
                {showAction && actionLabel && onAction && (
                    <Button 
                        label={actionLabel}
                        onClick={onAction}
                        className="p-button-outlined"
                    />
                )}
            </div>
        </Card>
    );
};

export const ErrorState = ({ 
    error = 'Ocorreu um erro inesperado',
    title = 'Erro',
    onRetry,
    showRetry = true
}) => {
    return (
        <Card className="error-state">
            <div className="error-content">
                <i className="pi pi-exclamation-triangle error-icon"></i>
                <h3>{title}</h3>
                <p>{error}</p>
                {showRetry && onRetry && (
                    <Button 
                        label="Tentar Novamente"
                        icon="pi pi-refresh"
                        onClick={onRetry}
                        className="p-button-outlined"
                    />
                )}
            </div>
        </Card>
    );
};

export const SearchEmptyState = ({ 
    searchTerm,
    onClearSearch,
    onNewItem,
    itemType = 'item'
}) => {
    return (
        <Card className="empty-state search-empty">
            <div className="empty-content">
                <i className="pi pi-search empty-icon"></i>
                <h3>Nenhum resultado para "{searchTerm}"</h3>
                <p>Não encontramos nenhum {itemType} que corresponda à sua busca.</p>
                <div className="empty-actions">
                    <Button 
                        label="Limpar Busca"
                        icon="pi pi-times"
                        onClick={onClearSearch}
                        className="p-button-outlined"
                    />
                    {onNewItem && (
                        <Button 
                            label={`Novo ${itemType}`}
                            icon="pi pi-plus"
                            onClick={onNewItem}
                        />
                    )}
                </div>
            </div>
        </Card>
    );
};
