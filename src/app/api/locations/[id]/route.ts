import { getClient } from '@/lib/db';
import { NextRequest } from 'next/server';

const getIdFromUrl = (req: NextRequest) => {
    const parts = req.nextUrl.pathname.split('/');
    return parts[parts.length - 1]; // вернёт [id]
};

export async function GET(req: NextRequest) {
    const id = getIdFromUrl(req);
    const client = await getClient();

    try {
        const res = await client.query('SELECT * FROM location WHERE id = $1', [id]);
        if (res.rowCount === 0) {
            return Response.json({ error: 'Not found' }, { status: 404 });
        }
        return Response.json(res.rows[0]);
    } catch (err) {
        console.error(err);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await client.end();
    }
}

export async function PATCH(req: NextRequest) {
    const id = getIdFromUrl(req);
    const client = await getClient();
    const { latitude, longitude, altitude, address } = await req.json();

    try {
        await client.query(
            `UPDATE location
             SET latitude = $1, longitude = $2, altitude = $3, address = $4
             WHERE id = $5`,
            [latitude, longitude, altitude, address, id]
        );
        return Response.json({ success: true });
    } catch (err) {
        console.error(err);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await client.end();
    }
}

export async function DELETE(req: NextRequest) {
    const id = getIdFromUrl(req);
    const client = await getClient();

    try {
        await client.query('DELETE FROM location WHERE id = $1', [id]);
        return Response.json({ success: true });
    } catch (err) {
        console.error(err);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await client.end();
    }
}
