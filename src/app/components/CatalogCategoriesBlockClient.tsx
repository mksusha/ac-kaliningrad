"use client";

import Image from "next/image";

interface Category {
    categoryTitle: string;
    categoryValue: string;
    count: number;
    imageUrl: string;
}

export default function CatalogCategoriesBlockClient({ categoriesData }: { categoriesData: Category[] }) {
    return (
        <section className="text-[#333] py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-5xl font-bold mb-8 tracking-tight text-left">Наши проекты</h2>
                <p className="text-lg max-w-3xl mb-12 text-gray-600 text-left">
                    Мы создаем <span className="font-semibold text-black">высококачественные</span> и
                    <span className="font-semibold text-black"> индивидуальные</span> объекты, которые повышают качество жизни.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {categoriesData.map((cat) => (
                        <div
                            key={cat.categoryValue}
                            className="relative rounded-2xl overflow-hidden shadow-xl bg-white transition-transform duration-300 hover:scale-105"
                        >
                            <div className="relative w-full h-72 md:h-[450px]">
                                <Image
                                    src={cat.imageUrl}
                                    alt={cat.categoryTitle}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6 text-white">
                                    <h3 className="text-2xl font-bold drop-shadow-md">{cat.categoryTitle}</h3>
                                    <p className="text-md opacity-90">Товаров в категории: {cat.count}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
