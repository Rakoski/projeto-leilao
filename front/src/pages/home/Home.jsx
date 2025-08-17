import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LeilaoService from '../../services/LeilaoService';
import CategoriaService from '../../services/CategoriaService';
import './Home.css';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalLeiloes: 0,
        totalCategorias: 0,
        leiloesAtivos: 0,
        leiloesEncerrados: 0
    });
    const [recentLeiloes, setRecentLeiloes] = useState([]);
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);

    const leilaoService = new LeilaoService();
    const categoriaService = new CategoriaService();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            
            // Carregar leilões
            const leiloesResponse = await leilaoService.buscarTodos();
            const leiloes = leiloesResponse.data || [];
            
            // Carregar categorias
            const categoriasResponse = await categoriaService.buscarTodos();
            const categorias = categoriasResponse.data || [];
            
            // Calcular estatísticas
            const leiloesAtivos = leiloes.filter(l => l.status === 'ATIVO').length;
            const leiloesEncerrados = leiloes.filter(l => l.status === 'ENCERRADO').length;
            const leiloesCancelados = leiloes.filter(l => l.status === 'CANCELADO').length;
            const leiloesInativos = leiloes.filter(l => l.status === 'INATIVO').length;
            
            setStats({
                totalLeiloes: leiloes.length,
                totalCategorias: categorias.length,
                leiloesAtivos,
                leiloesEncerrados
            });
            
            // Leilões recentes (últimos 5)
            const recent = leiloes
                .sort((a, b) => new Date(b.dataCriacao || b.dataInicio) - new Date(a.dataCriacao || a.dataInicio))
                .slice(0, 5);
            setRecentLeiloes(recent);
            
            // Dados do gráfico
            setChartData({
                labels: ['Ativos', 'Encerrados', 'Cancelados', 'Inativos'],
                datasets: [
                    {
                        data: [leiloesAtivos, leiloesEncerrados, leiloesCancelados, leiloesInativos],
                        backgroundColor: [
                            '#22c55e',
                            '#3b82f6',
                            '#ef4444',
                            '#f59e0b'
                        ]
                    }
                ]
            });
            
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
        } finally {
            setLoading(false);
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

    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(rowData.precoInicial);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Button 
                icon="pi pi-eye" 
                className="p-button-info p-button-sm"
                onClick={() => navigate('/leiloes')}
                tooltip="Ver detalhes"
            />
        );
    };

    if (loading) {
        return (
            <div className="loading-container">
                <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
            </div>
        );
    }

    return (
        <div className="home-container">
            <div className="welcome-section">
                <h1>Bem-vindo, {user?.nome}!</h1>
                <p>Gerencie seus leilões e categorias através do painel de controle</p>
            </div>

            {/* Cards de Estatísticas */}
            <div className="stats-grid">
                <Card className="stat-card">
                    <div className="stat-content">
                        <div className="stat-icon blue">
                            <i className="pi pi-list"></i>
                        </div>
                        <div className="stat-text">
                            <h3>{stats.totalLeiloes}</h3>
                            <p>Total de Leilões</p>
                        </div>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-content">
                        <div className="stat-icon green">
                            <i className="pi pi-tags"></i>
                        </div>
                        <div className="stat-text">
                            <h3>{stats.totalCategorias}</h3>
                            <p>Total de Categorias</p>
                        </div>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-content">
                        <div className="stat-icon orange">
                            <i className="pi pi-play"></i>
                        </div>
                        <div className="stat-text">
                            <h3>{stats.leiloesAtivos}</h3>
                            <p>Leilões Ativos</p>
                        </div>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-content">
                        <div className="stat-icon purple">
                            <i className="pi pi-stop"></i>
                        </div>
                        <div className="stat-text">
                            <h3>{stats.leiloesEncerrados}</h3>
                            <p>Leilões Encerrados</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Conteúdo Principal */}
            <div className="main-content">
                {/* Gráfico */}
                <Card title="Status dos Leilões" className="chart-card">
                    <Chart 
                        type="doughnut" 
                        data={chartData} 
                        className="chart"
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom'
                                }
                            }
                        }}
                    />
                </Card>

                {/* Leilões Recentes */}
                <Card title="Leilões Recentes" className="recent-card">
                    <DataTable 
                        value={recentLeiloes}
                        responsiveLayout="scroll"
                        emptyMessage="Nenhum leilão encontrado"
                    >
                        <Column field="titulo" header="Título" />
                        <Column field="precoInicial" header="Preço" body={priceBodyTemplate} />
                        <Column field="status" header="Status" body={statusBodyTemplate} />
                        <Column body={actionBodyTemplate} header="Ação" style={{ width: '80px' }} />
                    </DataTable>
                    
                    <div className="card-footer">
                        <Button 
                            label="Ver Todos os Leilões" 
                            icon="pi pi-arrow-right" 
                            onClick={() => navigate('/leiloes')}
                            className="p-button-link"
                        />
                    </div>
                </Card>
            </div>

            {/* Ações Rápidas */}
            <div className="quick-actions">
                <h3>Ações Rápidas</h3>
                <div className="actions-grid">
                    <Button 
                        label="Criar Leilão" 
                        icon="pi pi-plus" 
                        onClick={() => navigate('/leiloes')}
                        className="p-button-success"
                    />
                    <Button 
                        label="Criar Categoria" 
                        icon="pi pi-tag" 
                        onClick={() => navigate('/categorias')}
                        className="p-button-info"
                    />
                    <Button 
                        label="Ver Perfil" 
                        icon="pi pi-user" 
                        onClick={() => navigate('/perfil')}
                        className="p-button-warning"
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;
