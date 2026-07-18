'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

interface MainNavbarProps {
    locale: string;
}

export default function MainNavbar({ locale }: MainNavbarProps) {
    const t = useTranslations('HomePage');
    const pathname = usePathname();
    const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsScrolled(!entry.isIntersecting);
            },
            { threshold: [0], rootMargin: '0px 0px 0px 0px' }
        );
        if (sentinelRef.current) observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, []);

    const navLinks = [
        { label: t('nav.products'), href: `/${locale}/products#catalog`, active: pathname.includes('/products') },
        { label: t('nav.about'), href: `/${locale}/about`, active: pathname.includes('/about') },
        { label: t('nav.news'), href: `/${locale}/news`, active: pathname.includes('/news') },
        { label: t('nav.contact'), href: `/${locale}/contact`, active: pathname.includes('/contact') },
        { label: t('nav.inquiry'), href: `/${locale}/inquiry`, active: pathname.includes('/inquiry') },
        { label: t('nav.faq'), href: `/${locale}/faq`, active: pathname.includes('/faq') },
    ];

    return (
        <>
            <div ref={sentinelRef} className="h-px w-full absolute top-0 pointer-events-none" />
            <nav className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-xl ${isScrolled ? 'bg-white/95 dark:bg-zinc-900/95 py-0 shadow-md border-b-zinc-200 dark:border-b-zinc-800' : 'bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-sm'}`}>
                <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-16">
                {/* Logo Section */}
                <div className="flex items-center gap-3 text-zinc-900 leading-none">
                    <a href={`/${locale}`} className="flex items-center gap-2 group">
                        <div className="relative transition-all duration-300 group-hover:scale-105 overflow-hidden h-9 w-40 md:h-11 md:w-48">
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

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium transition-colors ${link.active
                                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                                : 'text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400'
                                }`}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Actions & Mobile Toggle */}
                <div className="flex items-center gap-1 md:gap-3">
                    <div className="hidden sm:flex items-center gap-2">
                        <LocaleSwitcher />
                        <ThemeToggle />
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="md:hidden flex items-center">
                        <Button
                            type="text"
                            icon={<MenuOutlined className="text-xl" />}
                            onClick={() => setMobileMenuOpen(true)}
                            className="flex items-center justify-center dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-none shadow-none"
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <Drawer
                title={
                    <div className="flex items-center gap-2 py-2">
                        <div className="relative h-8 w-32">
                            <Image src="/logo.png" alt="logo" fill className="object-contain object-left" priority />
                        </div>
                    </div>
                }
                placement="right"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                size="default"
                className="mobile-nav-drawer dark:bg-zinc-900"
                styles={{
                    body: { padding: '1.5rem 1rem' },
                    header: { borderBottom: '1px solid #f4f4f5' }
                }}
            >
                <div className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`p-4 rounded-2xl text-base font-bold transition-all duration-300 flex items-center justify-between group ${link.active
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                                }`}
                        >
                            {link.label}
                            <span className={`w-1.5 h-1.5 rounded-full bg-blue-500 transition-opacity ${link.active ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />
                        </a>
                    ))}

                    {/* Drawer Bottom Actions */}
                    <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Appearance</span>
                                <ThemeToggle />
                            </div>
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Language</span>
                                <LocaleSwitcher />
                            </div>
                        </div>
                    </div>
                </div>
            </Drawer>

            <style jsx global>{`
                .dark .mobile-nav-drawer .ant-drawer-content {
                    background-color: #18181b !important;
                }
                .dark .mobile-nav-drawer .ant-drawer-header {
                    background-color: #18181b !important;
                    border-bottom-color: #27272a !important;
                }
                .dark .mobile-nav-drawer .ant-drawer-title {
                    color: #fafafa !important;
                }
                .dark .mobile-nav-drawer .ant-drawer-close {
                    color: #a1a1aa !important;
                }
            `}</style>
        </nav>
        </>
    );
}
