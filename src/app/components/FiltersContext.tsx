'use client'
import { createContext, useContext, useState, ReactNode } from "react";

// Определяем типы для контекста
interface FiltersContextType {
    category: string;
    setCategory: (category: string) => void;
    brand: string;
    setBrand: (brand: string) => void;
    search: string;
    setSearch: (search: string) => void;
    management: string;
    setManagement: (management: string) => void;
    refrigerant: string;
    setRefrigerant: (refrigerant: string) => void;
}

// Создаём контекст
const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

// Хук для использования контекста
export const useFilters = () => {
    const context = useContext(FiltersContext);
    if (!context) {
        throw new Error("useFilters must be used within a FiltersProvider");
    }
    return context;
};

// Провайдер
export const FiltersProvider = ({ children }: { children: ReactNode }) => {
    const [category, setCategory] = useState("all");
    const [brand, setBrand] = useState("all");
    const [search, setSearch] = useState("");
    const [management, setManagement] = useState("all");
    const [refrigerant, setRefrigerant] = useState("all");

    return (
        <FiltersContext.Provider
            value={{ category, setCategory, brand, setBrand, search, setSearch, management, setManagement, refrigerant, setRefrigerant }}
        >
            {children}
        </FiltersContext.Provider>
    );
};
