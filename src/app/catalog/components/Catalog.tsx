import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AirConditioner } from "@/types/product";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

const categoryMap: { [key: string]: string } = {
    wall: "Настенные кондиционеры",
    cloud: "Облачные кондиционеры",
    mobile: "Мобильные кондиционеры",
    window: "Оконные кондиционеры",
};

export default function Catalog({
                                    airConditioners,
                                    currentPage,
                                    setCurrentPage,
                                }: {
    airConditioners: AirConditioner[];
    currentPage: number;
    setCurrentPage: (page: number) => void;
}) {
    const [isClient, setIsClient] = useState(false);
    const [sortType, setSortType] = useState<string>("default");
    const [category, setCategory] = useState<string | undefined>(undefined);
    const [brand, setBrand] = useState<string | undefined>(undefined);
    const [search, setSearch] = useState<string>("");

    const itemsPerPage = 9;
    const [filteredAirConditioners, setFilteredAirConditioners] = useState<AirConditioner[]>(airConditioners);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        setFilteredAirConditioners(airConditioners); // Обновляем состояние, когда airConditioners меняется
    }, [airConditioners]);

    // Функция для фильтрации
    const applyFilters = (data: AirConditioner[], filters: { category: string, brand: string, search: string }) => {
        let filtered = data;

        if (filters.category && filters.category !== "all") {
            filtered = filtered.filter((item) => item.category === filters.category);
        }
        if (filters.brand && filters.brand !== "all") {
            filtered = filtered.filter((item) => item.brand === filters.brand);
        }
        if (filters.search) {
            filtered = filtered.filter((item) =>
                item.title.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        setFilteredAirConditioners(filtered);
        setCurrentPage(1);
    };

    // Когда меняется любой фильтр, применяем фильтрацию
    useEffect(() => {
        applyFilters(airConditioners, { category: category || "all", brand: brand || "all", search });
    }, [category, brand, search, airConditioners]);

    const sortedAirConditioners = [...filteredAirConditioners].sort((a, b) => {
        if (sortType === "name-asc") return a.title.localeCompare(b.title);
        if (sortType === "name-desc") return b.title.localeCompare(a.title);
        if (sortType === "price-asc") return parseInt(a.prices[0]) - parseInt(b.prices[0]);
        if (sortType === "price-desc") return parseInt(b.prices[0]) - parseInt(a.prices[0]);
        return 0;
    });

    const totalPages = Math.ceil(sortedAirConditioners.length / itemsPerPage);
    const displayedItems = sortedAirConditioners.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleShowMore = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="container mx-auto px-4 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center my-6">
                <p className="text-[#333333] text-lg mb-2 sm:mb-0">
                    Найдено: {sortedAirConditioners.length}
                </p>
                <Select
                    value={sortType}
                    onValueChange={(value) => {
                        setSortType(value);
                        setCurrentPage(1);
                    }}
                >
                    <SelectTrigger className="w-64 rounded-2xl text-base border border-foreground/50">
                        <SelectValue placeholder="Сортировка" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">Без сортировки</SelectItem>
                        <SelectItem value="name-asc">Название A-Я</SelectItem>
                        <SelectItem value="name-desc">Название Я-А</SelectItem>
                        <SelectItem value="price-asc">Цена (дешевые → дорогие)</SelectItem>
                        <SelectItem value="price-desc">Цена (дорогие → дешевые)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {sortedAirConditioners.length === 0 ? (
                <SkeletonGrid />
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {displayedItems.map((item) => (
                            <Link
                                href={`/catalog/${item.slug}`}
                                key={item._id || item.slug}
                                className="group"
                            >
                                <div className="bg-white border border-foreground/20 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-foreground/50 hover:bg-gray-50 flex flex-col h-full">
                                    <div className="relative w-full h-52 flex items-center justify-center bg-white">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="w-auto h-full object-contain"
                                        />
                                    </div>
                                    <div className="p-4 bg-foreground w-full h-full flex flex-col transition-all duration-300 group-hover:bg-foreground/90 flex-grow">
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
                                        <div>
                                            <p className="text-lg font-bold text-[#C7E07A]">
                                                {item.prices[0]}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {currentPage < totalPages && (
                        <div className="flex justify-center mt-6">
                            <button
                                type="button"
                                onClick={handleShowMore}
                                className="px-6 py-2 bg-[#C7E07A] text-black text-lg mt-5 rounded-xl hover:bg-[#B4CC6E] transition"
                            >
                                Показать ещё
                            </button>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex sm:flex-row items-center justify-center gap-4 mt-8">
                            <button
                                type="button"
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
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="disabled:opacity-50"
                            >
                                <ChevronRight />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function SkeletonGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 9 }, (_, i) => (
                <div
                    key={i}
                    className="border border-foreground/20 rounded-xl shadow-sm p-4 animate-pulse flex flex-col"
                >
                    <div className="w-full h-52 bg-gray-200 mb-4"></div>
                    <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 w-1/2"></div>
                </div>
            ))}
        </div>
    );
}
