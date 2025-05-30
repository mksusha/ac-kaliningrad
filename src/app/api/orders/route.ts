import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";


interface CartItem {
    id: string | number;
    name: string;
    price: number;
    quantity: number;
}


interface OrderRequest {
    firstName: string;
    lastName: string;
    email: string;
    items: CartItem[];
    totalCost: number;
}


interface Order {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    total_cost: number;
    status: string;
}
export async function POST(req: NextRequest) {
    try {
        const { firstName, lastName, email, phone, items, totalCost }: OrderRequest & { phone: string } = await req.json();


        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert([
                {
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    phone,
                    total_cost: totalCost,
                    status: "pending",
                },
            ])
            .select("*")
            .single<Order>();

        if (orderError || !order) {
            throw new Error(orderError?.message || "Ошибка при создании заказа");
        }


        const orderItems = items.map((item) => ({
            order_id: order.id,
            product_name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
        }));

        const { error: orderItemError } = await supabase.from("order_items").insert(orderItems);

        if (orderItemError) {
            throw new Error(orderItemError.message);
        }

        return NextResponse.json(
            { message: "Заказ успешно оформлен!", data: order },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
