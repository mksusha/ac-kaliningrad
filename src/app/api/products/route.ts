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
        const body = await req.json();

        const {
            title,
            slug,
            manufacturer,
            brand,
            description,
            images,
            models,
            prices,
            area_options,
            cooling_capacity,
            management,
            refrigerant,
            dealer,
            specs,
            buy_links,
            category,
            range,
        } = body;

        if (!title || !slug || typeof slug !== "string") {
            return NextResponse.json(
                { message: "title и slug (строка) обязательны" },
                { status: 400 }
            );
        }

        const result = await pool.query(
            `INSERT INTO product (
                title, slug, manufacturer, brand, description, images, models, prices,
                area_options, cooling_capacity, management, refrigerant, dealer, specs,
                buy_links, category, range
            ) VALUES (
                $1, $2, $3, $4, $5::jsonb, $6::jsonb, $7::jsonb, $8::jsonb,
                $9::jsonb, $10::jsonb, $11, $12, $13, $14::jsonb,
                $15::jsonb, $16, $17
            ) RETURNING *`,
            [
                title,
                slug,
                manufacturer || null,
                brand || null,
                JSON.stringify(description || {}),
                JSON.stringify(images || []),
                JSON.stringify(models || []),
                JSON.stringify(prices || []),
                JSON.stringify(area_options || []),
                JSON.stringify(cooling_capacity || {}),
                management || null,
                refrigerant || null,
                dealer || null,
                JSON.stringify(specs || {}),
                JSON.stringify(buy_links || []),
                category || null,
                range || null,
            ]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error("Ошибка создания товара:", error);
        return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        const { id } = body;

        if (!id) {
            return NextResponse.json({ message: "id обязателен" }, { status: 400 });
        }

        const allowedFields = [
            "title", "slug", "brand", "description", "images", "models", "prices",
            "area_options", "cooling_capacity", "management", "refrigerant", "dealer",
            "manufacturer", "specs", "buy_links", "category", "range"
        ];

        const fields: string[] = [];
        const values: any[] = [];
        let index = 1;

        for (const key of allowedFields) {
            if (key in body) {
                fields.push(`${key} = $${index++}`);
                const value = typeof body[key] === "object"
                    ? JSON.stringify(body[key])
                    : body[key];
                values.push(value);
            }
        }

        if (fields.length === 0) {
            return NextResponse.json({ message: "Нет данных для обновления" }, { status: 400 });
        }

        values.push(id); // для WHERE
        const query = `UPDATE product SET ${fields.join(", ")} WHERE id = $${index}`;

        await pool.query(query, values);

        return NextResponse.json({ message: "Товар успешно обновлён" });
    } catch (error) {
        console.error("Ошибка обновления товара:", error);
        return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "id обязателен" }, { status: 400 });
        }

        await pool.query("DELETE FROM product WHERE id = $1", [id]);

        return NextResponse.json({ message: "Товар удалён" });
    } catch (error) {
        console.error("Ошибка удаления товара:", error);
        return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
    }
}
