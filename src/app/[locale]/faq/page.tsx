import { getTranslations, setRequestLocale } from 'next-intl/server';
import { supabase } from '@/supabase';
import MainNavbar from '@/components/MainNavbar';
import MainFooter from '@/components/MainFooter';
import FAQClient from '@/components/FAQClient';

type Props = {
    params: Promise<{ locale: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'FAQPage' });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.yichihealth.com';

    return {
        title: `${t('title')} | yichihealth`,
        description: t('subtitle'),
        keywords: 'medical supplies FAQ, yichihealth help, healthcare equipment support',
        alternates: {
            canonical: `${baseUrl}/${locale}/faq`,
        },
    };
}

export default async function FAQPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations('FAQPage');

    // Fetch FAQs from Supabase
    const { data: faqs } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors duration-500">
            <MainNavbar locale={locale} />

            <main>
                {/* Hero Section */}
                <section className="relative pt-8 pb-3 md:pt-16 md:pb-3 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white dark:from-zinc-900/50 dark:to-zinc-950 -z-10" />

                    {/* Decorative blobs */}
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
                    <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-400/20 dark:bg-cyan-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />

                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mb-4 animate-slide-up leading-tight">
                            {t('title')}
                        </h1>
                        <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed animate-slide-up-delay italic p-4 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm rounded-3xl border border-white/50 dark:border-zinc-800/50">
                            {t('subtitle')}
                        </p>
                    </div>
                </section>

                {/* FAQ Content Section */}
                <section className="pb-16 mt-4">
                    <div className="max-w-5xl mx-auto px-6">
                        <FAQClient faqs={faqs || []} locale={locale} />
                    </div>
                </section>
            </main>

            <MainFooter locale={locale} />
        </div>
    );
}
