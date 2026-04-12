'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/supabase';
import { 
    PlusOutlined, 
    MinusOutlined, 
    SearchOutlined,
    QuestionCircleOutlined 
} from '@ant-design/icons';

export interface FAQ {
    id: string;
    category: string;
    question: string;
    answer: string;
    display_order: number;
    view_count: number;
}

interface FAQClientProps {
    faqs: FAQ[];
    locale: string;
}

export default function FAQClient({ faqs, locale }: FAQClientProps) {
    const t = useTranslations('FAQPage');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    // Get unique categories from FAQs
    const categories = useMemo(() => {
        const cats = Array.from(new Set(faqs.map(faq => faq.category)));
        return cats.sort();
    }, [faqs]);

    // Filter FAQs based on search and category
    const filteredFaqs = useMemo(() => {
        return faqs.filter(faq => {
            const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory ? faq.category === activeCategory : true;
            return matchesSearch && matchesCategory;
        });
    }, [faqs, searchQuery, activeCategory]);

    const toggleExpand = async (id: string) => {
        const next = new Set(expandedIds);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
            // Increment view count when expanded
            try {
                await supabase.rpc('increment_faq_view_count', { row_id: id }).then(({ error }) => {
                    if (error) {
                         // Fallback if RPC doesn't exist
                         const faq = faqs.find(f => f.id === id);
                         if (faq) {
                            supabase.from('faqs').update({ view_count: (faq.view_count || 0) + 1 }).eq('id', id);
                         }
                    }
                });
            } catch (err) {
                console.error('Failed to increment view count', err);
            }
        }
        setExpandedIds(next);
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Search and Category Filter */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white dark:bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <div className="relative w-full md:w-96">
                    <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-900 dark:text-zinc-100"
                    />
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeCategory === null
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                            }`}
                    >
                        {t('allCategories')}
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeCategory === cat
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                }`}
                        >
                            {t(`categories.${cat}`) || cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
                {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq) => {
                        const isExpanded = expandedIds.has(faq.id);
                        return (
                            <div
                                key={faq.id}
                                className={`group overflow-hidden rounded-[1.5rem] border transition-all duration-500 ${isExpanded
                                    ? 'bg-blue-50/30 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/50 shadow-lg shadow-blue-500/5'
                                    : 'bg-white dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800/80 hover:border-blue-200 dark:hover:border-zinc-700'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleExpand(faq.id)}
                                    className="w-full text-left p-6 md:p-8 flex items-start gap-4 md:gap-6 focus:outline-none"
                                >
                                    <div className={`mt-1 w-8 h-8 shrink-0 rounded-xl flex items-center justify-center transition-colors ${isExpanded
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600'
                                        }`}>
                                        <QuestionCircleOutlined className="text-lg" />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className={`text-lg md:text-xl font-bold transition-colors ${isExpanded
                                            ? 'text-blue-700 dark:text-blue-400'
                                            : 'text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600'
                                            }`}>
                                            {faq.question}
                                        </h3>
                                        <div className={`mt-2 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-40'}`}>
                                            <span className="text-blue-600 dark:text-blue-400">{t(`categories.${faq.category}`) || faq.category}</span>
                                        </div>
                                    </div>
                                    <div className="mt-1">
                                        {isExpanded ? (
                                            <MinusOutlined className="text-blue-500" />
                                        ) : (
                                            <PlusOutlined className="text-zinc-300 group-hover:text-blue-400" />
                                        )}
                                    </div>
                                </button>
                                
                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="px-6 pb-6 md:px-20 md:pb-10">
                                        <div 
                                            className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-24 text-center bg-zinc-50 dark:bg-zinc-900/30 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <SearchOutlined className="text-2xl text-zinc-300" />
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium">{t('noResults')}</p>
                    </div>
                )}
            </div>

            {/* Support CTA */}
            <div className="mt-8 p-10 md:p-16 rounded-[3rem] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 border border-blue-500/30 relative overflow-hidden text-center shadow-2xl shadow-blue-900/20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10">
                    {t('stillHaveQuestions')}
                </h2>
                <p className="text-blue-100/80 mb-8 max-w-lg mx-auto relative z-10 italic">
                   {locale === 'zh' ? '如果以上常见问题没有解决您的疑问，请随时联系我们的专业支持团队。' : 'Should the FAQs above not address your concerns, our dedicated support team is here to assist.'}
                </p>
                <a 
                    href={`/${locale}/contact`}
                    className="inline-flex items-center gap-3 bg-white text-blue-600 font-black py-4 px-10 rounded-2xl transition-all hover:scale-110 hover:shadow-2xl shadow-xl shadow-black/10 relative z-10"
                >
                    {t('contactSupport')}
                </a>
            </div>
        </div>
    );
}
