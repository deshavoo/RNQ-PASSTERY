import Image, { type StaticImageData } from "next/image";

type AboutImage = {
    src: string | StaticImageData;
    alt: string;
    width?: number;
    height?: number;
};

type AboutSectionProps = {
    className?: string;
    largeImage?: AboutImage;
    smallImage?: AboutImage;
};

const DEFAULT_LARGE_IMAGE: AboutImage = {
    src: "/images/about/heritage-large.jpg",
    alt: "مجموعة من منتجات RNQ PASTRY للحلويات والمعجنات",
    width: 1000,
    height: 1250,
};

const DEFAULT_SMALL_IMAGE: AboutImage = {
    src: "/images/about/heritage-small.jpg",
    alt: "تفاصيل أحد منتجات RNQ PASTRY المصنوعة بعناية",
    width: 600,
    height: 750,
};

const HEADING_ID = "about-heading";

const STRUCTURED_DATA = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RNQ PASTRY",
    url: "https://www.rnq-group.com/",
    description:
        "RNQ PASTRY — علامة متخصصة في عالم الحلويات والمخبوزات، تهتم بجودة المنتجات والعناية بالتفاصيل وتقديم تجربة مميزة للعملاء.",
};

const BODY_TEXT =
    "text-base leading-8 text-white/75 sm:text-[17px] sm:leading-9";

const SUBHEADING =
    "text-xl font-semibold leading-snug text-[#c5a880] sm:text-2xl";

