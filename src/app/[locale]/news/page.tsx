import { getTranslations, setRequestLocale } from 'next-intl/server';
import MainNavbar from '@/components/MainNavbar';
import MainFooter from '@/components/MainFooter';
import { supabase } from '@/supabase';
import Link from 'next/link';
import { CalendarOutlined, EyeOutlined, ArrowRightOutlined } from '@ant-design/icons';

type Props = {
    params: Promise<{ locale: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'NewsPage' });

    return {
        title: `${t('title')} - yichihealth`,
        description: t('subtitle'),
    };
}

export default async function NewsListingPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations('NewsPage');

    const { data: newsItems } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

    // Helper to parse images (could be string or JSON array string)
    const parseImages = (imageField: any): string[] => {
        if (!imageField) return [];
        if (Array.isArray(imageField)) return imageField;
        try {
            const parsed = JSON.parse(imageField);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {
            // ignore
        }
        return [imageField];
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
            <MainNavbar locale={locale} />

            <main className="flex-grow">
                {/* Hero Section */}
                <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-6">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-6 tracking-tight">
                            {t('title')}
                        </h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </div>
                </div>

                {/* News Grid */}
                <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
                    {!newsItems || newsItems.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-zinc-500 dark:text-zinc-400 text-lg italic">
                                {t('noNews')}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {newsItems.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/${locale}/news/${item.slug || item.id}`}
                                    className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-zinc-100 dark:border-zinc-800 flex flex-col h-full"
                                >
                                    {/* Cover Image or Placeholder */}
                                    <div className="aspect-[16/10] overflow-hidden relative bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                        {item.cover_image ? (
                                            <img
                                                src={parseImages(item.cover_image)[0] || ""}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center p-8 text-zinc-300 dark:text-zinc-700">
                                                <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-2 shadow-inner">
                                                    <span className="text-3xl font-extrabold tracking-tighter opacity-50">YH</span>
                                                </div>
                                                <span className="text-xs font-semibold uppercase tracking-widest opacity-30">News & Trends</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                                            <span className="flex items-center gap-1.5">
                                                <CalendarOutlined />
                                                {new Date(item.published_at || item.created_at).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}
                                            </span>
                                        </div>

                                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {item.title}
                                        </h2>

                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                            {item.summary}
                                        </p>

                                        <div className="mt-auto flex items-center text-blue-600 font-semibold text-sm gap-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            {t('readMore')}
                                            <ArrowRightOutlined className="text-xs" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <MainFooter locale={locale} />
        </div>
    );
}
