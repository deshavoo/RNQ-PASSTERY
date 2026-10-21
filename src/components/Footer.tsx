import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

/* ================================================================
 * 👇 إعدادات الفوتر (عدّل من هنا)
 * ================================================================ */

const BRAND_NAME = "RNQ PASSTERY";

// اللوجو: الملف في public/MyLogo.png
const LOGO = {
    src: "/MyLogo.png",
    alt: "شعار RNQ PASSTERY",
    width: 180, // أبعاد الصورة الأصلية
    height: 70,
};

const DEFAULT_TAGLINE = "حلويات فاخرة تُصنع بإتقان، لتمنحك لحظات استثنائية في كل مناسبة.";

// روابط التواصل: لو صفحة التواصل عندك مختلفة غيّر المسار هنا
const CONTACT_HREF = "/#support";

type FooterLink = { label: string; href: string };

const SHOP_LINKS: FooterLink[] = [
    { label: "المنتجات", href: "/products" },
    { label: "المناسبات", href: "/#occasions" },
    { label: "حسب الطلب", href: "/custom-orders" },
    { label: `عن ${BRAND_NAME}`, href: "/#about" },
];

const ACCOUNT_LINKS: FooterLink[] = [
    { label: "تسجيل الدخول", href: "/auth" },
    { label: "حسابي", href: "/profile" },
    { label: "سلة التسوق", href: "/cart" },
];

// الشريط السفلي: الشروط والسياسات
const LEGAL_LINKS: FooterLink[] = [
    { label: "شروط الخدمة", href: "/terms-of-service" },
    { label: "سياسة الخصوصية", href: "/privacy-policy" },
    { label: "سياسة الاسترجاع", href: "/refund-policy" },
    { label: "تواصل معنا", href: CONTACT_HREF },
];

/* ================================================================
 * الأنواع
 * ================================================================ */

type SocialName = "instagram" | "facebook" | "tiktok" | "x";

interface FooterProps {
    className?: string;
    tagline?: string;
    /** بيانات التواصل: بتظهر بس اللي تمرره */
    contact?: {
        phone?: string;
        email?: string;
        address?: string;
        hours?: string;
    };
    /** حسابات السوشيال: بتظهر بس اللي تمرره */
    socials?: { name: SocialName; href: string; label?: string }[];
}

/* ================================================================
 * أجزاء صغيرة
 * ================================================================ */

const LINK_CLASS =
    "inline-block rounded text-sm text-[#FEF8EB]/75 transition-colors duration-200 hover:text-[#c5a880] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a880] focus-visible:ring-offset-2 focus-visible:ring-offset-[#005430]";

function ColumnTitle({ children }: { children: string }) {
    return (
        <h2 className="mb-5 text-base font-bold text-[#FEF8EB]">
            {children}
            <span className="mt-2 block h-0.5 w-8 rounded-full bg-[#c5a880]" aria-hidden="true" />
        </h2>
    );
}

function SocialIcon({ name }: { name: SocialName }) {
    const common = { viewBox: "0 0 24 24", className: "h-[18px] w-[18px]", "aria-hidden": true } as const;
    switch (name) {
        case "instagram":
            return (
                <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
            );
        case "facebook":
            return (
                <svg {...common} fill="currentColor">
                    <path d="M13.5 21v-7.5H16l.5-3h-3V8.7c0-.9.3-1.5 1.6-1.5h1.5V4.5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.2H8v3h2.5V21h3Z" />
                </svg>
            );
        case "tiktok":
            return (
                <svg {...common} fill="currentColor">
                    <path d="M16.5 3a5.5 5.5 0 0 0 4 4.9v3.1a8.6 8.6 0 0 1-4-1.2v6.1a6 6 0 1 1-6-6c.3 0 .7 0 1 .1v3.2a2.9 2.9 0 1 0 1.9 2.7V3h3.1Z" />
                </svg>
            );
        case "x":
            return (
                <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
                    <path d="M4.5 4.5l15 15M19.5 4.5l-15 15" />
                </svg>
            );
    }
}

const SOCIAL_LABELS: Record<SocialName, string> = {
    instagram: "إنستغرام",
    facebook: "فيسبوك",
    tiktok: "تيك توك",
    x: "إكس",
};

/* ================================================================
 * الفوتر
 * ================================================================ */

