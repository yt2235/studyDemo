import { getTranslations, setRequestLocale } from 'next-intl/server';
import MainFooter from '@/components/MainFooter';
import MainNavbar from '@/components/MainNavbar';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });

    return {
        title: t('aboutTitle'),
        description: t('description'), // Or a more specific about description if added
    };
}

export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations('AboutPage');
    const tHome = await getTranslations('HomePage');

    const factoryPhotos = [
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1565439390119-c63bf7019623?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600",
    ];

    const features = [
        { id: 'factory', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v2H9V7zm0 4h1v2H9v-2zm0 4h1v2H9v-2zm3-8h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z' },
        { id: 'quality', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
        { id: 'team', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { id: 'technology', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors duration-500">
            {/* Top Navigation */}
            <MainNavbar locale={locale} />

            <main>
                {/* 1. Hero / 公司简介 */}
                <section className="relative pt-24 pb-20 md:pt-36 md:pb-24 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white dark:from-zinc-900/50 dark:to-zinc-950 -z-10" />

                    {/* Decorative blobs */}
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
                    <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-400/20 dark:bg-cyan-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />

                    <div className="max-w-4xl mx-auto px-6 text-center mb-12">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 animate-slide-up">
                            {t('heroTitle')}
                        </h1>
                        <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed animate-slide-up-delay">
                            {t('heroSubtitle')}
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto px-6 text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-6 text-justify md:text-center animate-slide-up-delay-2">
                        <p>{t('introText1')}</p>
                        <p>{t('introText2')}</p>
                        <p>{t('introText3')}</p>
                        <p>{t('introText4')}</p>
                    </div>
                </section>

                {/* 2. WHY CHOOSE US */}
                <section className="py-24 bg-white dark:bg-zinc-900/50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-3">
                                {t('whyChooseUs')}
                            </h2>
                            <p className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                                {t('whyChooseUsDesc')}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, idx) => (
                                <div
                                    key={feature.id}
                                    className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                                        {t(`features.${feature.id}.title`)}
                                    </h3>
                                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                        {t(`features.${feature.id}.desc`)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. COMPANY PROFILE */}
                <section className="relative py-24 bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-white overflow-hidden transition-colors duration-500">
                    {/* Background texture effect */}
                    <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-300 via-zinc-100 to-white dark:from-zinc-800 dark:via-zinc-950 dark:to-black pointer-events-none" />

                    {/* Title */}
                    <div className="text-center mb-16 relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wider">
                            {t('companyProfileTitle')}
                        </h2>
                        {/* Green underline */}
                        <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        {/* Giant Watermark "ABOUT US" */}
                        <div className="hidden lg:block absolute top-0 right-10 text-[8rem] font-black text-zinc-900/5 dark:text-white/5 uppercase select-none pointer-events-none -translate-y-20">
                            {t('companyProfileWatermark')}
                        </div>

                        <div className="flex flex-col lg:flex-row shadow-2xl relative">
                            {/* Left: White Card */}
                            <div className="bg-white text-zinc-900 p-10 md:p-16 lg:w-1/2 relative lg:static z-20 border-t-8 border-blue-600">
                                <h3 className="text-2xl md:text-3xl font-extrabold uppercase leading-snug mb-8">
                                    {t('companyProfileSubTitle')}
                                </h3>
                                <p className="text-base text-zinc-600 leading-relaxed mb-10 text-justify">
                                    {t('companyProfileText')}
                                </p>
                                <a href="#contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 transition-colors">
                                    {t('companyProfileViewMore')}
                                </a>
                            </div>

                            {/* Right: Image Component */}
                            <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-full bg-zinc-800 -mt-8 lg:mt-0 lg:-ml-10 z-10 border-l-[12px] border-white lg:border-none">
                                {/* TODO: Replace this unsplash placeholder with your actual image URL */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200"
                                    alt="Company Profile Medical Supplies"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                {/* Bottom right green box */}
                                <div className="absolute bottom-0 right-0 bg-blue-600 text-white font-semibold py-4 px-6 md:px-10 text-lg shadow-lg">
                                    {t('companyProfileWelcome')}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. FACTORY PHOTOS */}
                <section className="py-24 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 transition-colors duration-500">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-sm font-bold text-blue-400 tracking-widest uppercase mb-3">
                                {t('factoryPhotos')}
                            </h2>
                            <p className="text-3xl md:text-4xl font-bold">
                                {t('factoryPhotosDesc')}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                            {factoryPhotos.map((url, idx) => (
                                <div key={idx} className="group relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-800">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={url}
                                        alt={`Factory Photo ${idx + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <MainFooter locale={locale} />
        </div>
    );
}
