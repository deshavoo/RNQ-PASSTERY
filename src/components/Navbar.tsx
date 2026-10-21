"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import type { FormEvent, MouseEvent } from "react";
import { Globe, Search, Menu, X, ShoppingBag, User, LogOut, Heart, ArrowLeft } from "lucide-react";


export interface NavLink {
    label: string;
    href: string;
}

export interface NavbarLogo {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    className?: string;
}

export interface NavbarUser {
    name?: string | null;
}

export interface NavbarProps {
    logo?: NavbarLogo;
    links?: NavLink[];

    cartCount?: number;

    user?: NavbarUser | null;
    isAuthLoading?: boolean;

    homeHref?: string;
    cartHref?: string;
    profileHref?: string;
    favoritesHref?: string;
    loginHref?: string;

    onSearch?: (query: string) => void;
    searchHref?: string;

    onNavigate?: (href: string) => void;

    onLogout?: () => void;

    onLanguageToggle?: () => void;
    languageLabel?: string; // الافتراضي "English" في الموبايل و "EN" في الديسكتوب

    /** النصوص (عشان تقدر تغيرها أو تترجمها) */
    labels?: Partial<typeof DEFAULT_LABELS>;

    className?: string;
}


const DEFAULT_LOGO: NavbarLogo = {
    src: "/MyLogo.png",
    alt: "شعار الموقع",
    width: 180,
    height: 70,
};

const DEFAULT_LABELS = {
    mainNav: "التنقل الرئيسي",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    home: "الصفحة الرئيسية",
    searchPlaceholder: "ابحث...",
    searchPlaceholderMobile: "ابحث عن منتج...",
    searchLabel: "البحث عن المنتجات",
    openSearch: "فتح البحث",
    closeSearch: "إغلاق البحث",
    clearSearch: "مسح البحث",
    favorites: "المفضلة",
    cart: "سلة التسوق",
    login: "تسجيل الدخول",
    account: "حسابي",
    logout: "تسجيل الخروج",
    footer: "",
};

const DEFAULT_LINKS: NavLink[] = [
    { label: "المنتجات", href: "#products" },
    { label: "المناسبات", href: "#occasions" },
    { label: "حسب الطلب", href: "/custom-orders" },
    { label: "من نحن", href: "#about" },
];

