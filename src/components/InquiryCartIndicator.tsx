'use client';

import { useInquiryStore } from '@/store/inquiryStore';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function InquiryCartIndicator({ locale }: { locale: string }) {
    const { cart, removeFromCart } = useInquiryStore();
    const t = useTranslations('HomePage');
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close popover if cart becomes empty
    useEffect(() => {
        if (cart.length === 0) {
            setIsOpen(false);
        }
    }, [cart.length]);

    if (!mounted || cart.length === 0) return null;

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
            {/* Popover */}
            {isOpen && (
                <div className="mb-4 w-80 sm:w-96 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-slide-up origin-bottom-right">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            {locale === 'zh' ? '询盘清单' : 'Inquiry List'}
                        </h3>
                        <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 rounded-full">
                            {cart.length} {locale === 'zh' ? '项' : 'items'}
                        </span>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto p-2">
                        {cart.map((product) => (
                            <div key={product.id} className="flex items-center justify-between gap-3 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors group">
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                        {product.name}
                                    </p>
                                    {product.specification && (
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                                            {product.specification}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeFromCart(product.id)}
                                    className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                                    title={locale === 'zh' ? '移除' : 'Remove'}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800">
                        <Link
                            href={`/${locale}/inquiry`}
                            onClick={() => setIsOpen(false)}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                        >
                            {locale === 'zh' ? '发起询盘' : 'Proceed to Inquire'}
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl transition-all duration-300 group ${
                    isOpen 
                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:scale-105'
                        : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-500/50 hover:-translate-y-1'
                }`}
            >
                <div className="relative">
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    )}
                    {!isOpen && (
                        <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-blue-600">
                            {cart.length}
                        </span>
                    )}
                </div>
                {!isOpen && (
                    <span className="font-bold hidden sm:inline-block">
                        {locale === 'zh' ? '查看询盘清单' : 'View Inquiry List'}
                    </span>
                )}
            </button>
        </div>
    );
}
