'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const accent = '#C7E07A';
const accentHover = '#B4CC6E';
const foreground = '#111827';

type Location = {
    id: number;
    latitude: number;
    longitude: number;
    altitude: number;
    address: string;
};

export default function LocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchLocations = async () => {
        try {
            const res = await fetch('/api/locations');

            if (!res.ok) {
                // Можно вывести ошибку, например в консоль или UI
                console.error(`Ошибка сервера: ${res.status}`);
                return;
            }

            // Проверяем, что Content-Type JSON (на всякий случай)
            const contentType = res.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
                console.error('Ответ сервера не JSON');
                return;
            }

            const data = await res.json();
            setLocations(data);
        } catch (err) {
            console.error('Ошибка при загрузке локаций:', err);
        }
    };


    useEffect(() => {
        fetchLocations();
    }, []);

    const handleDelete = async () => {
        if (!selectedId) return;

        setLoading(true);
        const res = await fetch(`/api/locations/${selectedId}`, { method: 'DELETE' });

        if (res.ok) {
            setLocations(prev => prev.filter(loc => loc.id !== selectedId));
            setSelectedId(null);
        } else {
            alert('Ошибка при удалении');
        }

        setLoading(false);
    };

    return (
        <main className="p-6 font-sans relative">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Все локации</h1>
                <Link
                    href="/ap/locations/new"
                    className="px-4 py-2 rounded-xl font-semibold text-white transition-colors"
                    style={{ backgroundColor: accent }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = accentHover)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = accent)}
                >
                    Добавить локацию
                </Link>
            </div>

            <ul className="space-y-4">
                {locations.map(loc => (
                    <li
                        key={loc.id}
                        className="border p-4 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                        <div>
                            <Link
                                href={`/ap/locations/${loc.id}`}
                                className="text-lg font-semibold"
                                style={{ color: accent }}
                                onMouseEnter={e => (e.currentTarget.style.color = accentHover)}
                                onMouseLeave={e => (e.currentTarget.style.color = accent)}
                            >
                                {loc.address}
                            </Link>
                            <div className="mt-1 text-sm text-gray-600">
                                lat: {loc.latitude}, lon: {loc.longitude}, alt: {loc.altitude}
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedId(loc.id)}
                            className="px-4 py-2 rounded-md text-sm font-medium transition-colors border"
                            style={{
                                color: foreground,
                                borderColor: foreground,
                            }}
                            disabled={loading}
                        >
                            Удалить
                        </button>
                    </li>
                ))}
            </ul>

            {selectedId !== null && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900">Подтверждение удаления</h2>
                        <p className="text-gray-700 mb-6">Вы уверены, что хотите удалить эту локацию?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedId(null)}
                                className="px-4 py-2 rounded-md text-sm border"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="px-4 py-2 rounded-md text-sm font-medium transition-colors border"
                                style={{
                                    color: foreground,
                                    borderColor: foreground,
                                    opacity: loading ? 0.5 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {loading ? 'Удаляю...' : 'Удалить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
