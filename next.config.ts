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
                        value:
                            "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' 'inline-speculation-rules' https://api-maps.yandex.ru https://yastatic.net;",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
