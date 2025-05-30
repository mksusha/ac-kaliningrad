'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface AirConditioner {
    id: number;
    _id: string;
    title: string;
    slug: string;
    brand: string;
    category: string;
    description: string;
    images: { url: string }[];
    models: string[];
    specs: {
        cooling_power: string[];
        heating_power: string[];
        power_supply: string[];
        energy_efficiency: string[];
        heating_efficiency: string[];
        noise_level: string[];
        dimensions_inner: string[];
        dimensions_outer: string[];
        weight_inner: string[];
        weight_outer: string[];
        refrigerant_type: string[];
        refrigerant_charge: string[];
        pipe_liquid: string[];
        pipe_gas: string[];
        pipe_length: string[];
        pipe_difference: string[];
        working_temp_cooling: string[];
        working_temp_heating: string[];
        lifetime: string[];
        manufacturer_country: string[];
    };
    prices: string[];
    buy_links: { name: string; url: string }[];
    documents: { title: string; url: string }[];
    areaOptions: number[];
    management: string;
    refrigerant: string;
    range: string;
    cooling_capacity: string;
    statsLogo?: string;
    manufacturer: {
        logo: string;
        link: string;
        desc: string;
    };
    dealer: {
        link: string;
        desc: string;
    };
}

function arrayToString(arr?: unknown): string {
    if (!arr) return "";
    if (Array.isArray(arr)) {
        return arr.join(", ");
    }
    return "";
}

function generateSlug(text: string) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

