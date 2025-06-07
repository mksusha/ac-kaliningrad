import { NextResponse } from 'next/server';
import { getClient } from '@/lib/db';
import { randomUUID } from 'crypto';

// Простая функция для генерации slug из title
function slugify(text: string) {
    const transliterationMap: Record<string, string> = {
        а: 'a', б: 'b', в: 'v', г: 'g', д: 'd',
        е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i',
        й: 'y', к: 'k', л: 'l', м: 'm', н: 'n',
        о: 'o', п: 'p', р: 'r', с: 's', т: 't',
        у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch',
        ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '',
        э: 'e', ю: 'yu', я: 'ya',
    };

    const lower = text.toLowerCase().trim();

    // Транслитерация
    const transliterated = Array.from(lower).map(char => {
        return transliterationMap[char] ?? char;
    }).join('');

    // Формируем slug
    const slug = transliterated
        .replace(/\s+/g, '-')        // пробелы в дефисы
        .replace(/[^a-z0-9\-]+/g, '') // разрешаем только латинские буквы, цифры, дефисы
        .replace(/\-\-+/g, '-')      // убираем двойные дефисы

    console.log('slugify output:', slug);
    return slug;
}


// Функция для генерации уникального slug
async function generateUniqueSlug(client: any, baseSlug: string) {
    let slug = baseSlug;
    let count = 1;

    while (true) {
        const res = await client.query('SELECT 1 FROM works WHERE slug = $1', [slug]);
        if (res.rowCount === 0) break;
        slug = `${baseSlug}-${count}`;
        count++;
    }

    return slug;
}

export async function GET() {
    const client = await getClient();
    try {
        const result = await client.query('SELECT * FROM works');
        console.log('Fetched works:', result.rows.length);

        const works = result.rows.map(work => {
            if (typeof work.description === 'string') {
                try {
                    work.description = JSON.parse(work.description);
                } catch {
                    // Оставляем как есть
                }
            }
            return work;
        });

        return NextResponse.json(works);
    } finally {
        if ('release' in client && typeof client.release === 'function') {
            await client.release();
        } else if ('end' in client && typeof client.end === 'function') {
            await client.end();
        }
    }
}

export async function POST(request: Request) {
    let client;
    try {
        const body = await request.json();
        const { title, description, address, images } = body;

        if (!title || !description) {
            return NextResponse.json({ error: 'title и description обязательны' }, { status: 400 });
        }

        client = await getClient();

        console.log('Получен запрос на создание work:', { title, description, address, images });

        const baseSlug = slugify(title);
        console.log('Сгенерирован baseSlug:', baseSlug);

        const slug = await generateUniqueSlug(client, baseSlug);
        console.log('Сгенерирован уникальный slug:', slug);

        const imagesArr = Array.isArray(images) ? images : [];
        const descriptionStr = JSON.stringify(description);
        const imagesJson = JSON.stringify(imagesArr);

        const sanityId = randomUUID();

        console.log('Данные для вставки:', {
            sanityId,
            title,
            slug,
            descriptionStr,
            address: address || null,
            imagesJson
        });

        const query = `
            INSERT INTO works (sanity_id, title, slug, description, address, images)
            VALUES ($1, $2, $3, $4::jsonb, $5, $6::jsonb)
            RETURNING *
        `;

        const result = await client.query(query, [sanityId, title, slug, descriptionStr, address || null, imagesJson]);

        const newWork = result.rows[0];
        console.log('Вставленная запись:', newWork);

        if (typeof newWork.description === 'string') {
            try {
                newWork.description = JSON.parse(newWork.description);
            } catch {}
        }

        return NextResponse.json(newWork, { status: 201 });
    } catch (e) {
        console.error('Error creating work:', e);
        return NextResponse.json(
            { error: 'Internal server error', details: e instanceof Error ? e.message : String(e) },
            { status: 500 }
        );
    } finally {
        if (client) {
            if ('release' in client && typeof client.release === 'function') {
                await client.release();
            } else if ('end' in client && typeof client.end === 'function') {
                await client.end();
            }
        }
    }
}
