import { getTranslations, setRequestLocale } from 'next-intl/server';
import { supabase } from '@/supabase';
import { notFound } from 'next/navigation';
import { ProductImageGallery } from '@/components/ProductImageGallery';
import MainNavbar from '@/components/MainNavbar';
import MainFooter from '@/components/MainFooter';
import { AppstoreOutlined, FileTextOutlined } from '@ant-design/icons';

export const revalidate = 60;

type Props = {
    params: Promise<{ locale: string; id: string }>;
};

interface Product {
    id: number;
    name: string;
    category: string;
    category_id?: string;
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

    // Fetch actual category name if category_id exists
    let displayCategory = typedProduct.category || '';
    if (typedProduct.category_id) {
        const { data: categoryData } = await supabase
            .from('categories')
            .select('name')
            .eq('id', typedProduct.category_id)
            .single();
        if (categoryData && categoryData.name) {
            displayCategory = categoryData.name;
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-slate-950 transition-colors duration-500">
            {/* Navigation Bar */}
            <MainNavbar locale={locale} />

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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                    {/* Left: Product Image */}
                    <div className="animate-slide-in-left lg:col-span-5 max-w-lg mx-auto w-full">
                        <ProductImageGallery
                            images={productImages}
                            productName={typedProduct.name}
                        />
                    </div>

                    {/* Right: Product Info */}
                    <div className="animate-slide-in-right lg:col-span-7 flex flex-col justify-center">
                        {/* Product Name */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight mb-6">
                            {typedProduct.name}
                        </h1>

                        {/* Category Badge */}
                        <div className="mb-8">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/50 text-sm font-medium text-blue-700 dark:text-blue-300">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                {displayCategory}
                            </span>
                        </div>

                        {/* Info Cards */}
                        <div className="space-y-4 mb-10">
                            {/* Specification / Size */}
                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 border border-indigo-100 dark:border-indigo-800/50 transition-transform group-hover:scale-110">
                                    <AppstoreOutlined className="text-2xl text-indigo-600 dark:text-indigo-400" />
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
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 border border-blue-100 dark:border-blue-800/50 transition-transform group-hover:scale-110">
                                        <FileTextOutlined className="text-2xl text-blue-600 dark:text-blue-400" />
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
            <MainFooter locale={locale} />
        </div>
    );
}
