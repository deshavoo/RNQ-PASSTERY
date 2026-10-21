"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Check,
    ChevronDown,
    ChevronLeft,
    Heart,
    Search,
    ShoppingBag,
    SlidersHorizontal,
    Star,
    X,
} from "lucide-react";
// ⚠️ لازم تضيف كلمة export قبل `const PRODUCTS` في ملف ProductSection.tsx
import { PRODUCTS, type Product } from "@/components/ProductSection";

/* ================================================================
 * إعدادات
 * ================================================================ */

const CURRENCY = "ر.س";
const LOCALE = "ar-SA";
const PAGE_SIZE = 12;
const OTHER_CATEGORY = "أخرى";
const getProductHref = (product: Product) => `/products/${product.id}`;

const FALLBACK_IMAGE =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#F3EBDD"/><circle cx="400" cy="300" r="56" fill="none" stroke="#c5a880" stroke-width="6"/><path d="M372 300h56M400 272v56" stroke="#c5a880" stroke-width="6" stroke-linecap="round"/></svg>`
    );

const SORT_OPTIONS = [
    { value: "featured", label: "الترتيب الافتراضي" },
    { value: "price-asc", label: "السعر: الأقل أولًا" },
    { value: "price-desc", label: "السعر: الأعلى أولًا" },
    { value: "rating", label: "الأعلى تقييمًا" },
] as const;
type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const RATING_OPTIONS = [
    { value: 0, label: "الكل" },
    { value: 4, label: "٤ فأكثر" },
    { value: 4.5, label: "٤٫٥ فأكثر" },
] as const;

const formatNumber = (value: number, fractionDigits = 0) =>
    new Intl.NumberFormat(LOCALE, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    }).format(value);

const formatPercent = (value: number) =>
    new Intl.NumberFormat(LOCALE, { style: "percent", maximumFractionDigits: 0 }).format(value);

// المسافات الزايدة في أسماء التصنيفات بتتشال
const categoryOf = (product: Product) => product.category?.trim() || OTHER_CATEGORY;
const hasDiscountOf = (product: Product) =>
    product.compareAtPrice != null && product.compareAtPrice > product.price;

/* ================================================================
 * الكمبوننت
 * ================================================================ */

interface ProductsCatalogProps {
    products?: Product[];
    /** بحث مبدئي (جاي من ?search= في اللينك) */
    initialSearch?: string;
}

