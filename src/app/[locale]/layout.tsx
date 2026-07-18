import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Geist, Geist_Mono } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/components/ThemeProvider';
import InquiryCartIndicator from '@/components/InquiryCartIndicator';
import '../globals.css';
import {
    BRAND_NAME,
    LEGAL_NAME,
    SITE_EMAIL,
    SITE_KEYWORDS,
    SITE_NAME,
    SITE_PHONE,
    SITE_URL,
} from '@/lib/site';

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

    return {
        metadataBase: new URL(SITE_URL),
        applicationName: `${BRAND_NAME} (${SITE_NAME})`,
        title: {
            default: t('title'),
            template: `%s | ${BRAND_NAME} (${SITE_NAME})`,
        },
        description: t('description'),
        keywords: [...SITE_KEYWORDS, t('keywords')],
        authors: [{ name: BRAND_NAME, url: SITE_URL }],
        creator: BRAND_NAME,
        publisher: LEGAL_NAME,
        category: 'Medical supplies and equipment',
        alternates: {
            canonical: `${SITE_URL}/${locale}`,
            languages: {
                en: `${SITE_URL}/en`,
                zh: `${SITE_URL}/zh`,
                'x-default': `${SITE_URL}/en`,
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${SITE_URL}/${locale}`,
            siteName: `${BRAND_NAME} (${SITE_NAME})`,
            images: [
                {
                    url: `${SITE_URL}/home.png`,
                    width: 2730,
                    height: 1536,
                    alt: `${BRAND_NAME} medical supplies and equipment`,
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
            images: [`${SITE_URL}/home.png`],
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
        manifest: '/manifest.json',
    };
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'Metadata' });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || SITE_URL;

    const organizationJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: BRAND_NAME,
        legalName: LEGAL_NAME,
        alternateName: [SITE_NAME, 'Yiwu Yichi Health', 'Yichihealth'],
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        image: `${baseUrl}/home.png`,
        description: t('description'),
        email: SITE_EMAIL,
        telephone: SITE_PHONE,
        sameAs: [
            SITE_URL,
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: SITE_PHONE,
            contactType: 'customer service',
            areaServed: 'Worldwide',
            availableLanguage: ['Chinese', 'English']
        }
    };

    const websiteJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        name: BRAND_NAME,
        alternateName: [SITE_NAME, 'Yichihealth'],
        url: baseUrl,
        publisher: {
            '@id': `${baseUrl}/#organization`,
        },
        potentialAction: {
            '@type': 'SearchAction',
            target: `${baseUrl}/${locale}/products?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
        }
    };

    setRequestLocale(locale);

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
                />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                suppressHydrationWarning
            >
                <ThemeProvider>
                    <NextIntlClientProvider>
                        {children}
                        <InquiryCartIndicator locale={locale} />
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
