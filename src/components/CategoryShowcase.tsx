"use client";

import { useState, useMemo, useEffect, useRef } from "react";

export interface Category {
    id: string;
    name: string;
    parent_id: string | null;
    level: number;
    sort_order: number;
    icon_url: string | null;
    path: string | null;
}

export interface Product {
    id: number;
    name: string;
    category_id: string;
    specification: string;
    image_url: string[];
}

interface Props {
    categories: Category[];
    products: Product[];
    locale: string;
    dict: {
        title: string;
        subtitle: string;
        totalItems: string;
        items: string;
        all: string;
    };
}

// Helper to get all descendant category IDs (including the target ID itself)
function getDescendantIds(categoryId: string, categories: Category[]): string[] {
    const ids = new Set<string>();
    ids.add(categoryId);
    let currentLevelIds = [categoryId];

    while (currentLevelIds.length > 0) {
        const nextLevelIds = categories
            .filter((c) => c.parent_id && currentLevelIds.includes(c.parent_id))
            .map((c) => c.id);
        nextLevelIds.forEach((id) => ids.add(id));
        currentLevelIds = nextLevelIds;
    }

    return Array.from(ids);
}

export function CategoryShowcase({ categories, products, locale, dict }: Props) {
    // Top-level categories
    const l1Cats = useMemo(
        () => categories.filter((c) => c.level === 1).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
        [categories]
    );

    // State for selected categories at each level
    const [activeL1, setActiveL1] = useState<string>("all");
    const [activeL2, setActiveL2] = useState<string | null>(null);
    const [activeL3, setActiveL3] = useState<string | null>(null);

    // Handle L1 change
    const handleL1Change = (id: string) => {
        setActiveL1(id);
        setActiveL2(null);
        setActiveL3(null);
    };

    // Handle L2 change
    const handleL2Change = (id: string | null) => {
        // Toggle off if clicking the already active L2
        if (activeL2 === id && id !== null) {
            setActiveL2(null);
            setActiveL3(null);
        } else {
            setActiveL2(id);
            setActiveL3(null);
        }
    };

    // Derived current L2 & L3 categories
    const currentL2s = useMemo(
        () => {
            if (activeL1 === "all") return [];
            return categories
                .filter((c) => c.level === 2 && c.parent_id === activeL1)
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        },
        [categories, activeL1]
    );

    const currentL3s = useMemo(
        () => {
            if (!activeL2 || activeL1 === "all") return [];
            return categories
                .filter((c) => c.level === 3 && c.parent_id === activeL2)
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        },
        [categories, activeL2, activeL1]
    );

    // Determine the deepest active category to filter products
    const activeDeepestCategoryId = activeL3 || activeL2 || activeL1;

    const validCategoryIds = useMemo(() => {
        if (!activeDeepestCategoryId || activeDeepestCategoryId === "all") return [];
        return getDescendantIds(activeDeepestCategoryId, categories);
    }, [activeDeepestCategoryId, categories]);

    const displayedProducts = useMemo(() => {
        if (activeL1 === "all") return products;
        if (validCategoryIds.length === 0) return [];
        return products.filter((p) => validCategoryIds.includes(p.category_id));
    }, [products, validCategoryIds, activeL1]);

    return (
        <section id="products" className="pb-24 md:pb-32 scroll-mt-20 focus:outline-none">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
                <div className="max-w-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 tracking-tight">
                        {dict.title}
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-base">{dict.subtitle}</p>
                </div>
                <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    {displayedProducts.length} {dict.items}
                </div>
            </div>

            {categories.length === 0 ? (
                <div className="p-12 text-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-500 dark:text-zinc-400">
                    No categories found. Please add categories in the database.
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {/* Level 1 Category Selection */}
                    <div className="z-40">
                        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl shadow-sm dark:shadow-black/20 p-2.5 md:p-3">
                            <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 opacity-100">
                                {locale === 'zh' ? '筛选分类' : 'Filter by Category'}
                            </h3>
                            <div className="flex items-start gap-2 w-full">
                                <div className="flex-1 flex flex-wrap gap-2 md:gap-2.5">
                                    <button
                                        onClick={() => handleL1Change("all")}
                                        className={`whitespace-nowrap transition-all duration-300 rounded-lg font-semibold shrink-0 px-4 py-2 text-sm ${activeL1 === "all"
                                            ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20 scale-[1.02]"
                                            : "bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
                                            }`}
                                    >
                                        {dict.all || (locale === 'zh' ? '全部' : 'All')}
                                    </button>
                                    {l1Cats.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleL1Change(cat.id)}
                                            className={`whitespace-nowrap transition-all duration-300 rounded-lg font-semibold shrink-0 px-4 py-2 text-sm ${activeL1 === cat.id
                                                ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20 scale-[1.02]"
                                                : "bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                        {/* Sidebar: L2 and L3 Categories - Only shown if activeL1 is not 'all' and subcategories exist */}
                        {currentL2s.length > 0 && (
                            <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-3 sticky top-24 lg:top-32 z-30">
                                <div className="bg-white/90 dark:bg-zinc-900/90 lg:bg-white/60 lg:dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl lg:rounded-xl p-3 md:p-3.5 lg:p-4 shadow-sm dark:shadow-black/20 overflow-hidden">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-1.5 lg:pb-0 no-scrollbar">
                                            <button
                                                onClick={() => handleL2Change(null)}
                                                className={`whitespace-nowrap text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-between shrink-0 ${activeL2 === null
                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                                                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 border border-zinc-100 dark:border-transparent"
                                                    }`}
                                            >
                                                {dict.all}
                                            </button>

                                            {currentL2s.map((l2) => {
                                                const isActive = activeL2 === l2.id;
                                                return (
                                                    <div key={l2.id} className="flex flex-col gap-1 shrink-0">
                                                        <button
                                                            onClick={() => handleL2Change(l2.id)}
                                                            className={`whitespace-nowrap text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-between gap-3 group ${isActive
                                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                                                                : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 border border-zinc-100 dark:border-transparent"
                                                                }`}
                                                            title={l2.name}
                                                        >
                                                            <span className="lg:truncate lg:flex-1">{l2.name}</span>
                                                            {categories.some(c => c.level === 3 && c.parent_id === l2.id) && (
                                                                <svg
                                                                    className={`w-3 h-3 transition-transform duration-300 hidden lg:block ${isActive ? 'rotate-90 text-blue-200' : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200'}`}
                                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            )}
                                                        </button>

                                                        {isActive && currentL3s.length > 0 && (
                                                            <div className="hidden lg:block pl-3 mt-0.5 mb-1.5">
                                                                <div className="border-l border-zinc-200 dark:border-zinc-800 pl-2.5 flex flex-col gap-0.5 py-0.5">
                                                                    <button
                                                                        onClick={() => setActiveL3(null)}
                                                                        className={`text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${activeL3 === null
                                                                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                                                                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                                                                            }`}
                                                                    >
                                                                        {dict.all}
                                                                    </button>
                                                                    {currentL3s.map((l3) => (
                                                                        <button
                                                                            key={l3.id}
                                                                            onClick={() => setActiveL3(l3.id)}
                                                                            className={`text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${activeL3 === l3.id
                                                                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-semibold"
                                                                                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                                                                                }`}
                                                                            title={l3.name}
                                                                        >
                                                                            {l3.name}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Mobile L3 Separate Row */}
                                        {activeL2 && currentL3s.length > 0 && (
                                            <div className="lg:hidden flex flex-col gap-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
                                                <div className="flex flex-row gap-1.5 overflow-x-auto pb-1 no-scrollbar p-1">
                                                    <button
                                                        onClick={() => setActiveL3(null)}
                                                        className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${activeL3 === null
                                                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-500"
                                                            : "bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-100 dark:border-zinc-800/50"
                                                            }`}
                                                    >
                                                        {dict.all}
                                                    </button>
                                                    {currentL3s.map((l3) => (
                                                        <button
                                                            key={l3.id}
                                                            onClick={() => setActiveL3(l3.id)}
                                                            className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${activeL3 === l3.id
                                                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-500"
                                                                : "bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-100 dark:border-zinc-800/50"
                                                                }`}
                                                            title={l3.name}
                                                        >
                                                            {l3.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </aside>
                        )}

                        {/* Product Grid Area - Expands when sidebar is hidden */}
                        <div className="flex-1 w-full outline-none focus:outline-none">
                            {displayedProducts.length > 0 ? (
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 outline-none focus:outline-none">
                                    {displayedProducts.map((product) => (
                                        <a
                                            href={`/${locale}/product/${product.id}`}
                                            key={product.id}
                                            className="group flex flex-col bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700/50 cursor-pointer"
                                        >
                                            <div className="aspect-[4/3] relative overflow-hidden bg-zinc-50 dark:bg-zinc-950/50">
                                                <div className="w-full h-full relative">
                                                    {product.image_url.length > 0 ? (
                                                        <>
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={product.image_url[0]}
                                                                alt={product.name}
                                                                loading="lazy"
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                        </>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                                                            <svg className="w-8 h-8 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-4 flex flex-col flex-grow">
                                                <h4 className="text-sm md:text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                                                    {product.name}
                                                </h4>
                                                {product.specification && (
                                                    <div className="flex flex-col gap-1 mt-auto pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                                        <span className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                                                            {product.specification}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-16 flex flex-col items-center justify-center bg-white/40 dark:bg-zinc-900/40 rounded-xl border border-zinc-200/50 border-dashed dark:border-zinc-800/50 backdrop-blur-sm">
                                    <div className="w-16 h-16 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                        </svg>
                                    </div>
                                    <p className="text-zinc-900 dark:text-zinc-100 font-semibold text-lg">No products match right now</p>
                                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 max-w-sm text-center">Try adjusting your subcategory filters or checking a different main category.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
