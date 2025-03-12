import { createClient } from "next-sanity";

export interface Work {
    _id: string;
    title: string;
    description: string;
    images: string[];
    slug: { current: string };  // Убедитесь, что слаг это объект с полем current
}


const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your_project_id",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2023-01-01",
    useCdn: true,
});

export async function fetchWorks(): Promise<Work[]> {
    try {
        const query = `*[_type == "work"]{
            _id,
            title,
            description,
            "images": images[].asset->url,
            slug
        } | order(_createdAt asc)`;

        return await client.fetch(query);
    } catch (error) {
        console.error("Ошибка при загрузке работ:", error);
        return [];
    }
}

// Метод для получения работы по слагу
export async function fetchWorkBySlug(slug: string): Promise<Work | null> {
    try {
        const query = `*[_type == "work" && slug.current == $slug][0]{
            _id,
            title,
            description,
            "images": images[].asset->url,
            slug
        }`;

        const params = { slug };
        const work = await client.fetch(query, params);

        return work || null;
    } catch (error) {
        console.error("Ошибка при загрузке работы по слагу:", error);
        return null;
    }
}
