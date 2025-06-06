'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewWorkPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [imagesInput, setImagesInput] = useState(''); // строка с ссылками через запятую
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Превращаем строку ссылок в массив (тримим пробелы и фильтруем пустые)
        const images = imagesInput
            .split(',')
            .map(url => url.trim())
            .filter(Boolean);

        // Формируем тело запроса JSON
        const body = {
            title,
            description,
            address,
            images,
        };

        const res = await fetch('/api/works', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            router.push('/ap/works');
        } else {
            alert('Ошибка при добавлении работы');
        }
    }

    return (
        <main className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Добавить работу</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-semibold">Название</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-xl px-3 py-2"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Описание</label>
                    <textarea
                        className="w-full border border-gray-300 rounded-xl px-3 py-2"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                        rows={4}
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Адрес</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-xl px-3 py-2"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">
                        Ссылки на изображения (через запятую)
                    </label>
                    <textarea
                        className="w-full border border-gray-300 rounded-xl px-3 py-2"
                        value={imagesInput}
                        onChange={e => setImagesInput(e.target.value)}
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                        rows={3}
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-accent text-foreground rounded-xl hover:bg-accentHover transition"
                >
                    Добавить
                </button>
            </form>
        </main>
    );
}
