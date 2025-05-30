// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import { ProductGallery } from "../components/ImageCarousel";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AddToCartTable from "../components/AddToCartTable";
import { FaYoutube } from "react-icons/fa";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});


type Product = {
    title: string;
    images: string[];
    management: string;
    refrigerant: string;
    slug: string;
    area_options: string[];
    models: string[];
    prices: number[];
    cooling_capacity: string;
    manufacturer_logo: string;
    manufacturer_link: string;
    manufacturer_desc: string;
    dealer_link: string;
    dealer_desc: string;
    specs: {
        [key: string]: string | null;
    };
};
interface PageProps {
    params: { slug: string }
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
    const res = await pool.query<{ slug: string }>("SELECT slug FROM product WHERE slug IS NOT NULL");
    return res.rows
        .filter(row => typeof row.slug === "string" && row.slug.length > 0)
        .map(row => ({ slug: row.slug }));  // <-- без обёртки params!
}



export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    // Нужно await params, чтобы получить объект с параметрами
    const { slug } = await params;

    const result = await pool.query("SELECT * FROM product WHERE slug = $1 LIMIT 1", [slug]);
    if (result.rows.length === 0) return notFound();

    const product: Product = result.rows[0];

    let images: string[] = [];

    if (Array.isArray(product.images)) {
        images = (product.images as { url?: string }[])
            .map(item => item.url)
            .filter((url): url is string => typeof url === 'string' && url.trim() !== '');
    } else {
        images = [];
    }

    const coolingRange = product.specs?.working_temp_cooling || "";
    const heatingRange = product.specs?.working_temp_heating || "";
    const combinedRange =
        coolingRange && heatingRange ? `${coolingRange}; ${heatingRange}` : coolingRange || heatingRange || "—";

    const specFields: { label: string; key: string }[] = [
        { label: "Охлаждение (кВт)", key: "cooling_power" },
        { label: "Нагрев (кВт)", key: "heating_power" },
        { label: "Холодопроизводительность, кВт", key: "cooling_capacity" },
        { label: "Электропитание (Ф / В / Гц)", key: "power_supply" },
        { label: "Энергоэффективность (EER)", key: "energy_efficiency" },
        { label: "Эффективность нагрева (COP)", key: "heating_efficiency" },
        { label: "Уровень шума (дБА)", key: "noise_level" },
        { label: "Размеры внутреннего блока (мм)", key: "dimensions_inner" },
        { label: "Размеры наружного блока (мм)", key: "dimensions_outer" },
        { label: "Вес внутреннего блока (кг)", key: "weight_inner" },
        { label: "Вес наружного блока (кг)", key: "weight_outer" },
        { label: "Тип хладагента", key: "refrigerant_type" },
        { label: "Заправка хладагента (кг)", key: "refrigerant_charge" },
        { label: "Диаметр трубки жидкости (мм)", key: "pipe_liquid" },
        { label: "Диаметр трубки газа (мм)", key: "pipe_gas" },
        { label: "Длина трубопровода (м)", key: "pipe_length" },
        { label: "Перепад высот (м)", key: "pipe_difference" },
        { label: "Диапазон температур охлаждения (°C)", key: "working_temp_cooling" },
        { label: "Диапазон температур нагрева (°C)", key: "working_temp_heating" },
        { label: "Срок эксплуатации", key: "lifetime" },
        { label: "Страна производства", key: "manufacturer_country" },
    ];

    return (
        <div>
            <Header />

            <div className="container max-w-[1350px] m-auto mx-auto px-4 mt-32">
                <div className="inline-block">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{product.title}</h1>
                    <div className="w-full h-1 bg-[#C7E07A] mt-2 mb-6"></div>
                </div>
            </div>

            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-5 md:mr-4">
                    <ProductGallery images={images} />
                </div>

                <div className="md:col-span-3 md:ml-5 flex flex-col justify-center space-y-3 md:mr-4">
                    <div>
                        <div className="text-sm text-gray-500">Для помещения площадью, м²</div>
                        <div className="text-lg font-semibold">{product.area_options?.join(", ") || "—"}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Управление</div>
                        <div className="text-lg font-semibold">{product.management || "—"}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Хладагент</div>
                        <div className="text-lg font-semibold">{product.refrigerant || "—"}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Диапазон температур</div>
                        <div className="text-lg font-semibold">{combinedRange}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Холодопроизводительность, кВт</div>
                        <div className="text-lg font-semibold">{product.cooling_capacity || "—"}</div>
                    </div>
                </div>

                <div className="md:col-span-3 flex flex-col justify-center gap-4">
                    <div className="p-6 border border-[#C7E07A] bg-[#333333] rounded-2xl mt-4">
                        <h2 className="text-2xl font-bold mb-4 text-white flex items-center">Узнать больше на YouTube</h2>
                        <p className="mb-4 text-white">
                            Посмотрите видео о {product.title} на YouTube, чтобы узнать больше о его характеристиках и преимуществах.
                        </p>
                        <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(product.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-full px-4 py-2 rounded-3xl font-semibold bg-[#C7E07A] text-foreground border border-[#C7E07A] transition-colors duration-200 hover:bg-[#B4CC6E] hover:border-[#879a4f]"
                        >
                            Перейти на YouTube
                            <FaYoutube className="text-foreground text-2xl ml-1.5" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <AddToCartTable product={product} specFields={specFields} />
            </div>

            <Footer />
        </div>
    );
}
