export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')              // Replace spaces with -
        .replace(/[^\w\u4e00-\u9fa5-]+/g, '') // Keep word chars, Chinese chars, and hyphens
        .replace(/--+/g, '-')              // Replace multiple - with single -
        .replace(/^-+/, '')               // Trim - from start of text
        .replace(/-+$/, '');              // Trim - from end of text
}

export function parseIdFromSlug(slug: string): string {
    // If it's just a number, return it
    if (/^\d+$/.test(slug)) return slug;
    // Otherwise extract the ID from the start (e.g., "23-product-name" -> "23")
    const match = slug.match(/^(\d+)-/);
    return match ? match[1] : slug;
}
