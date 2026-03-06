import { getTranslations, setRequestLocale } from 'next-intl/server';
import { supabase } from '@/supabase';
import { notFound } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { ProductImageGallery } from '@/components/ProductImageGallery';

export const revalidate = 60;

type Props = {
    params: Promise<{ locale: string; id: string }>;
};

interface Product {
    id: number;
    name: string;
    category: string;
    specification: string;
    image_url: string;
    price: number;
    description: string;
}

function parseImageUrl(raw: string): string[] {
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return raw ? [raw] : [];
    }
}

export async function generateMetadata({ params }: Props) {
    const { locale, id } = await params;
    const t = await getTranslations({ locale, namespace: 'ProductDetail' });

    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (!product) {
        return { title: t('notFound') };
    }

    return {
        title: (product as Product).name,
        description: `${(product as Product).name} - ${(product as Product).specification}`,
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { locale, id } = await params;
    setRequestLocale(locale);

    const t = await getTranslations('ProductDetail');
    const tHome = await getTranslations('HomePage');

    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !product) {
        notFound();
    }

    const typedProduct = product as Product;
    const productImages = parseImageUrl(typedProduct.image_url);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-slate-950 transition-colors duration-500">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <a href={`/${locale}`} className="flex items-center gap-3 group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25 transition-transform duration-300 group-hover:scale-110">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </div>
                            <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100 tracking-tight">
                                GlobalTrade
                            </span>
                        </a>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        <a href={`/${locale}#products`} className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {tHome('nav.products')}
                        </a>
                        <a href={`/${locale}#contact`} className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {tHome('nav.contact')}
                        </a>
                    </div>
                    <div className="flex items-center gap-3">
                        <LocaleSwitcher />
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8 md:py-16">
                {/* Back Button */}
                <a
                    href={`/${locale}#products`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 group"
                >
                    <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    {t('backToProducts')}
                </a>

                {/* Product Detail Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                    {/* Left: Product Image */}
                    <div className="animate-slide-in-left">
                        <ProductImageGallery
                            images={productImages}
                            productName={typedProduct.name}
                        />
                    </div>

                    {/* Right: Product Info */}
                    <div className="animate-slide-in-right flex flex-col justify-center">
                        {/* Product Name */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight mb-6">
                            {typedProduct.name}
                        </h1>

                        {/* Category Badge */}
                        <div className="mb-8">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/50 text-sm font-medium text-blue-700 dark:text-blue-300">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                {typedProduct.category}
                            </span>
                        </div>

                        {/* Info Cards */}
                        <div className="space-y-4 mb-10">
                            {/* Specification / Size */}
                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/20">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                                        {t('specification')}
                                    </div>
                                    <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                                        {typedProduct.specification}
                                    </div>
                                </div>
                            </div>


                            {/* Description */}
                            {typedProduct.description && (
                                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                                            {t('description')}
                                        </div>
                                        <div className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                                            {typedProduct.description}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href={`/${locale}#contact`}
                                className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {t('contactInquiry')}
                            </a>
                            <a
                                href={`/${locale}#products`}
                                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                {t('viewMore')}
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-500 mt-16">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                </div>
                                <span className="font-bold text-zinc-900 dark:text-zinc-100">GlobalTrade</span>
                            </div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                {tHome('footer.companyDesc')}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">{tHome('footer.quickLinks')}</h4>
                            <div className="space-y-2">
                                <a href={`/${locale}#products`} className="block text-sm text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{tHome('nav.products')}</a>
                                <a href={`/${locale}#contact`} className="block text-sm text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{tHome('nav.contact')}</a>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">{tHome('footer.contactInfo')}</h4>
                            <div className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                                <p>📧 info@globaltrade.com</p>
                                <p>📱 +86 138-0000-0000</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 text-center text-sm text-zinc-500 dark:text-zinc-500">
                        © {new Date().getFullYear()} GlobalTrade. {tHome('footer.rights')}
                    </div>
                </div>
            </footer>
        </div>
    );
}
