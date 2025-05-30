'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

type Work = {
    id: number;
    title: string;
    images: string[]; // URL картинок
    slug: string;
};

const Portfolio = () => {
    const [works, setWorks] = useState<Work[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadWorks() {
            try {
                const res = await fetch('/api/works', { cache: 'no-store' });
                if (!res.ok) throw new Error('Ошибка загрузки данных');
                const data: Work[] = await res.json();
                if (isMounted) {
                    setWorks(data);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Ошибка загрузки работ:', error);
                setLoading(false);
            }
        }

        loadWorks();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return <p className="text-center">Загрузка...</p>;
    }

    return (
        <div className="container mx-auto my-3 mt-12 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {works.map(work => (
                    <div
                        key={work.id}
                        className="border rounded-2xl text-white p-4 bg-foreground/90 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                        <h2 className="text-lg font-semibold mb-2">{work.title}</h2>

                        {work.images.length > 0 && (
                            <img
                                src={work.images[0]}
                                alt={`work-${work.id}`}
                                className="w-full h-64 object-cover rounded-xl mb-4"
                            />
                        )}

                        <Link
                            href={`/portfolio/${work.slug}`}
                            className="text-white hover:text-[#B4CC6E] flex items-center"
                        >
                            Посмотреть подробности
                            <FiChevronRight className="ml-2" />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Portfolio;
