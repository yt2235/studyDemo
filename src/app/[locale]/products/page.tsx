import { getTranslations, setRequestLocale } from 'next-intl/server';
import { supabase } from '@/supabase';
import { CategoryShowcase, Category, Product } from '@/components/CategoryShowcase';
import MainNavbar from '@/components/MainNavbar';
import MainFooter from '@/components/MainFooter';
import { parseImageUrl } from '@/lib/image';

export const revalidate = 60;

type Props = {
    params: Promise<{ locale: string }>;
};

interface ProductRaw {
    id: number;
    name: string;
    category_id: string;
    specification: string;
    image_url: string;
    category: string;
}

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });

    return {
        title: t('productsTitle'),
        description: t('description'),
        alternates: {
            canonical: `/${locale}/products`,
            languages: {
                en: '/en/products',
                zh: '/zh/products',
                'x-default': '/en/products',
            },
        },
    };
}

export default async function ProductListingPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations('HomePage');

    // Fetching categories and products concurrently
    const [categoriesRes, productsRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order', { ascending: true }),
        supabase.from('products').select('*')
    ]);

    const categoriesData: Category[] = categoriesRes.data || [];
    const typedProducts: Product[] = ((productsRes.data as ProductRaw[]) || []).map(p => ({
        id: p.id,
        name: p.name,
        category_id: p.category_id || p.category || '',
        specification: p.specification,
        image_url: parseImageUrl(p.image_url),
    }));

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
            <MainNavbar locale={locale} />

            <main className="flex-grow">
                {/* Header Section */}
                <div className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 py-12 md:py-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mb-4 animate-slide-up">
                            {t('products.title')}
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed animate-slide-up-delay">
                            {t('products.subtitle')}
                        </p>
                    </div>
                </div>

                {/* Product Catalog Area */}
                <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
                    <CategoryShowcase
                        categories={categoriesData}
                        products={typedProducts}
                        locale={locale}
                        dict={{
                            title: t('products.title'),
                            subtitle: t('products.subtitle'),
                            totalItems: t('products.totalItems'),
                            items: t('products.items'),
                            all: t('products.all', { fallback: 'All' })
                        }}
                    />
                </div>
            </main>

            <MainFooter locale={locale} />
        </div>
    );
}
