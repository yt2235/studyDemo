import { MetadataRoute } from 'next';
import { supabase } from '@/supabase';
import { routing } from '@/i18n/routing';

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.yichihealth.com';

    // Base routes
    const routes = ['', '/about', '/news', '/contact', '/inquiry', '/faq'];

    // Helper for localized URLs
    const getLocalizedUrl = (route: string, locale: string) => `${baseUrl}/${locale}${route}`;

    // Helper to generate alternates object
    const getAlternates = (route: string) => {
        const languages: Record<string, string> = {};
        routing.locales.forEach((l) => {
            languages[l] = getLocalizedUrl(route, l);
        });
        return { languages };
    };

    // Static Routes
    const staticEntries = routes.map((route) => ({
        url: getLocalizedUrl('', routing.defaultLocale) + route, // Canonical as default locale
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
        alternates: getAlternates(route),
    }));

    // Product routes
    const { data: products } = await supabase.from('products').select('id');
    const productEntries = (products || []).map((product) => ({
        url: getLocalizedUrl(`/product/${product.id}`, routing.defaultLocale),
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.6,
        alternates: getAlternates(`/product/${product.id}`),
    }));

    // News routes
    const { data: news } = await supabase.from('news').select('id, slug').eq('is_published', true);
    const newsEntries = (news || []).map((item) => {
        const path = `/news/${item.slug || item.id}`;
        return {
            url: getLocalizedUrl(path, routing.defaultLocale),
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.7,
            alternates: getAlternates(path),
        };
    });

    return [...staticEntries, ...productEntries, ...newsEntries];
}
