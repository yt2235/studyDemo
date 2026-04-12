import { MetadataRoute } from 'next';
import { supabase } from '@/supabase';
import { routing } from '@/i18n/routing';

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.yichihealth.com';

    // Base routes
    const routes = ['', '/about', '/news', '/contact', '/inquiry', '/faq'];

    // Localized static routes
    const staticEntries = routing.locales.flatMap((locale) =>
        routes.map((route) => ({
            url: `${baseUrl}/${locale}${route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: route === '' ? 1 : 0.8,
        }))
    );

    // Product routes
    const { data: products } = await supabase.from('products').select('id');
    const productEntries = (products || []).flatMap((product) =>
        routing.locales.map((locale) => ({
            url: `${baseUrl}/${locale}/product/${product.id}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.6,
        }))
    );

    // News routes
    const { data: news } = await supabase.from('news').select('id, slug').eq('is_published', true);
    const newsEntries = (news || []).flatMap((item) =>
        routing.locales.map((locale) => ({
            url: `${baseUrl}/${locale}/news/${item.slug || item.id}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.7,
        }))
    );

    return [...staticEntries, ...productEntries, ...newsEntries];
}
