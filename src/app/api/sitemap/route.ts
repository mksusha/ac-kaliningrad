import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your_project_id",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2023-01-01",
    useCdn: true,
});

export async function GET() {
    const baseUrl = "https://ac-kaliningrad.vercel.app";


    const productsQuery = `*[_type == "product" && defined(slug.current)]{
        "slug": slug.current
    }`;


    const servicesQuery = `*[_type == "service" && defined(slug.current)]{
        "slug": slug.current
    }`;


    const [products, services] = await Promise.all([
        client.fetch(productsQuery),
        client.fetch(servicesQuery),
    ]);


    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    ${products
        .map(
            (product: { slug: string }) => `
    <url>
        <loc>${baseUrl}/product/${product.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`
        )
        .join("")}
    ${services
        .map(
            (service: { slug: string }) => `
    <url>
        <loc>${baseUrl}/service/${service.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`
        )
        .join("")}
</urlset>`;

    return new NextResponse(sitemap, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
