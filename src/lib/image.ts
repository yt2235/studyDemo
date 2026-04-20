const OLD_DOMAIN = 'https://2c0df8ba15ecf22a6936d57e5b5cc503.r2.cloudflarestorage.com/yichi/';
const NEW_DOMAIN = 'https://assets.yichi.site/';

/**
 * Fixes a single image URL by replacing the old R2 domain with the new public assets domain.
 * If the URL doesn't match the old domain, it returns the original URL.
 */
export function fixImageUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith(OLD_DOMAIN)) {
        return url.replace(OLD_DOMAIN, NEW_DOMAIN);
    }
    return url;
}

/**
 * Parses an image URL string which might be a JSON array of strings or a single string.
 * It fixes the domains and returns an array of valid image URLs.
 */
export function parseImageUrl(raw: string): string[] {
    if (!raw) return [];
    
    try {
        // Try parsing as JSON array
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return parsed.map(fixImageUrl).filter(url => !!url);
        }
        // If not an array, treat as a single string
        const fixed = fixImageUrl(String(parsed));
        return fixed ? [fixed] : [];
    } catch {
        // If parsing fails, treat as a raw string
        const fixed = fixImageUrl(raw);
        return fixed ? [fixed] : [];
    }
}
