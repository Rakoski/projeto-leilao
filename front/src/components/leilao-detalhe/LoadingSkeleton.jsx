import React from 'react';
import { Skeleton } from 'primereact/skeleton';
import './LoadingSkeleton.css';

const LoadingSkeleton = () => {
    return (
        <main className="loading-skeleton">
            <div className="loading-skeleton__container">
                {/* Header Skeleton */}
                <div className="loading-skeleton__header">
                    <div className="loading-skeleton__header-content">
                        <div className="loading-skeleton__header-main">
                            <Skeleton width="60%" height="2rem" className="mb-3" />
                            <div className="loading-skeleton__meta">
                                <Skeleton width="150px" height="1.5rem" />
                                <Skeleton width="120px" height="1.5rem" borderRadius="20px" />
                            </div>
                        </div>
                        <div className="loading-skeleton__periodo">
                            <Skeleton width="100%" height="4rem" />
                        </div>
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="loading-skeleton__content">
                    <div className="loading-skeleton__main">
                        {/* Gallery Skeleton */}
                        <div className="loading-skeleton__gallery">
                            <Skeleton width="100%" height="400px" borderRadius="8px" />
                            <div className="loading-skeleton__thumbnails">
                                <Skeleton width="80px" height="60px" borderRadius="4px" />
                                <Skeleton width="80px" height="60px" borderRadius="4px" />
                                <Skeleton width="80px" height="60px" borderRadius="4px" />
                            </div>
                        </div>

                        {/* Description Skeleton */}
                        <div className="loading-skeleton__description">
                            <Skeleton width="200px" height="1.5rem" className="mb-3" />
                            <Skeleton width="100%" height="1rem" className="mb-2" />
                            <Skeleton width="100%" height="1rem" className="mb-2" />
                            <Skeleton width="80%" height="1rem" className="mb-3" />
                            <Skeleton width="100%" height="1rem" className="mb-2" />
                            <Skeleton width="90%" height="1rem" />
                        </div>
                    </div>

                    {/* Sidebar Skeleton */}
                    <div className="loading-skeleton__sidebar">
                        <div className="loading-skeleton__info-card">
                            <Skeleton width="180px" height="1.5rem" className="mb-3" />
                            
                            {/* Price Info */}
                            <div className="loading-skeleton__price-section">
                                <Skeleton width="100%" height="3rem" borderRadius="8px" className="mb-2" />
                                <Skeleton width="100%" height="2rem" className="mb-2" />
                                <Skeleton width="100%" height="2rem" className="mb-3" />
                            </div>

                            {/* Stats */}
                            <div className="loading-skeleton__stats">
                                <Skeleton width="100%" height="2.5rem" />
                                <Skeleton width="100%" height="2.5rem" />
                            </div>

                            {/* Button */}
                            <Skeleton width="100%" height="3rem" borderRadius="8px" className="mt-3" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default LoadingSkeleton;
