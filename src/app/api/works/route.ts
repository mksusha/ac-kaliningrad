import { NextResponse } from 'next/server';
import { getClient } from '@/lib/db';
import { randomUUID } from 'crypto'; // ✅ импорт генерации UUID

// Простая функция для генерации slug из title
function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')       // заменяем пробелы на дефисы
        .replace(/[^\w\-]+/g, '')   // удаляем все не буквенно-цифровые символы
        .replace(/\-\-+/g, '-');    // заменяем несколько дефисов на один
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

        const baseSlug = slugify(title);
        const slug = await generateUniqueSlug(client, baseSlug);

        const descriptionStr = typeof description === 'string' ? JSON.stringify(description) : JSON.stringify(description);
        const imagesArr = Array.isArray(images) ? images : [];

        const sanityId = randomUUID(); // ✅ генерируем UUID на стороне JS

        console.log('Inserting work:', { sanityId, title, slug, descriptionStr, address, imagesArr });

        const query = `
            INSERT INTO works (sanity_id, title, slug, description, address, images)
            VALUES ($1, $2, $3, $4::jsonb, $5, $6::jsonb)
            RETURNING *
        `;

        const result = await client.query(query, [sanityId, title, slug, descriptionStr, address || null, imagesArr]);

        const newWork = result.rows[0];

        if (typeof newWork.description === 'string') {
            try {
                newWork.description = JSON.parse(newWork.description);
            } catch {}
        }

        console.log('Inserted work:', newWork);

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
