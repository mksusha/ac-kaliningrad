import Link from 'next/link';
import WorksList from './WorksList'; // путь укажи правильный
import { PortableText } from '@portabletext/react';

type Work = {
    sanity_id: string;
    title: string;
    slug: string;
    description: any;
    images: string[];
    address: string;
};

export default async function WorksPage() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/works`);
    const works: Work[] = await res.json();

    return (
        <main className="p-6 font-sans bg-white min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Все работы</h1>
                <Link
                    href="/ap/works/new"
                    className="px-4 py-2 bg-accent text-foreground rounded-xl hover:bg-accentHover transition"
                >
                    Добавить работу
                </Link>
            </div>

            <WorksList initialWorks={works} />
        </main>
    );
}
