import Image from 'next/image';

type HomeHeroBannerProps = {
    className?: string;
    headingLevel?: 'h1' | 'h2';
};

type HeroIconName =
    | 'shield'
    | 'care'
    | 'support'
    | 'bed'
    | 'wheelchair'
    | 'drop'
    | 'heart'
    | 'flask'
    | 'hospital'
    | 'kit';

const valueCards = [
    {
        icon: 'shield',
        title: 'PREMIUM QUALITY',
        description: ['Strict quality control,', 'safe and reliable'],
    },
    {
        icon: 'care',
        title: 'WIDE SELECTION',
        description: ['Medical supplies, equipment', 'and laboratory consumables'],
    },
    {
        icon: 'support',
        title: 'PROFESSIONAL SERVICE',
        description: ['Fast response,', 'full support'],
    },
] satisfies { icon: HeroIconName; title: string; description: string[] }[];

const solutionCategories = [
    { icon: 'bed', title: 'BED CARE' },
    { icon: 'wheelchair', title: 'REHABILITATION SUPPORT' },
    { icon: 'drop', title: 'DIAGNOSTIC TESTING' },
    { icon: 'heart', title: 'CHRONIC DISEASE MANAGEMENT' },
    { icon: 'flask', title: 'LABORATORY SUPPLIES' },
] satisfies { icon: HeroIconName; title: string }[];

const footerHighlights = [
    {
        icon: 'hospital',
        title: 'MEDICAL EQUIPMENT',
        description: ['High Performance,', 'Premium Quality'],
    },
    {
        icon: 'kit',
        title: 'MEDICAL SUPPLIES',
        description: ['Wide Selection,', 'Safe and Reliable'],
    },
    {
        icon: 'flask',
        title: 'LABORATORY CONSUMABLES',
        description: ['Accurate Testing,', 'Research-Grade Quality'],
    },
] satisfies { icon: HeroIconName; title: string; description: string[] }[];

function HeroIcon({ name, className = '' }: { name: HeroIconName; className?: string }) {
    const common = {
        className,
        fill: 'none',
        viewBox: '0 0 48 48',
        stroke: 'currentColor',
        strokeWidth: 3,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
        'aria-hidden': true,
    };

    switch (name) {
        case 'shield':
            return (
                <svg {...common}>
                    <path d="M24 5 39 10v10c0 10-6.5 18.5-15 23C15.5 38.5 9 30 9 20V10l15-5Z" />
                    <path d="M24 16v14" />
                    <path d="M17 23h14" />
                </svg>
            );
        case 'care':
            return (
                <svg {...common}>
                    <path d="M15 27c-4-5-4-11 0-14 3-2 7-1 9 3 2-4 6-5 9-3 4 3 4 9 0 14l-9 9-9-9Z" />
                    <path d="M8 31c5 6 11 9 16 9s11-3 16-9" />
                </svg>
            );
        case 'support':
            return (
                <svg {...common}>
                    <path d="M11 26v-5a13 13 0 0 1 26 0v5" />
                    <path d="M11 26h7v11h-7a4 4 0 0 1-4-4v-3a4 4 0 0 1 4-4Z" />
                    <path d="M37 26h-7v11h7a4 4 0 0 0 4-4v-3a4 4 0 0 0-4-4Z" />
                    <path d="M30 39h-7" />
                </svg>
            );
        case 'bed':
            return (
                <svg {...common}>
                    <path d="M8 17v19" />
                    <path d="M8 29h32" />
                    <path d="M40 24v12" />
                    <path d="M12 24h10a5 5 0 0 1 5 5" />
                    <path d="M12 24v-6h9a5 5 0 0 1 5 5v1" />
                </svg>
            );
        case 'wheelchair':
            return (
                <svg {...common}>
                    <circle cx="24" cy="10" r="4" />
                    <path d="M22 16v11h10l5 11" />
                    <path d="M21 22h10" />
                    <path d="M19 27a9 9 0 1 0 10 10" />
                </svg>
            );
        case 'drop':
            return (
                <svg {...common}>
                    <path d="M24 6C18 15 12 22 12 30a12 12 0 0 0 24 0c0-8-6-15-12-24Z" />
                </svg>
            );
        case 'heart':
            return (
                <svg {...common}>
                    <path d="M24 39 11 26c-5-5-4-13 2-16 4-2 8 0 11 4 3-4 7-6 11-4 6 3 7 11 2 16L24 39Z" />
                    <path d="M13 25h7l3-7 5 14 3-7h4" />
                </svg>
            );
        case 'flask':
            return (
                <svg {...common}>
                    <path d="M18 7h12" />
                    <path d="M21 7v12L12 35a5 5 0 0 0 4 8h16a5 5 0 0 0 4-8l-9-16V7" />
                    <path d="M17 32h14" />
                </svg>
            );
        case 'hospital':
            return (
                <svg {...common}>
                    <path d="M8 41h32" />
                    <path d="M12 41V15h14v26" />
                    <path d="M26 23h10v18" />
                    <path d="M19 21v10" />
                    <path d="M14 26h10" />
                    <path d="M31 29h2" />
                    <path d="M31 35h2" />
                </svg>
            );
        case 'kit':
            return (
                <svg {...common}>
                    <path d="M12 17h24a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V21a4 4 0 0 1 4-4Z" />
                    <path d="M19 17v-5h10v5" />
                    <path d="M24 24v11" />
                    <path d="M18.5 29.5h11" />
                </svg>
            );
    }
}

