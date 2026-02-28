import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { supabase } from '@/supabase';

type Props = {
    params: Promise<{ locale: string }>;
};

interface Product {
    id: number;
    name: string;
    category: string;
    specification: string;
    image_url: string;
}

export default async function HomePage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations('HomePage');

    // Fetching data from the 'products' table
    const { data: products, error } = await supabase.from('products').select('*');
    const typedProducts = (products as Product[]) || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 transition-colors duration-500">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200/50 dark:border-zinc-800/50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                            <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                            StudyDemo
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <LocaleSwitcher />
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-6xl mx-auto px-6">
                <section className="pt-24 pb-20 md:pt-32 md:pb-28">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-800/50 mb-8 animate-fade-in">
                            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                            <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                                {t('badge')}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1] mb-6 animate-slide-up">
                            {t('title')}
                            <br />
                            <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 dark:from-violet-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                                {t('subtitle')}
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-10 animate-slide-up-delay">
                            {t('description')}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up-delay-2 mb-16">
                            <a
                                href="https://nextjs.org/docs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                {t('getStarted')}
                                <svg
                                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                    />
                                </svg>
                            </a>
                            <a
                                href="https://nextjs.org/learn"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                {t('learnMore')}
                            </a>
                        </div>
                    </div>
                </section>

                {/* Products Section */}
                <section className="pb-24 md:pb-32">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 tracking-tight">
                                {t('features.products.title')}
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                {t('features.products.subtitle')}
                            </p>
                        </div>
                        <button className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold hover:gap-3 transition-all">
                            {t('learnMore')}
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {error ? (
                        <div className="p-8 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-500 text-center">
                            <p className="font-semibold mb-2">Supabase Connection Error</p>
                            <p className="text-sm opacity-80">{error.message}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {typedProducts.map((product) => (
                                <div key={product.id} className="group flex flex-col bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-1 hover:border-violet-200 dark:hover:border-violet-800">
                                    {/* Image Container */}
                                    <div className="aspect-[4/3] relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="flex flex-col gap-1 mt-auto">
                                            <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none">
                                                {t('features.products.specification')}
                                            </span>
                                            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                                                {product.specification}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Features Section */}
                <section className="pb-24 md:pb-32">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-zinc-900 dark:text-zinc-50 mb-16 tracking-tight">
                        {t('features.title')}
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* i18n Feature */}
                        <div className="group relative rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 transition-all duration-500 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1 hover:border-violet-300 dark:hover:border-violet-700">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-5 shadow-lg shadow-blue-500/20 transition-transform duration-500 group-hover:scale-110">
                                <span className="text-2xl">🌐</span>
                            </div>
                            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                                {t('features.i18n.title')}
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {t('features.i18n.description')}
                            </p>
                        </div>

                        {/* SEO Feature */}
                        <div className="group relative rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 transition-all duration-500 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1 hover:border-violet-300 dark:hover:border-violet-700">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/20 transition-transform duration-500 group-hover:scale-110">
                                <span className="text-2xl">🔍</span>
                            </div>
                            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                                {t('features.seo.title')}
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {t('features.seo.description')}
                            </p>
                        </div>

                        {/* Dark Mode Feature */}
                        <div className="group relative rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 transition-all duration-500 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1 hover:border-violet-300 dark:hover:border-violet-700">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-5 shadow-lg shadow-amber-500/20 transition-transform duration-500 group-hover:scale-110">
                                <span className="text-2xl">🌙</span>
                            </div>
                            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                                {t('features.darkMode.title')}
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {t('features.darkMode.description')}
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 transition-colors duration-500">
                <div className="max-w-6xl mx-auto px-6 text-center text-sm text-zinc-500 dark:text-zinc-500">
                    © {new Date().getFullYear()} StudyDemo. Built with Next.js 16.
                </div>
            </footer>
        </div>
    );
}
