"use client";

import { useState, useEffect } from "react";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string>("");
    const [isClient, setIsClient] = useState(false); // Для проверки клиентской среды

    // useEffect выполняется только на клиенте
    useEffect(() => {
        setIsClient(true); // Устанавливаем флаг, что мы на клиенте
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = () => {
        const envLogin = process.env.NEXT_PUBLIC_ADMIN_LOGIN;
        const envPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

        if (login === envLogin && password === envPassword) {
            setIsAuthenticated(true);
            if (isClient) {
                localStorage.setItem("auth", "true");
            }
            setError(""); // Сбрасываем ошибку при успешном входе
        } else {
            setError("Неверные данные");
        }
    };

    if (!isClient) {
        return <div>Loading...</div>; // Показываем что-то на сервере, пока не определено состояние клиентского рендера
    }

    return isAuthenticated || localStorage.getItem("auth") === "true" ? (
        <>{children}</>
    ) : (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold mb-4">Вход</h2>
            <input
                type="text"
                placeholder="Логин"
                className="mb-2 p-2 border rounded"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
            />
            <input
                type="password"
                placeholder="Пароль"
                className="mb-2 p-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="px-4 py-2 bg-accent mt-4 text-foreground rounded-xl" onClick={handleLogin}>
                Войти
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>} {/* Текст ошибки снизу */}
        </div>
    );
};

export default AuthWrapper;
