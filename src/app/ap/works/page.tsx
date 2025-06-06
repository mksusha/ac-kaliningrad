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

export default async function WorksPage() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/works`);

    const works: Work[] = await res.json();

    return (
        <main className="p-6 font-sans bg-white min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Все работы</h1>
            <ul className="space-y-6">
                {works.map(work => (
                    <li
                        key={work.sanity_id}
                        className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                        <Link
                            href={`/ap/works/${work.sanity_id}`}
                            className="text-xl font-semibold text-foreground hover:text-accentHover2 transition-colors"
                        >
                            {work.title}
                        </Link>

                        <div className="mt-3 prose prose-sm max-w-none">
                            <PortableText value={work.description} />
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
                    </li>
                ))}
            </ul>
        </main>
    );
}
