'use client';

import { useTranslations } from 'next-intl';
import FooterContact from './FooterContact';
import Image from 'next/image';

interface MainFooterProps {
    locale: string;
}

export default function MainFooter({ locale }: MainFooterProps) {
    const tHome = useTranslations('HomePage');

    return (
        <footer className="border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="relative h-14 w-60 overflow-hidden">
                                <Image
                                    src="/logo.png"
                                    alt="yichihealth logo"
                                    fill
                                    className="object-contain object-left scale-[2.5] origin-left"
                                />
                            </div>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            {tHome('footer.companyDesc')}
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">{tHome('footer.quickLinks')}</h4>
                        <div className="space-y-2">
                            <a href={`/${locale}#products`} className="block text-sm text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{tHome('nav.products')}</a>
                            <a href={`/${locale}/about`} className="block text-sm text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{tHome('nav.about')}</a>
                            <a href={`/${locale}/about#contact`} className="block text-sm text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{tHome('nav.contact')}</a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">{tHome('footer.contactInfo')}</h4>
                        <FooterContact />
                    </div>
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 text-center text-sm text-zinc-500 dark:text-zinc-500">
                    © {new Date().getFullYear()} yichihealth. {tHome('footer.rights')}
                </div>
            </div>
        </footer>
    );
}
