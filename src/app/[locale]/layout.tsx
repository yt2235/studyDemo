import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Geist, Geist_Mono } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/components/ThemeProvider';
import '../globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.yichihealth.com';

    return {
        metadataBase: new URL(baseUrl),
        title: {
            default: t('title'),
            template: `%s | ${t('title')}`,
        },
        description: t('description'),
        keywords: t('keywords'),
        alternates: {
            canonical: `/${locale}`,
            languages: {
                en: '/en',
                zh: '/zh',
                'x-default': '/en',
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `/${locale}`,
            siteName: 'yichihealth',
            images: [
                {
                    url: '/logo.png',
                    width: 800,
                    height: 600,
                    alt: 'yichihealth logo',
                },
            ],
            locale: locale,
            alternateLocale: routing.locales.filter((l) => l !== locale),
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
            images: ['/logo.png'],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'Metadata' });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.yichihealth.com';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'yichihealth',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description: t('description'),
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+86-19136215806',
            contactType: 'customer service',
            areaServed: 'Worldwide',
            availableLanguage: ['Chinese', 'English']
        }
    };

    setRequestLocale(locale);

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                suppressHydrationWarning
            >
                <ThemeProvider>
                    <NextIntlClientProvider>
                        {children}
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
