'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Service = {
    id: number;
    title: string;
    slug: string;
    price: number;
    price_label?: string;
    service_type?: string;
    image_url?: string;
    description?: string;
    sanity_id?: string;
};

export default function ServicesAdminPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchServices = () => {
        setLoading(true);
        fetch('/api/services')
            .then(res => res.json())
            .then(data => {
                setServices(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Не удалось загрузить услуги');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить эту услугу?');
        if (!confirmDelete) return;

        try {
            const res = await fetch(`/api/services/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Ошибка при удалении');
            }

            fetchServices();
        } catch (err: any) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    if (loading) return <p className="p-6 text-gray-600">Загрузка...</p>;
    if (error) return <p className="p-6 text-red-600">{error}</p>;

    return (
        <main className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-foreground">Управление услугами</h1>
                <Link
                    href="/ap/services/new"
                    className="bg-foreground hover:bg-accentHover text-white px-4 py-2 rounded-xl transition"
                >
                    ➕ Добавить услугу
                </Link>
            </div>

            <div className="overflow-auto rounded-xl shadow-sm">
                <table className="min-w-full text-sm text-left border border-gray-200">
                    <thead className="bg-accent text-foreground uppercase tracking-wider text-xs">
                    <tr>
                        <th className="px-4 py-3 border-b border-gray-200">Название</th>
                        <th className="px-4 py-3 border-b border-gray-200">Цена</th>
                        <th className="px-4 py-3 border-b border-gray-200">Тип</th>
                        <th className="px-4 py-3 border-b border-gray-200">Действия</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {services.map((service) => (
                        <tr key={`svc-${service.id}-${service.sanity_id ?? 'nosanity'}`} className="hover:bg-accent/50 transition">
                            <td className="px-4 py-3 font-medium text-gray-900">{service.title}</td>
                            <td className="px-4 py-3 text-gray-700">
                                {service.price_label || 'От'} {service.price}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                                {service.service_type || '-'}
                            </td>
                            <td className="px-4 py-3 space-x-2">
                                <Link
                                    href={`/ap/services/${service.id}/edit`}
                                    className="inline-block text-accent hover:text-accentHover2 font-medium"
                                >
                                    ✏️ Редактировать
                                </Link>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="inline-block text-red-600 hover:text-red-800 font-medium"
                                >
                                    🗑️ Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
