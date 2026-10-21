"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";


export interface Product {
    id: string;
    name: string;

    note?: string;
    price: number;
    compareAtPrice?: number;
    image?: string;
    badge?: string;
    category?: string;
    ratingAvg?: number;
    reviewCount?: number;
}


export const PRODUCTS: Product[] = [
    {
        id: "1",
        name: "كيك الشيكولاته  ",
        note: "كيك الشيكولاته الفاخر مع طبقة من الكريمة الغنية والشيكولاته الداكنة.",
        price: 120,
        compareAtPrice: 150,
        image: "/images/products/chocolate-cake.jpg",
        badge: "جديد",
        category: " كيكات",
        ratingAvg: 4.8,
        reviewCount: 32,
    },
    {
        id: "2",
        name: " تشيز كيك توت ",
        note: "تشيز كيك التوت الطازج مع قاعدة من البسكويت المقرمش وطبقة من الكريمة الغنية.",
        price: 85,
        image: "/images/products/berry-cheesecake.jpg",
        category: "كيكات طبيعية",
    },
    {
        id: "3",
        name: "كنافة نابلسية",
        note: "كنافة نابلسية تقليدية مع الجبن الحلو والمكسرات، تقدم ساخنة مع القطر.",
        price: 60,
        image: "/images/products/kunafa.jpg",
        badge: "الأكثر مبيعًا",
        category: " حلويات شرقية",
        ratingAvg: 4.5,
        reviewCount: 12,
    },
    {
        id: "4",
        name: "بقلاوة  ",
        note: "بقلاوة شرقية محشوة بالمكسرات ومغطاة بالقطر، تقدم كتحلية فاخرة.",
        price: 200,
        image: "/images/products/baklava.jpg",
        category: " حلويات شرقية",
    },
];



const CURRENCY = "ر.س";
const LOCALE = "ar-SA";
const VIEW_ALL_HREF = "/products";
const getProductHref = (product: Product) => `/products/${product.id}`;

const FALLBACK_IMAGE =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#F3EBDD"/><circle cx="400" cy="300" r="56" fill="none" stroke="#c5a880" stroke-width="6"/><path d="M372 300h56M400 272v56" stroke="#c5a880" stroke-width="6" stroke-linecap="round"/></svg>`
    );

const ALL = "all";

const formatNumber = (value: number, fractionDigits = 0) =>
    new Intl.NumberFormat(LOCALE, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    }).format(value);



interface ProductsSectionProps {
    products?: Product[];
    onAddToCart?: (product: Product) => void;
    onToggleWishlist?: (product: Product, liked: boolean) => void;
    initialWishlist?: string[];
    viewAllHref?: string;
}

