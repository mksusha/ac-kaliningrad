"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Filters from "./components/Filters";
import Catalog from "./components/Catalog";
import Footer from "../components/Footer";
import { getAirConditioners } from "@/sanity/lib/fetchAirConditioners";
import { AirConditioner } from "@/types/product";

export default function CatalogPage() {
    const [airConditioners, setAirConditioners] = useState<AirConditioner[]>([]);
    const [filteredData, setFilteredData] = useState<AirConditioner[]>([]);

    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "";

    useEffect(() => {
        async function fetchData() {
            const data = await getAirConditioners();
            setAirConditioners(data);

            if (initialCategory) {
                setFilteredData(data.filter((item) => item.category === initialCategory));
            } else {
                setFilteredData(data);
            }
        }
        fetchData();
    }, [initialCategory]);

    // Фильтры
    const handleFilterChange = (filters: {
        category: string;
        brand: string;
        search: string;
        management: string;
        refrigerant: string;
    }) => {
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

        if (filters.management) {
            filtered = filtered.filter((item) => item.management === filters.management);
        }

        if (filters.refrigerant) {
            filtered = filtered.filter((item) => item.refrigerant === filters.refrigerant);
        }

        setFilteredData(filtered);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-1">
                <div className="container max-w-[1350px] mx-auto p-6 flex flex-col gap-4">
                    <Filters onFilterChangeAction={handleFilterChange} />
                    <Catalog airConditioners={filteredData} />
                </div>
            </main>
            <Footer />
        </div>
    );
}
