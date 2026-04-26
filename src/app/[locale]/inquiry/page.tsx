import { getTranslations, setRequestLocale } from 'next-intl/server';
import MainNavbar from '@/components/MainNavbar';
import MainFooter from '@/components/MainFooter';
import LeadForm from '@/components/LeadForm';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });
    const tP = await getTranslations({ locale, namespace: 'InquiryPage' });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.yichihealth.com';

    return {
        title: `${tP('title')} | yichihealth`,
        description: tP('subtitle'),
        keywords: 'bulk medical supplies inquiry, request quote medical equipment, yichihealth sales',
        alternates: {
            canonical: `${baseUrl}/${locale}/inquiry`,
        },
    };
}

export default async function InquiryPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('InquiryPage');

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-500">
            <MainNavbar locale={locale} />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-10 pb-10 md:pt-20 md:pb-10 overflow-hidden bg-zinc-50 dark:bg-zinc-900/40 border-b border-zinc-200/50 dark:border-zinc-800/50 transition-colors">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="max-w-3xl">
                            <h1 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mb-8 animate-slide-up leading-tight">
                                {t('title')}
                            </h1>
                            <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 leading-relaxed animate-slide-up-delay">
                                {t('subtitle')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Form Section */}
                <section className="py-24 md:py-32">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="bg-white dark:bg-zinc-900/50 rounded-[3rem] p-8 md:p-16 border border-zinc-100 dark:border-zinc-800 shadow-2xl shadow-zinc-200/50 dark:shadow-black/30">
                            <LeadForm
                                dict={{
                                    form: {
                                        fullName: t('form.fullName'),
                                        fullNamePlaceholder: t('form.fullNamePlaceholder'),
                                        companyName: t('form.companyName'),
                                        companyNamePlaceholder: t('form.companyNamePlaceholder'),
                                        phone: t('form.phone'),
                                        phonePlaceholder: t('form.phonePlaceholder'),
                                        email: t('form.email'),
                                        emailPlaceholder: t('form.emailPlaceholder'),
                                        orgType: t('form.orgType'),
                                        orgTypePlaceholder: t('form.orgTypePlaceholder'),
                                        orgTypes: {
                                            hospital: t('form.orgTypes.hospital'),
                                            pharmacy: t('form.orgTypes.pharmacy'),
                                            distributor: t('form.orgTypes.distributor'),
                                            other: t('form.orgTypes.other'),
                                        },
                                        requirement: t('form.requirement'),
                                        requirementPlaceholder: t('form.requirementPlaceholder'),
                                        timeline: t('form.timeline'),
                                        timelinePlaceholder: t('form.timelinePlaceholder'),
                                        timelines: {
                                            immediate: t('form.timelines.immediate'),
                                            soon: t('form.timelines.soon'),
                                            planning: t('form.timelines.planning'),
                                            budgeting: t('form.timelines.budgeting'),
                                        },
                                        submit: t('form.submit'),
                                        submitting: t('form.submitting'),
                                        success: t('form.success'),
                                        error: t('form.error'),
                                        required: t('form.required'),
                                    }
                                }}
                            />
                        </div>
                    </div>
                </section>
            </main>

            <MainFooter locale={locale} />
        </div>
    );
}
