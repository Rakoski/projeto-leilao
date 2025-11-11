import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { STATUS_OPTIONS, gerarOpcoesCategoria, isDataValida, compararDatas } from '../../utils';
import './LeilaoFiltros.css';

const LeilaoFiltros = ({ 
    categorias = [], 
    onFilter, 
    loading = false,
    initialFilters = {}
}) => {
    const [filtros, setFiltros] = useState({
        titulo: '',
        status: null,
        categoriaId: null,
        categoriaNome: '',
        dataHoraInicioFrom: null,
        dataHoraInicioTo: null,
        dataHoraFimFrom: null,
        dataHoraFimTo: null,
        lanceMinFrom: null,
        lanceMinTo: null,
        ...initialFilters
    });

    const [filtrosAtivos, setFiltrosAtivos] = useState(0);

    const statusOptions = STATUS_OPTIONS;
    const categoriaOptions = gerarOpcoesCategoria(categorias);

    useEffect(() => {
        const ativos = Object.values(filtros).filter(value => 
            value !== null && value !== undefined && value !== ''
        ).length;
        setFiltrosAtivos(ativos);
    }, [filtros]);

    const handleFiltroChange = (campo, valor) => {
        const novosFiltros = { ...filtros, [campo]: valor };
        setFiltros(novosFiltros);
        
        // Auto-aplicar filtros em tempo real para alguns campos
        if (['titulo', 'status', 'categoriaId'].includes(campo)) {
            onFilter(novosFiltros);
        }
    };

    const aplicarFiltros = () => {
        onFilter(filtros);
    };

    const limparFiltros = () => {
        const filtrosLimpos = {
            titulo: '',
            status: null,
            categoriaId: null,
            categoriaNome: '',
            dataHoraInicioFrom: null,
            dataHoraInicioTo: null,
            dataHoraFimFrom: null,
            dataHoraFimTo: null,
            lanceMinFrom: null,
            lanceMinTo: null
        };
        setFiltros(filtrosLimpos);
        onFilter(filtrosLimpos);
    };

    const validarIntervaloData = (dataInicio, dataFim) => {
        if (isDataValida(dataInicio) && isDataValida(dataFim) && compararDatas(dataInicio, dataFim) >= 0) {
            return 'A data de início deve ser anterior à data de fim';
        }
        return null;
    };

    const validarIntervaloValor = (valorMin, valorMax) => {
        if (valorMin && valorMax && valorMin > valorMax) {
            return 'O valor mínimo deve ser menor que o valor máximo';
        }
        return null;
    };

    return (
        <Card className="filtros-card">
            <div className="filtros-header">
                <h3>
                    <i className="pi pi-filter mr-2"></i>
                    Filtros {filtrosAtivos > 0 && <span className="filtros-count">({filtrosAtivos})</span>}
                </h3>
                <div className="filtros-actions">
                    <Button 
                        label="Aplicar" 
                        icon="pi pi-check" 
                        onClick={aplicarFiltros}
                        loading={loading}
                        size="small"
                    />
                    <Button 
                        label="Limpar" 
                        icon="pi pi-times" 
                        onClick={limparFiltros}
                        className="p-button-outlined"
                        size="small"
                    />
                </div>
            </div>

            <div className="filtros-grid">
                {/* Filtros básicos sempre visíveis */}
                <div className="field">
                    <label htmlFor="titulo">Título do Leilão</label>
                    <InputText 
                        id="titulo"
                        value={filtros.titulo}
                        onChange={(e) => handleFiltroChange('titulo', e.target.value)}
                        placeholder="Digite o título..."
                    />
                </div>

                <div className="field">
                    <label htmlFor="status">Status</label>
                    <Dropdown 
                        id="status"
                        value={filtros.status}
                        options={statusOptions}
                        onChange={(e) => handleFiltroChange('status', e.value)}
                        placeholder="Selecione o status"
                    />
                </div>

                <div className="field">
                    <label htmlFor="categoria">Categoria</label>
                    <Dropdown 
                        id="categoria"
                        value={filtros.categoriaId}
                        options={categoriaOptions}
                        onChange={(e) => handleFiltroChange('categoriaId', e.value)}
                        placeholder="Selecione a categoria"
                    />
                </div>
            </div>

            {/* Filtros avançados em accordion */}
            <Accordion className="filtros-avancados">
                <AccordionTab header="Filtros Avançados">
                    <div className="filtros-grid">
                        <div className="field-group">
                            <h4>Período de Início do Leilão</h4>
                            <div className="field-row">
                                <div className="field">
                                    <label htmlFor="dataInicioFrom">De</label>
                                    <Calendar 
                                        id="dataInicioFrom"
                                        value={filtros.dataHoraInicioFrom}
                                        onChange={(e) => handleFiltroChange('dataHoraInicioFrom', e.value)}
                                        showTime
                                        dateFormat="dd/mm/yy"
                                        placeholder="Data início"
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="dataInicioTo">Até</label>
                                    <Calendar 
                                        id="dataInicioTo"
                                        value={filtros.dataHoraInicioTo}
                                        onChange={(e) => handleFiltroChange('dataHoraInicioTo', e.value)}
                                        showTime
                                        dateFormat="dd/mm/yy"
                                        placeholder="Data fim"
                                    />
                                </div>
                            </div>
                            {validarIntervaloData(filtros.dataHoraInicioFrom, filtros.dataHoraInicioTo) && (
                                <small className="p-error">
                                    {validarIntervaloData(filtros.dataHoraInicioFrom, filtros.dataHoraInicioTo)}
                                </small>
                            )}
                        </div>

                        <div className="field-group">
                            <h4>Período de Fim do Leilão</h4>
                            <div className="field-row">
                                <div className="field">
                                    <label htmlFor="dataFimFrom">De</label>
                                    <Calendar 
                                        id="dataFimFrom"
                                        value={filtros.dataHoraFimFrom}
                                        onChange={(e) => handleFiltroChange('dataHoraFimFrom', e.value)}
                                        showTime
                                        dateFormat="dd/mm/yy"
                                        placeholder="Data início"
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="dataFimTo">Até</label>
                                    <Calendar 
                                        id="dataFimTo"
                                        value={filtros.dataHoraFimTo}
                                        onChange={(e) => handleFiltroChange('dataHoraFimTo', e.value)}
                                        showTime
                                        dateFormat="dd/mm/yy"
                                        placeholder="Data fim"
                                    />
                                </div>
                            </div>
                            {validarIntervaloData(filtros.dataHoraFimFrom, filtros.dataHoraFimTo) && (
                                <small className="p-error">
                                    {validarIntervaloData(filtros.dataHoraFimFrom, filtros.dataHoraFimTo)}
                                </small>
                            )}
                        </div>

                        <div className="field-group">
                            <h4>Faixa de Lance Mínimo</h4>
                            <div className="field-row">
                                <div className="field">
                                    <label htmlFor="lanceMinFrom">Valor Mínimo</label>
                                    <InputNumber 
                                        id="lanceMinFrom"
                                        value={filtros.lanceMinFrom}
                                        onValueChange={(e) => handleFiltroChange('lanceMinFrom', e.value)}
                                        mode="currency"
                                        currency="BRL"
                                        locale="pt-BR"
                                        placeholder="R$ 0,00"
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="lanceMinTo">Valor Máximo</label>
                                    <InputNumber 
                                        id="lanceMinTo"
                                        value={filtros.lanceMinTo}
                                        onValueChange={(e) => handleFiltroChange('lanceMinTo', e.value)}
                                        mode="currency"
                                        currency="BRL"
                                        locale="pt-BR"
                                        placeholder="R$ 0,00"
                                    />
                                </div>
                            </div>
                            {validarIntervaloValor(filtros.lanceMinFrom, filtros.lanceMinTo) && (
                                <small className="p-error">
                                    {validarIntervaloValor(filtros.lanceMinFrom, filtros.lanceMinTo)}
                                </small>
                            )}
                        </div>
                    </div>
                </AccordionTab>
            </Accordion>
        </Card>
    );
};

export default LeilaoFiltros;
