'use client'
import { useState, useEffect, Suspense } from "react";
import Header from "../components/Header";
import Filters from "./components/Filters";
import Catalog from "./components/Catalog";
import Footer from "../components/Footer";
import { getAirConditioners } from "@/sanity/lib/fetchAirConditioners";
import { AirConditioner } from "@/types/product";
import SearchFilters from "./components/SearchFilters";
import { useFilters } from "@/app/components/FiltersContext"; // Контекст уже внутри FiltersProvider!

function CatalogContent() {
    const { category, brand, search, management, refrigerant, setCategory, setBrand, setSearch, setManagement, setRefrigerant } = useFilters();
    const [airConditioners, setAirConditioners] = useState<AirConditioner[]>([]);
    const [filteredData, setFilteredData] = useState<AirConditioner[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        async function fetchData() {
            const data = await getAirConditioners();
            setAirConditioners(data);
        }
        fetchData();
    }, []);

    useEffect(() => {
        // Применяем фильтры только когда загружены данные
        if (airConditioners.length) {
            applyFilters(airConditioners);
        }
    }, [airConditioners, category, brand, search, management, refrigerant]);  // Следим за изменениями всех фильтров

    const applyFilters = (data: AirConditioner[]) => {
        let filtered = data;

        // Фильтрация по категории
        if (category && category !== "all") {
            filtered = filtered.filter((item) => item.category === category);
        }

        // Фильтрация по бренду
        if (brand && brand !== "all") {
            filtered = filtered.filter((item) => item.brand === brand);
        }

        // Фильтрация по поисковому запросу
        if (search) {
            filtered = filtered.filter((item) =>
                item.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Фильтрация по типу управления
        if (management && management !== "all") {
            filtered = filtered.filter((item) => item.management === management);
        }

        // Фильтрация по хладагенту
        if (refrigerant && refrigerant !== "all") {
            filtered = filtered.filter((item) => item.refrigerant === refrigerant);
        }

        // Устанавливаем отфильтрованные данные
        setFilteredData(filtered);
        setCurrentPage(1); // Сбрасываем на первую страницу
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-1">
                <div className="container max-w-[1350px] mx-auto p-6 flex flex-col gap-4">
                    <Suspense fallback={<div>Загрузка...</div>}>
                        <SearchFilters onCategoryChangeAction={setCategory} />
                    </Suspense>
                    <Filters
                        onFilterChangeAction={(filters) => {
                            setCategory(filters.category);
                            setBrand(filters.brand);
                            setSearch(filters.search);
                            setManagement(filters.management);
                            setRefrigerant(filters.refrigerant);
                        }}
                        onResetPagination={() => setCurrentPage(1)}
                        airConditioners={airConditioners}  // Передаем массив кондиционеров
                        applyFilters={applyFilters}        // Передаем функцию фильтрации
                    />

                    <Catalog airConditioners={filteredData} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function CatalogPage() {
    return <CatalogContent />;
}
