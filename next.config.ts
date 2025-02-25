import type { NextConfig } from "next";

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
                        // Здесь добавляем директиву 'unsafe-inline' (и другие, если необходимо) и указываем default-src
                        value:
                            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' 'inline-speculation-rules' https://api-maps.yandex.ru https://yastatic.net;",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
