import 'dotenv/config';
import { createClient } from 'next-sanity';



const client = createClient({
    projectId: "2y01oix2", // "2y01oix2"
    dataset: "production",        // "production"
    token: "skGpyILeZJ7AnXVmDnuB3n2LcMYt3dl0Bhm4fV2BuBYeq98FtqqzmDou8rK9GQXcL816xaK2Q9pp76uD8w1I3rq8lCSeQ1iQ3pmcrqW1YgIRd1ynJfgdqvNyp3ie0djFncEp4uGyVI2uzaz8MK2bgGYjjXEAxU8A8QM3nDNSzfp7kAKyFWfZ",                         // ваш токен
    apiVersion: "2025-02-11",   // "2025-02-11"
    useCdn: false,
});

async function migrateManagement() {
    // Получаем все документы, где management == "On"
    const docs = await client.fetch(`
        *[_type == "product" && management == "On"]{
          _id,
          _rev,
          management
        }
    `);

    console.log(`Найдено документов для обновления: ${docs.length}`);

    // Обновляем каждую запись, заменяя "On" на "On/Off"
    for (const doc of docs) {
        await client
            .patch(doc._id)
            .set({ management: 'On/Off' })
            .commit()
            .then((updatedDoc) => {
                console.log(`Обновлён документ: ${updatedDoc._id}, management: ${updatedDoc.management}`);
            })
            .catch((err) => {
                console.error(`Ошибка при обновлении документа ${doc._id}:`, err);
            });
    }

    console.log('Миграция завершена!');
}

// Запускаем функцию миграции
migrateManagement().catch((err) => {
    console.error('Ошибка при запуске миграции:', err);
    process.exit(1);
});
