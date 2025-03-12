import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFilters } from "@/app/components/FiltersContext";
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
        management: string;
        refrigerant: string;
    }) => void;
    onResetPagination: () => void;
    airConditioners: any[]; // Массив кондиционеров
    applyFilters: (data: any[], filters: any) => void; // Функция фильтрации
}

export default function Filters({
                                    onFilterChangeAction,
                                    onResetPagination,
                                    airConditioners,
                                    applyFilters,
                                }: FiltersProps) {
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    const { category, setCategory } = useFilters();

    const [brand, setBrand] = useState("all");
    const [search, setSearch] = useState("");
    const [management, setManagement] = useState("all");
    const [refrigerant, setRefrigerant] = useState("all");

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            handleFilterChange(
                params.get("category") || "all", // Считываем категорию из URL
                params.get("brand") || "all",
                params.get("search") || "",
                params.get("management") || "all",
                params.get("refrigerant") || "all"
            );
        }
    }, []);

    // Обновление состояния фильтров и обновление URL
    const handleFilterChange = (
        newCategory: string,
        newBrand: string,
        newSearch: string,
        newManagement: string,
        newRefrigerant: string
    ) => {
        setCategory(newCategory);
        setBrand(newBrand);
        setSearch(newSearch);
        setManagement(newManagement);
        setRefrigerant(newRefrigerant);

        // Сброс пагинации при изменении фильтров
        onResetPagination();

        // Создаем объект фильтров
        const updatedFilters = {
            category: newCategory,
            brand: newBrand,
            search: newSearch,
            management: newManagement,
            refrigerant: newRefrigerant,
        };

        // Применение фильтров к данным кондиционеров
        if (typeof applyFilters === "function") {
            applyFilters(airConditioners, updatedFilters);
        } else {
            console.error("applyFilters is not defined or not a function");
        }

        // Обновление URL с новыми параметрами
        const queryParams = new URLSearchParams();
        queryParams.set("category", newCategory);
        queryParams.set("brand", newBrand);
        queryParams.set("search", newSearch);
        queryParams.set("management", newManagement);
        queryParams.set("refrigerant", newRefrigerant);

        router.push(`/catalog?${queryParams.toString()}`);

        // Отправка фильтров через onFilterChangeAction
        onFilterChangeAction(updatedFilters);
    };

    const handleResetFilters = () => {
        handleFilterChange("all", "all", "", "all", "all");
    };

    if (!isClient) return null;

    return (
        <div className="mt-28 bg-accent border-2 border-accent max-w-[1350px] p-6 rounded-3xl flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            {/* Фильтр по категории */}
            <div className="flex flex-col w-full md:w-auto">
                <label className="mb-1 text-lg font-semibold text-foreground">Фильтр по категории</label>
                <Select
                    value={category}
                    onValueChange={(value) =>
                        handleFilterChange(value, brand, search, management, refrigerant)
                    }
                >
                    <SelectTrigger className="w-full md:w-48 h-10 px-3 border border-foreground/50 bg-foreground/50 text-white rounded-xl shadow-sm">
                        <SelectValue placeholder="Все категории" />
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
                <label className="mb-1 text-lg font-semibold text-foreground">Фильтр по бренду</label>
                <Select
                    value={brand}
                    onValueChange={(value) =>
                        handleFilterChange(category, value, search, management, refrigerant)
                    }
                >
                    <SelectTrigger className="w-full md:w-48 h-10 px-3 border border-foreground/50 bg-foreground/50 text-white rounded-xl shadow-sm">
                        <SelectValue placeholder="Все бренды" />
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

            {/* Фильтр по режиму управления */}
            <div className="flex flex-col w-full md:w-auto">
                <label className="mb-1 text-lg font-semibold text-foreground">Режим управления</label>
                <Select
                    value={management}
                    onValueChange={(value) =>
                        handleFilterChange(category, brand, search, value, refrigerant)
                    }
                >
                    <SelectTrigger className="w-full md:w-48 h-10 px-3 border border-foreground/50 bg-foreground/50 text-white rounded-xl shadow-sm">
                        <SelectValue placeholder="Все режимы" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Все</SelectItem>
                        <SelectItem value="Full DC Inverter">Full DC Inverter</SelectItem>
                        <SelectItem value="Inverter">Inverter</SelectItem>
                        <SelectItem value="On/Off">On/Off</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Фильтр по типу хладагента */}
            <div className="flex flex-col w-full md:w-auto">
                <label className="mb-1 text-lg font-semibold text-foreground">Тип хладагента</label>
                <Select
                    value={refrigerant}
                    onValueChange={(value) =>
                        handleFilterChange(category, brand, search, management, value)
                    }
                >
                    <SelectTrigger className="w-full md:w-48 h-10 px-3 border border-foreground/50 bg-foreground/50 text-white rounded-xl shadow-sm">
                        <SelectValue placeholder="Все хладагенты" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Все</SelectItem>
                        <SelectItem value="R290">R290</SelectItem>
                        <SelectItem value="R32">R32</SelectItem>
                        <SelectItem value="R410A">R410A</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Поиск по названию */}
            <div className="flex flex-col flex-grow">
                <label className="mb-1 text-lg font-semibold text-foreground">Поиск по названию</label>
                <input
                    type="text"
                    placeholder="Введите название"
                    className="w-full h-10 px-3 border border-foreground/50 bg-foreground/50 text-white placeholder-white/50 rounded-xl shadow-sm"
                    value={search}
                    onChange={(e) =>
                        handleFilterChange(category, brand, e.target.value, management, refrigerant)
                    }
                />
            </div>

            {/* Кнопка очистки фильтров */}
            <button
                className="sm:h-20 w-full md:w-48 px-4 bg-foreground/50 text-white text-lg rounded-3xl"
                onClick={handleResetFilters}
            >
                Очистить фильтры
            </button>
        </div>
    );
}
