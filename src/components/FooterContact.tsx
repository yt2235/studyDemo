'use client';

import { MailOutlined, PhoneOutlined, WechatFilled, GlobalOutlined, WhatsAppOutlined } from '@ant-design/icons';

export default function FooterContact() {
    return (
        <div className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <p>
                <MailOutlined className="mr-2 text-blue-500" />
                <a href="mailto:info@yichihealth.com" className="hover:text-blue-500 transition-colors">
                    info@yichihealth.com
                </a>
            </p>
            <p>
                <PhoneOutlined className="mr-2 text-blue-500" />
                <a href="tel:+8619136215806" className="hover:text-blue-500 transition-colors">
                    +(86)-19136215806
                </a>
            </p>
            <p>
                <WechatFilled className="mr-2 text-green-500" />
                WeChat: A1483923042
            </p>
            <p>
                <WhatsAppOutlined className="mr-2 text-green-500" />
                <a href="https://wa.me/8619136215806" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                    +(86)-19136215806
                </a>
            </p>
            <p>
                <GlobalOutlined className="mr-2 text-blue-500" />
                <a href="http://www.yichihealth.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                    www.yichihealth.com
                </a>
            </p>
        </div>
    );
}
