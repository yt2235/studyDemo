import { getTranslations, setRequestLocale } from 'next-intl/server';
import { supabase } from '@/supabase';
import { CategoryShowcase, Category, Product } from '@/components/CategoryShowcase';
import MainNavbar from '@/components/MainNavbar';
import MainFooter from '@/components/MainFooter';
import { parseImageUrl } from '@/lib/image';
import HomeHeroBanner from '@/components/HomeHeroBanner';
import { SITE_URL } from '@/lib/site';

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
        description: t('productsDescription'),
        alternates: {
            canonical: `${SITE_URL}/${locale}/products`,
            languages: {
                en: `${SITE_URL}/en/products`,
                zh: `${SITE_URL}/zh/products`,
                'x-default': `${SITE_URL}/en/products`,
            },
        },
        openGraph: {
            title: t('productsTitle'),
            description: t('productsDescription'),
            type: 'website',
            url: `${SITE_URL}/${locale}/products`,
            images: [
                {
                    url: `${SITE_URL}/home.png`,
                    width: 2730,
                    height: 1536,
                    alt: 'Yichi Health Products Catalog',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: t('productsTitle'),
            description: t('productsDescription'),
            images: [`${SITE_URL}/home.png`],
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
                <div className="w-full bg-white dark:bg-zinc-950 pt-10">
                    <div className="max-w-7xl mx-auto px-6">
                        <HomeHeroBanner headingLevel="h2" className="shadow-xl shadow-blue-500/5" />
                    </div>
                </div>

                {/* Product Catalog Area */}
                <div id="catalog" className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:pb-32">
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
