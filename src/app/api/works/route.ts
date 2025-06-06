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
    const result = await client.query('SELECT * FROM works');
    await client.end();

    const works = result.rows.map(work => {
        // Парсим описание из JSON, если оно строка
        if (typeof work.description === 'string') {
            try {
                work.description = JSON.parse(work.description);
            } catch {
                // оставить как есть, если не JSON
            }
        }

        // Парсим images из pg массива
        if (typeof work.images === 'string') {
            work.images = parsePgArray(work.images);
        }

        return work;
    });

    return NextResponse.json(works);
}
