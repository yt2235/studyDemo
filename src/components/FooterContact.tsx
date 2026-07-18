'use client';

import { useState } from 'react';
import { MailOutlined, PhoneOutlined, WechatFilled, GlobalOutlined, WhatsAppOutlined, CopyOutlined } from '@ant-design/icons';

export default function FooterContact() {
    const [copied, setCopied] = useState(false);

    const handleCopyWeChat = () => {
        navigator.clipboard.writeText("A1483923042");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
            <p className="flex items-center">
                <MailOutlined className="mr-2 text-blue-500" />
                <a href="mailto:info@yichihealth.com" className="hover:text-blue-500 transition-colors">
                    info@yichihealth.com
                </a>
            </p>
            <p className="flex items-center">
                <PhoneOutlined className="mr-2 text-blue-500" />
                <a href="tel:+8619136215806" className="hover:text-blue-500 transition-colors">
                    +(86)-19136215806
                </a>
            </p>
            <div className="relative inline-flex items-center cursor-pointer group" onClick={handleCopyWeChat} title="Click to copy WeChat ID">
                <WechatFilled className="mr-2 text-green-500" />
                <span className="group-hover:text-blue-500 transition-colors flex items-center gap-1.5">
                    WeChat: A1483923042
                    <CopyOutlined className="opacity-0 group-hover:opacity-100 transition-opacity text-xs" />
                </span>
                {copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-zinc-800 dark:bg-zinc-700 text-white text-xs rounded shadow-lg animate-fade-in whitespace-nowrap z-10 before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-zinc-800 dark:before:border-t-zinc-700">
                        Copied!
                    </span>
                )}
            </div>
            <p className="flex items-center">
                <WhatsAppOutlined className="mr-2 text-green-500" />
                <a href="https://wa.me/8619136215806" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                    +(86)-19136215806
                </a>
            </p>
            <p className="flex items-center">
                <GlobalOutlined className="mr-2 text-blue-500" />
                <a href="https://www.yichihealth.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                    www.yichihealth.com
                </a>
            </p>
        </div>
    );
}
