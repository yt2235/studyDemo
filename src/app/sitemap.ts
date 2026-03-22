import { MetadataRoute } from 'next';
import { supabase } from '@/supabase';
import { routing } from '@/i18n/routing';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.yichihealth.com';

    // Base routes
    const routes = ['', '/about', '/contact'];

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

    return [...staticEntries, ...productEntries];
}
