import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { supabase } from '@/supabase';

export const revalidate = 60;

type Props = {
    params: Promise<{ locale: string }>;
};

interface ProductRaw {
    id: number;
    name: string;
    category: string;
    specification: string;
    image_url: string;
}

interface Product extends Omit<ProductRaw, 'image_url'> {
    image_url: string[];
}

function parseImageUrl(raw: string): string[] {
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return raw ? [raw] : [];
    }
}

export default async function HomePage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations('HomePage');

    // Fetching data from the 'products' table
    const { data: products, error } = await supabase.from('products').select('*');
    const typedProducts: Product[] = ((products as ProductRaw[]) || []).map(p => ({
        ...p,
        image_url: parseImageUrl(p.image_url),
    }));

    // Group products by category
    const categories = Array.from(new Set(typedProducts.map(p => p.category)));
    const groupedProducts: Record<string, Product[]> = {};
    categories.forEach(cat => {
        groupedProducts[cat] = typedProducts.filter(p => p.category === cat);
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-slate-950 transition-colors duration-500">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </div>
                        <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100 tracking-tight">
                            GlobalTrade
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        <a href="#products" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {t('nav.products')}
                        </a>
                        <a href="#contact" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {t('nav.contact')}
                        </a>
                    </div>
                    <div className="flex items-center gap-3">
                        <LocaleSwitcher />
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6">
                <section className="pt-20 pb-16 md:pt-28 md:pb-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1] mb-6 animate-slide-up">
                            {t('title')}
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
                                {t('subtitle')}
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-10 animate-slide-up-delay">
                            {t('description')}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up-delay-2">
                            <a
                                href="#products"
                                className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                {t('viewProducts')}
                                <svg
                                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </a>
                            <a
                                href="#contact"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                {t('contactUs')}
                            </a>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 animate-slide-up-delay-2">
                        {[
                            { value: '500+', label: t('stats.products') },
                            { value: '50+', label: t('stats.countries') },
                            { value: '10+', label: t('stats.years') },
                            { value: '98%', label: t('stats.satisfaction') },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center p-6 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur border border-zinc-200/50 dark:border-zinc-800/50">
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Products Section */}
                <section id="products" className="pb-24 md:pb-32 scroll-mt-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3 tracking-tight">
                                {t('products.title')}
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                                {t('products.subtitle')}
                            </p>
                        </div>
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">
                            {typedProducts.length} {t('products.totalItems')}
                        </div>
                    </div>

                    {/* Category Navigation */}
                    {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-10">
                            {categories.map((category) => (
                                <a
                                    key={category}
                                    href={`#category-${category}`}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300"
                                >
                                    {category}
                                    <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-xs text-zinc-500 dark:text-zinc-400">
                                        {groupedProducts[category].length}
                                    </span>
                                </a>
                            ))}
                        </div>
                    )}

                    {error ? (
                        <div className="p-8 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-500 text-center">
                            <p className="font-semibold mb-2">Connection Error</p>
                            <p className="text-sm opacity-80">{error.message}</p>
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {categories.map((category) => (
                                <div key={category} id={`category-${category}`} className="scroll-mt-24">
                                    {/* Category Header */}
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-blue-500 to-cyan-500" />
                                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                            {category}
                                        </h3>
                                        <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50">
                                            {groupedProducts[category].length} {t('products.items')}
                                        </span>
                                        <div className="flex-1 h-px bg-gradient-to-r from-zinc-200 dark:from-zinc-800 to-transparent" />
                                    </div>

                                    {/* Product Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {groupedProducts[category].map((product) => (
                                            <a href={`/${locale}/product/${product.id}`} key={product.id} className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer">
                                                {/* Image */}
                                                <div className="aspect-[4/3] relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                                    {product.image_url.length > 0 ? (
                                                        <>
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={product.image_url[0]}
                                                                alt={product.name}
                                                                loading="lazy"
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                        </>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <svg className="w-12 h-12 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="p-5 flex flex-col flex-grow">
                                                    <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                                        {product.name}
                                                    </h4>
                                                    <div className="flex flex-col gap-1.5 mt-auto">
                                                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                                            {product.specification}
                                                        </span>
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Contact Section */}
                <section id="contact" className="pb-24 md:pb-32 scroll-mt-20">
                    <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 p-10 md:p-16 text-center relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                                {t('contact.title')}
                            </h2>
                            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
                                {t('contact.description')}
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <a href="mailto:info@globaltrade.com" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-all duration-300 hover:-translate-y-0.5 shadow-lg">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {t('contact.email')}
                                </a>
                                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                </div>
                                <span className="font-bold text-zinc-900 dark:text-zinc-100">GlobalTrade</span>
                            </div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                {t('footer.companyDesc')}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">{t('footer.quickLinks')}</h4>
                            <div className="space-y-2">
                                <a href="#products" className="block text-sm text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('nav.products')}</a>
                                <a href="#contact" className="block text-sm text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('nav.contact')}</a>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">{t('footer.contactInfo')}</h4>
                            <div className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                                <p>📧 info@globaltrade.com</p>
                                <p>📱 +86 138-0000-0000</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 text-center text-sm text-zinc-500 dark:text-zinc-500">
                        © {new Date().getFullYear()} GlobalTrade. {t('footer.rights')}
                    </div>
                </div>
            </footer>
        </div>
    );
}
