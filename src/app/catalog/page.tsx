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

    // Функция фильтрации
    const handleFilterChange = (filters: { category: string; brand: string; search: string }) => {
        let filtered = airConditioners;

        if (filters.category) {
            filtered = filtered.filter((item) => item.category === filters.category);
        }

        if (filters.brand) {
            filtered = filtered.filter((item) => item.brand === filters.brand);
        }

        if (filters.search) {
            filtered = filtered.filter((item) =>
                item.title.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        setFilteredData(filtered);
    };

    return (
        <div className="bg-white ">
            <Header />
            <div className="container max-w-[1350px]  m-auto p-6 flex flex-col gap-4">
                {/* ✅ Фильтры теперь только сверху */}
                <Filters onFilterChangeAction={handleFilterChange} />

                {/* ✅ Каталог занимает всю ширину под фильтрами */}
                <Catalog airConditioners={filteredData} />
            </div>

        </div>
    );
}
