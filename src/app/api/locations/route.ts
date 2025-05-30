import { getClient } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET() {
    const client = await getClient();
    try {
        const res = await client.query('SELECT * FROM location');
        return Response.json(res.rows);
    } catch (err) {
        console.error(err);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await client.end();
    }
}

export async function POST(request: NextRequest) {
    const client = await getClient();
    try {
        const { latitude, longitude, altitude, address } = await request.json();

        if (
            typeof latitude !== 'number' ||
            typeof longitude !== 'number' ||
            typeof address !== 'string' ||
            !address.trim()
        ) {
            return Response.json({ error: 'Invalid input data' }, { status: 400 });
        }

        const parsedAltitude =
            typeof altitude === 'number' ? altitude : null;

        const res = await client.query(
            `INSERT INTO location (latitude, longitude, altitude, address)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [latitude, longitude, parsedAltitude, address.trim()]
        );

        return Response.json(res.rows[0], { status: 201 });
    } catch (err) {
        console.error(err);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await client.end();
    }
}
