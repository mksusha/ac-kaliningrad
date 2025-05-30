import { NextResponse } from 'next/server';
import { getClient } from '@/lib/db';

export async function GET() {
    const client = await getClient();
    const result = await client.query('SELECT * FROM works');
    await client.end();

    return NextResponse.json(result.rows);
}
