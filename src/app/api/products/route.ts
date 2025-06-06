import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function GET() {
    try {
        const result = await pool.query("SELECT * FROM product ORDER BY id DESC");
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Ошибка получения товаров:", error);
        return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { title, slug, manufacturer } = await req.json();

        if (!title || !slug || typeof slug !== "string") {
            return NextResponse.json(
                { message: "title и slug (строка) обязательны" },
                { status: 400 }
            );
        }

        await pool.query(
            "INSERT INTO product (title, slug, manufacturer) VALUES ($1, $2, $3)",
            [title, slug, manufacturer || null]
        );

        return NextResponse.json({ message: "Товар создан" }, { status: 201 });
    } catch (error) {
        console.error("Ошибка создания товара:", error);
        return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, title, slug, manufacturer } = await req.json();

        if (!id || !title || !slug || typeof slug !== "string") {
            return NextResponse.json(
                { message: "id, title и slug (строка) обязательны" },
                { status: 400 }
            );
        }

        await pool.query(
            "UPDATE product SET title = $1, slug = $2, manufacturer = $3 WHERE id = $4",
            [title, slug, manufacturer || null, id]
        );

        return NextResponse.json({ message: "Товар обновлен" });
    } catch (error) {
        console.error("Ошибка обновления товара:", error);
        return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: "id обязателен" }, { status: 400 });
        }

        await pool.query("DELETE FROM product WHERE id = $1", [id]);

        return NextResponse.json({ message: "Товар удален" });
    } catch (error) {
        console.error("Ошибка удаления товара:", error);
        return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
    }
}
