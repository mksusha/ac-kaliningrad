// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { username, password } = body;

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !JWT_SECRET) {
        return NextResponse.json({ message: 'Ошибка конфигурации сервера' }, { status: 500 });
    }

    if (username.trim() !== ADMIN_USERNAME || password.trim() !== ADMIN_PASSWORD) {
        return NextResponse.json({ message: 'Неверный логин или пароль' }, { status: 401 });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' });

    const response = NextResponse.json({ message: 'Успешный вход' });

    response.cookies.set({
        name: 'token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400,
        path: '/',
        sameSite: 'strict',
    });

    return response;
}
