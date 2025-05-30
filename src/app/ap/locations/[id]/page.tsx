'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Location = {
    id: number;
    latitude: number;
    longitude: number;
    altitude: number;
    address: string;
};

export default function EditLocation() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [location, setLocation] = useState<Location | null>(null);
    const [form, setForm] = useState({
        latitude: '',
        longitude: '',
        altitude: '',
        address: '',
    });

    useEffect(() => {
        if (!id) return;
        fetch(`/api/locations/${id}`)
            .then(res => res.json())
            .then((data: Location) => {
                setLocation(data);
                setForm({
                    latitude: data.latitude.toString(),
                    longitude: data.longitude.toString(),
                    altitude: data.altitude?.toString() || '',
                    address: data.address,
                });
            });
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        await fetch(`/api/locations/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                latitude: parseFloat(form.latitude),
                longitude: parseFloat(form.longitude),
                altitude: form.altitude ? parseFloat(form.altitude) : null,
                address: form.address,
            }),
        });
        router.back();
    };

    if (!location) return <p className="p-6 text-gray-600">Загрузка...</p>;

    return (
        <main className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Редактировать локацию</h1>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Адрес</label>
                <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Широта</label>
                    <input
                        name="latitude"
                        type="number"
                        value={form.latitude}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Latitude"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Долгота</label>
                    <input
                        name="longitude"
                        type="number"
                        value={form.longitude}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Longitude"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Высота</label>
                    <input
                        name="altitude"
                        type="number"
                        value={form.altitude}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Altitude"
                    />
                </div>
            </div>

            <button
                onClick={handleSave}
                className="w-full sm:w-auto px-6 py-2 bg-foreground hover:bg-accentHover text-white font-semibold rounded-xl transition"
            >
               Сохранить
            </button>
        </main>
    );
}
