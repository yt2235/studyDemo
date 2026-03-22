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
    };
}

export default async function ContactPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('AboutPage');

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-500">
            <MainNavbar locale={locale} />

            <main className="flex-grow pt-16">
                {/* 1. HERO SECTION */}
                <section className="relative py-20 overflow-hidden bg-zinc-50 dark:bg-zinc-900/40 border-b border-zinc-200/50 dark:border-zinc-800/50">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="max-w-3xl">
                            <nav className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-500 mb-6 animate-slide-up">
                                <a href={`/${locale}`} className="hover:text-blue-600 transition-colors">Home</a>
                                <span>/</span>
                                <span className="text-zinc-900 dark:text-zinc-100 italic">Contact</span>
                            </nav>
                            <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-6 animate-slide-up-delay">
                                {t('contactUs')}
                            </h1>
                            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed animate-slide-up-delay-2">
                                We're here to help you with your global health trade needs. Reach out to our expert team today.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 2. CONTACT DETAILS SECTION */}
                <section className="py-24 bg-white dark:bg-zinc-950 transition-colors">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-5 gap-16 items-start">
                            {/* Left Col: Description & CTA */}
                            <div className="lg:col-span-2 space-y-10">
                                <div>
                                    <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 tracking-[0.2em] uppercase mb-4">
                                        Support Team
                                    </h2>
                                    <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 leading-tight">
                                        Get in Touch with Our Global Export Team
                                    </h3>
                                    <div className="space-y-6 text-zinc-600 dark:text-zinc-400 leading-relaxed text-justify">
                                        <p>{t('contactDesc1')}</p>
                                        <p>{t('contactDesc2')}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Fast Contact</p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <a
                                            href="mailto:info@yichihealth.com"
                                            className="group flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:bg-blue-700 transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <MailOutlined className="text-lg transition-transform group-hover:scale-110" />
                                            {t('emailUs')}
                                        </a>
                                        <a
                                            href="https://wa.me/8619136215806"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <WhatsAppOutlined className="text-lg transition-transform group-hover:scale-110" />
                                            {t('whatsappUs')}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Right Col: Detail Cards */}
                            <div className="lg:col-span-3 grid sm:grid-cols-2 gap-6">
                                {[
                                    { id: 'name', icon: <HomeOutlined /> },
                                    { id: 'address', icon: <EnvironmentOutlined />, span: true },
                                    { id: 'manager', icon: <UserOutlined /> },
                                    { id: 'mobile', icon: <PhoneOutlined />, href: 'tel:+8619136215806' },
                                    { id: 'whatsapp', icon: <WhatsAppOutlined />, href: 'https://wa.me/8619136215806' },
                                    { id: 'wechat', icon: <WechatOutlined /> },
                                    { id: 'email', icon: <MailOutlined />, href: 'mailto:info@yichihealth.com' },
                                    { id: 'website', icon: <GlobalOutlined />, href: 'http://www.yichihealth.com' },
                                ].map((item, idx) => (
                                    <div
                                        key={item.id}
                                        className={`group p-8 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60 hover:border-blue-500/30 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 ${item.span ? 'sm:col-span-2' : ''} animate-slide-up`}
                                        style={{ animationDelay: `${0.1 * idx}s` }}
                                    >
                                        <div className="flex items-start gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 shadow-md flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 flex-shrink-0 border border-zinc-100 dark:border-zinc-700">
                                                <span className="text-xl">{item.icon}</span>
                                            </div>
                                            <div className="min-w-0 pt-1">
                                                <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.25em] mb-2">
                                                    {t(`contactInfo.${item.id}Label`)}
                                                </p>
                                                {item.href ? (
                                                    <a href={item.href} target={item.id === 'website' ? '_blank' : undefined} rel="noopener noreferrer" className="text-zinc-900 dark:text-zinc-100 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-words text-lg block leading-tight">
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
            </main>

            <MainFooter locale={locale} />
        </div>
    );
}
