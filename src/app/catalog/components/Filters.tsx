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
        area: number | "";
    }) => void;
    onResetPagination: () => void;
    airConditioners: any[];
    applyFilters: (data: any[], filters: any) => void;
}

export default function Filters({
                                    onFilterChangeAction,
                                    onResetPagination,
                                    airConditioners,
                                    applyFilters,
                                }: FiltersProps) {
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    const {category, setCategory} = useFilters();

    const [brand, setBrand] = useState("all");
    const [search, setSearch] = useState("");
    const [management, setManagement] = useState("all");
    const [refrigerant, setRefrigerant] = useState("all");
    const [area, setArea] = useState<number | "">("");

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            setCategory(params.get("category") || "all");
            setBrand(params.get("brand") || "all");
            setSearch(params.get("search") || "");
            setManagement(params.get("management") || "all");
            setRefrigerant(params.get("refrigerant") || "all");
            setArea(params.get("area") ? Number(params.get("area")) : "");
        }
    }, []);

    useEffect(() => {
        handleFilterChange(category, brand, search, management, refrigerant, area);
    }, [brand, category, search, management, refrigerant, area]);

    const handleFilterChange = (
        newCategory: string,
        newBrand: string,
        newSearch: string,
        newManagement: string,
        newRefrigerant: string,
        newArea: number | ""
    ) => {

        console.log("Изменение фильтров:", {
            category: newCategory,
            brand: newBrand,
            search: newSearch,
            management: newManagement,
            refrigerant: newRefrigerant,
            area: newArea,
        });


        onResetPagination();


        const updatedFilters = {
            category: newCategory,
            brand: newBrand,
            search: newSearch,
            management: newManagement,
            refrigerant: newRefrigerant,
            area: newArea,
        };


        console.log("Применение фильтров к кондиционерам с фильтрами:", updatedFilters);
        if (typeof applyFilters === "function") {
            applyFilters(airConditioners, updatedFilters);
        } else {
            console.error("applyFilters is not defined or not a function");
        }


        const queryParams = new URLSearchParams(window.location.search);
        console.log("Параметры перед обновлением URL:", queryParams);


        queryParams.delete("size");


        queryParams.set("category", newCategory);
        queryParams.set("brand", newBrand);
        queryParams.set("search", newSearch);
        queryParams.set("management", newManagement);
        queryParams.set("refrigerant", newRefrigerant);

        if (newArea) {
            queryParams.set("area", String(newArea));
        }

        console.log("Итоговые параметры для URL:", queryParams.toString());


        router.push(`/catalog?${queryParams.toString()}`);


        onFilterChangeAction(updatedFilters);
    };


    const handleResetFilters = () => {

        console.log("Сбрасываем фильтры...");


        setArea("");
        setSearch("");
        setBrand("all");
        setCategory("all");
        setManagement("all");
        setRefrigerant("all");


        console.log("Обновляем фильтры с новыми значениями:");
        handleFilterChange("all", "all", "", "all", "all", "");
    };


    if (!isClient) return null;

    return (
        <div
            className="mt-28 bg-accent border-2 border-accent max-w-[1350px] p-6 rounded-3xl flex flex-col gap-4 md:flex-row md:items-end md:justify-between">


            <div className="flex flex-col w-full md:w-1/6">
                <label className="mb-1 text-lg font-semibold text-foreground">Категория</label>
                <Select
                    value={category}
                    onValueChange={(value) =>
                        handleFilterChange(value, brand, search, management, refrigerant, area)
                    }
                >
                    <SelectTrigger
                        className="w-full h-10 px-3 border border-foreground/50 bg-foreground/50 text-white rounded-xl shadow-sm">
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


            <div className="flex flex-col w-full md:w-1/6">
                <label className="mb-1 text-lg font-semibold text-foreground">Фильтр по бренду</label>
                <Select
                    value={brand}
                    onValueChange={(value) => {
                        console.log("Выбран новый бренд:", value);
                        setBrand(value);
                        handleFilterChange(category, value, search, management, refrigerant, area);
                    }}
                >
                    <SelectTrigger
                        className="w-full h-10 px-3 border border-foreground/50 bg-foreground/50 text-white rounded-xl shadow-sm">
                        <SelectValue placeholder="Все бренды"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Все бренды</SelectItem>
                        <SelectItem value="AIRWAVE">AIRWAVE</SelectItem>
                        <SelectItem value="Aurum">Aurum</SelectItem>
                        <SelectItem value="Axioma">Axioma</SelectItem>
                        <SelectItem value="BOSCH">BOSCH</SelectItem>
                        <SelectItem value="Daichi">Daichi</SelectItem>
                        <SelectItem value="Daikin">Daikin</SelectItem>
                        <SelectItem value="Kentatsu">Kentatsu</SelectItem>
                        <SelectItem value="Midea">Midea</SelectItem>
                        <SelectItem value="Primera">Primera</SelectItem>
                    </SelectContent>
                </Select>
            </div>


            <div className="flex flex-col w-full md:w-1/6">
                <label className="mb-1 text-lg font-semibold text-foreground">Режим управления</label>
                <Select
                    value={management}
                    onValueChange={(value) => {
                        setManagement(value);
                        handleFilterChange(category, brand, search, value, refrigerant, area);
                    }}
                >
                    <SelectTrigger
                        className="w-full h-10 px-3 border border-foreground/50 bg-foreground/50 text-white rounded-xl shadow-sm">
                        <SelectValue placeholder="Все режимы"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Все</SelectItem>
                        <SelectItem value="Full DC Inverter">Full DC Inverter</SelectItem>
                        <SelectItem value="Inverter">Inverter</SelectItem>
                        <SelectItem value="On/Off">On/Off</SelectItem>
                    </SelectContent>
                </Select>
            </div>


            <div className="flex flex-col w-full md:w-1/6">
                <label className="mb-1 text-lg font-semibold text-foreground">Тип хладагента</label>
                <Select
                    value={refrigerant}
                    onValueChange={(value) => {
                        setRefrigerant(value);
                        handleFilterChange(category, brand, search, management, value, area);
                    }}
                >
                    <SelectTrigger
                        className="w-full h-10 px-3 border border-foreground/50 bg-foreground/50 text-white rounded-xl shadow-sm">
                        <SelectValue placeholder="Все хладагенты"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Все</SelectItem>
                        <SelectItem value="R290">R290</SelectItem>
                        <SelectItem value="R32">R32</SelectItem>
                        <SelectItem value="R410A">R410A</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col w-full md:w-1/6">
                <label className="mb-1 text-lg font-semibold text-foreground">Площадь (м²)</label>
                <input
                    type="number"
                    placeholder="Введите площадь"
                    className="w-full h-10 px-3 border border-foreground/50 bg-foreground/50 text-white placeholder-white text-[0.9rem] rounded-xl shadow-sm"
                    value={area}
                    onChange={(e) => {
                        const value = e.target.value ? Number(e.target.value) : "";
                        setArea(value);
                        handleFilterChange(category, brand, search, management, refrigerant, value);
                    }}
                />
            </div>


            <div className="flex flex-col flex-grow w-full md:w-1/6">
                <label className="mb-1 text-lg font-semibold text-foreground">Поиск</label>
                <input
                    type="text"
                    placeholder="Введите название"
                    className="w-full h-10 px-3 border border-foreground/50 bg-foreground/50 text-white placeholder-white text-[0.9rem]  rounded-xl shadow-sm"
                    value={search}
                    onChange={(e) => {
                        const newSearch = e.target.value;
                        setSearch(newSearch);
                        handleFilterChange(category, brand, newSearch, management, refrigerant, area);
                    }}
                />
            </div>

            <button
                className="sm:h-20 w-full md:w-48 px-4 bg-foreground/50 text-white text-lg rounded-3xl"
                onClick={handleResetFilters}
            >
                Очистить фильтры
            </button>
        </div>
    );
}