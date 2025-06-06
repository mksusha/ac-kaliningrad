import { NextResponse } from 'next/server';
import { getClient } from '@/lib/db';

function getIdFromRequest(request: Request) {
    const url = new URL(request.url);
    const parts = url.pathname.split('/');
    return parts[parts.length - 1]; // последний сегмент — это id
}

export async function GET(request: Request) {
    const id = getIdFromRequest(request);

    const client = await getClient();
    const result = await client.query(
        'SELECT * FROM works WHERE sanity_id = $1',
        [id]
    );
    await client.end();

    if (result.rows.length === 0) {
        return NextResponse.json({ message: 'Работа не найдена' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
}

export async function PATCH(request: Request) {
    const id = getIdFromRequest(request);

    let bodyText: string;
    try {
        bodyText = await request.text();
        console.log('PATCH BODY RAW:', bodyText);
    } catch {
        return NextResponse.json({ message: 'Ошибка чтения тела запроса' }, { status: 400 });
    }

    let body: any;
    try {
        body = JSON.parse(bodyText);
    } catch {
        return NextResponse.json({ message: 'Неверный JSON' }, { status: 400 });
    }

    const { title, address, description, images } = body;

    if (!title) {
        return NextResponse.json({ message: 'Название обязательно' }, { status: 400 });
    }

    const client = await getClient();
    try {
        const descriptionJson = JSON.stringify(description);
        const imagesArr = Array.isArray(images) ? images : [];

        await client.query(
            `UPDATE works SET title = $1, address = $2, description = $3, images = $4 WHERE sanity_id = $5`,
            [title, address, descriptionJson, imagesArr, id]
        );
    } catch (error) {
        console.error('Ошибка базы данных:', error);
        return NextResponse.json({ message: 'Ошибка базы данных' }, { status: 500 });
    } finally {
        await client.end();
    }

    return NextResponse.json({ success: true });
}
