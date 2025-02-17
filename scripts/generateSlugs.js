import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); // Загрузка переменных из .env.local

import { createClient } from 'next-sanity';
import slugify from 'slugify';

// Создаём клиента, используя переменные окружения
export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // должно быть "2y01oix2"
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,        // "production"
    token: process.env.SANITY_TOKEN,                         // ваш токен
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,   // "2025-02-11"
    useCdn: false, // для записи CDN должен быть отключён
});

// Далее ваш скрипт...
async function generateSlugs() {
    const query = `*[_type == "product" && !defined(slug.current)]{
    _id,
    _rev,
    title
  }`;

    const docsWithoutSlug = await client.fetch(query);

    console.log(`Найдено ${docsWithoutSlug.length} документов без slug.`);

    let transaction = client.transaction();

    docsWithoutSlug.forEach((doc) => {
        const newSlug = slugify(doc.title, { lower: true, strict: true, trim: true });
        transaction = transaction.patch(doc._id, {
            set: {
                slug: {
                    _type: 'slug',
                    current: newSlug,
                },
            },
        });
    });

    if (docsWithoutSlug.length > 0) {
        await transaction.commit();
        console.log('Slug-и успешно сгенерированы и сохранены!');
    } else {
        console.log('Нет документов без slug, ничего не делаем.');
    }
}

generateSlugs().catch((err) => {
    console.error(err);
    process.exit(1);
});
