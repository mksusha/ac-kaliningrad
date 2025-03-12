"use client";
import React from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { useCart } from "@/hooks/useCart";
import slugify from "slugify";

interface Props {
    product: any; // Для примера типизация упрощена
    specFields: { label: string; key: string }[];
}

export default function AddToCartTable({ product, specFields }: Props) {
    const { cart, addToCart } = useCart();

    // Функция для добавления конкретной модели в корзину
    const handleAddToCart = (modelIndex: number) => {
        const itemId = `${product._id ?? product.title}_${modelIndex}`;
        const modelName = product.models?.[modelIndex] || "";
        const priceRaw = product.prices?.[modelIndex] ?? "0";
        const parsedPrice = Number(String(priceRaw).replace(/[^\d.-]/g, ""));

        const image =
            product.images && product.images.length > 0
                ? product.images[0]
                : "/images/placeholder.png";

        const slugValue = product.slug?.current
            ? product.slug.current.toLowerCase()
            : slugify(product.title);

        addToCart({
            id: itemId,
            name: `${product.title} – ${modelName}`,
            slug: slugValue,
            price: parsedPrice,
            quantity: 1,
            image,
            type: "product",
        });
    };

    return (
        <Table className="border border-[#C7E07A] rounded-md overflow-hidden">
            <TableHeader>
                <TableRow>
                    <TableHead>Модель</TableHead>
                    {product.models?.map((modelName: string, i: number) => (
                        <TableHead key={i}>{modelName}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {specFields.map(({ label, key }) => (
                    <TableRow key={key}>
                        <TableCell className="font-medium">{label}</TableCell>
                        {product.models?.map((_: string, i: number) => {
                            let value = "—";
                            if (key === "cooling_capacity") {
                                const arr = product.cooling_capacity
                                    ? product.cooling_capacity.split(";").map((s: string) => s.trim())
                                    : [];
                                value = arr[i] || "—";
                            } else {
                                const arr: string[] = product.specs?.[key] || [];
                                value = arr[i] || "—";
                            }
                            return <TableCell key={i}>{value}</TableCell>;
                        })}
                    </TableRow>
                ))}
                <TableRow>
                    <TableCell className="font-medium mt-2 flex flex-col justify-start">
                        Цена
                    </TableCell>
                    {product.models?.map((_: string, i: number) => {
                        const price = product.prices?.[i] ?? "—";
                        const itemId = `${product._id ?? product.title}_${i}`;
                        const inCart = cart.some((item) => item.id === itemId);
                        const itemInCart = cart.find((item) => item.id === itemId);
                        const quantityInCart = itemInCart ? itemInCart.quantity : 0;
                        const buttonClasses = inCart
                            ? "px-4 py-2 rounded-xl font-semibold text-[#333333] bg-transparent border border-[#C7E07A] cursor-default relative"
                            : "px-4 py-2 rounded-xl font-semibold text-[#333333] bg-[#C7E07A] border border-[#879a4f] transition-colors duration-200 cursor-pointer hover:bg-[#B4CC6E]";

                        return (
                            <TableCell key={i} className="space-y-2">
                                <div >{price}</div>
                                {price !== "—" && (
                                    <button
                                        onClick={() => handleAddToCart(i)}
                                        className={buttonClasses}
                                        disabled={inCart}
                                    >
                                        {inCart ? (
                                            <>
                                                В корзине
                                                {quantityInCart > 0 && (
                                                    <span className="absolute -top-2 -right-2 rounded-full bg-[#C7E07A] text-white text-xs px-2 py-1">
                                                        {quantityInCart}
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            "В корзину"
                                        )}
                                    </button>
                                )}
                            </TableCell>
                        );
                    })}
                </TableRow>
            </TableBody>
        </Table>
    );
}
