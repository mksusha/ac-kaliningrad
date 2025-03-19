const nextConfig = {
    images: {
        domains: [
            "cdn.sanity.io",
            "core-renderer-tiles.maps.yandex.net",
            "api-maps.yandex.ru",
        ],
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
                            script-src 'self' 'unsafe-eval' 'unsafe-inline' https://api-maps.yandex.ru https://yastatic.net https://core-renderer-tiles.maps.yandex.net;
                            img-src 'self' data: blob: cdn.sanity.io https://core-renderer-tiles.maps.yandex.net https://api-maps.yandex.ru;
                            connect-src 'self' https://cqwijnozskrhzzzjokai.supabase.co https://2y01oix2.api.sanity.io https://2y01oix2.apicdn.sanity.io https://cdn.sanity.io https://core-renderer-tiles.maps.yandex.net https://api-maps.yandex.ru;
                        `.replace(/\s{2,}/g, " ").trim(),
                    },
                ],
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: "/sitemap.xml",
                destination: "/api/sitemap",
            },
        ];
    },
};

export default nextConfig;
