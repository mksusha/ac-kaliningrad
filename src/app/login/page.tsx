'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        console.log('Отправляем данные:', { username, password }); // <-- сюда

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.message || 'Ошибка входа');
            setLoading(false);
            return;
        }

        router.push('/ap');
    }


    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-white p-6 font-sans">
            <form
                onSubmit={handleSubmit}
                className="bg-white bg-opacity-90 border-accent border-2 backdrop-blur-md shadow-lg rounded-2xl max-w-md w-full p-10"
            >
                <h1 className="text-3xl font-extrabold mb-8 text-center text-foreground select-none">
                    Вход в админ-панель
                </h1>

                {error && (
                    <div className="mb-6 px-4 py-3 bg-red-100 text-red-700 rounded-md font-semibold text-center">
                        {error}
                    </div>
                )}

                <label className="block mb-6">
                    <span className="text-gray-800 font-medium mb-1 block select-none">Логин</span>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        placeholder="Введите логин"
                        className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-[#C7E07A] focus:border-[#AFC95F] transition"
                    />
                </label>

                <label className="block mb-8">
                    <span className="text-gray-800 font-medium mb-1 block select-none">Пароль</span>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        placeholder="Введите пароль"
                        className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-[#C7E07A] focus:border-[#AFC95F] transition"
                    />
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-foreground hover:bg-[#B4CC6E] active:bg-[#AFC95F] text-white font-semibold py-3 rounded-2xl
            shadow-md focus:outline-none focus:ring-4 focus:ring-[#B4CC6E]/70 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? 'Входим...' : 'Войти'}
                </button>
            </form>
        </main>
    );
}