export default function HomeHeroBanner({ className = '', headingLevel = 'h1' }: HomeHeroBannerProps) {
    const Heading = headingLevel;

    return (
        <div
            className={`relative w-full [container-type:inline-size] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10 ${className}`}
        >
            <Image
                src="/home.png"
                alt="Medical equipment, supplies, laboratory consumables and healthcare products"
                width={2730}
                height={1536}
                sizes="(max-width: 768px) calc(100vw - 48px), 1280px"
                className="w-full h-auto block animate-fade-in"
            />

            <div className="absolute inset-0 text-[#08246d] font-sans pointer-events-none">
                <div className="absolute left-[6%] top-[20.8%] w-[45%]">
                    <Heading className="m-0 font-extrabold leading-[1.18] text-[clamp(10px,2.9cqw,38px)]">
                        <span className="block whitespace-nowrap">PROFESSIONAL MEDICAL CARE</span>
                        <span className="block whitespace-nowrap">
                            PROTECTING <strong className="text-[#0572ff] font-extrabold">HEALTH</strong>
                        </span>
                    </Heading>
                    <p className="mt-[2.2%] m-0 font-semibold leading-[1.35] text-[clamp(5px,1.45cqw,19px)]">
                        <span className="block">Global Medical Equipment Solutions</span>
                        <span className="block">for a Healthier Future</span>
                    </p>
                </div>

                <ul className="absolute left-[5.2%] top-[46%] w-[40.5%] grid grid-cols-3 gap-0 m-0 p-0 list-none">
                    {valueCards.map((item, index) => (
                        <li
                            key={item.title}
                            className={`relative pl-[22%] pr-[5%] ${index > 0 ? 'border-l border-[#6fa6ff]/65' : ''}`}
                        >
                            <HeroIcon
                                name={item.icon}
                                className="absolute left-[4%] top-[0] w-[14%] h-auto text-[#08246d]"
                            />
                            <h2 className="m-0 font-extrabold leading-none text-[clamp(3.2px,0.74cqw,10px)]">
                                {item.title}
                            </h2>
                            <p className="mt-[8%] m-0 font-semibold leading-[1.55] text-[clamp(3px,0.66cqw,9px)]">
                                {item.description.map((line) => (
                                    <span key={line} className="block">
                                        {line}
                                    </span>
                                ))}
                            </p>
                        </li>
                    ))}
                </ul>

                <p className="absolute left-[6%] top-[57.4%] w-[39%] m-0 rounded-full bg-[#0874ff] px-[1.25%] py-[0.45%] text-center font-extrabold leading-none text-white whitespace-nowrap text-[clamp(4.2px,1.02cqw,14px)]">
                    ONE-STOP MEDICAL SOLUTIONS FOR BETTER HEALTHCARE
                </p>

                <ul className="absolute left-[6%] top-[64.2%] w-[34.6%] grid grid-cols-5 gap-0 m-0 p-0 list-none">
                    {solutionCategories.map((category) => (
                        <li
                            key={category.title}
                            className="flex flex-col items-center px-[4%] text-center font-extrabold leading-[1.18] text-[clamp(3.2px,0.68cqw,9px)]"
                        >
                            <span className="mb-[8%] flex aspect-square w-[52%] items-center justify-center rounded-full border border-[#0d67ff] bg-white/30 text-[#0a49bd]">
                                <HeroIcon name={category.icon} className="w-[64%] h-[64%]" />
                            </span>
                            <span>{category.title}</span>
                        </li>
                    ))}
                </ul>

                <div
                    aria-hidden="true"
                    className="absolute left-0 bottom-0 h-[12.9%] w-[60%] bg-gradient-to-r from-[#1685ff] via-[#3495ff]/90 to-[#b8d8ff]/0"
                />

                <ul className="absolute left-[7.1%] bottom-[3.25%] z-10 w-[53.5%] grid grid-cols-3 gap-0 m-0 p-0 list-none text-white">
                    {footerHighlights.map((item, index) => (
                        <li
                            key={item.title}
                            className={`relative pl-[11%] pr-[6%] ${index > 0 ? 'border-l border-white/50' : ''}`}
                        >
                            <HeroIcon
                                name={item.icon}
                                className="absolute left-[1.5%] top-[2%] w-[7.9%] h-auto text-white"
                            />
                            <h2 className="m-0 font-semibold leading-none text-[clamp(4px,1cqw,13px)]">
                                {item.title}
                            </h2>
                            <p className="mt-[5%] m-0 font-normal leading-[1.55] text-[clamp(3.6px,0.85cqw,11px)]">
                                {item.description.map((line) => (
                                    <span key={line} className="block">
                                        {line}
                                    </span>
                                ))}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
