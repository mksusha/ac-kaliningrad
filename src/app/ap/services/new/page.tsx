'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateServicePage() {
    const router = useRouter();

    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        price_label: '',
        slug: '',
        service_type: '',
        image_url: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Обработчик загрузки файлов
    const handleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
                setForm(prev => {
                    const currentUrls = prev.image_url
                        ? prev.image_url.split(',').map(x => x.trim()).filter(Boolean)
                        : [];
                    const newUrls = [...currentUrls, ...data.urls];
                    return { ...prev, image_url: newUrls.join(', ') };
                });
            }
        } catch {
            alert('Ошибка загрузки файлов');
        }

        e.target.value = ''; // чтобы можно было загрузить те же файлы повторно
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                price: parseFloat(form.price),
            }),
        });

        if (res.ok) {
            router.push('/ap/services');
        } else {
            alert('Ошибка при добавлении');
        }
    };

    return (
        <main className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">➕ Добавить новую услугу</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Название"
                    className="w-full rounded-xl border px-3 py-2"
                    required
                />
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Описание"
                    className="w-full rounded-xl border px-3 py-2"
                />
                <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Цена"
                    className="w-full rounded-xl border px-3 py-2"
                    required
                />
                <input
                    name="price_label"
                    value={form.price_label}
                    onChange={handleChange}
                    placeholder="Метка цены (например, от 1000 ₽)"
                    className="w-full rounded-xl border px-3 py-2"
                />
                <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="Слаг (для URL)"
                    className="w-full rounded-xl border px-3 py-2"
                />
                <input
                    name="service_type"
                    value={form.service_type}
                    onChange={handleChange}
                    placeholder="Тип услуги"
                    className="w-full rounded-xl border px-3 py-2"
                />

                {/* Блок загрузки изображений */}
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
                                onChange={handleFilesUpload}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <input
                        type="text"
                        placeholder="Вставьте URL изображений через запятую"
                        name="image_url"
                        value={form.image_url}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-accent text-foreground px-4 py-2 rounded-xl hover:bg-accentHover"
                >
                    Сохранить
                </button>
            </form>
        </main>
    );
}
