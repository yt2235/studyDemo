'use client';

import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const t = useTranslations('ThemeToggle');
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className="flex items-center gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-800">
                <div className="h-8 w-16 rounded-full" />
                <div className="h-8 w-16 rounded-full" />
                <div className="h-8 w-16 rounded-full" />
            </div>
        );
    }

    const themes = [
        { key: 'light' as const, icon: '☀️' },
        { key: 'dark' as const, icon: '🌙' },
        { key: 'system' as const, icon: '💻' },
    ];

    return (
        <div className="flex items-center gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-800 transition-colors duration-300">
            {themes.map(({ key, icon }) => (
                <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 cursor-pointer ${theme === key
                            ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100'
                            : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                        }`}
                    aria-label={t(key)}
                >
                    <span className="text-base">{icon}</span>
                    <span className="hidden sm:inline">{t(key)}</span>
                </button>
            ))}
        </div>
    );
}