export default function AboutSection({
    className = "",
    largeImage = DEFAULT_LARGE_IMAGE,
    smallImage = DEFAULT_SMALL_IMAGE,
}: AboutSectionProps) {
    return (
        <section
            id="about"
            dir="rtl"
            lang="ar"
            aria-labelledby={HEADING_ID}
            className={`relative scroll-mt-20 overflow-x-clip bg-[#005430] bg-[radial-gradient(70rem_36rem_at_100%_0%,rgba(197,168,128,0.12),transparent_65%)] py-20 text-white sm:py-28 lg:py-32 ${className}`}
        >
            {/* Organization Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(STRUCTURED_DATA).replace(
                        /</g,
                        "\\u003c"
                    ),
                }}
            />

            <div className="mx-auto grid max-w-7xl gap-x-16 gap-y-12 px-6 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-x-20 lg:px-10 xl:gap-x-28">
                {/* Main Heading and Introduction */}
                <header className="lg:col-start-1 lg:row-start-1">
                    <p className="mb-5 text-xs font-semibold tracking-[0.2em] text-[#c5a880] sm:text-sm">
                        ABOUT RNQ PASTRY
                    </p>

                    <h2
                        id={HEADING_ID}
                        className="text-[1.875rem] font-light leading-[1.55] sm:text-5xl sm:leading-[1.4]"
                    >
                        RNQ PASTRY،
                        <span className="font-semibold text-[#c5a880]">
                            {" "}
                            شغفٌ بالتفاصيل
                        </span>
                        <br className="hidden sm:block" />
                        وتجربة تستحق التميّز
                    </h2>

                    <div
                        aria-hidden="true"
                        className="mt-7 h-px w-24 bg-[linear-gradient(to_left,#c5a880,transparent)] sm:mt-9 sm:w-32"
                    />

                    <p className="mt-7 max-w-[60ch] text-[1.0625rem] leading-9 text-white/85 sm:mt-9 sm:text-xl sm:leading-10">
                        في RNQ PASTRY، تبدأ التجربة من الاهتمام بالتفاصيل،
                        وتكتمل باختيار المنتجات وتقديمها بأسلوب يعكس هوية
                        العلامة التجارية. نؤمن بأن الجودة لا تقتصر على
                        المنتج نفسه، بل تمتد إلى كل تفصيلة تصنع تجربة
                        متكاملة ومميزة لعملائنا.
                    </p>
                </header>

                {/* Brand Images */}
                <figure className="relative mx-auto w-full max-w-md pb-24 sm:max-w-lg sm:pb-28 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none lg:self-start lg:sticky lg:top-28">
                    {/* Main Image */}
                    <div className="relative me-auto w-[84%]">
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-e-3 -top-3 h-full w-full rounded-2xl border border-[#c5a880]/45 sm:-inset-e-4 sm:-top-4"
                        />

                        <Image
                            src={largeImage.src}
                            alt={largeImage.alt}
                            width={largeImage.width ?? 1000}
                            height={largeImage.height ?? 1250}
                            sizes="(min-width: 1024px) 34vw, (min-width: 640px) 60vw, 84vw"
                            quality={85}
                            className="relative h-auto w-full rounded-2xl shadow-[0_30px_60px_-24px_rgba(0,0,0,0.55)]"
                        />
                    </div>

                    {/* Secondary Image */}
                    <div className="absolute bottom-0 inset-s-0 w-[44%] overflow-hidden rounded-xl border-[5px] border-[#005430] bg-[#005430] shadow-[0_24px_48px_-20px_rgba(0,0,0,0.6)] sm:border-8">
                        <Image
                            src={smallImage.src}
                            alt={smallImage.alt}
                            width={smallImage.width ?? 600}
                            height={smallImage.height ?? 750}
                            sizes="(min-width: 1024px) 16vw, (min-width: 640px) 28vw, 36vw"
                            quality={85}
                            className="block h-auto w-full"
                        />
                    </div>

                    {/* Brand Statement */}
                    <figcaption className="absolute bottom-0 inset-e-0 text-end">
                        <span className="block text-4xl font-light leading-tight tracking-tight text-[#c5a880] sm:text-5xl">
                            RNQ
                        </span>

                        <span className="mt-2 block text-sm text-white/70 sm:text-base">
                            شغف يصنع الفرق
                        </span>
                    </figcaption>
                </figure>

                {/* Brand Values */}
                <div className="space-y-10 sm:space-y-12 lg:col-start-1 lg:row-start-2">
                    <article className="border-t border-[#c5a880]/25 pt-8 sm:pt-10">
                        <h3 className={SUBHEADING}>
                            الجودة تبدأ من التفاصيل
                        </h3>

                        <p className={`mt-4 max-w-[62ch] ${BODY_TEXT}`}>
                            كل تفصيلة لها قيمتها؛ من اختيار المنتجات إلى
                            طريقة عرضها وتقديمها. لذلك نركز على بناء تجربة
                            متناسقة تعكس هوية RNQ PASTRY وتمنح العملاء
                            انطباعًا يليق بتوقعاتهم.
                        </p>
                    </article>

                    <article className="border-t border-[#c5a880]/25 pt-8 sm:pt-10">
                        <h3 className={SUBHEADING}>
                            تجربة تتجاوز المنتج
                        </h3>

                        <p className={`mt-4 max-w-[62ch] ${BODY_TEXT}`}>
                            نرى أن التجربة المميزة تتكون من مجموعة تفاصيل
                            متكاملة؛ فالمنتج وطريقة تقديمه وسهولة الوصول
                            إليه عناصر تعمل معًا لتكوين تجربة واضحة
                            ومريحة للعملاء.
                        </p>

                        <ul
                            role="list"
                            className="mt-7 max-w-[62ch] space-y-7"
                        >
                            <li className="border-s border-[#c5a880]/60 ps-5 sm:ps-6">
                                <p className={BODY_TEXT}>
                                    <strong className="font-semibold text-white">
                                        الاهتمام بالتفاصيل:
                                    </strong>{" "}
                                    العناية بطريقة عرض المنتجات وتقديمها
                                    بصورة تعكس شخصية العلامة التجارية.
                                </p>
                            </li>

                            <li className="border-s border-[#c5a880]/60 ps-5 sm:ps-6">
                                <p className={BODY_TEXT}>
                                    <strong className="font-semibold text-white">
                                        تجربة متكاملة:
                                    </strong>{" "}
                                    الاهتمام برحلة العميل وتقديم تجربة
                                    تتسم بالوضوح والاهتمام في مختلف
                                    نقاط التواصل مع العلامة التجارية.
                                </p>
                            </li>
                        </ul>
                    </article>

                    <article className="border-t border-[#c5a880]/25 pt-8 sm:pt-10">
                        <h3 className={SUBHEADING}>
                            هوية تعكس طموحنا
                        </h3>

                        <p className={`mt-4 max-w-[62ch] ${BODY_TEXT}`}>
                            تمثل RNQ PASTRY هوية نطمح إلى أن ترتبط
                            بالجودة والاهتمام بالتفاصيل. ونسعى إلى
                            تقديم تجربة متناسقة تجمع بين المنتج
                            وطريقة تقديمه، مع الحفاظ على شخصية
                            العلامة التجارية في كل تفاعل مع عملائنا.
                        </p>
                    </article>
                </div>
            </div>
        </section>
    );
}
