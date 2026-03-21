'use client';

import { MailOutlined, WhatsAppOutlined } from '@ant-design/icons';

interface ContactButtonsProps {
    emailLabel: string;
    whatsappLabel: string;
    /** extra className applied to the container */
    className?: string;
    /** visual variant – 'dark' for the blue-gradient hero, 'light' for white card */
    variant?: 'dark' | 'light';
}

export default function ContactButtons({
    emailLabel,
    whatsappLabel,
    className = '',
    variant = 'light',
}: ContactButtonsProps) {
    const isDark = variant === 'dark';

    return (
        <div className={`flex flex-wrap gap-4 ${className}`}>
            <a
                href="mailto:info@yichihealth.com"
                className={
                    isDark
                        ? 'inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-all duration-300 hover:-translate-y-0.5 shadow-lg'
                        : 'inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30'
                }
            >
                <MailOutlined style={{ fontSize: 18 }} />
                {emailLabel}
            </a>

            <a
                href="https://wa.me/8619136215806"
                target="_blank"
                rel="noopener noreferrer"
                className={
                    isDark
                        ? 'inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5'
                        : 'inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-300 hover:-translate-y-1'
                }
            >
                <WhatsAppOutlined style={{ fontSize: 18 }} />
                {whatsappLabel}
            </a>
        </div>
    );
}
