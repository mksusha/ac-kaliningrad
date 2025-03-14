"use client"; // 💡 Делаем этот компонент клиентским
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchWorkBySlug } from "@/sanity/lib/fetchWorks";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { type PortableTextBlock } from "sanity";
import Link from "next/link"; // Для добавления ссылок в хлебные крошки
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"; // Импортируем компоненты хлебных крошек

const components: PortableTextComponents = {
    block: {
        normal: ({ children }) => <p className="text-gray-600 mb-4">{children}</p>,
        h2: ({ children }) => <h2 className="text-xl font-bold">{children}</h2>,
    },
    marks: {
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    },
    list: {
        bullet: ({ children }) => <ul className="list-disc ml-5">{children}</ul>,
    },
    listItem: {
        bullet: ({ children }) => <li className="mb-1">{children}</li>,
    },
};

export default function WorkDetails() {
    const { slug } = useParams(); // ✅ Теперь params обрабатывается правильно
    const [work, setWork] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        fetchWorkBySlug(slug as string)
            .then((data) => {
                setWork(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Ошибка загрузки:", error);
                setLoading(false);
            });
    }, [slug]);

    if (loading) return null; // ✅ Не отображаем ничего при загрузке
    if (!work) return <p className="text-center text-gray-500">Работа не найдена</p>;

    return (
        <div className="flex flex-col bg-white">
            <Header />

            <main className="flex-grow container mt-14 md:mt-24 mx-auto px-6 pt-6 pb-0">
                {/* Хлебные крошки */}
                <Breadcrumb className="mb-3">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/portfolio" className="text-gray-500 hover:text-[#C7E07A]">Портфолио</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {/* Разделитель */}
                        <BreadcrumbItem>
                            <span className="text-gray-600">/</span>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <span className="text-gray-600">{work.address}</span>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <h1 className="text-4xl font-semibold text-left mb-8">{work.title}</h1>

                {/* Галерея изображений */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.isArray(work.images) && work.images.length > 0 ? (
                        work.images.map((image: string, index: number) => (
                            <div key={index} className="w-full flex justify-center items-center">
                                <img
                                    src={image}
                                    alt={`work-${index}`}
                                    className="w-full h-[500px] object-cover rounded-xl shadow-lg"
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">Нет изображений</p>
                    )}
                </div>

                {/* Описание работы */}
                <div className="text-gray-700 text-lg text-left mt-10">
                    <PortableText
                        value={(Array.isArray(work.description) ? work.description : []) as PortableTextBlock[]}
                        components={components}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
