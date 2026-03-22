'use client';

import { useState } from 'react';
import { supabase } from '@/supabase';
import { Select, ConfigProvider, theme } from 'antd';
import {
    UserOutlined,
    BankOutlined,
    PhoneOutlined,
    MailOutlined,
    AppstoreOutlined,
    MessageOutlined,
    HistoryOutlined,
    CheckCircleFilled,
    LoadingOutlined
} from '@ant-design/icons';

interface LeadFormProps {
    dict: {
        form: {
            fullName: string;
            fullNamePlaceholder: string;
            companyName: string;
            companyNamePlaceholder: string;
            phone: string;
            phonePlaceholder: string;
            email: string;
            emailPlaceholder: string;
            orgType: string;
            orgTypePlaceholder: string;
            orgTypes: {
                hospital: string;
                pharmacy: string;
                distributor: string;
                other: string;
            };
            requirement: string;
            requirementPlaceholder: string;
            timeline: string;
            timelinePlaceholder: string;
            timelines: {
                immediate: string;
                soon: string;
                planning: string;
                budgeting: string;
            };
            submit: string;
            submitting: string;
            success: string;
            error: string;
            required: string;
        };
    };
}

export default function LeadForm({ dict }: LeadFormProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Controlled states for AntD Select
    const [orgType, setOrgType] = useState<string | null>(null);
    const [timeline, setTimeline] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            full_name: formData.get('fullName') as string,
            company_name: formData.get('companyName') as string,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string || null,
            org_type: orgType,
            requirement_detail: formData.get('requirement') as string,
            expected_timeline: timeline,
            source_url: typeof window !== 'undefined' ? window.location.href : '',
            status: 'pending'
        };

        const { error: submitError } = await supabase
            .from('customer_leads')
            .insert([data]);

        if (submitError) {
            console.error('Submission error:', submitError);
            setError(dict.form.error);
        } else {
            setSuccess(true);
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 shadow-lg shadow-blue-500/20">
                    <CheckCircleFilled className="text-4xl" />
                </div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 tracking-tight">
                    {dict.form.success.split('.')[0]}.
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-md">
                    {dict.form.success.split('.')[1]}
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-10 px-8 py-3 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold hover:scale-105 transition-transform"
                >
                    Submit Another
                </button>
            </div>
        );
    }

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                    borderRadius: 16,
                    controlHeight: 56,
                    colorBgContainer: 'transparent',
                    colorBorder: '#e5e7eb',
                },
                components: {
                    Select: {
                        optionSelectedBg: '#eff6ff',
                        colorTextPlaceholder: '#9ca3af',
                    }
                }
            }}
        >
            <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                            <UserOutlined className="text-blue-500" />
                            {dict.form.fullName}
                            <span className="text-rose-500">*</span>
                        </label>
                        <input
                            required
                            name="fullName"
                            placeholder={dict.form.fullNamePlaceholder}
                            className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-medium h-[56px]"
                        />
                    </div>

                    {/* Company Name */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                            <BankOutlined className="text-blue-500" />
                            {dict.form.companyName}
                            <span className="text-rose-500">*</span>
                        </label>
                        <input
                            required
                            name="companyName"
                            placeholder={dict.form.companyNamePlaceholder}
                            className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-medium h-[56px]"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                            <PhoneOutlined className="text-blue-500" />
                            {dict.form.phone}
                            <span className="text-rose-500">*</span>
                        </label>
                        <input
                            required
                            name="phone"
                            type="tel"
                            placeholder={dict.form.phonePlaceholder}
                            className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-medium h-[56px]"
                        />
                    </div>

                    {/* Email (Optional) */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                            <MailOutlined className="text-blue-500" />
                            {dict.form.email}
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder={dict.form.emailPlaceholder}
                            className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-medium h-[56px]"
                        />
                    </div>

                    {/* Organization Type */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                            <AppstoreOutlined className="text-blue-500" />
                            {dict.form.orgType}
                        </label>
                        <Select
                            placeholder={dict.form.orgTypePlaceholder}
                            onChange={setOrgType}
                            className="w-full custom-select-large"
                            classNames={{ popup: { root: 'custom-select-popup' } }}
                            options={Object.entries(dict.form.orgTypes).map(([key, label]) => ({
                                value: key,
                                label: label
                            }))}
                            style={{ width: '100%', height: '56px' }}
                        />
                    </div>

                    {/* Expected Timeline */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                            <HistoryOutlined className="text-blue-500" />
                            {dict.form.timeline}
                        </label>
                        <Select
                            placeholder={dict.form.timelinePlaceholder}
                            onChange={setTimeline}
                            className="w-full custom-select-large"
                            classNames={{ popup: { root: 'custom-select-popup' } }}
                            options={Object.entries(dict.form.timelines).map(([key, label]) => ({
                                value: key,
                                label: label
                            }))}
                            style={{ width: '100%', height: '56px' }}
                        />
                    </div>
                </div>

                {/* Requirement Detail */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                        <MessageOutlined className="text-blue-500" />
                        {dict.form.requirement}
                        <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                        required
                        name="requirement"
                        rows={5}
                        placeholder={dict.form.requirementPlaceholder}
                        className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-medium resize-none"
                    />
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-black text-lg tracking-wide hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-zinc-900/10 dark:shadow-black/20"
                >
                    {loading ? (
                        <>
                            <LoadingOutlined />
                            {dict.form.submitting}
                        </>
                    ) : (
                        dict.form.submit
                    )}
                </button>

                <style jsx global>{`
                    .custom-select-large .ant-select-selector {
                        border-radius: 1rem !important;
                        background-color: #f9fafb !important;
                        border-color: #e5e7eb !important;
                        padding: 0 1.25rem !important;
                        transition: all 0.2s !important;
                    }
                    .dark .custom-select-large .ant-select-selector {
                        background-color: #18181b !important;
                        border-color: #27272a !important;
                    }
                    .custom-select-large.ant-select-focused .ant-select-selector {
                         border-color: #3b82f6 !important;
                         box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.05) !important;
                    }
                    .custom-select-large .ant-select-selection-placeholder {
                        color: #9ca3af !important;
                        font-weight: 500 !important;
                    }
                    .dark .custom-select-large .ant-select-selection-placeholder {
                        color: #52525b !important;
                    }
                    .custom-select-popup {
                        border-radius: 1rem !important;
                        overflow: hidden !important;
                        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1) !important;
                    }
                `}</style>
            </form>
        </ConfigProvider>
    );
}
