'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
    const router = useRouter();

    // Основные поля
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [manufacturerLogo, setManufacturerLogo] = useState("");
    const [manufacturerLink, setManufacturerLink] = useState("");
    const [manufacturerDesc, setManufacturerDesc] = useState("");
    const [dealerLink, setDealerLink] = useState("");
    const [dealerDesc, setDealerDesc] = useState("");

    // Массивы — вводим через строку с разделителями
    const [images, setImages] = useState("");
    const [models, setModels] = useState("");
    const [prices, setPrices] = useState("");
    const [areaOptions, setAreaOptions] = useState("");
    const [buyLinks, setBuyLinks] = useState(""); // формат: имя::url, имя2::url2
    const [documents, setDocuments] = useState(""); // формат: название::url, название2::url2

    // specs — все поля строками, запятыми
    const [specs, setSpecs] = useState({
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
    });

    // Остальные строки
    const [management, setManagement] = useState("");
    const [refrigerant, setRefrigerant] = useState("");
    const [range, setRange] = useState("");
    const [cooling_capacity, setCoolingCapacity] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Утилиты
    function stringToArray(str: string) {
        return str.split(",").map(s => s.trim()).filter(Boolean);
    }
    function parseNameUrlPairs(str: string) {
        return str
            ? str.split(",").map(item => {
                const [name, url] = item.split("::").map(s => s.trim());
                return { name, url };
            })
            : [];
    }
    function parseTitleUrlPairs(str: string) {
        return str
            ? str.split(",").map(item => {
                const [title, url] = item.split("::").map(s => s.trim());
                return { title, url };
            })
            : [];
    }

    // Генерация slug из title
    function transliterate(text: string) {
        const ru = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
        const en = ["a","b","v","g","d","e","yo","zh","z","i","y","k","l","m","n","o","p","r","s","t","u","f","h","ts","ch","sh","sch","","y","","e","yu","ya"];
        return text
            .toLowerCase()
            .split('')
            .map(char => {
                const index = ru.indexOf(char);
                return index >= 0 ? en[index] : char;
            })
            .join('');
    }

    function generateSlug(text: string) {
        return transliterate(text)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        setSlug(generateSlug(newTitle));
    };


    const handleSpecsChange = (field: keyof typeof specs) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setSpecs(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!title.trim() || !slug.trim()) {
            setError("Поля 'Название' и 'Slug' обязательны");
            setLoading(false);
            return;
        }

        const newProduct = {
            title,
            slug,
            brand,
            category,
            description,
            images: stringToArray(images).map(url => ({ url })),
            models: stringToArray(models),
            prices: stringToArray(prices),
            areaOptions: stringToArray(areaOptions).map(Number).filter(n => !isNaN(n)),
            buy_links: parseNameUrlPairs(buyLinks),
            documents: parseTitleUrlPairs(documents),
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
            manufacturer:
                manufacturerLogo || manufacturerLink || manufacturerDesc
                    ? {
                        logo: manufacturerLogo,
                        link: manufacturerLink,
                        desc: manufacturerDesc,
                    }
                    : null,
            dealer:
                dealerLink || dealerDesc
                    ? {
                        link: dealerLink,
                        desc: dealerDesc,
                    }
                    : null,
        };

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Ошибка при создании товара");
            }

            router.push("/ap/products");
        } catch (err: any) {
            setError(err.message || "Ошибка сервера");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-4xl mx-auto p-6 my-10 font-sans">
            <h1 className="text-2xl font-bold mb-6">➕ Добавить новый товар</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-red-600">{error}</p>}

                <div>
                    <label htmlFor="title" className="block mb-1 font-semibold">Название *</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        className="w-full border border-gray-300 rounded-2xl px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="slug" className="block mb-1 font-semibold">Slug (уникальный) *</label>
                    <input
                        id="slug"
                        type="text"
                        value={slug}
                        readOnly
                        className="w-full border border-gray-300 rounded-2xl px-3 py-2 bg-gray-100"
                    />

                </div>

                <div>
                    <label htmlFor="brand" className="block mb-1 font-semibold">Бренд</label>
                    <input
                        id="brand"
                        type="text"
                        value={brand}
                        onChange={e => setBrand(e.target.value)}
                        className="w-full border border-gray-300 rounded-2xl px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block mb-1 font-semibold">Категория</label>
                    <input
                        id="category"
                        type="text"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full border border-gray-300 rounded-2xl px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block mb-1 font-semibold">Описание</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-2xl px-3 py-2"
                        rows={4}
                    />
                </div>

                {/* Загрузка изображений + просмотр URL'ов */}
                <div className="mb-4">
                    <div className="flex items-center space-x-4 mb-2">
                        <span className="text-gray-700 font-medium select-none">Загрузить изображения</span>

                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer inline-flex items-center px-4 py-2 bg-accent text-foreground rounded-xl hover:bg-accentHover transition-colors font-semibold select-none"
                        >
                            Выбрать файлы
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={async (e) => {
                                    const files = e.target.files;
                                    if (!files || files.length === 0) return;

                                    const formData = new FormData();
                                    Array.from(files).forEach(file => formData.append('file', file));

                                    try {
                                        const res = await fetch('/api/upload', {
                                            method: 'POST',
                                            body: formData,
                                        });

                                        const data = await res.json();
                                        if (data?.urls) {
                                            setImages(prev => {
                                                const current = prev
                                                    ? prev.split(',').map(x => x.trim()).filter(Boolean)
                                                    : [];
                                                return [...current, ...data.urls].join(', ');
                                            });
                                        }
                                    } catch (err) {
                                        alert('Ошибка загрузки файлов');
                                    }

                                    e.target.value = '';
                                }}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div>
                        <label htmlFor="images" className="block mb-1 font-semibold">
                            Изображения (URL через запятую)
                        </label>
                        <input
                            id="images"
                            type="text"
                            value={images}
                            onChange={e => setImages(e.target.value)}
                            className="w-full border border-gray-300 rounded-2xl px-3 py-2"
                        />
                    </div>
                </div>


                <div>
                    <label htmlFor="models" className="block mb-1 font-semibold">Модели (через запятую)</label>
                    <input
                        id="models"
                        type="text"
                        value={models}
                        onChange={e => setModels(e.target.value)}
                        className="w-full border border-gray-300 rounded-2xl px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="prices" className="block mb-1 font-semibold">Цены (через запятую)</label>
                    <input
                        id="prices"
                        type="text"
                        value={prices}
                        onChange={e => setPrices(e.target.value)}
                        className="w-full border border-gray-300 rounded-2xl px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="areaOptions" className="block mb-1 font-semibold">Площади (через запятую)</label>
                    <input
                        id="areaOptions"
                        type="text"
                        value={areaOptions}
                        onChange={e => setAreaOptions(e.target.value)}
                        className="w-full border border-gray-300 rounded-2xl px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="buyLinks" className="block mb-1 font-semibold">Ссылки на покупку (name::url, через запятую)</label>
                    <input
                        id="buyLinks"
                        type="text"
                        value={buyLinks}
                        onChange={e => setBuyLinks(e.target.value)}
                        className="w-full border border-gray-300 rounded-2xl px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="documents" className="block mb-1 font-semibold">Документы (title::url, через запятую)</label>
                    <input
                        id="documents"
                        type="text"
                        value={documents}
                        onChange={e => setDocuments(e.target.value)}
                        className="w-full border border-gray-300 rounded-2xl px-3 py-2"
                    />
                </div>

                <fieldset className="border p-3 rounded-2xl">
                    <legend className="font-semibold mb-2">Спецификации (через запятую)</legend>

                    {Object.entries(specs).map(([key, value]) => (
                        <div key={key} className="mb-2">
                            <label htmlFor={key} className="block mb-1 capitalize">
                                {key.replace(/_/g, " ")}
                            </label>
                            <input
                                id={key}
                                type="text"
                                value={value}
                                onChange={handleSpecsChange(key as keyof typeof specs)}
                                className="w-full border border-gray-300 rounded-2xl px-3 py-2"
                            />
                        </div>
                    ))}
                </fieldset>

                <div>
                    <label htmlFor="management" className="block mb-1 font-semibold">Управление</label>
                    <input
                        id="management"
                        type="text"
                        value={management}
                        onChange={e => setManagement(e.target.value)}
                        className="w-full border border-gray-300 rounded-2xl px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="refrigerant" className="block mb-1 font-semibold">Хладагент</label>
                    <input
                        id="refrigerant"
                        type="text"
                        value={refrigerant}
                        onChange={e => setRefrigerant(e.target.value)}
                        className="w-full border border-gray-300 rounded-2xl px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="range" className="block mb-1 font-semibold">Диапазон</label>
                    <input
                        id="range"
                        type="text"
                        value={range}
                        onChange={e => setRange(e.target.value)}
                        className="w-full border border-gray-300 rounded-2xl px-3 py-2"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="cooling_capacity" className="block mb-1 font-semibold">Охлаждающая мощность</label>
                    <input
                        id="cooling_capacity"
                        type="text"
                        value={cooling_capacity}
                        onChange={e => setCoolingCapacity(e.target.value)}
                        className="w-full border border-gray-300 rounded-2xl px-3 py-2"
                    />
                </div>

                <fieldset className="border p-3 rounded-2xl mb-6">
                    <legend className="font-semibold mb-2">Производитель</legend>

                    <div className="mb-3">
                        <label htmlFor="manufacturerLogo" className="block mb-1 font-semibold">Логотип (URL)</label>
                        <input
                            id="manufacturerLogo"
                            type="text"
                            value={manufacturerLogo}
                            onChange={e => setManufacturerLogo(e.target.value)}
                            className="w-full border border-gray-300 rounded-2xl px-3 py-2"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="manufacturerLink" className="block mb-1 font-semibold">Ссылка</label>
                        <input
                            id="manufacturerLink"
                            type="text"
                            value={manufacturerLink}
                            onChange={e => setManufacturerLink(e.target.value)}
                            className="w-full border border-gray-300 rounded-2xl px-3 py-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="manufacturerDesc" className="block mb-1 font-semibold">Описание</label>
                        <textarea
                            id="manufacturerDesc"
                            value={manufacturerDesc}
                            onChange={e => setManufacturerDesc(e.target.value)}
                            className="w-full border border-gray-300 rounded-2xl px-3 py-2"
                            rows={3}
                        />
                    </div>
                </fieldset>

                <fieldset className="border p-3 rounded-2xl mb-6">
                    <legend className="font-semibold mb-2">Дилер</legend>

                    <div className="mb-3">
                        <label htmlFor="dealerLink" className="block mb-1 font-semibold">Ссылка</label>
                        <input
                            id="dealerLink"
                            type="text"
                            value={dealerLink}
                            onChange={e => setDealerLink(e.target.value)}
                            className="w-full border border-gray-300 rounded-2xl px-3 py-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="dealerDesc" className="block mb-1 font-semibold">Описание</label>
                        <textarea
                            id="dealerDesc"
                            value={dealerDesc}
                            onChange={e => setDealerDesc(e.target.value)}
                            className="w-full border border-gray-300 rounded-2xl px-3 py-2"
                            rows={3}
                        />
                    </div>
                </fieldset>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-accent text-foreground px-6 py-2 rounded-2xl hover:bg-accentHover transition disabled:opacity-50"
                >
                    {loading ? "Сохранение..." : "Создать"}
                </button>
            </form>
        </main>
    );
}
