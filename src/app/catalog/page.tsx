"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Filters from "./components/Filters";
import Catalog from "./components/Catalog";
import Footer from "../components/Footer";
import { getAirConditioners } from "@/sanity/lib/fetchAirConditioners";
import { AirConditioner } from "@/types/product";

export default function CatalogPage() {
    const [airConditioners, setAirConditioners] = useState<AirConditioner[]>([]);
    const [filteredData, setFilteredData] = useState<AirConditioner[]>([]);

    useEffect(() => {
        async function fetchData() {
            const data = await getAirConditioners();
            setAirConditioners(data);
            setFilteredData(data);
        }
        fetchData();
    }, []);

    // Обратите внимание на новые поля management, refrigerant
    const handleFilterChange = (filters: {
        category: string;
        brand: string;
        search: string;
        management: string;
        refrigerant: string;
    }) => {
        let filtered = airConditioners;

        // Фильтрация по категории
        if (filters.category) {
            filtered = filtered.filter((item) => item.category === filters.category);
        }

        // Фильтрация по бренду
        if (filters.brand) {
            filtered = filtered.filter((item) => item.brand === filters.brand);
        }

        // Поиск по названию
        if (filters.search) {
            filtered = filtered.filter((item) =>
                item.title.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // Фильтрация по режиму управления
        if (filters.management) {
            filtered = filtered.filter((item) => item.management === filters.management);
        }

        // Фильтрация по типу хладагента
        if (filters.refrigerant) {
            filtered = filtered.filter((item) => item.refrigerant === filters.refrigerant);
        }

        setFilteredData(filtered);
    };

    return (
        <div className="bg-white">
            <Header />
            <div className="container max-w-[1350px] m-auto p-6 flex flex-col gap-4">
                {/* Компонент с фильтрами */}
                <Filters onFilterChangeAction={handleFilterChange} />

                {/* Каталог с уже отфильтрованными данными */}
                <Catalog airConditioners={filteredData} />
            </div>
            <Footer></Footer>
        </div>
    );
}