export default function Navbar({
    logo = DEFAULT_LOGO,
    links = DEFAULT_LINKS,
    cartCount = 0,
    user = null,
    isAuthLoading = false,
    homeHref = "/",
    cartHref = "/cart",
    profileHref = "/profile",
    favoritesHref = "/profile",
    loginHref = "/auth",
    onSearch,
    searchHref = "/products",
    onNavigate,
    onLogout,
    onLanguageToggle,
    languageLabel,
    labels: labelsProp,
    className = "",
}: NavbarProps) {
    const labels = { ...DEFAULT_LABELS, ...labelsProp };

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    const safeItemCount = cartCount ?? 0;
    const isAuthenticated = !!user;

    // منع سكرول الصفحة والقائمة مفتوحة
    useEffect(() => {
        if (!isMobileMenuOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isMobileMenuOpen]);

    // inert بالـ ref عشان يشتغل مع React 18 و 19
    useEffect(() => {
        if (mobileMenuRef.current) {
            (mobileMenuRef.current as HTMLElement & { inert: boolean }).inert = !isMobileMenuOpen;
        }
    }, [isMobileMenuOpen]);

    // إغلاق بزرار Esc
    useEffect(() => {
        if (!isMobileMenuOpen && !isSearchOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            if (isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
                menuButtonRef.current?.focus();
            }
            if (isSearchOpen) setIsSearchOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isMobileMenuOpen, isSearchOpen]);

    // قفل القائمة لو الشاشة كبرت لمقاس md
    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 768px)");
        const handleChange = (e: MediaQueryListEvent) => {
            if (e.matches) setIsMobileMenuOpen(false);
        };
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    // فوكس تلقائي على حقل البحث لما يتفتح
    useEffect(() => {
        if (isSearchOpen) searchInputRef.current?.focus();
    }, [isSearchOpen]);

    const navigate = useCallback(
        (href: string) => {
            if (onNavigate) onNavigate(href);
            else window.location.assign(href);
        },
        [onNavigate]
    );

    const handleSearchSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const trimmed = searchQuery.trim();
            if (!trimmed) return;
            if (onSearch) onSearch(trimmed);
            else navigate(`${searchHref}?search=${encodeURIComponent(trimmed)}`);
            setIsSearchOpen(false);
            setIsMobileMenuOpen(false);
        },
        [searchQuery, onSearch, navigate, searchHref]
    );

    // كليك على أي رابط: سكرول للسكشن لو "#id"، أو تنقل عبر onNavigate لو متمرر
    const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith("#")) {
            e.preventDefault();
            const element = document.getElementById(href.slice(1));
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            } else {
                // السكشن مش في الصفحة دي، روح للرئيسية مع الهاش
                navigate(`${homeHref}${href}`);
            }
        } else if (onNavigate) {
            e.preventDefault();
            onNavigate(href);
        }
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
    };

    const firstName = user?.name?.split(" ")[0] || labels.account;

    return (
        <header
            className={`sticky top-0 z-50 w-full border-b border-[#c5a880]/20 bg-[#FEF8EB]/95 backdrop-blur-md transition-all duration-300 shadow-sm ${className}`}
        >
            <nav
                dir="rtl"
                aria-label={labels.mainNav}
                className="relative mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-3 sm:px-5 lg:px-8"
            >
                {/* روابط التنقل */}
                <div className="flex items-center gap-4 lg:gap-8">
                    <button
                        ref={menuButtonRef}
                        type="button"
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        aria-label={isMobileMenuOpen ? labels.closeMenu : labels.openMenu}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-[#005430] hover:bg-[#c5a880]/10 transition-colors md:hidden focus:outline-none focus:ring-2 focus:ring-[#c5a880]"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <ul className="hidden items-center gap-4 md:flex lg:gap-8">
                        {links.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    onClick={(e) => handleLinkClick(e, link.href)}
                                    className="group relative py-1 text-[13px] font-bold text-[#005430] transition-colors duration-200 hover:text-[#c5a880] lg:text-sm"
                                >
                                    {link.label}
                                    <span
                                        className="absolute inset-x-0 bottom-0 h-0.5 w-0 bg-[#c5a880] transition-all duration-300 group-hover:w-full"
                                        aria-hidden="true"
                                    />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* الشعار: بيتمركز تلقائياً، والعرض بيتظبط على حسب نسبة الصورة */}
                <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                    <a
                        href={homeHref}
                        onClick={(e) => handleLinkClick(e, homeHref)}
                        aria-label={logo.alt ?? labels.home}
                        className="flex items-center justify-center transition-transform duration-300 hover:scale-105 focus:outline-none"
                    >
                        <Image
                            src={logo.src}
                            alt={logo.alt ?? ""}
                            width={logo.width ?? 180}
                            height={logo.height ?? 70}
                            priority
                            className={
                                logo.className ??
                                "h-11 w-auto max-w-[38vw] object-contain sm:h-12 md:h-14 md:max-w-55 lg:h-16"
                            }
                        />
                    </a>
                </div>

                {/* البحث وأدوات المستخدم */}
                <div dir="ltr" className="flex items-center gap-1 sm:gap-1.5 lg:gap-3">
                    {/* البحث (مخفي تحت md، موجود جوه قائمة الموبايل) */}
                    <form
                        onSubmit={handleSearchSubmit}
                        role="search"
                        className={`hidden h-10 shrink-0 items-center rounded-full border bg-white/80 px-2.5 transition-none duration-300 ease-out focus-within:border-[#c5a880] focus-within:bg-white focus-within:shadow-[0_4px_18px_rgba(0,84,48,0.08)] md:flex ${isSearchOpen
                            ? "w-40 border-[#c5a880]/50 sm:w-52 lg:w-64"
                            : "w-10 border-transparent bg-transparent sm:w-40 sm:border-[#c5a880]/30 sm:bg-white/80 lg:w-52"
                            }`}
                    >
                        <button
                            type="button"
                            onClick={() => setIsSearchOpen((prev) => !prev)}
                            aria-label={isSearchOpen ? labels.closeSearch : labels.openSearch}
                            aria-expanded={isSearchOpen}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#005430] transition-colors hover:bg-[#c5a880]/15 hover:text-[#8f7041] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a880]"
                        >
                            {isSearchOpen ? <X size={18} strokeWidth={2} /> : <Search size={18} strokeWidth={2} />}
                        </button>

                        <input
                            ref={searchInputRef}
                            type="search"
                            dir="rtl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={labels.searchPlaceholder}
                            aria-label={labels.searchLabel}
                            tabIndex={isSearchOpen ? 0 : undefined}
                            className={`ml-1 min-w-0 flex-1 bg-transparent text-xs text-[#005430] outline-none placeholder:text-gray-400 lg:text-sm ${isSearchOpen ? "block" : "hidden sm:block"
                                }`}
                        />
                    </form>

                    {/* تغيير اللغة */}
                    {onLanguageToggle && (
                        <button
                            type="button"
                            onClick={onLanguageToggle}
                            aria-label={languageLabel ?? "English"}
                            className="hidden shrink-0 items-center gap-1.5 rounded-full border border-[#c5a880]/30 px-2.5 py-1.5 text-xs font-bold text-[#005430] transition-all duration-200 hover:border-[#c5a880] hover:bg-[#c5a880] hover:text-[#005430] lg:flex"
                        >
                            <Globe size={16} strokeWidth={2} />
                            <span className="hidden xl:inline-block">{languageLabel ?? "EN"}</span>
                        </button>
                    )}

                    {/* المفضلة */}
                    <a
                        href={favoritesHref}
                        onClick={(e) => handleLinkClick(e, favoritesHref)}
                        aria-label={labels.favorites}
                        className="relative hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#005430] transition-colors hover:bg-[#c5a880]/20 hover:text-[#c5a880] md:flex"
                    >
                        <Heart size={20} strokeWidth={2} />
                    </a>

                    {/* السلة */}
                    <a
                        href={cartHref}
                        onClick={(e) => handleLinkClick(e, cartHref)}
                        aria-label={`${labels.cart} (${safeItemCount})`}
                        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#005430] transition-colors hover:bg-[#c5a880]/20 hover:text-[#c5a880] md:h-10 md:w-10"
                    >
                        <ShoppingBag size={20} strokeWidth={2} />
                        {safeItemCount > 0 && (
                            <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c5a880] px-1 text-[10px] font-bold text-[#005430] shadow-sm">
                                {safeItemCount > 99 ? "99+" : safeItemCount}
                            </span>
                        )}
                    </a>

                    {/* قسم الحساب */}
                    {isAuthLoading ? (
                        <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-[#c5a880]/20 md:h-10 md:w-10" />
                    ) : isAuthenticated ? (
                        <div className="flex shrink-0 items-center gap-1.5">
                            <a
                                href={profileHref}
                                onClick={(e) => handleLinkClick(e, profileHref)}
                                aria-label={labels.account}
                                className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#c5a880]/40 bg-[#062920] px-2 py-1.5 text-xs font-bold text-[#c5a880] shadow-sm transition-all duration-300 hover:border-[#c5a880] hover:bg-[#c5a880] hover:text-[#005430] md:h-10 lg:px-3"
                            >
                                <User size={18} strokeWidth={2} className="shrink-0" />
                                <span className="hidden max-w-30 truncate sm:inline-block lg:max-w-none">
                                    {firstName}
                                </span>
                            </a>

                            {onLogout && (
                                <button
                                    type="button"
                                    onClick={onLogout}
                                    title={labels.logout}
                                    aria-label={labels.logout}
                                    className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-red-600 transition-colors hover:bg-red-50 md:flex"
                                >
                                    <LogOut size={20} strokeWidth={2.2} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <a
                            href={loginHref}
                            onClick={(e) => handleLinkClick(e, loginHref)}
                            aria-label={labels.login}
                            title={labels.login}
                            className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#c5a880]/40 bg-[#062920] px-2 py-1.5 text-xs font-bold text-[#c5a880] shadow-sm transition-all duration-300 hover:border-[#c5a880] hover:bg-[#c5a880] hover:text-[#005430] md:h-10 lg:px-3"
                        >
                            <User size={18} strokeWidth={2} className="shrink-0" />
                            <span className="hidden sm:inline-block">{labels.login}</span>
                        </a>
                    )}
                </div>
            </nav>

            {/* Overlay: بيظهر والقائمة مفتوحة، والضغط عليه يقفلها */}
            {isMobileMenuOpen && (
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                    className="absolute inset-x-0 top-full z-40 h-dvh bg-[#062920]/40 backdrop-blur-[2px] md:hidden"
                />
            )}

            {/* قائمة الموبايل */}
            <div
                ref={mobileMenuRef}
                id="mobile-menu"
                dir="rtl"
                aria-hidden={!isMobileMenuOpen}
                className={`absolute inset-x-0 top-full z-50 overflow-hidden border-t border-[#c5a880]/20 bg-[#FEF8EB] shadow-[0_16px_35px_rgba(0,84,48,0.10)] transition-all duration-300 ease-out md:hidden ${isMobileMenuOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-2 opacity-0 pointer-events-none"
                    }`}
            >
                <div className="max-h-[calc(100dvh-80px)] overflow-y-auto overscroll-contain px-5 py-5">
                    {/* البحث */}
                    <form
                        onSubmit={handleSearchSubmit}
                        role="search"
                        className="mb-5 flex min-h-12 items-center gap-3 rounded-2xl border border-[#c5a880]/30 bg-white px-4 shadow-sm focus-within:border-[#c5a880]"
                    >
                        <Search size={19} className="shrink-0 text-[#a88a5e]" aria-hidden="true" />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={labels.searchPlaceholderMobile}
                            aria-label={labels.searchLabel}
                            className="w-full bg-transparent py-3 text-sm text-[#005430] outline-none placeholder:text-gray-400"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                aria-label={labels.clearSearch}
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-[#c5a880]/15 hover:text-[#005430]"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </form>

                    {/* روابط */}
                    <ul className="flex flex-col">
                        {links.map((link, index) => (
                            <li
                                key={link.href}
                                className={`border-b border-[#c5a880]/15 ${index === 0 ? "border-t border-[#c5a880]/15" : ""}`}
                            >
                                <a
                                    href={link.href}
                                    onClick={(e) => handleLinkClick(e, link.href)}
                                    className="group flex min-h-13 items-center justify-between gap-4 py-3 text-[15px] font-bold text-[#005430] hover:text-[#8f7041]"
                                >
                                    <span>{link.label}</span>
                                    <ArrowLeft size={17} className="shrink-0 text-[#a88a5e] group-hover:-translate-x-1" />
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* أدوات المستخدم */}
                    <div className="mt-5 grid grid-cols-2 gap-3">
                        <a
                            href={favoritesHref}
                            onClick={(e) => handleLinkClick(e, favoritesHref)}
                            className="group flex min-h-22 flex-col items-center justify-center gap-2 rounded-2xl border border-[#c5a880]/25 bg-white/70 p-3 text-sm font-semibold text-[#005430] hover:border-[#c5a880]/60 hover:bg-white"
                        >
                            <Heart size={21} strokeWidth={1.8} className="text-[#a88a5e]" />
                            <span>{labels.favorites}</span>
                        </a>

                        <a
                            href={cartHref}
                            onClick={(e) => handleLinkClick(e, cartHref)}
                            className="group flex min-h-22 flex-col items-center justify-center gap-2 rounded-2xl border border-[#c5a880]/25 bg-white/70 p-3 text-sm font-semibold text-[#005430] hover:border-[#c5a880]/60 hover:bg-white"
                        >
                            <span className="relative">
                                <ShoppingBag size={21} strokeWidth={1.8} className="text-[#a88a5e]" />
                                {safeItemCount > 0 && (
                                    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c5a880] px-1 text-[9px] font-bold text-[#005430]">
                                        {safeItemCount > 99 ? "99+" : safeItemCount}
                                    </span>
                                )}
                            </span>
                            <span>{labels.cart}</span>
                        </a>

                        {onLanguageToggle && (
                            <button
                                type="button"
                                onClick={onLanguageToggle}
                                className="group flex min-h-22 flex-col items-center justify-center gap-2 rounded-2xl border border-[#c5a880]/25 bg-white/70 p-3 text-sm font-semibold text-[#005430] hover:border-[#c5a880]/60 hover:bg-white"
                            >
                                <Globe size={21} strokeWidth={1.8} className="text-[#a88a5e]" />
                                <span>{languageLabel ?? "English"}</span>
                            </button>
                        )}

                        <a
                            href={isAuthenticated ? profileHref : loginHref}
                            onClick={(e) => handleLinkClick(e, isAuthenticated ? profileHref : loginHref)}
                            className="group flex min-h-22 flex-col items-center justify-center gap-2 rounded-2xl border border-[#c5a880]/25 bg-white/70 p-3 text-sm font-semibold text-[#005430] hover:border-[#c5a880]/60 hover:bg-white"
                        >
                            <User size={21} strokeWidth={1.8} className="text-[#a88a5e]" />
                            <span>{isAuthenticated ? labels.account : labels.login}</span>
                        </a>
                    </div>

                    {isAuthenticated && onLogout && (
                        <button
                            type="button"
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                onLogout();
                            }}
                            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-red-200/80 px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-50"
                        >
                            <LogOut size={18} strokeWidth={1.8} />
                            <span>{labels.logout}</span>
                        </button>
                    )}

                    {labels.footer && (
                        <div className="mt-5 border-t border-[#c5a880]/15 pt-4 text-center">
                            <p className="text-[10px] font-medium tracking-[0.22em] text-[#005430]/45">
                                {labels.footer}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}