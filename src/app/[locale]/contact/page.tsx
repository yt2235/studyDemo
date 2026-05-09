import { getTranslations, setRequestLocale } from 'next-intl/server';
import MainFooter from '@/components/MainFooter';
import MainNavbar from '@/components/MainNavbar';
import {
    MailOutlined,
    WhatsAppOutlined,
    PhoneOutlined,
    WechatOutlined,
    HomeOutlined,
    UserOutlined,
    GlobalOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });

    return {
        title: t('contactTitle'),
        description: t('description'),
        alternates: {
            canonical: `/${locale}/contact`,
            languages: {
                en: '/en/contact',
                zh: '/zh/contact',
                'x-default': '/en/contact',
            },
        },
    };
}

export default async function ContactPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('AboutPage');

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-500">
            <MainNavbar locale={locale} />

            <main className="flex-grow">
                {/* 1. HERO SECTION */}
                <section className="relative pt-10 pb-10 md:pt-20 md:pb-10 overflow-hidden bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200/50 dark:border-zinc-800/50 transition-colors">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full -translate-x-1/2 translate-y-1/2 blur-[80px] pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                        <nav className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-500 mb-6 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 animate-slide-up">
                            <a href={`/${locale}`} className="hover:opacity-70 transition-opacity">{t('contactPage.home')}</a>
                            <span className="text-zinc-400">/</span>
                            <span>{t('contactPage.breadcrumb')}</span>
                        </nav>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter mb-6 animate-slide-up-delay">
                            {t('contactUs')}
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto animate-slide-up-delay-2 italic">
                            {t('contactPage.heroDescription')}
                        </p>
                    </div>
                </section>

                {/* 2. CONTACT CONTENT - Vertically Stacked */}
                <section className="py-20 md:py-32 bg-white dark:bg-zinc-950 transition-colors">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="max-w-5xl mx-auto space-y-24">

                            {/* Top: Description & Main CTA */}
                            <div className="flex flex-col items-center text-center space-y-10">
                                <div className="space-y-4 max-w-3xl">
                                    <h2 className="text-xs font-black text-blue-600 dark:text-blue-400 tracking-[0.4em] uppercase">
                                        {t('contactPage.supportTeam')}
                                    </h2>
                                    <h3 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                                        {t('contactPage.supportTitle')}
                                    </h3>
                                    <div className="space-y-6 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                        <p>{t('contactDesc1')}</p>
                                        <p>{t('contactDesc2')}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                                    <a
                                        href="mailto:info@yichihealth.com"
                                        className="group inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-blue-600 text-white font-bold shadow-xl hover:bg-blue-700 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <MailOutlined className="text-lg transition-transform group-hover:scale-110" />
                                        {t('emailUs')}
                                    </a>
                                    <a
                                        href="https://wa.me/8619136215806"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <WhatsAppOutlined className="text-lg transition-transform group-hover:scale-110" />
                                        {t('whatsappUs')}
                                    </a>
                                </div>
                            </div>

                            {/* Bottom: Detail Cards Grid */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { id: 'name', icon: <HomeOutlined /> },
                                    { id: 'address', icon: <EnvironmentOutlined />, span: true },
                                    { id: 'manager', icon: <UserOutlined /> },
                                    { id: 'mobile', icon: <PhoneOutlined />, href: 'tel:+8619136215806' },
                                    { id: 'whatsapp', icon: <WhatsAppOutlined />, href: 'https://wa.me/8619136215806' },
                                    { id: 'wechat', icon: <WechatOutlined /> },
                                    { id: 'email', icon: <MailOutlined />, href: 'mailto:info@yichihealth.com' },
                                    { id: 'website', icon: <GlobalOutlined />, href: 'https://www.yichihealth.com' },
                                ].map((item, idx) => (
                                    <div
                                        key={item.id}
                                        className={`group p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60 transition-all duration-500 hover:shadow-lg ${item.span ? 'sm:col-span-2' : ''} animate-slide-up`}
                                        style={{ animationDelay: `${0.05 * idx}s` }}
                                    >
                                        <div className="flex items-start gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 flex-shrink-0 border border-zinc-50 dark:border-zinc-700">
                                                <span className="text-lg">{item.icon}</span>
                                            </div>
                                            <div className="min-w-0 pt-0.5">
                                                <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-1">
                                                    {t(`contactInfo.${item.id}Label`)}
                                                </p>
                                                {item.href ? (
                                                    <a href={item.href} target={item.id === 'website' ? '_blank' : undefined} rel="noopener noreferrer" className="text-zinc-900 dark:text-zinc-100 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-words text-lg leading-tight">
                                                        {t(`contactInfo.${item.id}Value`)}
                                                    </a>
                                                ) : (
                                                    <p className="text-zinc-900 dark:text-zinc-100 font-bold break-words text-lg leading-tight">
                                                        {t(`contactInfo.${item.id}Value`)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. VISUAL SECTION - Global Presence */}
                <section className="py-24 bg-zinc-50 dark:bg-zinc-900/40 border-t border-zinc-200/50 dark:border-zinc-800/50 transition-colors border-dashed">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <div className="max-w-2xl mx-auto mb-16 space-y-4">
                            <h2 className="text-[10px] font-black text-blue-600 dark:text-blue-400 tracking-[0.4em] uppercase">{t('contactPage.globalPresence')}</h2>
                            <h3 className="text-3xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">{t('contactPage.globalTitle')}</h3>
                            <p className="text-base text-zinc-600 dark:text-zinc-400 italic">{t('contactPage.globalDesc')}</p>
                        </div>

                        <div className="relative aspect-[21/9] w-full max-w-4xl mx-auto rounded-[2rem] overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl group">
                            <div className="absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-20 transition-transform duration-1000 group-hover:scale-110">
                                <GlobalOutlined style={{ fontSize: '240px', color: '#3b82f6' }} />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white dark:from-zinc-900 dark:via-transparent dark:to-zinc-900" />
                            <div className="relative z-10 flex items-center justify-center h-full">
                                <div className="text-4xl md:text-6xl font-black text-blue-600/10 dark:text-blue-400/5 tracking-widest uppercase">YICHI HEALTH</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <MainFooter locale={locale} />
        </div>
    );
}
