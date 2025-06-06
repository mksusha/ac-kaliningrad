'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';

type Work = {
    sanity_id: string;
    title: string;
    slug: string;
    description: any;
    images: string[];
    address: string;
};

export default function WorksList({ initialWorks }: { initialWorks: Work[] }) {
    const [works, setWorks] = useState(initialWorks);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    function openModal(id: string) {
        setSelectedId(id);
        setModalOpen(true);
    }

    function closeModal() {
        setSelectedId(null);
        setModalOpen(false);
    }

    async function handleDelete() {
        if (!selectedId) return;

        setDeletingId(selectedId);

        const res = await fetch(`/api/works/${selectedId}`, { method: 'DELETE' });
        if (res.ok) {
            setWorks(prev => prev.filter(work => work.sanity_id !== selectedId));
        } else {
            alert('Ошибка при удалении работы');
        }

        setDeletingId(null);
        closeModal();
    }

    return (
        <>
            <ul className="space-y-6">
                {works.map(work => (
                    <li
                        key={work.sanity_id}
                        className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow relative"
                    >
                        <Link
                            href={`/ap/works/${work.sanity_id}`}
                            className="text-xl font-semibold text-foreground hover:text-accentHover2 transition-colors"
                        >
                            {work.title}
                        </Link>

                        <div className="mt-3 prose prose-sm max-w-none">
                            <PortableText value={work.description}/>
                        </div>

                        <div className="mt-3 text-sm text-gray-600 italic">{work.address}</div>

                        {work.images?.length > 0 && (
                            <div className="mt-4 flex gap-3 overflow-x-auto">
                                {work.images.map((url, i) => (
                                    <img
                                        key={i}
                                        src={url}
                                        alt={`${work.title} — изображение ${i + 1}`}
                                        className="h-24 w-auto rounded object-cover"
                                    />
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => openModal(work.sanity_id)}
                            disabled={deletingId === work.sanity_id}
                            className={`
    absolute top-5 right-5
    px-2 py-1 text-sm
    text-foreground
    border border-foreground
    rounded-xl
    bg-transparent
    transition
    duration-300
    ease-in-out
    hover:bg-foreground hover:text-background
    disabled:opacity-50 disabled:cursor-not-allowed
  `}
                        >
                            {deletingId === work.sanity_id ? 'Удаление...' : 'Удалить'}
                        </button>

                    </li>
                ))}
            </ul>

            {/* Модальное окно */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-80 max-w-full shadow-lg">
                        <p className="mb-6 text-gray-900">Вы действительно хотите удалить эту работу?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={!!deletingId}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {deletingId ? 'Удаление...' : 'Удалить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
