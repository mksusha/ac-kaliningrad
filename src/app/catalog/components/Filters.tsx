"use client";

import { useState } from "react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

interface FiltersProps {
    onFilterChangeAction: (filters: {
        category: string;
        brand: string;
        search: string;
    }) => void;
}

export default function Filters({ onFilterChangeAction }: FiltersProps) {
    const [category, setCategory] = useState("all");
    const [brand, setBrand] = useState("all");
    const [search, setSearch] = useState("");

    const handleFilterChange = (newCategory: string, newBrand: string, newSearch: string) => {
        setCategory(newCategory);
        setBrand(newBrand);
        setSearch(newSearch);

        onFilterChangeAction({
            category: newCategory === "all" ? "" : newCategory,
            brand: newBrand === "all" ? "" : newBrand,
            search: newSearch,
        });
    };

    return (
        <div
            className=" mt-28
        bg-background
        border-2
        border-foreground
max-w-[1350px]
        p-6
        rounded-3xl
        flex
        flex-col
        gap-4
        md:flex-row
        md:items-end
        md:justify-between
      "
        >
            {/* Фильтр по категории */}
            <div className="flex flex-col w-full md:w-auto">
                <label className="mb-1 text-lg font-semibold text-foreground">
                    Фильтр по категории
                </label>
                <Select
                    value={category}
                    onValueChange={(value) =>
                        handleFilterChange(value, brand, search)
                    }
                >
                    <SelectTrigger
                        className="
              h-10
              px-3
              border
              border-foreground/50
              bg-foreground/50
              text-white
              rounded-xl
              shadow-sm
              focus:outline-none
              focus:ring-2
              focus:ring-[#C7E07A]
              focus:border-transparent
              w-full
              md:w-48
            "
                    >
                        <SelectValue placeholder="Все категории"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Все</SelectItem>
                        <SelectItem value="wall">Настенные</SelectItem>
                        <SelectItem value="cloud">Облачные</SelectItem>
                        <SelectItem value="mobile">Мобильные</SelectItem>
                        <SelectItem value="window">Оконные</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Фильтр по бренду */}
            <div className="flex flex-col w-full md:w-auto">
                <label className="mb-1 text-lg font-semibold text-foreground">
                    Фильтр по бренду
                </label>
                <Select
                    value={brand}
                    onValueChange={(value) =>
                        handleFilterChange(category, value, search)
                    }
                >
                    <SelectTrigger
                        className="
           h-10
              px-3
              border
              border-foreground/50
              bg-foreground/50
              text-white
              rounded-xl
              shadow-sm
              focus:outline-none
              focus:ring-2
              focus:ring-[#C7E07A]
              focus:border-transparent
              w-full
              md:w-48
            "
                    >
                        <SelectValue placeholder="Все бренды"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Все бренды</SelectItem>
                        <SelectItem value="Daichi">Daichi</SelectItem>
                        <SelectItem value="Midea">Midea</SelectItem>
                        <SelectItem value="Daikin">Daikin</SelectItem>
                        <SelectItem value="Kentatsu">Kentatsu</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Поиск по названию */}
            <div className="flex flex-col flex-grow">
                <label className="mb-1 text-lg font-semibold text-foreground">
                    Поиск по названию
                </label>
                <input
                    type="text"
                    placeholder="Введите название"
                    className="
            h-10
            px-3
            border
            border-foreground/50
            bg-foreground/50
            text-white
            placeholder-white/50
            rounded-xl
            shadow-sm
            focus:outline-none
            focus:ring-2
            focus:ring-[#C7E07A]
            focus:border-transparent
            w-full
        "
                    value={search}
                    onChange={(e) =>
                        handleFilterChange(category, brand, e.target.value)
                    }
                />
            </div>


            {/* Кнопка очистки (без дополнительного текста) */}
            <button
                className="sm:h-20 px-4 bg-foreground/50 text-white text-lg rounded-3xl border-foreground/50 border-2 shadow-sm hover:bg-foreground/20 transition h-16 mt-5 sm:mt-0 w-full md:w-48"
                onClick={() => handleFilterChange("all", "all", "")}
            >
                Очистить фильтры
            </button>
        </div>
    );
}
