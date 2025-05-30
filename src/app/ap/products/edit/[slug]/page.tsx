import EditProductForm from "./EditProductForm";
import { notFound } from "next/navigation";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function EditProductPage({ params }: Props) {
    const { slug } = await params;  // <-- await здесь

    const result = await pool.query(
        `
      SELECT
        id,
        _id,
        title,
        slug,
        brand,
        category,
        description,
        images,
        models,
        specs,
        prices,
        buy_links,
        documents,
        area_options,
        management,
        refrigerant,
        range,
        manufacturer,
        dealer
      FROM product
      WHERE slug = $1
    `,
        [slug]
    );

    if (result.rows.length === 0) return notFound();

    const product = result.rows[0];

    return <EditProductForm product={product} />;
}
