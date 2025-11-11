import React, { useState } from 'react';
import { Galleria } from 'primereact/galleria';
import './LeilaoGallery.css';

const LeilaoGallery = ({ imagens, titulo }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Se não há imagens, mostra placeholder
    if (!imagens || imagens.length === 0) {
        return (
            <section className="leilao-gallery">
                <div className="leilao-gallery__placeholder">
                    <i className="pi pi-image"></i>
                    <span>Nenhuma imagem disponível</span>
                </div>
            </section>
        );
    }

    // Template para a imagem principal
    const itemTemplate = (item) => {
        return (
            <div className="leilao-gallery__item">
                <img 
                    src={item.url} 
                    alt={`${titulo} - Imagem ${item.ordem || 1}`}
                    loading="lazy"
                    className="leilao-gallery__image"
                    onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                    }}
                />
            </div>
        );
    };

    // Template para as miniaturas
    const thumbnailTemplate = (item) => {
        return (
            <div className="leilao-gallery__thumbnail">
                <img 
                    src={item.url} 
                    alt={`Miniatura ${item.ordem || 1}`}
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                    }}
                />
            </div>
        );
    };

    const galleriaOptions = {
        value: imagens,
        activeIndex,
        onItemChange: (e) => setActiveIndex(e.index),
        item: itemTemplate,
        thumbnail: thumbnailTemplate,
        numVisible: Math.min(5, imagens.length),
        responsiveOptions: [
            {
                breakpoint: '768px',
                numVisible: 3
            },
            {
                breakpoint: '480px',
                numVisible: 2
            }
        ],
        showThumbnails: imagens.length > 1,
        showItemNavigators: imagens.length > 1,
        showIndicators: false,
        thumbnailsPosition: 'bottom',
        circular: true,
        autoPlay: false
    };

    return (
        <section className="leilao-gallery">
            <h2 className="leilao-gallery__title">Imagens do leilão</h2>
            
            {imagens.length === 1 ? (
                // Imagem única sem galeria
                <div className="leilao-gallery__single">
                    <img 
                        src={imagens[0].url}
                        alt={`${titulo} - Imagem principal`}
                        loading="lazy"
                        className="leilao-gallery__single-image"
                        onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                        }}
                    />
                </div>
            ) : (
                // Galeria múltipla
                <div className="leilao-gallery__container">
                    <Galleria {...galleriaOptions} />
                </div>
            )}

            {imagens.length > 1 && (
                <div className="leilao-gallery__counter">
                    <span>{activeIndex + 1} de {imagens.length}</span>
                </div>
            )}
        </section>
    );
};

export default LeilaoGallery;
