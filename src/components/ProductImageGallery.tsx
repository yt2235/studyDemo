'use client';

import { useState, useRef, useEffect } from 'react';

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const thumbScrollRef = useRef<HTMLDivElement>(null);

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % images.length);
    };

    // Auto-scroll thumbnails when activeIndex changes
    useEffect(() => {
        if (thumbScrollRef.current) {
            const activeButton = thumbScrollRef.current.children[activeIndex] as HTMLElement;
            if (activeButton) {
                activeButton.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    }, [activeIndex]);

    const scrollThumbnails = (direction: 'left' | 'right') => {
        if (thumbScrollRef.current) {
            const scrollAmount = 200;
            thumbScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shadow-xl flex items-center justify-center">
                <svg className="w-16 h-16 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="group relative aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={images[activeIndex]}
                    alt={`${productName} - ${activeIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Navigation Arrows - More visible now */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.preventDefault(); handlePrev(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/60 dark:bg-black/60 backdrop-blur-md border border-white/20 dark:border-white/10 text-zinc-900 dark:text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-white dark:hover:bg-black hover:scale-110 z-10"
                            aria-label="Previous image"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => { e.preventDefault(); handleNext(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/60 dark:bg-black/60 backdrop-blur-md border border-white/20 dark:border-white/10 text-zinc-900 dark:text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-white dark:hover:bg-black hover:scale-110 z-10"
                            aria-label="Next image"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Image counter badge */}
                {images.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-semibold tracking-wider">
                        {activeIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Strip with Navigation */}
            {images.length > 1 && (
                <div className="relative group/thumbs">
                    {/* Left Scroll Button */}
                    <button
                        onClick={() => scrollThumbnails('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-8 h-8 rounded-full bg-white dark:bg-zinc-900 shadow-md border border-zinc-200 dark:border-zinc-800 flex items-center justify-center z-10 opacity-0 group-hover/thumbs:opacity-100 transition-opacity hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    >
                        <svg className="w-4 h-4 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div
                        ref={thumbScrollRef}
                        className="flex gap-3 overflow-x-auto py-2 px-1 scrollbar-hide no-scrollbar"
                    >
                        {images.map((url, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${index === activeIndex
                                        ? 'border-blue-500 shadow-lg shadow-blue-500/25 scale-105'
                                        : 'border-zinc-200 dark:border-zinc-700 opacity-60 hover:opacity-100 hover:border-zinc-400 dark:hover:border-zinc-500'
                                    }`}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={url}
                                    alt={`${productName} - thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </button>
                        ))}
                    </div>

                    {/* Right Scroll Button */}
                    <button
                        onClick={() => scrollThumbnails('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-8 h-8 rounded-full bg-white dark:bg-zinc-900 shadow-md border border-zinc-200 dark:border-zinc-800 flex items-center justify-center z-10 opacity-0 group-hover/thumbs:opacity-100 transition-opacity hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    >
                        <svg className="w-4 h-4 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}
