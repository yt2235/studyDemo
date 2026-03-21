'use client';

import {
    MailOutlined,
    PhoneOutlined,
    WhatsAppOutlined,
    WechatOutlined,
    EnvironmentOutlined,
    UserOutlined,
    GlobalOutlined,
    LinkOutlined,
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface SiteFooterProps {
    locale: string;
}

const contactRows = [
    { field: 'name', Icon: UserOutlined },
    { field: 'address', Icon: EnvironmentOutlined },
    { field: 'manager', Icon: UserOutlined },
    { field: 'mobile', Icon: PhoneOutlined },
    { field: 'whatsapp', Icon: WhatsAppOutlined },
    { field: 'wechat', Icon: WechatOutlined },
    { field: 'email', Icon: MailOutlined },
    { field: 'website', Icon: GlobalOutlined },
];

export default function SiteFooter({ locale }: SiteFooterProps) {
    const tHome = useTranslations('HomePage');
    const tAbout = useTranslations('AboutPage');

    return (
        <footer className="bg-zinc-950 text-zinc-100 transition-colors duration-500">
            {/* Contact Bar */}
            <div className="border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-6 py-14">
                    <p className="text-center text-sm font-bold text-blue-400 tracking-widest uppercase mb-2">
                        {tAbout('contactUs')}
                    </p>
                    <h2 className="text-center text-3xl font-bold text-white mb-12">
                        {tAbout('contactDesc1').slice(0, 60)}...
                    </h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactRows.map(({ field, Icon }) => {
                            const label = tAbout(`contactInfo.${field}Label` as any);
                            const value = tAbout(`contactInfo.${field}Value` as any);
                            let href: string | undefined;
                            if (field === 'email') href = `mailto:${value}`;
                            if (field === 'mobile' || field === 'whatsapp') href = `tel:${value.replace(/[^+\d]/g, '')}`;
                            if (field === 'website') href = value;

                            return (
                                <div
                                    key={field}
                                    className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-blue-500/40 transition-all group"
                                >
                                    <div className="mt-0.5 w-9 h-9 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/30 transition-colors shrink-0">
                                        <Icon style={{ fontSize: 18 }} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
                                        {href ? (
                                            <a
                                                href={href}
                                                target={field === 'website' ? '_blank' : undefined}
                                                rel="noopener noreferrer"
                                                className="text-sm text-zinc-200 hover:text-blue-400 transition-colors break-all"
                                            >
                                                {value}
                                            </a>
                                        ) : (
                                            <p className="text-sm text-zinc-200 break-words">{value}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="relative h-9 w-40 overflow-hidden">
                        <Image
                            src="/logo.png"
                            alt="yichihealth logo"
                            fill
                            className="object-contain object-left"
                        />
                    </div>
                </div>

                <nav className="flex items-center gap-6 text-sm text-zinc-400">
                    <a href={`/${locale}`} className="hover:text-blue-400 transition-colors">{tHome('nav.products')}</a>
                    <a href={`/${locale}/about`} className="hover:text-blue-400 transition-colors">{tHome('nav.about')}</a>
                    <a href={`/${locale}/about#contact`} className="hover:text-blue-400 transition-colors">{tHome('nav.contact')}</a>
                </nav>

                <p className="text-xs text-zinc-600">
                    © {new Date().getFullYear()} yichihealth. {tHome('footer.rights')}
                </p>
            </div>
        </footer>
    );
}
