"use client";

import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { useState, useEffect } from "react";
import { ArrowRightCircle } from "lucide-react";
import { useFilters } from "@/app/components/FiltersContext";
import { useRouter } from "next/navigation";

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your_project_id",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2023-01-01",
    useCdn: true,
});

const builder = imageUrlBuilder(client);
function urlFor(source: SanityImageSource) {
    return builder.image(source).width(1000).height(800).fit("crop").url();
}

const CATEGORIES = [
    { title: "Настенные кондиционеры", value: "wall" },
    { title: "Облачные кондиционеры", value: "cloud" },
    { title: "Мобильные кондиционеры", value: "mobile" },
    { title: "Оконные кондиционеры", value: "window" },
];

interface CategoryData {
    categoryTitle: string;
    categoryValue: string;
    count: number;
    imageUrl: string;
}

export default function CatalogCategoriesBlock() {
    const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
    const { setCategory } = useFilters();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const data = await Promise.all(
                    CATEGORIES.map(async (cat) => {
                        const firstProductQuery = `*[_type == "product" && category == $category][0]{ images }`;
                        const countQuery = `count(*[_type == "product" && category == $category])`;

                        const [product, count] = await Promise.all([
                            client.fetch(firstProductQuery, { category: cat.value }),
                            client.fetch(countQuery, { category: cat.value }),
                        ]);

                        let imageUrl = "/no-image.png";
                        if (product?.images?.[0]) {
                            imageUrl = urlFor(product.images[0]);
                        }

                        return {
                            categoryTitle: cat.title,
                            categoryValue: cat.value,
                            count: count || 0,
                            imageUrl,
                        };
                    })
                );
                setCategoriesData(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleCategoryClick = (categoryValue: string) => {
        setCategory(categoryValue);
        const queryParams = new URLSearchParams(window.location.search);
        queryParams.set("category", categoryValue);
        router.push(`/catalog?${queryParams.toString()}`);
    };


    if (isLoading) {
        return <div>Загрузка категорий...</div>;
    }

    return (
        <div className="bg-white text-[#333333] px-6 py-12">
            <div className="flex flex-col mb-16 sm:flex-row items-start justify-between gap-6 sm:gap-8 w-full">
                <h2 className="text-3xl sm:text-4xl font-bold leading-tight sm:leading-normal text-left w-full sm:w-auto">
                    ВЫБЕРИТЕ{" "}
                    <span className="bg-accent rounded-2xl px-3 py-1 inline-block">
                        КАТЕГОРИЮ
                    </span>
                </h2>
                <p className="text-lg text-black lg:max-w-[36rem] text-left leading-relaxed w-full sm:w-auto">
                    Выберите подходящий тип кондиционера для вашего помещения. Мы предлагаем широкий ассортимент моделей
                    для любых нужд.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {categoriesData.map((category) => (
                    <div
                        key={category.categoryValue}
                        onClick={() => handleCategoryClick(category.categoryValue)}
                        className="cursor-pointer relative bg-white border border-gray-300 p-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                    >
                        <div className="relative w-full h-56 md:h-64 lg:h-64 rounded-lg overflow-hidden">
                            <img
                                src={category.imageUrl}
                                alt={category.categoryTitle}
                                className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 left-2 bg-foreground/80 text-white text-base px-3 py-1 rounded-full font-semibold">
                                {category.count} товаров
                            </span>
                        </div>
                        <div className="absolute inset-0 flex items-end justify-between p-4 bg-black bg-opacity-10 rounded-2xl">
                            <h3 className="text-xl bg-accent/80 px-2 rounded-2xl font-semibold text-black">
                                {category.categoryTitle}
                            </h3>
                            <ArrowRightCircle
                                size={34}
                                className="text-accent bg-foreground rounded-full opacity-80 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
