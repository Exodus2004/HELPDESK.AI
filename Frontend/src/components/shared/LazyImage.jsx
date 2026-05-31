import React, { useState, useEffect, useRef } from 'react';

/**
 * High-performance Lazy Loaded Image component using IntersectionObserver.
 * Reduces initial payload size and improves LCP by only loading images in the viewport.
 */
const LazyImage = ({ 
    src, 
    alt, 
    className = "", 
    placeholder = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxIDEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmMmYyZjIiLz48L3N2Zz4=",
    ...props 
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                rootMargin: '100px', // Start loading 100px before it enters viewport
                threshold: 0.01
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, []);

    return (
        <div 
            ref={imgRef}
            className={`relative overflow-hidden ${className}`}
            style={{ minHeight: isLoaded ? 'auto' : '20px' }}
        >
            {/* Smooth transition from placeholder to real image */}
            <img
                src={isInView ? src : placeholder}
                alt={alt}
                onLoad={() => setIsLoaded(true)}
                className={`transition-opacity duration-500 ease-in-out ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                } ${className}`}
                {...props}
            />
            
            {/* Shimmer effect while loading */}
            {!isLoaded && isInView && (
                <div className="absolute inset-0 animate-pulse bg-slate-200" />
            )}
        </div>
    );
};

export default LazyImage;
