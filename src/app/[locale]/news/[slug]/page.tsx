import { getTranslations, setRequestLocale } from 'next-intl/server';
import MainNavbar from '@/components/MainNavbar';
import MainFooter from '@/components/MainFooter';
import { supabase } from '@/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarOutlined, EyeOutlined, LeftOutlined, UserOutlined, ArrowRightOutlined } from '@ant-design/icons';

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug);

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug);
    const { data: news } = await supabase
        .from('news')
        .select('title, summary')
        .or(`slug.eq."${slug}"${isUuid ? `,id.eq.${slug}` : ''}`)
        .single();

    if (!news) return {};

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yichihealth.com';

    return {
        title: `${news.title} - yichihealth`,
        description: news.summary,
        keywords: `${news.title}, medical news, healthcare industry, yichihealth`,
        alternates: {
            canonical: `${baseUrl}/${locale}/news/${slug}`,
        },
    };
}

export default async function NewsDetailPage({ params }: Props) {
    const { locale, slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug);
    setRequestLocale(locale);

    const t = await getTranslations('NewsPage');

    // Fetch news content
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug);
    const { data: news } = await supabase
        .from('news')
        .select('*')
        .or(`slug.eq."${slug}"${isUuid ? `,id.eq.${slug}` : ''}`)
        .single();

    if (!news) {
        notFound();
    }

    // Increment view count
    supabase.rpc('increment_view_count', { row_id: news.id }).then(({ error }) => {
        if (error) {
            supabase.from('news').update({ view_count: (news.view_count || 0) + 1 }).eq('id', news.id).select();
        }
    });

    // Fetch related news (2 items, excluding current)
    const { data: relatedNews } = await supabase
        .from('news')
        .select('id, title, summary, cover_image, slug, published_at, created_at')
        .eq('is_published', true)
        .neq('id', news.id)
        .limit(2);

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

    // Helper to format content (handle plain text with newlines or HTML)
    const renderContent = (content: string, images: string[]) => {
        if (!content) return null;
        const hasHtmlTags = /<[a-z][\s\S]*>/i.test(content);
        
        if (hasHtmlTags) {
            return (
                <div className="relative">
                    {images.map((img, idx) => (
                         <div key={idx} className={`md:mb-8 mb-10 w-full md:w-80 lg:w-96 rounded-2xl overflow-hidden shadow-xl border border-zinc-100 dark:border-zinc-800 ring-4 ring-white dark:ring-zinc-900 ${idx % 2 === 0 ? 'md:float-right md:ml-8' : 'md:float-left md:mr-8'}`}>
                             <img src={img} alt="" className="w-full h-auto" />
                         </div>
                    ))}
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
            );
        }

        const paragraphs = content.split('\n').filter(line => line.trim() !== '');
        const imgDistGap = Math.max(1, Math.floor(paragraphs.length / Math.max(1, images.length)));

        return (
            <div className="whitespace-pre-wrap leading-relaxed space-y-4">
                {paragraphs.map((para, i) => {
                    const imgIndex = Math.floor(i / imgDistGap);
                    const showImage = i % imgDistGap === 0 && imgIndex < images.length;
                    
                    return (
                        <div key={i}>
                            {showImage && (
                                <div className={`md:mb-6 mb-8 w-full md:w-80 lg:w-96 rounded-2xl overflow-hidden shadow-xl border border-zinc-100 dark:border-zinc-800 ring-4 ring-white dark:ring-zinc-900 ${imgIndex % 2 === 0 ? 'md:float-right md:ml-8' : 'md:float-left md:mr-8'}`}>
                                    <img src={images[imgIndex]} alt="" className="w-full h-auto" />
                                </div>
                            )}
                            <p>{para}</p>
                        </div>
                    );
                })}
            </div>
        );
    };

    const newsImages = parseImages(news.cover_image);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yichihealth.com';
    const newsJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: news.title,
        image: newsImages,
        datePublished: news.published_at || news.created_at,
        dateModified: news.updated_at || news.published_at || news.created_at,
        author: {
            '@type': 'Organization',
            name: 'yichihealth'
        },
        publisher: {
            '@type': 'Organization',
            name: 'yichihealth',
            logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/logo.png`
            }
        },
        description: news.summary
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }}
            />
            <MainNavbar locale={locale} />

            <main className="flex-grow">
                {/* Simplified Header area */}
                <div className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="max-w-4xl mx-auto px-6 pt-12 pb-12">
                        <Link
                            href={`/${locale}/news`}
                            className="inline-flex items-center gap-2 text-zinc-500 hover:text-blue-600 transition-colors text-xs font-semibold uppercase tracking-widest group mb-8"
                        >
                            <LeftOutlined className="text-[10px] transition-transform group-hover:-translate-x-1" />
                            {t('backToList')}
                        </Link>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-8 leading-tight tracking-tight">
                            {news.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                            <div className="flex items-center gap-2">
                                <CalendarOutlined className="text-blue-500" />
                                <span>{new Date(news.published_at || news.created_at).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-16">
                    <article className="prose prose-zinc md:prose-lg dark:prose-invert max-w-none prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed prose-headings:text-zinc-900 dark:prose-headings:text-zinc-50 mb-16 clearfix">
                        {renderContent(news.content, newsImages)}
                    </article>


                    {/* Related News */}
                    {relatedNews && relatedNews.length > 0 && (
                        <div className="mt-24 pt-16 border-t border-zinc-100 dark:border-zinc-800">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-10">
                                {t('relatedNews')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {relatedNews.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/${locale}/news/${item.slug || item.id}`}
                                        className="group flex gap-4 p-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                                    >
                                        <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                            {item.cover_image && (
                                                <img 
                                                    src={parseImages(item.cover_image)[0] || ""} 
                                                    alt={item.title} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors underline-offset-4 group-hover:underline">
                                                {item.title}
                                            </h4>
                                            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">
                                                {new Date(item.published_at || item.created_at).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <MainFooter locale={locale} />
        </div>
    );
}
