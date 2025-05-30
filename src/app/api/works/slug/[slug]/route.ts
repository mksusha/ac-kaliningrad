import { NextResponse } from 'next/server';
import { getClient } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const { slug } = params;
    const client = await getClient();

    const result = await client.query(
        `SELECT * FROM works WHERE slug = $1`,
        [slug]
    );

    await client.end();

    if (result.rows.length === 0) {
        return NextResponse.json({ message: 'Работа не найдена' }, { status: 404 });
    }

    const work = result.rows[0];

    if (typeof work.images === 'string') {
        work.images = parsePgArray(work.images);
    }

    return NextResponse.json(work);
}

function parsePgArray(pgArrayStr: string): string[] {
    if (!pgArrayStr) return [];
    const trimmed = pgArrayStr.replace(/^{|}$/g, '');
    return trimmed
        .split(',')
        .map((s) => s.trim().replace(/^"(.*)"$/, '$1'))
        .filter(Boolean);
}
