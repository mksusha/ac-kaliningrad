import { NextResponse } from 'next/server';
import { getClient } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;

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

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;

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

    const { title, address, description } = body;

    if (!title) {
        return NextResponse.json({ message: 'Название обязательно' }, { status: 400 });
    }

    const client = await getClient();
    try {
        const descriptionJson = JSON.stringify(description);

        await client.query(
            `UPDATE works SET title = $1, address = $2, description = $3 WHERE sanity_id = $4`,
            [title, address, descriptionJson, id]
        );
    } catch (error) {
        console.error('Ошибка базы данных:', error);
        return NextResponse.json({ message: 'Ошибка базы данных' }, { status: 500 });
    } finally {
        await client.end();
    }

    return NextResponse.json({ success: true });
}
