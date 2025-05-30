// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    console.log('Middleware сработал на пути:', req.nextUrl.pathname);
    return NextResponse.next();
}

export const config = {
    matcher: ['/ap/:path*', '/ap'],
};
