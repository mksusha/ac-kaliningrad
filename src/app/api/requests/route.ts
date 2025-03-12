import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { phone, email, requestType, message } = await req.json();

    const { data, error } = await supabase
        .from('requests')
        .insert([
            {
                phone,
                email,
                request_type: requestType,
                message,
            },
        ]);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Заявка успешно отправлена!', data }, { status: 200 });
}

export async function GET() {
    const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
}
