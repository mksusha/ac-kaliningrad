import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function PATCH(req: NextRequest) {
    try {
        // Получаем id из URL
        const url = new URL(req.url);
        const productId = url.pathname.split("/").pop();

        if (!productId) {
            return NextResponse.json({ message: "Неверный ID" }, { status: 400 });
        }

        const body = await req.json();

        const allowedFields = [
            "title",
            "slug",
            "brand",
            "description",
            "images",
            "models",
            "prices",
            "area_options",
            "cooling_capacity",
            "management",
            "refrigerant",
            "dealer",
            "manufacturer",
            "specs",
            "buy_links",
            "category",
            "range",
        ];

        const fields: string[] = [];
        const values: any[] = [];
        let index = 1;

        for (const key of allowedFields) {
            if (key in body) {
                fields.push(`${key} = $${index++}`);
                const value =
                    typeof body[key] === "object" ? JSON.stringify(body[key]) : body[key];
                values.push(value);
            }
        }

        if (fields.length === 0) {
            return NextResponse.json(
                { message: "Нет данных для обновления" },
                { status: 400 }
            );
        }

        values.push(productId);
        const query = `UPDATE product SET ${fields.join(", ")} WHERE _id = $${index}`;

        await pool.query(query, values);

        return NextResponse.json({ message: "Товар успешно обновлён" });
    } catch (error) {
        console.error("Ошибка обновления товара:", error);
        return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
    }
}