export default function ProductsCatalog({ products = PRODUCTS, initialSearch = "" }: ProductsCatalogProps) {
    const [search, setSearch] = useState(initialSearch);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [onlyDiscount, setOnlyDiscount] = useState(false);
    const [minRating, setMinRating] = useState<number>(0);
    const [sort, setSort] = useState<SortValue>("featured");
    const [page, setPage] = useState({ key: "", count: PAGE_SIZE });

    const [wishlist, setWishlist] = useState<string[]>([]);
    const [toast, setToast] = useState<string | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    /* ───────────── بيانات مشتقة ───────────── */

    const categories = useMemo(() => {
        const counts = new Map<string, number>();
        for (const p of products) counts.set(categoryOf(p), (counts.get(categoryOf(p)) ?? 0) + 1);
        return Array.from(counts, ([name, count]) => ({ name, count }));
    }, [products]);

    const [lowestPrice, highestPrice] = useMemo(() => {
        const prices = products.map((p) => p.price);
        return prices.length ? [Math.min(...prices), Math.max(...prices)] : [0, 0];
    }, [products]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        const min = minPrice === "" ? -Infinity : Number(minPrice);
        const max = maxPrice === "" ? Infinity : Number(maxPrice);

        const result = products.filter((p) => {
            if (q && !`${p.name} ${p.note ?? ""} ${categoryOf(p)}`.toLowerCase().includes(q)) return false;
            if (selectedCategories.length && !selectedCategories.includes(categoryOf(p))) return false;
            if (p.price < min || p.price > max) return false;
            if (onlyDiscount && !hasDiscountOf(p)) return false;
            if (minRating && (p.ratingAvg ?? 0) < minRating) return false;
            return true;
        });

        if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
        else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
        else if (sort === "rating") result.sort((a, b) => (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0));

        return result;
    }, [products, search, selectedCategories, minPrice, maxPrice, onlyDiscount, minRating, sort]);

    // أي تغيير في الفلاتر بيغيّر الـ key فالعرض يرجع لأول صفحة تلقائيًا (من غير useEffect)
    const filterKey = JSON.stringify([search, selectedCategories, minPrice, maxPrice, onlyDiscount, minRating, sort]);
    const visibleCount = page.key === filterKey ? page.count : PAGE_SIZE;
    const visibleProducts = filtered.slice(0, visibleCount);

    /* ───────────── تأثيرات جانبية ───────────── */

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 2400);
        return () => clearTimeout(timer);
    }, [toast]);

    useEffect(() => {
        if (!drawerOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKey);
        };
    }, [drawerOpen]);

    // لو الشاشة كبرت والدرج مفتوح نقفله
    useEffect(() => {
        const mq = window.matchMedia("(min-width: 1024px)");
        const onChange = (e: MediaQueryListEvent) => e.matches && setDrawerOpen(false);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    /* ───────────── إجراءات ───────────── */

    const toggleCategory = (name: string) =>
        setSelectedCategories((prev) => (prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]));

    const resetAll = () => {
        setSearch("");
        setSelectedCategories([]);
        setMinPrice("");
        setMaxPrice("");
        setOnlyDiscount(false);
        setMinRating(0);
    };

    const toggleWishlist = (product: Product, e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setWishlist((prev) => (prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]));
    };

    const addToCart = (product: Product) => setToast(`تمت إضافة «${product.name}» إلى السلة`);

    /* ───────────── الفلاتر النشطة (chips) ───────────── */

    const chips = [
        ...(search.trim() ? [{ key: "q", label: `بحث: ${search.trim()}`, remove: () => setSearch("") }] : []),
        ...selectedCategories.map((c) => ({ key: `c-${c}`, label: c, remove: () => toggleCategory(c) })),
        ...(minPrice !== "" || maxPrice !== ""
            ? [
                  {
                      key: "price",
                      label: `السعر: ${formatNumber(minPrice !== "" ? Number(minPrice) : lowestPrice)} – ${formatNumber(
                          maxPrice !== "" ? Number(maxPrice) : highestPrice
                      )}`,
                      remove: () => {
                          setMinPrice("");
                          setMaxPrice("");
                      },
                  },
              ]
            : []),
        ...(onlyDiscount ? [{ key: "disc", label: "عروض وخصومات", remove: () => setOnlyDiscount(false) }] : []),
        ...(minRating > 0
            ? [{ key: "rate", label: `تقييم ${formatNumber(minRating, minRating % 1 ? 1 : 0)}+`, remove: () => setMinRating(0) }]
            : []),
    ];

    /* ───────────── محتوى الفلتر (بيتعرض في السايدبار وفي الدرج) ───────────── */

    const sectionTitle = "mb-3 flex items-center gap-3 text-sm font-bold text-[#005430]";
    const sectionRule = <span className="h-px flex-1 bg-[#c5a880]/40" aria-hidden="true" />;

    const filterBody = (
        <div className="space-y-7">
            {/* التصنيف */}
            <fieldset>
                <legend className={`${sectionTitle} w-full`}>
                    التصنيف {sectionRule}
                </legend>
                <div className="-my-1">
                    {categories.map(({ name, count }) => (
                        <label key={name} className="flex cursor-pointer items-center gap-3 py-2 text-sm text-[#005430]">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(name)}
                                onChange={() => toggleCategory(name)}
                                className="peer sr-only"
                            />
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-[#c5a880]/70 bg-white text-transparent transition-colors peer-checked:border-[#005430] peer-checked:bg-[#005430] peer-checked:text-[#FEF8EB] peer-focus-visible:ring-2 peer-focus-visible:ring-[#c5a880] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#FEF8EB]">
                                <Check size={13} strokeWidth={3} aria-hidden="true" />
                            </span>
                            <span className="flex-1">{name}</span>
                            <span className="text-xs text-[#968B7A]">{formatNumber(count)}</span>
                        </label>
                    ))}
                </div>
            </fieldset>

            {/* السعر */}
            <fieldset>
                <legend className={`${sectionTitle} w-full`}>
                    السعر ({CURRENCY}) {sectionRule}
                </legend>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder={String(lowestPrice)}
                        aria-label="أقل سعر"
                        className="h-11 w-full min-w-0 rounded-xl border border-[#c5a880]/40 bg-white px-3 text-center text-sm text-[#005430] outline-none transition-colors placeholder:text-[#968B7A]/70 focus:border-[#c5a880]"
                    />
                    <span className="text-[#c5a880]" aria-hidden="true">
                        –
                    </span>
                    <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder={String(highestPrice)}
                        aria-label="أعلى سعر"
                        className="h-11 w-full min-w-0 rounded-xl border border-[#c5a880]/40 bg-white px-3 text-center text-sm text-[#005430] outline-none transition-colors placeholder:text-[#968B7A]/70 focus:border-[#c5a880]"
                    />
                </div>
            </fieldset>

            {/* التقييم */}
            <fieldset>
                <legend className={`${sectionTitle} w-full`}>
                    التقييم {sectionRule}
                </legend>
                <div className="flex flex-wrap gap-2">
                    {RATING_OPTIONS.map((opt) => {
                        const active = minRating === opt.value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setMinRating(opt.value)}
                                aria-pressed={active}
                                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                                    active
                                        ? "border-[#005430] bg-[#005430] text-[#FEF8EB]"
                                        : "border-[#c5a880]/40 bg-white text-[#005430] hover:border-[#c5a880]"
                                }`}
                            >
                                {opt.value > 0 && <Star size={12} fill="currentColor" className="text-amber-400" aria-hidden="true" />}
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </fieldset>

            {/* العروض */}
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#c5a880]/30 bg-white px-4 py-3 text-sm font-semibold text-[#005430]">
                <span>عروض وخصومات فقط</span>
                <input
                    type="checkbox"
                    role="switch"
                    checked={onlyDiscount}
                    onChange={(e) => setOnlyDiscount(e.target.checked)}
                    className="peer sr-only"
                />
                <span className="relative h-6 w-11 shrink-0 rounded-full bg-[#c5a880]/35 transition-colors after:absolute after:right-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:bg-[#005430] peer-checked:after:right-5.5 peer-focus-visible:ring-2 peer-focus-visible:ring-[#c5a880] peer-focus-visible:ring-offset-2" />
            </label>
        </div>
    );

    /* ───────────── الواجهة ───────────── */

    return (
        <main id="products" dir="rtl" className="min-h-screen scroll-mt-20 bg-[#FEF8EB] text-[#005430]">
            {/* الهيدر */}
            <header className="relative overflow-hidden border-b border-[#c5a880]/40 bg-[radial-gradient(ellipse_at_top,#0a6b3f_0%,#005430_65%)] py-12 text-center text-[#FEF8EB] sm:py-16">
                <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-10">
                    <nav aria-label="مسار التصفح" className="mb-6 flex items-center justify-center gap-2 text-xs text-[#FEF8EB]/70">
                        <Link href="/" className="transition-colors hover:text-[#c5a880]">
                            الرئيسية
                        </Link>
                        <ChevronLeft size={14} aria-hidden="true" className="text-[#c5a880]" />
                        <span aria-current="page" className="font-semibold text-[#c5a880]">
                            المنتجات
                        </span>
                    </nav>

                    <span className="mb-4 inline-flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-[#c5a880] sm:text-sm">
                        <span className="h-px w-8 bg-[#c5a880]" />
                        RNQ PASSTERY
                        <span className="h-px w-8 bg-[#c5a880]" />
                    </span>

                    <h1 className="mb-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">جميع المنتجات</h1>
                    <p className="mx-auto max-w-xl text-sm leading-8 text-[#FEF8EB]/80 sm:text-base">
                        تشكيلة كاملة من حلوياتنا الفاخرة، اختر منها ما يناسب مناسبتك.
                    </p>
                    <div className="mx-auto mt-6 h-0.5 w-16 rounded-full bg-[#c5a880]" />
                </div>
            </header>

            <div className="mx-auto max-w-360 px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                    {/* الفلتر (على اليمين في RTL) */}
                    <aside
                        aria-label="تصفية المنتجات"
                        className="hidden w-72 shrink-0 rounded-2xl border border-[#c5a880]/40 bg-white/60 p-6 shadow-[0_10px_30px_rgba(0,84,48,0.06)] lg:sticky lg:top-28 lg:block xl:w-80"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-base font-bold text-[#005430]">
                                <SlidersHorizontal size={18} className="text-[#a88a5e]" aria-hidden="true" />
                                تصفية
                            </h2>
                            {chips.length > 0 && (
                                <button
                                    type="button"
                                    onClick={resetAll}
                                    className="text-xs font-semibold text-[#A88746] underline-offset-4 hover:underline"
                                >
                                    مسح الكل
                                </button>
                            )}
                        </div>
                        {filterBody}
                    </aside>

                    {/* النتائج */}
                    <section className="min-w-0 flex-1" aria-label="قائمة المنتجات">
                        {/* شريط الأدوات */}
                        <div className="mb-5 flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setDrawerOpen(true)}
                                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#c5a880]/50 bg-white px-4 text-sm font-bold text-[#005430] transition-colors hover:border-[#c5a880] lg:hidden"
                            >
                                <SlidersHorizontal size={17} aria-hidden="true" />
                                تصفية
                                {chips.length > 0 && (
                                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#005430] px-1 text-[11px] text-[#FEF8EB]">
                                        {formatNumber(chips.length)}
                                    </span>
                                )}
                            </button>

                            <div className="flex h-11 min-w-0 flex-1 basis-56 items-center gap-2 rounded-xl border border-[#c5a880]/40 bg-white px-3 focus-within:border-[#c5a880]">
                                <Search size={18} className="shrink-0 text-[#a88a5e]" aria-hidden="true" />
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="ابحث في المنتجات..."
                                    aria-label="البحث في المنتجات"
                                    className="w-full bg-transparent text-sm text-[#005430] outline-none placeholder:text-[#968B7A]"
                                />
                            </div>

                            <div className="relative">
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value as SortValue)}
                                    aria-label="ترتيب المنتجات"
                                    className="h-11 appearance-none rounded-xl border border-[#c5a880]/40 bg-white pl-9 pr-4 text-sm font-semibold text-[#005430] outline-none transition-colors focus:border-[#c5a880]"
                                >
                                    {SORT_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={16}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#a88a5e]"
                                />
                            </div>
                        </div>

                        {/* العدد + الفلاتر النشطة */}
                        <div className="mb-6 flex flex-wrap items-center gap-2">
                            <p className="ml-2 text-sm text-[#70685C]" aria-live="polite">
                                {formatNumber(filtered.length)} منتج
                            </p>
                            {chips.map((chip) => (
                                <button
                                    key={chip.key}
                                    type="button"
                                    onClick={chip.remove}
                                    aria-label={`إزالة الفلتر ${chip.label}`}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-[#c5a880]/50 bg-white px-3 py-1.5 text-xs font-semibold text-[#005430] transition-colors hover:border-[#005430]"
                                >
                                    {chip.label}
                                    <X size={13} className="text-[#a88a5e]" aria-hidden="true" />
                                </button>
                            ))}
                            {chips.length > 1 && (
                                <button
                                    type="button"
                                    onClick={resetAll}
                                    className="text-xs font-semibold text-[#A88746] underline-offset-4 hover:underline"
                                >
                                    مسح الكل
                                </button>
                            )}
                        </div>

                        {/* الشبكة */}
                        {visibleProducts.length > 0 ? (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                                {visibleProducts.map((product) => {
                                    const isLiked = wishlist.includes(product.id);
                                    const hasDiscount = hasDiscountOf(product);
                                    const hasReviews = (product.reviewCount ?? 0) > 0;
                                    const href = getProductHref(product);

                                    return (
                                        <article
                                            key={product.id}
                                            className="group overflow-hidden rounded-2xl border border-[#c5a880]/30 bg-white text-[#005430] shadow-[0_6px_20px_rgba(0,84,48,0.06)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#c5a880]/70 hover:shadow-[0_16px_38px_rgba(0,84,48,0.14)]"
                                        >
                                            <Link
                                                href={href}
                                                className="relative block aspect-4/3 overflow-hidden bg-[#F3EBDD]"
                                                aria-label={`عرض ${product.name}`}
                                            >
                                                <Image
                                                    src={product.image || FALLBACK_IMAGE}
                                                    alt={product.name}
                                                    fill
                                                    sizes="(max-width: 639px) 92vw, (max-width: 1279px) 46vw, 30vw"
                                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                />

                                                {product.badge && (
                                                    <span className="absolute right-3 top-3 rounded-full border border-[#c5a880]/70 bg-[#FEF8EB]/95 px-3 py-1.5 text-xs font-semibold text-[#005430] shadow-sm">
                                                        {product.badge}
                                                    </span>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={(e) => toggleWishlist(product, e)}
                                                    aria-label={isLiked ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                                                    aria-pressed={isLiked}
                                                    className={`absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#c5a880]/40 shadow-md transition-transform duration-200 hover:scale-110 active:scale-95 ${
                                                        isLiked
                                                            ? "bg-rose-50 text-rose-600"
                                                            : "bg-[#FEF8EB]/90 text-[#005430] hover:text-rose-600"
                                                    }`}
                                                >
                                                    <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                                                </button>
                                            </Link>

                                            <div className="p-4 sm:p-5">
                                                <div className="mb-2 flex items-center justify-between gap-2">
                                                    <span className="text-xs font-medium text-[#A88746]">{categoryOf(product)}</span>

                                                    {hasReviews && (
                                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#70685C]">
                                                            <Star size={12} fill="currentColor" className="text-amber-400" aria-hidden="true" />
                                                            {formatNumber(product.ratingAvg ?? 0, 1)}
                                                            <span className="font-normal text-[#968B7A]">
                                                                ({formatNumber(product.reviewCount ?? 0)})
                                                            </span>
                                                        </span>
                                                    )}
                                                </div>

                                                <Link href={href}>
                                                    <h3 className="mb-2 line-clamp-1 text-base font-bold text-[#005430] transition-colors duration-200 group-hover:text-[#A88746] sm:text-lg">
                                                        {product.name.trim()}
                                                    </h3>
                                                </Link>

                                                <p className="mb-5 line-clamp-2 min-h-10 text-xs leading-6 text-[#70685C] sm:text-sm">
                                                    {product.note || "اختيار حلوى أنيق بطعم غني وقوام شهي."}
                                                </p>

                                                <div className="flex items-center justify-between gap-2 border-t border-[#F0E9DC] pt-4">
                                                    <div>
                                                        <span className="block text-[11px] text-[#968B7A]">السعر</span>
                                                        <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-base font-bold text-[#005430] sm:text-lg">
                                                            <span className="whitespace-nowrap">
                                                                {formatNumber(product.price)}{" "}
                                                                <span className="text-xs font-medium">{CURRENCY}</span>
                                                            </span>
                                                            {hasDiscount && (
                                                                <>
                                                                    <span className="text-xs font-medium text-[#968B7A] line-through">
                                                                        {formatNumber(product.compareAtPrice as number)}
                                                                    </span>
                                                                    <span className="rounded-full bg-[#c5a880]/25 px-2 py-0.5 text-[10px] font-bold text-[#7a5f2e]">
                                                                        خصم{" "}
                                                                        {formatPercent(
                                                                            1 - product.price / (product.compareAtPrice as number)
                                                                        )}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => addToCart(product)}
                                                        aria-label={`أضف ${product.name.trim()} إلى السلة`}
                                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#005430] text-[#FEF8EB] transition-colors duration-200 hover:bg-[#c5a880] hover:text-[#005430] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a880] focus-visible:ring-offset-2"
                                                    >
                                                        <ShoppingBag size={18} strokeWidth={2} />
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-[#c5a880]/60 bg-white/50 px-6 py-16 text-center">
                                <p className="mb-2 text-lg font-bold text-[#005430]">مفيش منتجات بالمواصفات دي</p>
                                <p className="mb-6 text-sm text-[#70685C]">جرّب تغيّر الفلاتر أو تبحث بكلمة تانية.</p>
                                <button
                                    type="button"
                                    onClick={resetAll}
                                    className="rounded-full border border-[#005430] px-7 py-2.5 text-sm font-bold text-[#005430] transition-colors hover:bg-[#005430] hover:text-[#FEF8EB]"
                                >
                                    مسح كل الفلاتر
                                </button>
                            </div>
                        )}

                        {/* عرض المزيد */}
                        {filtered.length > visibleCount && (
                            <div className="mt-10 text-center">
                                <button
                                    type="button"
                                    onClick={() => setPage({ key: filterKey, count: visibleCount + PAGE_SIZE })}
                                    className="rounded-full border border-[#005430] px-8 py-3 text-sm font-bold text-[#005430] transition-colors duration-200 hover:bg-[#005430] hover:text-[#FEF8EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a880] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FEF8EB]"
                                >
                                    عرض المزيد ({formatNumber(filtered.length - visibleCount)})
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* درج الفلتر على الموبايل */}
            {drawerOpen && (
                <div className="fixed inset-0 z-60 lg:hidden" role="dialog" aria-modal="true" aria-label="تصفية المنتجات">
                    <div
                        onClick={() => setDrawerOpen(false)}
                        aria-hidden="true"
                        className="absolute inset-0 bg-[#062920]/50 backdrop-blur-[2px]"
                    />
                    <div className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-[#FEF8EB] shadow-2xl">
                        <div className="flex items-center justify-between border-b border-[#c5a880]/30 px-5 py-4">
                            <h2 className="flex items-center gap-2 text-base font-bold text-[#005430]">
                                <SlidersHorizontal size={18} className="text-[#a88a5e]" aria-hidden="true" />
                                تصفية
                            </h2>
                            <button
                                type="button"
                                onClick={() => setDrawerOpen(false)}
                                aria-label="إغلاق"
                                className="flex h-10 w-10 items-center justify-center rounded-full text-[#005430] transition-colors hover:bg-[#c5a880]/15"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6">{filterBody}</div>

                        <div className="flex gap-3 border-t border-[#c5a880]/30 px-5 py-4">
                            <button
                                type="button"
                                onClick={resetAll}
                                disabled={chips.length === 0}
                                className="h-12 rounded-xl border border-[#c5a880]/60 px-5 text-sm font-bold text-[#005430] transition-colors hover:border-[#005430] disabled:opacity-40"
                            >
                                مسح
                            </button>
                            <button
                                type="button"
                                onClick={() => setDrawerOpen(false)}
                                className="h-12 flex-1 rounded-xl bg-[#005430] text-sm font-bold text-[#FEF8EB] transition-colors hover:bg-[#0a6b3f]"
                            >
                                عرض {formatNumber(filtered.length)} منتج
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-6 z-70 flex justify-center">
                {toast && (
                    <p
                        role="status"
                        className="rounded-xl border border-[#c5a880]/60 bg-[#FEF8EB] px-5 py-3 text-sm font-semibold text-[#005430] shadow-xl"
                    >
                        {toast}
                    </p>
                )}
            </div>
        </main>
    );
}
