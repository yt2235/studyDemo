import { getTranslations, setRequestLocale } from 'next-intl/server';
import { supabase } from '@/supabase';
import { notFound } from 'next/navigation';
import { ProductImageGallery } from '@/components/ProductImageGallery';
import MainNavbar from '@/components/MainNavbar';
import MainFooter from '@/components/MainFooter';
import { parseImageUrl } from '@/lib/image';
import { AppstoreOutlined, FileTextOutlined } from '@ant-design/icons';
import AddToCartButton from '@/components/AddToCartButton';

import { parseIdFromSlug, slugify } from '@/lib/slug';
import { SITE_URL } from '@/lib/site';

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


export async function generateMetadata({ params }: Props) {
    const { locale, id } = await params;
    const t = await getTranslations({ locale, namespace: 'ProductDetail' });

    const actualId = parseIdFromSlug(id);
    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', actualId)
        .single();

    if (!product) {
        return { title: t('notFound') };
    }

    const typedProduct = product as Product;
    const images = parseImageUrl(typedProduct.image_url);
    const mainImage = images.length > 0 ? images[0] : '/logo.png';

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

    const productSlug = `${typedProduct.id}-${slugify(typedProduct.name)}`;

    return {
        title: `${typedProduct.name} - ${displayCategory}`,
        description: (() => {
            const raw = typedProduct.description ?? '';
            // Truncate at a word/punctuation boundary to avoid mid-word cuts
            const MAX = 150;
            const base = `${typedProduct.name} (${displayCategory}) - ${typedProduct.specification ?? ''}. `;
            const remaining = MAX - base.length;
            if (remaining <= 0 || !raw) return base.trim();
            if (raw.length <= remaining) return `${base}${raw}`.trim();
            // Find last space or punctuation before the limit for a clean cut
            const cut = raw.slice(0, remaining);
            const boundary = cut.search(/[\s，。！？,.!?](?=[^\s，。！？,.!?]*$)/);
            const trimmed = boundary > 0 ? cut.slice(0, boundary) : cut;
            return `${base}${trimmed}…`.trim();
        })(),
        keywords: `${typedProduct.name}, ${displayCategory}, medical supplies, health equipment, yichihealth`,
        alternates: {
            canonical: `${SITE_URL}/${locale}/products/${productSlug}`,
            languages: {
                en: `${SITE_URL}/en/products/${productSlug}`,
                zh: `${SITE_URL}/zh/products/${productSlug}`,
                'x-default': `${SITE_URL}/en/products/${productSlug}`,
            },
        },
        openGraph: {
            title: typedProduct.name,
            description: typedProduct.description,
            images: [
                {
                    url: mainImage,
                    width: 800,
                    height: 800,
                    alt: typedProduct.name,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: typedProduct.name,
            description: typedProduct.description,
            images: [mainImage],
        },
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { locale, id } = await params;
    setRequestLocale(locale);

    const t = await getTranslations('ProductDetail');

    const actualId = parseIdFromSlug(id);
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', actualId)
        .single();

    if (error || !product) {
        notFound();
    }

    const typedProduct = product as Product;
    const productImages = parseImageUrl(typedProduct.image_url);
    const productSlug = `${typedProduct.id}-${slugify(typedProduct.name)}`;

    // Only serve the canonical slug URL. Any non-slug format (e.g. pure numeric IDs)
    // returns 404 so Google removes old redirect URLs from its index.
    if (decodeURIComponent(id) !== productSlug) {
        notFound();
    }

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

    const productUrl = `${SITE_URL}/${locale}/products/${productSlug}`;

    const productJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: typedProduct.name,
        image: productImages,
        description: typedProduct.description,
        sku: `PROD-${typedProduct.id}`,
        category: displayCategory,
        brand: {
            '@type': 'Brand',
            name: 'yichihealth'
        },
        offers: {
            '@type': 'Offer',
            url: productUrl,
            priceCurrency: 'USD',
            price: typedProduct.price || '0',
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: 'yichihealth'
            }
        }
    };

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: `${SITE_URL}/${locale}`
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: displayCategory,
                item: `${SITE_URL}/${locale}/products`
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: typedProduct.name,
                item: productUrl
            }
        ]
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-slate-950 transition-colors duration-500">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            {/* Navigation Bar */}
            <MainNavbar locale={locale} />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8 md:py-16">
                {/* Back Button */}
                <a
                    href={`/${locale}/products`}
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
                {/* Product Header: Name & Category Badge (Spans full width) */}
                <div className="flex flex-col gap-4 mb-10 md:mb-16">
                    <div className="flex flex-wrap items-baseline gap-4 md:gap-6">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
                            {typedProduct.name}
                        </h1>
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/50 text-sm font-semibold text-blue-700 dark:text-blue-300 whitespace-nowrap">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            {displayCategory}
                        </span>
                    </div>
                </div>

                {/* Product Detail Layout (Modern Sticky Grid) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start animate-slide-up">
                    {/* Left: Product Image (Sticky on Desktop) */}
                    <div className="lg:col-span-5 w-full sticky top-24 z-10 max-w-lg mx-auto lg:mx-0 flex flex-col gap-6">
                        <ProductImageGallery
                            images={productImages}
                            productName={typedProduct.name}
                        />
                    </div>

                    {/* Right: Unified Product Info */}
                    <div className="lg:col-span-7 flex flex-col">
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-10 shadow-sm border border-zinc-100 dark:border-zinc-800">
                            
                            {/* Specification Section */}
                            {typedProduct.specification && (
                                <div className="mb-10 group">
                                    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
                                        <AppstoreOutlined className="text-lg text-blue-500 transition-transform group-hover:scale-110" />
                                        {t('specification')}
                                    </h3>
                                    <p className="text-xl font-medium text-zinc-900 dark:text-zinc-100 ml-[9px] pl-5 border-l-2 border-blue-500/20 group-hover:border-blue-500 transition-colors">
                                        {typedProduct.specification}
                                    </p>
                                </div>
                            )}

                            {typedProduct.specification && typedProduct.description && (
                                <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800/80 mb-10" />
                            )}

                            {/* Description Section */}
                            {typedProduct.description && (
                                <div className="group">
                                    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-5">
                                        <FileTextOutlined className="text-lg text-blue-500 transition-transform group-hover:scale-110" />
                                        {t('description')}
                                    </h3>
                                    <div className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 whitespace-pre-line ml-[9px] pl-5 border-l-2 border-blue-500/20 group-hover:border-blue-500 transition-colors">
                                        {typedProduct.description}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>

            {/* Floating Action Bar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
                <div className="flex items-center gap-3 p-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-full shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-zinc-200/50 dark:border-zinc-700/50">
                    <div className="w-[160px] sm:w-[200px]">
                        <AddToCartButton 
                            product={{ id: typedProduct.id, name: typedProduct.name, specification: typedProduct.specification }} 
                            locale={locale} 
                        />
                    </div>
                    <a
                        href={`/${locale}/products`}
                        className="w-[160px] sm:w-[200px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm sm:text-base font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 whitespace-nowrap"
                    >
                        {t('viewMore')}
                    </a>
                </div>
            </div>

            {/* Footer */}
            <MainFooter locale={locale} />
        </div>
    );
}
