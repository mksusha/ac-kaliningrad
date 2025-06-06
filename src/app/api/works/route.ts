import { NextResponse } from 'next/server';
import { getClient } from '@/lib/db';

function parsePgArray(pgArrayStr: string): string[] {
    if (!pgArrayStr) return [];
    const trimmed = pgArrayStr.replace(/^{|}$/g, '');
    return trimmed
        .split(',')
        .map((s) => s.trim().replace(/^"(.*)"$/, '$1'))
        .filter(Boolean);
}

export async function GET() {
    const client = await getClient();
    try {
        const result = await client.query('SELECT * FROM works');

        const works = result.rows.map(work => {
            if (typeof work.description === 'string') {
                try {
                    work.description = JSON.parse(work.description);
                } catch {
                    // оставить как есть
                }
            }

            if (typeof work.images === 'string') {
                work.images = parsePgArray(work.images);
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

        console.log({ title, description, address, images });

        const query = `
      INSERT INTO works (title, description, address, images)
      VALUES ($1, $2::jsonb, $3, $4)
      RETURNING *
    `;

        const descriptionStr = typeof description === 'string' ? description : JSON.stringify(description);
        const imagesArr = Array.isArray(images) ? images : [];

        const result = await client.query(query, [title, descriptionStr, address || null, imagesArr]);

        const newWork = result.rows[0];

        if (typeof newWork.description === 'string') {
            try {
                newWork.description = JSON.parse(newWork.description);
            } catch {}
        }

        if (typeof newWork.images === 'string') {
            newWork.images = parsePgArray(newWork.images);
        }

        return NextResponse.json(newWork, { status: 201 });
    } catch (e) {
        console.error('Error creating work:', e);
        return NextResponse.json(
            { error: 'Internal server error', details: e instanceof Error ? e.message : e },
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