export default function Footer({ className = "", tagline = DEFAULT_TAGLINE, contact, socials = [] }: FooterProps) {
    const year = new Date().getFullYear();
    const hasContactDetails = !!(contact?.phone || contact?.email || contact?.address || contact?.hours);

    return (
        <footer
            dir="rtl"
            aria-label={`تذييل ${BRAND_NAME}`}
            className={`relative overflow-hidden bg-[radial-gradient(ellipse_at_top,#0a6b3f_0%,#005430_55%,#062920_100%)] text-[#FEF8EB] ${className}`}
        >
            {/* خط ذهبي علوي */}
            <div
                aria-hidden="true"
                className="h-px w-full bg-[linear-gradient(to_left,transparent,#c5a880,transparent)]"
            />

            <div className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 sm:pt-16 lg:px-10 lg:pt-20">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-10 xl:gap-16">
                    {/* العلامة التجارية */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link
                            href="/"
                            aria-label={`${BRAND_NAME} - الصفحة الرئيسية`}
                            className="inline-flex rounded-2xl border border-[#c5a880]/60 bg-[#FEF8EB] px-5 py-3 shadow-[0_14px_34px_-14px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a880] focus-visible:ring-offset-2 focus-visible:ring-offset-[#005430]"
                        >
                            <Image
                                src={LOGO.src}
                                alt={LOGO.alt}
                                width={LOGO.width}
                                height={LOGO.height}
                                className="h-12 w-auto object-contain sm:h-14"
                            />
                        </Link>

                        <p className="mt-6 max-w-xs text-sm leading-8 text-[#FEF8EB]/75">{tagline}</p>

                        {socials.length > 0 && (
                            <ul className="mt-6 flex items-center gap-3" role="list">
                                {socials.map((s) => (
                                    <li key={`${s.name}-${s.href}`}>
                                        <a
                                            href={s.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={s.label ?? SOCIAL_LABELS[s.name]}
                                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c5a880]/50 text-[#c5a880] transition-colors duration-200 hover:border-[#c5a880] hover:bg-[#c5a880] hover:text-[#005430] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a880] focus-visible:ring-offset-2 focus-visible:ring-offset-[#005430]"
                                        >
                                            <SocialIcon name={s.name} />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* تسوق */}
                    <nav aria-label="روابط التسوق">
                        <ColumnTitle>تسوق</ColumnTitle>
                        <ul role="list" className="space-y-3.5">
                            {SHOP_LINKS.map((l) => (
                                <li key={l.href}>
                                    <Link href={l.href} className={LINK_CLASS}>
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* حسابك */}
                    <nav aria-label="روابط الحساب">
                        <ColumnTitle>حسابك</ColumnTitle>
                        <ul role="list" className="space-y-3.5">
                            {ACCOUNT_LINKS.map((l) => (
                                <li key={l.href}>
                                    <Link href={l.href} className={LINK_CLASS}>
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* التواصل */}
                    <div>
                        <ColumnTitle>تواصل معنا</ColumnTitle>

                        {hasContactDetails ? (
                            <ul role="list" className="space-y-4 text-sm text-[#FEF8EB]/80">
                                {contact?.phone && (
                                    <li className="flex items-center gap-3">
                                        <ContactIcon>
                                            <Phone size={16} aria-hidden="true" />
                                        </ContactIcon>
                                        <a
                                            href={`tel:${contact.phone.replace(/\s/g, "")}`}
                                            dir="ltr"
                                            className="rounded transition-colors hover:text-[#c5a880] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a880]"
                                        >
                                            {contact.phone}
                                        </a>
                                    </li>
                                )}
                                {contact?.email && (
                                    <li className="flex items-center gap-3">
                                        <ContactIcon>
                                            <Mail size={16} aria-hidden="true" />
                                        </ContactIcon>
                                        <a
                                            href={`mailto:${contact.email}`}
                                            dir="ltr"
                                            className="break-all rounded transition-colors hover:text-[#c5a880] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a880]"
                                        >
                                            {contact.email}
                                        </a>
                                    </li>
                                )}
                                {contact?.address && (
                                    <li className="flex items-start gap-3">
                                        <ContactIcon>
                                            <MapPin size={16} aria-hidden="true" />
                                        </ContactIcon>
                                        <span className="pt-1.5 leading-7">{contact.address}</span>
                                    </li>
                                )}
                                {contact?.hours && (
                                    <li className="flex items-start gap-3">
                                        <ContactIcon>
                                            <Clock size={16} aria-hidden="true" />
                                        </ContactIcon>
                                        <span className="pt-1.5 leading-7">{contact.hours}</span>
                                    </li>
                                )}
                            </ul>
                        ) : (
                            <>
                                <p className="mb-5 text-sm leading-7 text-[#FEF8EB]/75">
                                    عندك سؤال أو شكوى أو طلب خاص؟ فريقنا جاهز يساعدك.
                                </p>
                                <Link
                                    href={CONTACT_HREF}
                                    className="inline-flex items-center justify-center rounded-full border border-[#c5a880] px-6 py-2.5 text-sm font-bold text-[#c5a880] transition-colors duration-200 hover:bg-[#c5a880] hover:text-[#005430] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a880] focus-visible:ring-offset-2 focus-visible:ring-offset-[#005430]"
                                >
                                    أرسل لنا رسالة
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* الشريط السفلي: الحقوق + الشروط والسياسات */}
            <div className="border-t border-[#c5a880]/25 bg-[#062920]">
                <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-6 text-center sm:px-6 md:flex-row md:justify-between md:text-start lg:px-10">
                    <p className="text-xs leading-6 text-[#FEF8EB]/60">
                        © {year} {BRAND_NAME}. جميع الحقوق محفوظة.
                    </p>

                    <nav aria-label="الشروط والسياسات">
                        <ul role="list" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                            {LEGAL_LINKS.map((l) => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className="rounded text-xs font-medium text-[#FEF8EB]/70 transition-colors duration-200 hover:text-[#c5a880] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a880] focus-visible:ring-offset-2 focus-visible:ring-offset-[#062920]"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </footer>
    );
}

function ContactIcon({ children }: { children: ReactNode }) {
    return (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#c5a880]/40 text-[#c5a880]">
            {children}
        </span>
    );
}