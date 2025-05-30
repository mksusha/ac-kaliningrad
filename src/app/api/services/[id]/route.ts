import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

const getClient = () => new Client({ connectionString: process.env.DATABASE_URL });

const getIdFromRequest = (req: NextRequest | Request) => {
    // Для NextRequest у нас есть nextUrl, для обычного Request нужно преобразовать
    if ('nextUrl' in req) {
        const parts = req.nextUrl.pathname.split('/');
        return parts[parts.length - 1];
    } else {
        // Если придет обычный Request — разберём URL
        const url = new URL(req.url);
        const parts = url.pathname.split('/');
        return parts[parts.length - 1];
    }
};

export async function GET(req: NextRequest) {
    const client = getClient();
    await client.connect();

    const id = getIdFromRequest(req);

    try {
        const res = await client.query('SELECT * FROM services WHERE id = $1', [id]);

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

export async function PUT(req: Request) {
    const client = getClient();
    await client.connect();

    const id = getIdFromRequest(req);

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
            id,
        ]);

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error('Ошибка при обновлении услуги:', e);
        return NextResponse.json({ error: 'Ошибка при обновлении' }, { status: 500 });
    } finally {
        await client.end();
    }
}

export async function DELETE(req: Request) {
    const client = getClient();
    await client.connect();

    const id = getIdFromRequest(req);

    try {
        const res = await client.query('DELETE FROM services WHERE id = $1', [id]);

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
