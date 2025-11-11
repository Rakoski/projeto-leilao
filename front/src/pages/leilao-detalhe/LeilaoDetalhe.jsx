import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import LeilaoService from '../../services/LeilaoService';
import LeilaoHeader from '../../components/leilao-detalhe/LeilaoHeader';
import LeilaoGallery from '../../components/leilao-detalhe/LeilaoGallery';
import LeilaoInfo from '../../components/leilao-detalhe/LeilaoInfo';
import LeilaoDescription from '../../components/leilao-detalhe/LeilaoDescription';
import LeilaoBids from '../../components/leilao-detalhe/LeilaoBids';
import LoadingSkeleton from '../../components/leilao-detalhe/LoadingSkeleton';
import NotFound from '../../components/leilao-detalhe/NotFound';

import './LeilaoDetalhe.css';

const LeilaoDetalhe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [leilao, setLeilao] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const leilaoService = new LeilaoService();

    useEffect(() => {
        carregarLeilao();
    }, [id]);

    const carregarLeilao = async () => {
        try {
            setLoading(true);
            setError(false);
            
            const response = await leilaoService.buscarPorId(id);
            
            if (response.status === 200) {
                setLeilao(response.data);
            } else {
                setError(true);
            }
        } catch (error) {
            console.error('Erro ao carregar leilão:', error);
            if (error.response?.status === 404) {
                setError(true);
            } else {
                toast.error('Erro ao carregar dados do leilão');
                setError(true);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (error || !leilao) {
        return <NotFound />;
    }

    const metaTitle = `${leilao.titulo} — Leilões`;
    const metaDescription = leilao.descricaoResumida || `Leilão de ${leilao.titulo} na categoria ${leilao.categoria?.nome}`;

    // Atualizar título da página
    useEffect(() => {
        document.title = metaTitle;
        
        // Atualizar meta description se existir
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', metaDescription);
        }
    }, [metaTitle, metaDescription]);

    return (
        <main className="leilao-detalhe">
                <div className="leilao-detalhe__container">
                    <LeilaoHeader leilao={leilao} />
                    
                    <div className="leilao-detalhe__content">
                        <div className="leilao-detalhe__main">
                            <LeilaoGallery imagens={leilao.imagens} titulo={leilao.titulo} />
                            <LeilaoDescription leilao={leilao} />
                            {leilao.lances && leilao.lances.length > 0 && (
                                <LeilaoBids lances={leilao.lances} />
                            )}
                        </div>
                        
                        <aside className="leilao-detalhe__sidebar">
                            <LeilaoInfo leilao={leilao} />
                        </aside>
                    </div>
                </div>
            </main>
    );
};

export default LeilaoDetalhe;
