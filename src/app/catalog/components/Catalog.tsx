"use client";

import { useState } from "react";
import Link from "next/link"; // Импортируем Link для навигации
import { AirConditioner } from "@/types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

export default function Catalog({ airConditioners }: { airConditioners: AirConditioner[] }) {
    const [sortType, setSortType] = useState<string>("default");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isCumulative, setIsCumulative] = useState<boolean>(false);
    const itemsPerPage = 9;

    // Сортировка товаров
    const sortedAirConditioners = [...airConditioners].sort((a, b) => {
        if (sortType === "name-asc") {
            return a.title.localeCompare(b.title);
        }
        if (sortType === "name-desc") {
            return b.title.localeCompare(a.title);
        }
        if (sortType === "price-asc") {
            return parseInt(a.prices[0]) - parseInt(b.prices[0]);
        }
        if (sortType === "price-desc") {
            return parseInt(b.prices[0]) - parseInt(a.prices[0]);
        }
        return 0;
    });

    // Общее количество страниц
    const totalPages = Math.ceil(sortedAirConditioners.length / itemsPerPage);

    // Если режим накопительный – показываем товары с 1-й по currentPage-ю страницу,
    // иначе – показываем товары только для выбранной страницы.
    const displayedItems = isCumulative
        ? sortedAirConditioners.slice(0, currentPage * itemsPerPage)
        : sortedAirConditioners.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );

    // Обработчик для кнопки "Показать ещё" – переходим в накопительный режим
    const handleShowMore = () => {
        if (currentPage < totalPages) {
            setIsCumulative(true);
            setCurrentPage((prev) => prev + 1);
        }
    };

    // Обработчики для пагинации – переключают на выбранную страницу (без накопления)
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setIsCumulative(false);
            setCurrentPage((prev) => prev - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setIsCumulative(false);
            setCurrentPage((prev) => prev + 1);
        }
    };

    const goToPage = (page: number) => {
        setIsCumulative(false);
        setCurrentPage(page);
    };

    const categoryMap: { [key: string]: string } = {
        wall: "Настенные кондиционеры",
        cloud: "Облачные кондиционеры",
        mobile: "Мобильные кондиционеры",
        window: "Оконные кондиционеры",
    };

    return (
        <div className="container mx-auto px-4 w-full">
            {/* Шапка каталога */}
            <div className="flex flex-col sm:flex-row justify-between items-center my-6">
                <p className="text-[#333333] text-lg mb-2 sm:mb-0">
                    Найдено: {sortedAirConditioners.length}
                </p>
                <Select
                    value={sortType}
                    onValueChange={(value) => {
                        setSortType(value);
                        setCurrentPage(1);
                        setIsCumulative(false);
                    }}
                >
                    <SelectTrigger className="w-64 rounded-2xl text-base border border-foreground/50">
                        <SelectValue placeholder="Сортировка" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem key="default" value="default">Без сортировки</SelectItem>
                        <SelectItem key="name-asc" value="name-asc">Название A-Я</SelectItem>
                        <SelectItem key="name-desc" value="name-desc">Название Я-А</SelectItem>
                        <SelectItem key="price-asc" value="price-asc">Цена (дешевые → дорогие)</SelectItem>
                        <SelectItem key="price-desc" value="price-desc">Цена (дорогие → дешевые)</SelectItem>
                    </SelectContent>

                </Select>
            </div>

            {/* Список товаров */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {displayedItems.map((item) => (
                    <Link
                        href={`/catalog/${item.slug}`}                         key={item._id || item.slug }
                        className="group" // Можно добавить класс для hover-эффектов
                    >
                        <div
                            className="
                bg-white
                border border-foreground/20
                rounded-xl
                shadow-sm
                overflow-hidden
                transition-all
                duration-300
                hover:shadow-lg
                hover:border-foreground/50
                hover:bg-gray-50
                flex flex-col
                h-full
              "
                        >
                            <div className="relative w-full h-52 flex items-center justify-center bg-white">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-auto h-full object-contain"
                                />
                            </div>
                            <div
                                className="
                  p-4
                  bg-foreground
                  w-full h-full
                  flex flex-col
                  transition-all
                  duration-300
                  group-hover:bg-foreground/90
                  flex-grow
                "
                            >
                                <div className="flex-grow">
                                    {item.category && (
                                        <p className="text-sm text-foreground bg-accent px-1 mb-2 py-1 rounded-lg inline-block">
                                            {categoryMap[item.category] || "Неизвестная категория"}
                                        </p>
                                    )}

                                    <h2 className="text-lg font-semibold text-white break-words">
                                        {item.title}
                                    </h2>
                                    <p className="text-sm text-gray-300">{item.brand}</p>
                                </div>

                                <div className="">
                                    <p className="text-lg font-bold text-[#C7E07A]">
                                        {item.prices[0]} ₽
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Кнопка "Показать ещё" – накопительный режим */}
            {currentPage < totalPages && (
                <div className="flex justify-center mt-6">
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={handleShowMore}
                        className="px-6 py-2 bg-[#C7E07A] text-black text-lg mt-5 rounded-xl hover:bg-[#B4CC6E] transition"
                    >
                        Показать ещё
                    </button>
                </div>
            )}

            {/* Пагинация (стрелки) – переключение страниц без накопления */}
            {totalPages > 1 && (
                <div className="flex sm:flex-row items-center justify-center gap-4 mt-8">
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="disabled:opacity-50"
                    >
                        <ChevronLeft />
                    </button>

                    <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 font-semibold">
              {currentPage}
            </span>
                        <span className="text-gray-600">из {totalPages}</span>
                    </div>

                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="disabled:opacity-50"
                    >
                        <ChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
}
