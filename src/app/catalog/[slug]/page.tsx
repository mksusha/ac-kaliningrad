import { notFound } from "next/navigation";
import { createClient } from "next-sanity";
import { ProductGallery } from "../components/ImageCarousel";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

// Импортируем все необходимые компоненты таблицы (Shadcn UI)
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
} from "@/components/ui/table";

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your_project_id",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2023-01-01",
    useCdn: true,
});

// Генерация статических путей (пример)
export async function generateStaticParams() {
    const query = `*[_type == "product" && defined(slug.current)]{
      "slug": slug.current
    }`;

    const products: { slug: string }[] = await client.fetch(query);

    return products.map((product) => ({
        slug: product.slug,
    }));
}


interface PageProps {
    params?: { slug: string };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
    if (!params || !params.slug) {
        return notFound();
    }

    const { slug } = params;

    // Запрос с дополнительными полями
    const query = `*[_type == "product" && slug.current == $slug][0]{
      title,
      "images": images[].asset->url,
      management,
      refrigerant,
      areaOptions,
      models,
      prices,
      cooling_capacity,
      manufacturer{
          "logo": logo.asset->url,
          link,
          desc
      },
      dealer {
          link,
          desc
      },
      specs {
          cooling_power,
          heating_power,
          power_supply,
          energy_efficiency,
          heating_efficiency,
          noise_level,
          dimensions_inner,
          dimensions_outer,
          weight_inner,
          weight_outer,
          refrigerant_type,
          refrigerant_charge,
          pipe_liquid,
          pipe_gas,
          pipe_length,
          pipe_difference,
          working_temp_cooling,
          working_temp_heating,
          lifetime,
          manufacturer_country
      }
  }`;

    const product: any = await client.fetch(query, { slug });
    if (!product) {
        notFound();
    }

    // Формируем строку для "Диапазон температур"
    const coolingRange = product.specs?.working_temp_cooling?.[0] || "";
    const heatingRange = product.specs?.working_temp_heating?.[0] || "";
    const combinedRange =
        coolingRange && heatingRange
            ? `${coolingRange}; ${heatingRange}`
            : coolingRange || heatingRange || "—";

    // Список характеристик для таблицы
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
            <Header/>

            {/* Блок заголовка */}
            <div className="container max-w-[1350px] m-auto mx-auto px-4 mt-28">
                <div className="inline-block">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                        {product.title}
                    </h1>
                    <div className="w-full h-1 bg-[#C7E07A] mt-2 mb-6"></div>
                </div>
            </div>

            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Левая колонка (галерея) - шире (5 столбцов) */}
                <div className="md:col-span-5 md:mr-4">
                    <ProductGallery images={product.images || []}/>
                </div>

                {/* Средняя колонка (основная информация) - 4 столбца */}
                <div className="md:col-span-3 md:ml-5 flex flex-col justify-center space-y-3 md:mr-4">
                    <div>
                        <div className="text-sm text-gray-500">Для помещения площадью, м²</div>
                        <div className="text-lg font-semibold">
                            {product.areaOptions?.join(", ") || "—"}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Управление</div>
                        <div className="text-lg font-semibold">
                            {product.management || "—"}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Хладагент</div>
                        <div className="text-lg font-semibold">
                            {product.refrigerant || "—"}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Диапазон температур</div>
                        <div className="text-lg font-semibold">
                            {combinedRange}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Холодопроизводительность, кВт</div>
                        <div className="text-lg font-semibold">
                            {product.cooling_capacity || "—"}
                        </div>
                    </div>
                </div>

                {/* Правая колонка (блок с кнопками) - 3 столбца */}
                <div className="md:col-span-3 flex flex-col justify-center gap-4">
                    {/* Блок Производитель */}
                    <div className="p-6 border border-[#C7E07A] bg-[#333333] rounded-2xl">
                        <h2 className="text-2xl font-bold mb-4 text-white">Производитель</h2>
                        <p className="mb-4 text-white">
                            {product.manufacturer?.desc || "—"}
                        </p>
                        {product.manufacturer?.link && (
                            <a
                                href={product.manufacturer.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block w-full px-4 py-2 rounded-3xl font-semibold bg-[#C7E07A] text-white border border-[#C7E07A] transition-colors duration-200 hover:bg-[#B4CC6E] hover:border-[#879a4f]"
                            >
                                Сайт производителя
                            </a>
                        )}
                    </div>

                    {/* Блок Дилер */}
                    <div className="p-6 border border-[#C7E07A] bg-[#333333] rounded-2xl">
                        <h2 className="text-2xl font-bold mb-4 text-white">Дилер</h2>
                        <p className="mb-4 text-white">
                            {product.dealer?.desc || "—"}
                        </p>
                        {product.dealer?.link && (
                            <a
                                href={product.dealer.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block w-full px-4 py-2 rounded-3xl font-semibold bg-[#C7E07A] text-white border border-[#C7E07A] transition-colors duration-200 hover:bg-[#B4CC6E] hover:border-[#879a4f]"
                            >
                                Сайт дилера
                            </a>
                        )}
                    </div>
                </div>

            </div>


    {/* Таблица: модели по горизонтали, характеристики по вертикали */
    }
    <div className="container mx-auto px-4 py-8">
        <Table className="border border-[#C7E07A] rounded-md overflow-hidden">
            <TableCaption></TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Характеристика</TableHead>
                    {product.models?.map((modelName: string, i: number) => (
                        <TableHead key={i}>{modelName}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>

            <TableBody>
                {specFields.map(({label, key}) => (
                            <TableRow key={key}>
                                <TableCell className="font-medium">{label}</TableCell>
                                {product.models?.map((_: string, i: number) => {
                                    let value = "—";
                                    if (key === "cooling_capacity") {
                                        // Разбиваем строку по разделителю ";"
                                        const arr = product.cooling_capacity
                                            ? product.cooling_capacity.split(";").map((s: string) => s.trim())
                                            : [];
                                        value = arr[i] || "—";
                                    } else {
                                        const arr: string[] = product.specs?.[key] || [];
                                        value = arr[i] || "—";
                                    }
                                    return <TableCell key={i}>{value}</TableCell>;
                                })}
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell className="font-medium">Цена</TableCell>
                            {product.models?.map((_: string, i: number) => {
                                const value = product.prices?.[i] ?? "—";
                                return <TableCell key={i}>{value}</TableCell>;
                            })}
                        </TableRow>
                    </TableBody>
                </Table>
            </div>


            <Footer/>
        </div>
    );
}
