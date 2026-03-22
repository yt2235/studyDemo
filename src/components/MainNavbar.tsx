'use client';

import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface MainNavbarProps {
    locale: string;
}

export default function MainNavbar({ locale }: MainNavbarProps) {
    const t = useTranslations('HomePage');
    const pathname = usePathname();
    const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3 text-zinc-900 leading-none">
                    <a href={`/${locale}`} className="flex items-center gap-2 group">
                        <div className="relative h-11 w-48 transition-transform duration-300 group-hover:scale-105 overflow-hidden">
                            <Image
                                src="/logo.png"
                                alt="yichihealth logo"
                                fill
                                className="object-contain object-left"
                                priority
                            />
                        </div>
                    </a>
                </div>
                <div className="hidden md:flex items-center gap-6">
                    <a
                        href={isHome ? "#products" : `/${locale}#products`}
                        className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        {t('nav.products')}
                    </a>
                    <a
                        href={`/${locale}/about`}
                        className={`text-sm font-medium transition-colors ${pathname.includes('/about')
                            ? 'text-blue-600 dark:text-blue-400 font-semibold'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400'
                            }`}
                    >
                        {t('nav.about')}
                    </a>
                    <a
                        href={`/${locale}/contact`}
                        className={`text-sm font-medium transition-colors ${pathname.includes('/contact')
                            ? 'text-blue-600 dark:text-blue-400 font-semibold'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400'
                            }`}
                    >
                        {t('nav.contact')}
                    </a>
                </div>
                <div className="flex items-center gap-3">
                    <LocaleSwitcher />
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}
