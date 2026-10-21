import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ProductsCatalog from "@/components/ProductsCatalog";

export const metadata: Metadata = {
    title: "جميع المنتجات | RNQ PASSTERY",
    description: "تصفح جميع حلوياتنا الفاخرة وصفّها حسب التصنيف والسعر والتقييم.",
};

type SearchParams = { search?: string | string[] };

export default async function ProductsPage({
    searchParams,
}: {
    // Next 15 بيرجعها Promise، و Next 14 object عادي. await بتشتغل مع الاتنين
    searchParams?: Promise<SearchParams> | SearchParams;
}) {
    const params = await searchParams;
    const raw = params?.search;
    const search = Array.isArray(raw) ? raw[0] : raw ?? "";

    // key عشان لو البحث من النافبار اتغير والصفحة مفتوحة، الكتالوج يتحدث
    return (
        <>
            <Navbar />
            <ProductsCatalog key={search} initialSearch={search} />
        </>
    );
}
