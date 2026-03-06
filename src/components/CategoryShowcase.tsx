"use client";

import { useState, useMemo } from "react";

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

export function CategoryShowcase({ categories, products, locale, dict }: Props) {
    const l1Cats = useMemo(
        () => categories.filter((c) => c.level === 1).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
        [categories]
    );

    const [activeL1, setActiveL1] = useState<string>(l1Cats[0]?.id || "");

    const currentL2s = useMemo(
        () =>
            categories
                .filter((c) => c.level === 2 && c.parent_id === activeL1)
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
        [categories, activeL1]
    );

    return (
        <section id="products" className="pb-24 md:pb-32 scroll-mt-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div className="max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3 tracking-tight">
                        {dict.title}
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-lg">{dict.subtitle}</p>
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    {products.length} {dict.totalItems}
                </div>
            </div>

            {categories.length === 0 ? (
                <div className="p-12 text-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-500 dark:text-zinc-400">
                    No categories found. Please add categories in the database.
                </div>
            ) : (
                <div className="flex flex-col gap-12">
                    {/* Level 1 Navigation (Premium Tabs) */}
                    <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800 sticky top-16 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md pt-4">
                        {l1Cats.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveL1(cat.id)}
                                className={`whitespace-nowrap px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 relative ${
                                    activeL1 === cat.id
                                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md"
                                        : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Level 2 Sections */}
                    <div className="flex flex-col gap-16">
                        {currentL2s.length === 0 ? (
                            <div className="p-12 text-center bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 border-dashed dark:border-zinc-800">
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                                    No secondary categories found for this selection.
                                </p>
                            </div>
                        ) : (
                            currentL2s.map((l2) => (
                                <L2Section
                                    key={l2.id}
                                    l2Category={l2}
                                    allCategories={categories}
                                    allProducts={products}
                                    locale={locale}
                                    dict={dict}
                                />
                            ))
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}

// Separate component for each L2 Section to maintain local L3 active state
function L2Section({
    l2Category,
    allCategories,
    allProducts,
    locale,
    dict,
}: {
    l2Category: Category;
    allCategories: Category[];
    allProducts: Product[];
    locale: string;
    dict: Props["dict"];
}) {
    const l3Cats = useMemo(
        () =>
            allCategories
                .filter((c) => c.level === 3 && c.parent_id === l2Category.id)
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
        [allCategories, l2Category.id]
    );

    const [activeL3, setActiveL3] = useState<string | null>(null);

    const displayedProducts = useMemo(() => {
        return allProducts.filter((p) => {
            if (activeL3) {
                return p.category_id === activeL3;
            }
            // If "All" is selected, include products strictly in L2, or in any of its L3 child categories
            const validL3Ids = l3Cats.map((c) => c.id);
            return p.category_id === l2Category.id || validL3Ids.includes(p.category_id);
        });
    }, [allProducts, activeL3, l2Category.id, l3Cats]);

    // Only hide section if there are truly no products in this L2 at all
    const hasAnyProducts = useMemo(() => {
        const validL3Ids = l3Cats.map(c => c.id);
        return allProducts.some(p => p.category_id === l2Category.id || validL3Ids.includes(p.category_id));
    }, [allProducts, l2Category.id, l3Cats]);

    if (!hasAnyProducts && l3Cats.length === 0) return null;

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* L2 Header */}
            <div className="flex items-center gap-4">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {l2Category.name}
                </h3>
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
            </div>

            {/* L3 Navigation (Pills) */}
            {l3Cats.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setActiveL3(null)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                            activeL3 === null
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        }`}
                    >
                        {dict.all}
                    </button>
                    {l3Cats.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveL3(cat.id)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                                activeL3 === cat.id
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Products Grid */}
            {displayedProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-2">
                    {displayedProducts.map((product) => (
                        <a
                            href={`/${locale}/product/${product.id}`}
                            key={product.id}
                            className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-800/50 cursor-pointer"
                        >
                            {/* Image */}
                            <div className="aspect-[4/3] relative overflow-hidden bg-zinc-50 dark:bg-zinc-900/50 p-2">
                                <div className="w-full h-full rounded-xl overflow-hidden relative">
                                    {product.image_url.length > 0 ? (
                                        <>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={product.image_url[0]}
                                                alt={product.name}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/5 transition-colors duration-500" />
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                                            <svg
                                                className="w-8 h-8 text-zinc-300 dark:text-zinc-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 flex flex-col flex-grow">
                                <h4 className="text-sm md:text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                    {product.name}
                                </h4>
                                <div className="flex flex-col gap-1 mt-auto">
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                                        {product.specification}
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="p-8 text-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 border-dashed dark:border-zinc-800/80">
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        No products match the selected category.
                    </p>
                </div>
            )}
        </div>
    );
}
