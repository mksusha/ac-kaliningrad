'use client';

import Link from 'next/link';

const accent = '#C7E07A';
const accentHover = '#B4CC6E';

export default function AdminPage() {
    return (
        <main className="p-8 font-sans bg-white min-h-screen flex flex-col items-center">
            <h1 className="text-3xl font-extrabold mb-10" style={{ color: accent }}>
                Админ-панель
            </h1>

            <ul className="space-y-4 w-full max-w-md">
                {[
                    { href: '/ap/works', label: 'Все работы' },
                    { href: '/ap/locations', label: 'Все локации' },
                    { href: '/ap/products', label: 'Все товары' },
                    { href: '/ap/services', label: 'Все услуги' },
                ].map(({ href, label }) => (
                    <li key={href}>
                        <Link
                            href={href}
                            className="block px-5 py-4 rounded-lg font-medium text-lg transition-colors"
                            style={{ color: accent }}
                            onMouseEnter={e => {
                                e.currentTarget.style.color = accentHover;
                                e.currentTarget.style.backgroundColor = 'rgba(199, 224, 122, 0.1)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.color = accent;
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}
