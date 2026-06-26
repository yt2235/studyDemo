import { MetadataRoute } from 'next';
import { supabase } from '@/supabase';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/site';

export const revalidate = 60;

// Date of the last meaningful update to static pages.
// Update this manually when you make significant changes to static content.
const STATIC_LAST_MODIFIED = new Date('2026-06-26');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Base routes
    const routes = ['', '/about', '/news', '/products', '/contact', '/inquiry', '/faq'];

    // Helper for localized URLs
    const getLocalizedUrl = (route: string, locale: string) => `${SITE_URL}/${locale}${route}`;

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

    // Static Routes — use a fixed date to avoid telling Google these pages
    // changed on every build when the actual content hasn't changed.
    for (const locale of routing.locales) {
        for (const route of routes) {
            entries.push({
                url: getLocalizedUrl(route, locale),
                lastModified: STATIC_LAST_MODIFIED,
                changeFrequency: 'weekly' as const,
                priority: route === '' ? 1 : 0.8,
                alternates: getAlternates(route),
            });
        }
    }

    // Product routes
    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, image_url');
    if (productsError) {
        console.error('Failed to fetch products for sitemap:', productsError);
    }
    if (products) {
        const { slugify } = await import('@/lib/slug');
        for (const product of products) {
            const productSlug = `${product.id}-${slugify(product.name || '')}`;
            const productImages = parseImages(product.image_url);
            for (const locale of routing.locales) {
                entries.push({
                    url: getLocalizedUrl(`/products/${productSlug}`, locale),
                    lastModified: STATIC_LAST_MODIFIED,
                    changeFrequency: 'weekly' as const,
                    priority: 0.6,
                    alternates: getAlternates(`/products/${productSlug}`),
                    images: productImages,
                });
            }
        }
    }

    // News routes — only include entries that have an explicit slug.
    // Entries without a slug would produce UUID/numeric ID URLs that cause redirects or 404s.
    const { data: news } = await supabase.from('news').select('id, slug, cover_image, updated_at, created_at').eq('is_published', true);
    if (news) {
        for (const item of news) {
            if (!item.slug) continue; // skip entries without a proper slug
            const slugOrId = cleanPathSegment(item.slug);
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
