import { MetadataRoute } from 'next';
import { supabase } from '@/supabase';
import { routing } from '@/i18n/routing';

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yichihealth.com';

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

    // Helper to parse images
    const parseImages = (imageField: unknown): string[] => {
        if (!imageField) return [];
        if (Array.isArray(imageField)) return imageField.filter((image): image is string => typeof image === 'string');
        if (typeof imageField !== 'string') return [];
        try {
            const parsed = JSON.parse(imageField);
            if (Array.isArray(parsed)) return parsed.filter((image): image is string => typeof image === 'string');
        } catch {
            // ignore
        }
        return [imageField];
    };

    // Helper to clean slug/id for URL
    const cleanPathSegment = (segment: string) => encodeURIComponent(segment.replace(/\s+/g, '-'));

    // Combined Entries
    const entries: MetadataRoute.Sitemap = [];

    // Static Routes
    for (const locale of routing.locales) {
        for (const route of routes) {
            entries.push({
                url: getLocalizedUrl(route, locale),
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: route === '' ? 1 : 0.8,
                alternates: getAlternates(route),
            });
        }
    }

    // Product routes
    const { data: products, error: productsError } = await supabase.from('products').select('id, image_url');
    if (productsError) {
        console.error('Failed to fetch products for sitemap:', productsError);
    }
    if (products) {
        for (const product of products) {
            const productImages = parseImages(product.image_url);
            for (const locale of routing.locales) {
                entries.push({
                    url: getLocalizedUrl(`/product/${product.id}`, locale),
                    lastModified: new Date(),
                    changeFrequency: 'daily' as const,
                    priority: 0.6,
                    alternates: getAlternates(`/product/${product.id}`),
                    images: productImages,
                });
            }
        }
    }

    // News routes
    const { data: news } = await supabase.from('news').select('id, slug, cover_image, updated_at, created_at').eq('is_published', true);
    if (news) {
        for (const item of news) {
            const slugOrId = cleanPathSegment(item.slug || String(item.id));
            const path = `/news/${slugOrId}`;
            const newsImages = parseImages(item.cover_image);
            
            for (const locale of routing.locales) {
                entries.push({
                    url: getLocalizedUrl(path, locale),
                    lastModified: item.updated_at ? new Date(item.updated_at) : new Date(item.created_at),
                    changeFrequency: 'daily' as const,
                    priority: 0.7,
                    alternates: getAlternates(path),
                    images: newsImages,
                });
            }
        }
    }

    return entries;
}
