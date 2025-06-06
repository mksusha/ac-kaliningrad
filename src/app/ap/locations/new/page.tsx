'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const accent = '#C7E07A';
const accentHover = '#B4CC6E';

export default function NewLocationPage() {
    const router = useRouter();

    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [altitude, setAltitude] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setError(null);
        setSuccess(null);

        // Валидация: все поля обязательны
        if (!address.trim() || !latitude || !longitude) {
            setError('Адрес, широта и долгота обязательны');
            return;
        }


        setLoading(true);

        try {
            const res = await fetch('/api/locations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    address: address.trim(),
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    altitude: altitude ? parseFloat(altitude) : null,
                }),

            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Ошибка при сохранении');
            }

            setSuccess('Локация добавлена!');
            setTimeout(() => router.push('/ap/locations'), 1500);
        } catch (e: any) {
            setError(e.message || 'Ошибка сохранения');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow font-sans">
            <h1 className="text-2xl font-semibold mb-6 text-center">Новая локация</h1>

            <label className="block mb-2 font-medium text-gray-700">Адрес</label>
            <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Введите адрес"
                disabled={loading}
            />

            <label className="block mb-2 font-medium text-gray-700">Широта (latitude)</label>
            <input
                type="number"
                value={latitude}
                onChange={e => setLatitude(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Например, 59.9343"
                disabled={loading}
            />

            <label className="block mb-2 font-medium text-gray-700">Долгота (longitude)</label>
            <input
                type="number"
                value={longitude}
                onChange={e => setLongitude(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Например, 30.3351"
                disabled={loading}
            />

            <label className="block mb-2 font-medium text-gray-700">Высота (altitude)</label>
            <input
                type="number"
                value={altitude}
                onChange={e => setAltitude(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl mb-5 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Например, 10"
                disabled={loading}
            />

            {error && <p className="text-red-600 mb-4 font-semibold">{error}</p>}
            {success && <p className="text-green-600 mb-4 font-semibold">{success}</p>}

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 rounded-xl text-white text-lg font-semibold transition-colors"
                style={{
                    backgroundColor: loading ? '#ccc' : accent,
                    cursor: loading ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = accentHover)}
                onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = accent)}
            >
                {loading ? 'Добавляю...' : 'Добавить локацию'}
            </button>
        </main>
    );
}
