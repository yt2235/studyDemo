'use client';

import { useInquiryStore, CartProduct } from '@/store/inquiryStore';
import { useEffect, useState } from 'react';

export default function AddToCartButton({ product, locale }: { product: CartProduct; locale: string }) {
    const { addToCart, removeFromCart, isInCart } = useInquiryStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 opacity-50 cursor-not-allowed whitespace-nowrap w-full">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                 {locale === 'zh' ? '加入询盘' : 'Add to Inquiry'}
            </button>
        );
    }

    const inCart = isInCart(product.id);

    if (inCart) {
        return (
            <button
                onClick={() => removeFromCart(product.id)}
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-green-500 text-white font-semibold shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap w-full"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {locale === 'zh' ? '已加入询盘' : 'Added to Inquiry'}
            </button>
        );
    }

    return (
        <button
            onClick={() => addToCart(product)}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap w-full"
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {locale === 'zh' ? '加入询盘' : 'Add to Inquiry'}
        </button>
    );
}
