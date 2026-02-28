'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function LocaleSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('LocaleSwitcher');

    function handleSwitch(newLocale: string) {
        router.replace(pathname, { locale: newLocale });
    }

    return (
        <div className="flex items-center gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-800 transition-colors duration-300">
            {routing.locales.map((loc) => (
                <button
                    key={loc}
                    onClick={() => handleSwitch(loc)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 cursor-pointer ${locale === loc
                        ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100'
                        : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                        }`}
                    aria-label={t(loc)}
                >
                    {t(loc)}
                </button>
            ))}
        </div>
    );
}
