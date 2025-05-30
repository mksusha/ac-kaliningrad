import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

const getClient = () => new Client({ connectionString: process.env.DATABASE_URL });

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    const client = getClient();
    await client.connect();

    try {
        const res = await client.query('SELECT * FROM services WHERE id = $1', [params.id]);

        if (res.rowCount === 0) {
            return NextResponse.json({ error: 'Услуга не найдена' }, { status: 404 });
        }

        return NextResponse.json(res.rows[0]);
    } catch (e) {
        console.error('Ошибка при получении услуги:', e);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    } finally {
        await client.end();
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const client = getClient();
    await client.connect();

    try {
        const body = await req.json();

        const query = `
            UPDATE services SET
                title = $1,
                description = $2,
                price = $3,
                price_label = $4,
                slug = $5,
                service_type = $6,
                image_url = $7
            WHERE id = $8
        `;

        await client.query(query, [
            body.title,
            body.description,
            body.price,
            body.price_label,
            body.slug,
            body.service_type,
            body.image_url,
            params.id,
        ]);

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error('Ошибка при обновлении услуги:', e);
        return NextResponse.json({ error: 'Ошибка при обновлении' }, { status: 500 });
    } finally {
        await client.end();
    }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    const client = getClient();
    await client.connect();

    try {
        const res = await client.query('DELETE FROM services WHERE id = $1', [params.id]);

        if (res.rowCount === 0) {
            return NextResponse.json({ error: 'Услуга не найдена' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error('Ошибка при удалении услуги:', e);
        return NextResponse.json({ error: 'Ошибка при удалении' }, { status: 500 });
    } finally {
        await client.end();
    }
}
