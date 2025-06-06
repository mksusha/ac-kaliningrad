'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

type Work = {
    sanity_id: string;
    title: string;
    slug: string;
    description: any;
    images: string[];
    address: string;
};

export default function EditWork() {
    const params = useParams();
    const id = params?.id || '';
    const router = useRouter();

    const [work, setWork] = useState<Work | null>(null);
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [imagesInput, setImagesInput] = useState(''); // <-- новое состояние для картинок
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const blocksToText = (blocks: any[]): string =>
        blocks.map(block => block.children?.map((child: any) => child.text).join('') || '').join('\n\n');

    const textToBlocks = (text: string): any[] =>
        text.split(/\n{2,}/).map(paragraph => ({
            _key: Math.random().toString(36).substr(2, 9),
            _type: 'block',
            style: 'normal',
            markDefs: [],
            children: [
                {
                    _key: Math.random().toString(36).substr(2, 9),
                    _type: 'span',
                    text: paragraph,
                    marks: [],
                },
            ],
        }));

    useEffect(() => {
        if (!id) return;

        fetch(`/api/works/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Работа не найдена');
                return res.json();
            })
            .then((data: Work) => {
                setWork(data);
                setTitle(data.title);
                setAddress(data.address);
                setDescription(blocksToText(data.description));
                setImagesInput(data.images?.join(', ') || ''); // <-- заполняем строки с картинками
            })
            .catch(err => {
                alert(err.message);
                router.push('/ap/works');
            });
    }, [id, router]);

    const handleSave = async () => {
        setError(null);
        setSuccess(null);

        if (!title.trim()) {
            setError('Название обязательно');
            return;
        }

        setLoading(true);

        const imagesArray = imagesInput
            .split(',')
            .map(img => img.trim())
            .filter(Boolean);

        const payload = {
            title: title.trim(),
            address: address.trim(),
            description: textToBlocks(description.trim()),
            images: imagesArray, // <-- отправляем массив
        };

        try {
            const res = await fetch(`/api/works/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Ошибка при сохранении');
            }

            setSuccess('Сохранено');
            setTimeout(() => router.push('/ap/works'), 1500);
        } catch (e: any) {
            setError(e.message || 'Ошибка сохранения');
        } finally {
            setLoading(false);
        }
    };

    if (!work) return <div className="p-5 text-lg">Загрузка...</div>;

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow font-sans">
            <h1 className="text-2xl font-semibold mb-8 text-center text-gray-800">Редактировать работу</h1>

            <label className="block mb-2 font-medium text-gray-700">Название</label>
            <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Введите название"
                disabled={loading}
            />

            <label className="block mb-2 font-medium text-gray-700">Адрес</label>
            <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Введите адрес"
                disabled={loading}
            />

            <label className="block mb-2 font-medium text-gray-700">Описание</label>
            <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={10}
                className="w-full p-3 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Введите описание"
                disabled={loading}
            />

            <label className="block mb-2 font-medium text-gray-700">Ссылки на изображения (через запятую)</label>
            <textarea
                value={imagesInput}
                onChange={e => setImagesInput(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                disabled={loading}
            />

            {error && <p className="text-red-600 mb-4 font-semibold">{error}</p>}
            {success && <p className="text-green-600 mb-4 font-semibold">{success}</p>}

            <button
                onClick={handleSave}
                disabled={loading}
                className={`w-full py-3 rounded-xl text-foreground text-lg font-semibold transition-colors ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent hover:bg-accentHover'
                }`}
            >
                {loading ? 'Сохраняю...' : 'Сохранить'}
            </button>
        </div>
    );
}
