'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

type Manufacturer = {
    desc: string;
    link: string;
    logo: string;
} | null;

type Product = {
    id: number;
    title: string;
    slug: string;
    manufacturer: Manufacturer;
};

export default function ProductsAdminPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/products');
                if (!res.ok) throw new Error('Ошибка загрузки товаров');
                const data = await res.json();
                setProducts(data);
            } catch (err: any) {
                setError(err.message || 'Ошибка сервера');
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    function openDeleteModal(id: number) {
        setDeletingId(id);
        setShowModal(true);
    }

    function closeDeleteModal() {
        setDeletingId(null);
        setShowModal(false);
    }

    async function handleDelete() {
        if (deletingId === null) return;

        try {
            const res = await fetch(`/api/products/${deletingId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Ошибка при удалении товара");

            setProducts((prev) => prev.filter((product) => product.id !== deletingId));
        } catch (err: any) {
            alert(err.message || "Не удалось удалить товар");
        } finally {
            closeDeleteModal();
        }
    }

    // Поиск и фильтрация
    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Сортировка по названию
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortOrder === "asc") return a.title.localeCompare(b.title);
        else return b.title.localeCompare(a.title);
    });

    if (loading) return <p className="text-center mt-10 text-gray-600 text-lg font-medium">Загрузка...</p>;
    if (error) return <p className="text-center mt-10 text-red-600 text-lg font-semibold">{error}</p>;

    return (
        <main className="p-8 font-sans max-w-6xl m-auto">
            <h1 className="text-3xl font-extrabold mb-8 text-gray-900">🛒 Все товары</h1>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <Link
                    href="/ap/products/new"
                    className="px-5 py-2 bg-accent hover:bg-accentHover text-foreground font-semibold rounded-xl shadow-md transition"
                >
                    ➕ Добавить новый товар
                </Link>

                <input
                    type="text"
                    placeholder="Поиск по названию..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="border border-accent rounded-xl px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-accentHover w-full max-w-xs transition"
                />

                <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    aria-label="Переключить сортировку"
                    className="flex items-center gap-1 px-4 py-2 bg-accent hover:bg-accentHover rounded-xl shadow-sm transition select-none"
                    title={`Сортировка: ${sortOrder === "asc" ? "А → Я" : "Я → А"}`}
                >
                    Сортировка
                    {sortOrder === "asc" ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    )}
                </button>
            </div>

            {sortedProducts.length === 0 ? (
                <p className="text-center text-gray-500 text-lg mt-12">Товары не найдены.</p>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
                    <table className="w-full table-auto border-collapse text-gray-800">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-300">
                            <th className="text-left px-6 py-3 font-semibold text-gray-600">Название</th>
                            <th className="text-left px-6 py-3 font-semibold text-gray-600">Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedProducts.map(({ id, title, slug, manufacturer }) => (
                            <tr
                                key={id}
                                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{title}</td>

                                <td className="px-6 py-4 whitespace-nowrap space-x-6">
                                    <Link
                                        href={`/ap/products/edit/${slug}`}
                                        className="text-accentHover2 hover:text-accent font-semibold transition"
                                    >
                                        Редактировать
                                    </Link>
                                    <button
                                        onClick={() => openDeleteModal(id)}
                                        className="text-red-600 hover:text-red-800 font-semibold transition"
                                        disabled={deletingId === id && showModal}
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Модальное окно */}
            {showModal && deletingId !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
                    onClick={closeDeleteModal}
                >
                    <div
                        className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl transform transition-all scale-100 animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">
                            Подтверждение удаления
                        </h2>
                        <p className="mb-6 text-gray-700">
                            Вы уверены, что хотите удалить этот товар? Это действие невозможно отменить.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={closeDeleteModal}
                                className="px-5 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition font-semibold"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold transition"
                                autoFocus
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes fadeIn {
          from {opacity: 0; transform: scale(0.95);}
          to {opacity: 1; transform: scale(1);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease forwards;
        }
      `}</style>
        </main>
    );
}
