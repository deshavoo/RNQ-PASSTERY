"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    FaWhatsapp,
    FaInstagram,
    FaFacebook,
    FaPhone,
    FaShoppingBag,
    FaArrowLeft,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const CONTACT = {
    phone: "+966920017070",
};

const SOCIAL_LINKS = [
    {
        name: "WhatsApp",
        href: `https://wa.me/${CONTACT.phone.replace(/\D/g, "")}`,
        icon: FaWhatsapp,
        label: "تواصل معنا عبر واتساب",
    },
    {
        name: "Instagram",
        href: "https://www.instagram.com/saadeddinpastry",
        icon: FaInstagram,
        label: "تابعنا على إنستجرام",
    },
    {
        name: "Facebook",
        href: "https://www.facebook.com/saadeddinpastry",
        icon: FaFacebook,
        label: "تابعنا على فيسبوك",
    },
    {
        name: "X",
        href: "https://x.com/saadeddinpastry",
        icon: FaXTwitter,
        label: "تابعنا على منصة X",
    },
];

export default function TopBar() {
    const [visible, setVisible] = useState(true);
    const router = useRouter();

    useEffect(() => {
        let previousScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY <= 20) {
                setVisible(true);
            } else if (currentScrollY > previousScrollY + 3) {
                setVisible(false);
            } else if (currentScrollY < previousScrollY - 3) {
                setVisible(true);
            }

            previousScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToProducts = (
        e: React.MouseEvent<HTMLAnchorElement>
    ) => {
        e.preventDefault();

        const element = document.getElementById("products");

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        } else {
            router.push("/#products");
        }
    };

    return (
        <div
            dir="rtl"
            aria-label="شريط التواصل والعروض"
            aria-hidden={!visible}
            className={`relative z-40 overflow-hidden bg-[#005430] text-[#c5a880] transition-[opacity,transform] duration-200 ease-out ${visible
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-full opacity-0"
                }`}
        >
            {/* Top Gold Divider */}
            <div
                aria-hidden="true"
                className="h-px bg-linear-to-l from-transparent via-[#c5a880]/60 to-transparent"
            />

            <div className="mx-auto grid min-h-11 max-w-7xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 px-2 sm:gap-4 sm:px-6 lg:px-8">
                {/* Right Side: Saudi Identity and Contact */}
                <div className="flex min-w-0 items-center justify-start gap-2 sm:gap-4 lg:gap-6">
                    {/* Made in Saudi Arabia */}
                    <div className="flex shrink-0 items-center gap-1.5 rounded-md border border-[#c5a880]/20 bg-[#fef8eb]/10 px-1.5 py-1 text-[9px] font-semibold tracking-wide text-[#c5a880] min-[360px]:gap-2 min-[360px]:px-2 sm:px-2.5 sm:text-xs">
                        <div className="relative h-3 w-5 shrink-0 overflow-hidden rounded-xs shadow-xs sm:h-4 sm:w-6">
                            <Image
                                src="/flag-for-flag-saudi-arabia-svgrepo-com.svg"
                                alt="علم المملكة العربية السعودية"
                                fill
                                sizes="24px"
                                className="object-cover"
                            />
                        </div>

                        <span className="whitespace-nowrap">
                            صنع في السعودية
                        </span>
                    </div>

                    {/* Phone Number */}
                    <a
                        href={`tel:${CONTACT.phone}`}
                        aria-label="اتصل بنا"
                        className="hidden items-center gap-1.5 whitespace-nowrap text-xs transition-colors duration-200 hover:text-white md:flex"
                    >
                        <FaPhone aria-hidden="true" size={11} />

                        <span dir="ltr">{CONTACT.phone}</span>
                    </a>
                </div>

                {/* Center: Promotional CTA */}
                <div className="flex min-w-0 items-center justify-center">
                    <Link
                        href="/#products"
                        onClick={scrollToProducts}
                        aria-label="اكتشف منتجات حلويات سعد الدين"
                        className="group inline-flex shrink-0 items-center justify-center gap-1 rounded-full border border-[#c5a880]/50 bg-[#c5a880]/10 px-2 py-1.5 text-[9px] font-semibold text-[#f3dfb8] transition-all duration-300 hover:border-[#c5a880] hover:bg-[#c5a880] hover:text-[#005430] min-[360px]:gap-1.5 min-[360px]:px-2.5 sm:gap-2 sm:px-4 sm:text-xs"
                    >
                        <FaShoppingBag
                            aria-hidden="true"
                            size={11}
                            className="shrink-0"
                        />

                        <span className="whitespace-nowrap">
                            تسوق الآن
                        </span>

                        <FaArrowLeft
                            aria-hidden="true"
                            size={10}
                            className="hidden shrink-0 transition-transform duration-300 group-hover:-translate-x-1 sm:block"
                        />
                    </Link>
                </div>

                {/* Left Side: Social Media */}
                <nav
                    aria-label="حساباتنا على وسائل التواصل الاجتماعي"
                    className="flex min-w-0 items-center justify-end gap-0.5 min-[360px]:gap-1 sm:gap-2.5 lg:gap-3"
                >
                    {SOCIAL_LINKS.map((social) => {
                        const Icon = social.icon;

                        return (
                            <a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.label}
                                title={social.name}
                                className="flex h-7 w-5 shrink-0 items-center justify-center rounded-full text-[#c5a880] transition-all duration-200 hover:-translate-y-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a880] min-[360px]:w-6 sm:h-8 sm:w-7"
                            >
                                <Icon
                                    aria-hidden="true"
                                    size={14}
                                    className="transition-transform duration-200 hover:scale-110 sm:text-base"
                                />
                            </a>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Gold Divider */}
            <div
                aria-hidden="true"
                className="h-px bg-[#c5a880]/20"
            />
        </div>
    );
}