export default function ProductsSection({
    products = PRODUCTS,
    onAddToCart,
    onToggleWishlist,
    initialWishlist = [],
    viewAllHref = VIEW_ALL_HREF,
}: ProductsSectionProps) {
    const [activeCategory, setActiveCategory] = useState<string>(ALL);
    const [wishlist, setWishlist] = useState<string[]>(initialWishlist);
    const [toast, setToast] = useState<string | null>(null);

    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 2400);
        return () => clearTimeout(timer);
    }, [toast]);

    // التابات من تصنيفات المنتجات نفسها (بترتيب ظهورها)
    const categories = useMemo(
        () => Array.from(new Set(products.map((p) => p.category).filter(Boolean) as string[])),
        [products]
    );

    // لو التصنيف النشط اختفى (مثلاً الداتا اتغيرت) نرجع لـ "الكل"
    const activeTab = categories.includes(activeCategory) ? activeCategory : ALL;

    const filteredProducts = useMemo(
        () => (activeTab === ALL ? products : products.filter((p) => p.category === activeTab)),
        [activeTab, products]
    );

    const toggleWishlist = (product: Product, e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const liked = !wishlist.includes(product.id);
        setWishlist((prev) => (liked ? [...prev, product.id] : prev.filter((id) => id !== product.id)));
        onToggleWishlist?.(product, liked);
    };

    const addToCart = (product: Product) => {
        onAddToCart?.(product);
        setToast(`تمت إضافة «${product.name}» إلى السلة`);
    };

    const scrollSlider = (direction: "next" | "prev") => {
        const slider = sliderRef.current;
        if (!slider) return;
        const amount = Math.max(slider.clientWidth * 0.8, 280);
        // الصفحة RTL: اتجاه السكرول معكوس في بعض المتصفحات القديمة، scrollBy بيتعامل معاه صح في الحديثة
        slider.scrollBy({ left: direction === "next" ? -amount : amount, behavior: "smooth" });
    };

    return (
        <section
            id="products"
            dir="rtl"
            aria-labelledby="products-heading"
            className="overflow-hidden bg-[#005430] py-16 text-[#FEF8EB] sm:py-20 lg:py-24"
        >
            <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-10">
                {/* Section Heading */}
                <div className="mb-10 text-center sm:mb-12">
                    <span className="mb-4 inline-flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-[#c5a880] sm:text-sm">
                        <span className="h-px w-8 bg-[#c5a880]" />
                        RNQ PASSTERY
                        <span className="h-px w-8 bg-[#c5a880]" />
                    </span>

                    <h2
                        id="products-heading"
                        className="mb-4 text-3xl font-bold leading-tight text-[#FEF8EB] sm:text-4xl lg:text-5xl"
                    >
                        اكتشف تشكيلتنا الفاخرة
                    </h2>

                    <p className="mx-auto max-w-2xl text-sm leading-8 text-[#FEF8EB]/80 sm:text-base">
                        من الحلويات الفاخرة إلى القهوة المميزة، اكتشف اختيارات صُنعت لتمنحك لحظات استثنائية في كل مرة.
                    </p>

                    <div className="mx-auto mt-6 h-0.5 w-16 rounded-full bg-[#c5a880]" />
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                    <div
                        className="mb-8 flex gap-2 overflow-x-auto pb-3 sm:mb-10 sm:flex-wrap sm:justify-center sm:overflow-visible"
                        role="group"
                        aria-label="تصنيفات المنتجات"
                    >
                        {[ALL, ...categories].map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveCategory(tab)}
                                    aria-pressed={isActive}
                                    className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-200 ${isActive
                                        ? "border-[#c5a880] bg-[#c5a880] font-bold text-[#005430] shadow-[0_4px_14px_rgba(197,168,128,0.3)]"
                                        : "border-[#c5a880]/30 bg-transparent text-[#FEF8EB]/80 hover:border-[#c5a880] hover:bg-white/10 hover:text-[#FEF8EB]"
                                        }`}
                                >
                                    {tab === ALL ? "الكل" : tab}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Slider Controls */}
                <div className="mb-5 flex items-center justify-between">
                    <p className="text-sm text-[#c5a880]">{formatNumber(filteredProducts.length)} منتجات</p>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => scrollSlider("prev")}
                            aria-label="عرض المنتجات السابقة"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c5a880]/40 text-[#FEF8EB] transition-colors duration-200 hover:border-[#c5a880] hover:bg-[#c5a880] hover:text-[#005430]"
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                                <path d="m10 5 7 7-7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            onClick={() => scrollSlider("next")}
                            aria-label="عرض المنتجات التالية"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c5a880]/40 text-[#FEF8EB] transition-colors duration-200 hover:border-[#c5a880] hover:bg-[#c5a880] hover:text-[#005430]"
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                                <path d="m14 5-7 7 7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Products Slider */}
                <div
                    ref={sliderRef}
                    className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-6 scrollbar-none [&::-webkit-scrollbar]:hidden sm:gap-6"
                >
                    {filteredProducts.map((product) => {
                        const isLiked = wishlist.includes(product.id);
                        const hasDiscount = product.compareAtPrice != null && product.compareAtPrice > product.price;
                        const hasReviews = (product.reviewCount ?? 0) > 0;
                        const href = getProductHref(product);
                        const image = product.image || FALLBACK_IMAGE;

                        return (
                            <article
                                key={product.id}
                                className="group w-[78%] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#c5a880]/30 bg-white text-[#005430] transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(0,0,0,0.2)] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]"
                            >
                                <Link
                                    href={href}
                                    className="relative block aspect-4/3 overflow-hidden bg-[#F3EBDD]"
                                    aria-label={`عرض ${product.name}`}
                                >
                                    <Image
                                        src={image}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 639px) 78vw, (max-width: 1023px) 48vw, (max-width: 1279px) 31vw, 24vw"
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />

                                    {product.badge && (
                                        <span className="absolute right-3 top-3 rounded-full border border-[#c5a880]/70 bg-[#FEF8EB]/95 px-3 py-1.5 text-xs font-semibold text-[#005430] shadow-sm">
                                            {product.badge}
                                        </span>
                                    )}

                                    {/* زر القلب (المفضلة) */}
                                    <button
                                        type="button"
                                        onClick={(e) => toggleWishlist(product, e)}
                                        aria-label={isLiked ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                                        aria-pressed={isLiked}
                                        className={`absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#c5a880]/40 shadow-md transition-transform duration-200 hover:scale-110 active:scale-95 ${isLiked
                                            ? "bg-rose-50 text-rose-600"
                                            : "bg-[#FEF8EB]/90 text-[#005430] hover:text-rose-600"
                                            }`}
                                    >
                                        <Heart
                                            size={18}
                                            fill={isLiked ? "currentColor" : "none"}
                                            className="transition-colors duration-200"
                                        />
                                    </button>
                                </Link>

                                <div className="p-4 sm:p-5">
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <span className="text-xs font-medium text-[#A88746]">
                                            {product.category || "حلويات فاخرة"}
                                        </span>

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
                                            {product.name}
                                        </h3>
                                    </Link>

                                    <p className="mb-5 line-clamp-2 min-h-10 text-xs leading-6 text-[#70685C] sm:text-sm">
                                        {product.note || "اختيار حلوى أنيق بطعم غني وقوام شهي."}
                                    </p>

                                    <div className="flex items-center justify-between gap-2 border-t border-[#F0E9DC] pt-4">
                                        <div>
                                            <span className="block text-[11px] text-[#968B7A]">السعر</span>
                                            <p className="mt-1 flex items-baseline gap-2 whitespace-nowrap text-base font-bold text-[#005430] sm:text-lg">
                                                <span>
                                                    {formatNumber(product.price)}{" "}
                                                    <span className="text-xs font-medium">{CURRENCY}</span>
                                                </span>
                                                {hasDiscount && (
                                                    <span className="text-xs font-medium text-[#968B7A] line-through">
                                                        {formatNumber(product.compareAtPrice as number)}
                                                    </span>
                                                )}
                                            </p>
                                        </div>

                                        {/* زر السلة */}
                                        <button
                                            type="button"
                                            onClick={() => addToCart(product)}
                                            aria-label={`أضف ${product.name} إلى السلة`}
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

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-[#c5a880]/40 py-16 text-center text-[#FEF8EB]">
                        <p className="text-lg font-semibold">لا توجد منتجات حاليًا</p>
                    </div>
                )}

                {/* View All */}
                <div className="mt-8 text-center">
                    <Link
                        href={viewAllHref}
                        className="inline-flex items-center justify-center rounded-full border border-[#c5a880] px-8 py-3 text-sm font-bold text-[#c5a880] transition-colors duration-200 hover:bg-[#c5a880] hover:text-[#005430] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a880] focus-visible:ring-offset-2 focus-visible:ring-offset-[#005430]"
                    >
                        عرض جميع المنتجات
                    </Link>
                </div>
            </div>

            {/* Toast */}
            <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-6 z-50 flex justify-center">
                {toast && (
                    <p
                        role="status"
                        className="rounded-xl border border-[#c5a880]/60 bg-[#FEF8EB] px-5 py-3 text-sm font-semibold text-[#005430] shadow-xl"
                    >
                        {toast}
                    </p>
                )}
            </div>
        </section>
    );
}