function stringToArray(str: string) {
    return str
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

function imagesToString(images?: { url: string }[]): string {
    if (!images || !Array.isArray(images)) return "";
    return images.map((img) => img.url).join(", ");
}

export default function EditProductForm({ product }: { product: AirConditioner }) {
    const router = useRouter();

    const defaultSpecs = {
        cooling_power: "",
        heating_power: "",
        power_supply: "",
        energy_efficiency: "",
        heating_efficiency: "",
        noise_level: "",
        dimensions_inner: "",
        dimensions_outer: "",
        weight_inner: "",
        weight_outer: "",
        refrigerant_type: "",
        refrigerant_charge: "",
        pipe_liquid: "",
        pipe_gas: "",
        pipe_length: "",
        pipe_difference: "",
        working_temp_cooling: "",
        working_temp_heating: "",
        lifetime: "",
        manufacturer_country: "",
    };

    // Основные поля
    const [title, setTitle] = useState(product.title ?? "");
    const [slug, setSlug] = useState(product.slug ?? "");
    const [brand, setBrand] = useState(product.brand ?? "");
    const [category, setCategory] = useState(product.category ?? "");
    const [description, setDescription] = useState(product.description ?? "");

    // Массивы как строки через запятую
    const [images, setImages] = useState(imagesToString(product.images));
    const [models, setModels] = useState(arrayToString(product.models));
    const [prices, setPrices] = useState(arrayToString(product.prices));
    const [area_options, setArea_options] = useState(arrayToString(product.areaOptions));
    const [buyLinks, setBuyLinks] = useState(
        product.buy_links?.map((b) => `${b.name}::${b.url}`).join(", ") ?? ""
    );
    const [documents, setDocuments] = useState(
        product.documents?.map((d) => `${d.title}::${d.url}`).join(", ") ?? ""
    );

    // specs — каждый массив как строка
    const specsData = product.specs || {
        cooling_power: [],
        heating_power: [],
        power_supply: [],
        energy_efficiency: [],
        heating_efficiency: [],
        noise_level: [],
        dimensions_inner: [],
        dimensions_outer: [],
        weight_inner: [],
        weight_outer: [],
        refrigerant_type: [],
        refrigerant_charge: [],
        pipe_liquid: [],
        pipe_gas: [],
        pipe_length: [],
        pipe_difference: [],
        working_temp_cooling: [],
        working_temp_heating: [],
        lifetime: [],
        manufacturer_country: [],
    };

    const [specs, setSpecs] = useState({
        cooling_power: arrayToString(specsData.cooling_power),
        heating_power: arrayToString(specsData.heating_power),
        power_supply: arrayToString(specsData.power_supply),
        energy_efficiency: arrayToString(specsData.energy_efficiency),
        heating_efficiency: arrayToString(specsData.heating_efficiency),
        noise_level: arrayToString(specsData.noise_level),
        dimensions_inner: arrayToString(specsData.dimensions_inner),
        dimensions_outer: arrayToString(specsData.dimensions_outer),
        weight_inner: arrayToString(specsData.weight_inner),
        weight_outer: arrayToString(specsData.weight_outer),
        refrigerant_type: arrayToString(specsData.refrigerant_type),
        refrigerant_charge: arrayToString(specsData.refrigerant_charge),
        pipe_liquid: arrayToString(specsData.pipe_liquid),
        pipe_gas: arrayToString(specsData.pipe_gas),
        pipe_length: arrayToString(specsData.pipe_length),
        pipe_difference: arrayToString(specsData.pipe_difference),
        working_temp_cooling: arrayToString(specsData.working_temp_cooling),
        working_temp_heating: arrayToString(specsData.working_temp_heating),
        lifetime: arrayToString(specsData.lifetime),
        manufacturer_country: arrayToString(specsData.manufacturer_country),
    });


    // Остальные строки
    const [management, setManagement] = useState(product.management ?? "");
    const [refrigerant, setRefrigerant] = useState(product.refrigerant ?? "");
    const [range, setRange] = useState(product.range ?? "");
    const [cooling_capacity, setCoolingCapacity] = useState(product.cooling_capacity ?? "");

    const [manufacturerLogo, setManufacturerLogo] = useState(product.manufacturer?.logo ?? "");
    const [manufacturerLink, setManufacturerLink] = useState(product.manufacturer?.link ?? "");
    const [manufacturerDesc, setManufacturerDesc] = useState(product.manufacturer?.desc ?? "");


    // dealer
    const [dealerLink, setDealerLink] = useState(product.dealer?.link ?? "");
    const [dealerDesc, setDealerDesc] = useState(product.dealer?.desc ?? "");


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        setSlug(generateSlug(newTitle));
    };

    // УДАЛЕНО: const specs = product.specs || defaultSpecs;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!title.trim() || !slug.trim()) {
            setError("Поля 'Название' и 'Slug' обязательны");
            setLoading(false);
            return;
        }

        const updatedProduct = {
            ...product,
            title,
            slug,
            brand,
            category,
            description,
            images: stringToArray(images).map((url) => ({ url })),
            models: stringToArray(models),
            prices: stringToArray(prices),
            area_options: stringToArray(area_options).map(Number).filter(n => !isNaN(n)),
            buy_links: buyLinks
                ? buyLinks.split(",").map((item) => {
                    const [name, url] = item.split("::").map((s) => s.trim());
                    return { name, url };
                })
                : [],
            documents: documents
                ? documents.split(",").map((item) => {
                    const [title, url] = item.split("::").map((s) => s.trim());
                    return { title, url };
                })
                : [],
            specs: {
                cooling_power: stringToArray(specs.cooling_power),
                heating_power: stringToArray(specs.heating_power),
                power_supply: stringToArray(specs.power_supply),
                energy_efficiency: stringToArray(specs.energy_efficiency),
                heating_efficiency: stringToArray(specs.heating_efficiency),
                noise_level: stringToArray(specs.noise_level),
                dimensions_inner: stringToArray(specs.dimensions_inner),
                dimensions_outer: stringToArray(specs.dimensions_outer),
                weight_inner: stringToArray(specs.weight_inner),
                weight_outer: stringToArray(specs.weight_outer),
                refrigerant_type: stringToArray(specs.refrigerant_type),
                refrigerant_charge: stringToArray(specs.refrigerant_charge),
                pipe_liquid: stringToArray(specs.pipe_liquid),
                pipe_gas: stringToArray(specs.pipe_gas),
                pipe_length: stringToArray(specs.pipe_length),
                pipe_difference: stringToArray(specs.pipe_difference),
                working_temp_cooling: stringToArray(specs.working_temp_cooling),
                working_temp_heating: stringToArray(specs.working_temp_heating),
                lifetime: stringToArray(specs.lifetime),
                manufacturer_country: stringToArray(specs.manufacturer_country),
            },
            management,
            refrigerant,
            range,
            cooling_capacity,
            manufacturer: {
                logo: manufacturerLogo,
                link: manufacturerLink,
                desc: manufacturerDesc,
            },
            dealer: {
                link: dealerLink,
                desc: dealerDesc,
            },
        };

        try {
            console.log("PATCH request:", updatedProduct);

            const response = await fetch(`/api/products/${product._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProduct),
            });



            if (!response.ok) {
                throw new Error("Ошибка при обновлении продукта");
            }

            setLoading(false);
            router.refresh();
        } catch (err) {
            setError(String(err));
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto my-10 p-4 bg-white rounded-2xl shadow">
            {/* Основные поля */}
            <div>
                <label className="block font-semibold mb-1" htmlFor="title">Название *</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    required
                    className="w-full border px-3 py-2 rounded-2xl"
                />
            </div>

            <div className="mt-4">
                <label className="block font-semibold mb-1" htmlFor="slug">Slug *</label>
                <input
                    id="slug"
                    type="text"
                    value={slug}
                    readOnly  // поле только для чтения, пользователь не может менять вручную
                    className="w-full border px-3 py-2 rounded-2xl bg-gray-100 cursor-not-allowed"
                />
            </div>

            <div>
                <label className="block font-semibold mb-1" htmlFor="brand">Бренд</label>
                <input
                    id="brand"
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full border px-3 py-2 rounded-2xl"
                />
            </div>

            <div>
                <label className="block font-semibold mb-1" htmlFor="category">Категория</label>
                <input
                    id="category"
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border px-3 py-2 rounded-2xl"
                />
            </div>

            <div>
                <label className="block font-semibold mb-1" htmlFor="description">Описание</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border px-3 py-2 rounded-2xl"
                    rows={3}
                />
            </div>

            {/* Массивы как строки */}
            <div>
                <label className="block font-semibold mb-1" htmlFor="images">Изображения (через запятую)</label>
                <input
                    id="images"
                    type="text"
                    value={images}
                    onChange={(e) => setImages(e.target.value)}
                    className="w-full border px-3 py-2 rounded-2xl"
                />
            </div>

            <div>
                <label className="block font-semibold mb-1" htmlFor="models">Модели (через запятую)</label>
                <input
                    id="models"
                    type="text"
                    value={models}
                    onChange={(e) => setModels(e.target.value)}
                    className="w-full border px-3 py-2 rounded-2xl"
                />
            </div>

            <div>
                <label className="block font-semibold mb-1" htmlFor="prices">Цены (через запятую)</label>
                <input
                    id="prices"
                    type="text"
                    value={prices}
                    onChange={(e) => setPrices(e.target.value)}
                    className="w-full border px-3 py-2 rounded-2xl"
                />
            </div>

            <div>
                <label htmlFor="area_options">Площадь помещения (через запятую)</label>
                <input
                    id="area_options"
                    type="text"
                    value={area_options}
                    onChange={(e) => setArea_options(e.target.value)}
                    className="w-full border px-3 py-2 rounded-2xl"
                    placeholder="25, 35, 50, 60"
                />
            </div>

            <div>
                <label className="block font-semibold mb-1" htmlFor="buyLinks">Ссылки на покупку (name::url, через
                    запятую)</label>
                <input
                    id="buyLinks"
                    type="text"
                    value={buyLinks}
                    onChange={(e) => setBuyLinks(e.target.value)}
                    className="w-full border px-3 py-2 rounded-2xl"
                    placeholder="Магазин1::https://example.com, Магазин2::https://example2.com"
                />
            </div>

            <div>
                <label className="block font-semibold mb-1" htmlFor="documents">Документы (title::url, через
                    запятую)</label>
                <input
                    id="documents"
                    type="text"
                    value={documents}
                    onChange={(e) => setDocuments(e.target.value)}
                    className="w-full border px-3 py-2 rounded-2xl"
                    placeholder="Документ1::https://doc1.com, Документ2::https://doc2.com"
                />
            </div>

            {/* Specs */}
            <fieldset className="border p-4 rounded-2xl space-y-4">
                <legend className="font-semibold mb-2">Характеристики (через запятую)</legend>

                {Object.entries(specs).map(([key, value]) => (
                    <div key={key}>
                        <label className="block font-semibold mb-1" htmlFor={key}>
                            {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </label>
                        <input
                            id={key}
                            type="text"
                            value={value}
                            onChange={(e) => setSpecs((prev) => ({...prev, [key]: e.target.value}))}
                            className="w-full border px-3 py-2 rounded-2xl"
                        />
                    </div>
                ))}
            </fieldset>

            {/* Остальные строки */}
            <div>
                <label className="block font-semibold mb-1" htmlFor="management">Управление</label>
                <input
                    id="management"
                    type="text"
                    value={management}
                    onChange={(e) => setManagement(e.target.value)}
                    className="w-full border px-3 py-2 rounded-2xl"
                />
            </div>

            <div>
                <label className="block font-semibold mb-1" htmlFor="refrigerant">Хладагент</label>
                <input
                    id="refrigerant"
                    type="text"
                    value={refrigerant}
                    onChange={(e) => setRefrigerant(e.target.value)}
                    className="w-full border px-3 py-2 rounded-2xl"
                />
            </div>

            <div>
                <label className="block font-semibold mb-1" htmlFor="range">Диапазон</label>
                <input
                    id="range"
                    type="text"
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="w-full border px-3 py-2 rounded-2xl"
                />
            </div>

            <div>
                <label className="block font-semibold mb-1" htmlFor="cooling_capacity">Холодопроизводительность,
                    кВт</label>
                <input
                    id="cooling_capacity"
                    type="text"
                    value={cooling_capacity}
                    onChange={(e) => setCoolingCapacity(e.target.value)}
                    className="w-full border px-3 py-2 rounded-2xl"
                />
            </div>

            {/* Manufacturer */}
            <fieldset className="border p-4 rounded-2xl space-y-4">
                <legend className="font-semibold mb-2">Производитель</legend>

                <div>
                    <label className="block font-semibold mb-1" htmlFor="manufacturerLogo">Логотип (URL)</label>
                    <input
                        id="manufacturerLogo"
                        type="text"
                        value={manufacturerLogo}
                        onChange={(e) => setManufacturerLogo(e.target.value)}
                        className="w-full border px-3 py-2 rounded-2xl"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1" htmlFor="manufacturerLink">Ссылка</label>
                    <input
                        id="manufacturerLink"
                        type="url"
                        value={manufacturerLink}
                        onChange={(e) => setManufacturerLink(e.target.value)}
                        className="w-full border px-3 py-2 rounded-2xl"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1" htmlFor="manufacturerDesc">Описание</label>
                    <textarea
                        id="manufacturerDesc"
                        value={manufacturerDesc}
                        onChange={(e) => setManufacturerDesc(e.target.value)}
                        className="w-full border px-3 py-2 rounded-2xl"
                        rows={3}
                    />
                </div>
            </fieldset>

            {/* Dealer */}
            <fieldset className="border p-4 rounded-2xl space-y-4">
                <legend className="font-semibold mb-2">Дилер</legend>

                <div>
                    <label className="block font-semibold mb-1" htmlFor="dealerLink">Ссылка</label>
                    <input
                        id="dealerLink"
                        type="url"
                        value={dealerLink}
                        onChange={(e) => setDealerLink(e.target.value)}
                        className="w-full border px-3 py-2 rounded-2xl"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1" htmlFor="dealerDesc">Описание</label>
                    <textarea
                        id="dealerDesc"
                        value={dealerDesc}
                        onChange={(e) => setDealerDesc(e.target.value)}
                        className="w-full border px-3 py-2 rounded-2xl"
                        rows={3}
                    />
                </div>
            </fieldset>

            {/* Ошибка */}
            {error && <p className="text-red-600 font-semibold">{error}</p>}

            {/* Кнопка */}
            <button
                type="submit"
                disabled={loading}
                className="bg-accent text-foreground px-6 py-2 rounded-2xl hover:bg-accentHover disabled:opacity-50"
            >
                {loading ? "Сохраняем..." : "Сохранить"}
            </button>
        </form>
    );
}
