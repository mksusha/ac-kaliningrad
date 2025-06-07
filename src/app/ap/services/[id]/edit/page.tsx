'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

type Service = {
    id: number;
    title: string;
    description?: string;
    price: number;
    price_label?: string;
    slug: string;
    service_type?: string;
    image_url?: string;
};

export default function EditServicePage() {
    const { id } = useParams();
    const router = useRouter();

    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/services/${id}`)
            .then(res => res.json())
            .then(data => {
                setService(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Ошибка загрузки данных');
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!service) return;

        const res = await fetch(`/api/services/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(service),
        });

        if (res.ok) {
            router.push('/ap/services');
        } else {
            alert('Ошибка при сохранении');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setService(prev => prev ? { ...prev, [name]: value } : prev);
    };

    if (loading) return <p className="p-6 text-gray-600">Загрузка...</p>;
    if (error || !service) return <p className="p-6 text-red-600">{error || 'Услуга не найдена'}</p>;

    return (
        <main className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Редактировать услугу</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Название</label>
                    <input
                        name="title"
                        value={service.title}
                        onChange={handleChange}
                        placeholder="Название услуги"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Описание</label>
                    <textarea
                        name="description"
                        value={service.description || ''}
                        onChange={handleChange}
                        placeholder="Описание услуги"
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Цена</label>
                        <input
                            name="price"
                            type="number"
                            value={service.price}
                            onChange={handleChange}
                            placeholder="Цена"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Метка цены</label>
                        <input
                            name="price_label"
                            value={service.price_label || ''}
                            onChange={handleChange}
                            placeholder="например, от 1000 ₽"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Слаг (URL)</label>
                        <input
                            name="slug"
                            value={service.slug}
                            onChange={handleChange}
                            placeholder="service-slug"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Тип услуги</label>
                        <input
                            name="service_type"
                            value={service.service_type || ''}
                            onChange={handleChange}
                            placeholder="напр. Консультация"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                </div>


                {/* Загрузка изображений + ручной ввод URL'ов */}
                <div className="mb-4">
                    <div className="flex items-center space-x-4 mb-2">
                        <span className="text-gray-700 font-medium select-none">Изображения</span>

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
                                            setService(prev => {
                                                if (!prev) return prev;
                                                const current = prev.image_url
                                                    ? prev.image_url.split(',').map(x => x.trim()).filter(Boolean)
                                                    : [];
                                                const newUrls = [...current, ...data.urls];
                                                return { ...prev, image_url: newUrls.join(', ') };
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

                    <input
                        type="text"
                        placeholder="Вставьте URL изображений через запятую"
                        name="image_url"
                        value={service.image_url || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                </div>


                <button
                    type="submit"
                    className="mt-4 bg-foreground text-white px-6 py-3 rounded-xl font-semibold hover:bg-accent transition"
                >
                     Сохранить изменения
                </button>
            </form>
        </main>
    );
}
