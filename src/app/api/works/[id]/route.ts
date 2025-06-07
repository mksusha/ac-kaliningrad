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
    try {
        const result = await client.query(
            'SELECT * FROM works WHERE sanity_id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ message: 'Работа не найдена' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } finally {
        await client.end();
    }
}

export async function PATCH(request: Request) {
    const id = getIdFromRequest(request);

    let bodyText: string;
    try {
        bodyText = await request.text();
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
        // Преобразуем images в JSON-строку
        const imagesJson = JSON.stringify(Array.isArray(images) ? images : []);

        await client.query(
            `UPDATE works SET title = $1, address = $2, description = $3, images = $4 WHERE sanity_id = $5`,
            [title, address, descriptionJson, imagesJson, id]
        );
    } catch (error) {
        console.error('Ошибка базы данных:', error);
        return NextResponse.json({ message: 'Ошибка базы данных' }, { status: 500 });
    } finally {
        await client.end();
    }

    return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
    const id = getIdFromRequest(request);

    const client = await getClient();
    try {
        const res = await client.query('DELETE FROM works WHERE sanity_id = $1', [id]);

        if (res.rowCount === 0) {
            return NextResponse.json({ message: 'Работа не найдена' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Ошибка при удалении работы:', error);
        return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
    } finally {
        await client.end();
    }
}
