import type { NextConfig } from "next";
import dotenv from "dotenv";

// Загружаем переменные окружения из .env.local
dotenv.config();

const nextConfig: NextConfig = {
    images: {
        domains: ["cdn.sanity.io"],
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: `
                            default-src 'self';
                            style-src 'self' 'unsafe-inline';
                            script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' 'inline-speculation-rules' https://api-maps.yandex.ru https://yastatic.net;
                            img-src 'self' cdn.sanity.io;
                            connect-src 'self' https://2y01oix2.api.sanity.io https://2y01oix2.apicdn.sanity.io https://cdn.sanity.io;
                        `.replace(/\s{2,}/g, " ").trim(),
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
