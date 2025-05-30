import { getClient } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    const client = await getClient();
    const id = params.id;

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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const client = await getClient();
    const id = params.id;
    const { latitude, longitude, altitude, address } = await request.json();

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

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    const client = await getClient();
    const id = params.id;

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
