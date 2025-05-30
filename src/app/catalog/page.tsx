'use client'
import { useState, useEffect, Suspense } from "react";
import Header from "../components/Header";
import Filters from "./components/Filters";
import Catalog from "./components/Catalog";
import Footer from "../components/Footer";
import { getAirConditioners } from "@/sanity/lib/fetchAirConditioners";
import { AirConditioner } from "@/types/product";
import SearchFilters from "./components/SearchFilters";
import { useFilters } from "@/app/components/FiltersContext";

function CatalogContent() {
    const { category, brand, search, management, refrigerant, setCategory, setBrand, setSearch, setManagement, setRefrigerant } = useFilters();
    const [airConditioners, setAirConditioners] = useState<AirConditioner[]>([]);
    const [filteredData, setFilteredData] = useState<AirConditioner[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [area, setArea] = useState<number | "">("");

    useEffect(() => {
        async function fetchData() {
            const res = await fetch('/api/air-conditioners');
            const data: AirConditioner[] = await res.json();
            setAirConditioners(data);
        }
        fetchData();
    }, []);


    useEffect(() => {
        if (airConditioners.length) {
            applyFilters(airConditioners);
        }
    }, [airConditioners, category, brand, search, management, refrigerant, area]);

    const applyFilters = (data: AirConditioner[]) => {
        let filtered = data;

        if (category && category !== "all") {
            filtered = filtered.filter((item) => item.category === category);
        }

        if (brand && brand !== "all") {
            filtered = filtered.filter((item) => item.brand === brand);
        }

        if (search) {
            filtered = filtered.filter((item) =>
                item.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (management && management !== "all") {
            filtered = filtered.filter((item) => item.management === management);
        }

        if (refrigerant && refrigerant !== "all") {
            filtered = filtered.filter((item) => item.refrigerant === refrigerant);
        }



        if (area && typeof area === "number") {
            filtered = filtered.filter((item) =>
                Array.isArray(item.areaOptions) && item.areaOptions.some((opt) => opt >= area)
            );
        }

        setFilteredData(filtered);
        setCurrentPage(1);
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
                            console.log("Фильтры из Filters:", filters);
                            setCategory(filters.category);
                            setBrand(filters.brand);
                            setSearch(filters.search);
                            setManagement(filters.management);
                            setRefrigerant(filters.refrigerant);
                            setArea(filters.area);
                        }}
                        onResetPagination={() => setCurrentPage(1)}
                        airConditioners={airConditioners}
                        applyFilters={applyFilters}

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
