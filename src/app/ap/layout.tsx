import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies(); // <-- await здесь!
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    try {
        jwt.verify(token, JWT_SECRET);
    } catch {
        redirect('/login');
    }

    return <>{children}</>;
}
