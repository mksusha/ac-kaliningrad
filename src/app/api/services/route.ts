import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function GET() {
    if (!process.env.DATABASE_URL) {
        return NextResponse.json(
            { error: 'DATABASE_URL не задана в переменных окружения' },
            { status: 500 }
        );
    }

    try {
        const res = await pool.query(`
            SELECT
                id,
                title,
                description,
                price,
                price_label AS "priceLabel",
                slug,
                service_type AS "serviceType",
                image_url AS "imageUrl"
            FROM services
            ORDER BY id ASC
        `);

        return NextResponse.json(res.rows);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Ошибка сервера при получении данных' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    if (!process.env.DATABASE_URL) {
        return NextResponse.json(
            { error: 'DATABASE_URL не задана в переменных окружения' },
            { status: 500 }
        );
    }

    const body = await req.json();

    try {
        const query = `
            INSERT INTO services (
                title, description, price, price_label, slug, service_type, image_url
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await pool.query(query, [
            body.title,
            body.description,
            body.price,
            body.price_label,
            body.slug,
            body.service_type,
            body.image_url,
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Ошибка при добавлении услуги:', error);
        return NextResponse.json(
            { error: 'Ошибка сервера при добавлении услуги' },
            { status: 500 }
        );
    }
}
