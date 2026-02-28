import { routing } from '@/i18n/routing';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

    const routes = [''];

    return routes.flatMap((route) =>
        routing.locales.map((locale) => ({
            url: `${baseUrl}/${locale}${route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: route === '' ? 1.0 : 0.8,
        }))
    );
}
