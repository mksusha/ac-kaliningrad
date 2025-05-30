// /app/api/air-conditioners/route.ts
import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL, // или другие параметры подключения
    });

    try {
        await client.connect();

        const res = await client.query('SELECT * FROM product '); // пример запроса
        await client.end();

        return NextResponse.json(res.rows);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Ошибка сервера при получении данных' },
            { status: 500 }
        );
    }
}
