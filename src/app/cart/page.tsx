"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "@/app/components/Footer";

const CartPage = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

    const totalCost = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    if (!mounted) return null;

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-1 w-full bg-white">
                <div className="max-w-[1350px] w-full mx-auto text-[#333333] py-8">
                    <div className="mt-24 px-4">
                        <h1 className="text-4xl font-bold mb-6">Корзина</h1>
                        {cart.length === 0 ? (
                            <p className="text-xl">Ваша корзина пуста.</p>
                        ) : (
                            <>
                                <div className="space-y-8">
                                    {cart.map((item) => {
                                        const slugValue =
                                            typeof item.slug === "object" &&
                                            item.slug !== null &&
                                            "current" in item.slug
                                                ? (item.slug as { current: string }).current.toLowerCase()
                                                : typeof item.slug === "string"
                                                    ? item.slug.toLowerCase()
                                                    : "";

                                        return (
                                            <div
                                                key={item.id}
                                                className="flex flex-col md:flex-row items-center p-4 md:p-6 bg-white rounded-xl shadow transition transform cursor-pointer border-b-4 border-accent hover:shadow-md"
                                            >
                                                <Link
                                                    href={`/catalog/${slugValue}`}
                                                    className="flex flex-col md:flex-row items-center flex-1"
                                                >
                                                    <div className="w-full md:w-28 h-auto md:h-28 mr-0 md:mr-6 mb-4 md:mb-0 flex-shrink-0">
                                                        {item.image ? (
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                                                                Нет фото
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-center md:text-left">
                                                        <h2 className="text-2xl font-semibold">{item.name}</h2>
                                                        <p className="text-lg mt-2">Цена: {item.price} руб.</p>
                                                    </div>
                                                </Link>
                                                <div className="flex flex-col items-center md:items-end mt-4 md:mt-0">
                                                    <div className="flex items-center">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                updateQuantity(item.id, item.quantity - 1);
                                                            }}
                                                            className="px-4 py-2 bg-[#C7E07A] text-black rounded-lg hover:bg-[#B4CC6E] transition"
                                                        >
                                                            –
                                                        </button>
                                                        <span className="px-6 mx-1 py-2 border-2 rounded-lg border-gray-100">
                              {item.quantity}
                            </span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                updateQuantity(item.id, item.quantity + 1);
                                                            }}
                                                            className="px-4 py-2 bg-[#C7E07A] text-black rounded-lg hover:bg-[#B4CC6E] transition"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeFromCart(item.id);
                                                        }}
                                                        className="mt-4 px-4 py-2 border border-[#C7E07A] text-[#C7E07A] rounded-lg hover:bg-[#C7E07A] hover:text-white transition"
                                                    >
                                                        Удалить
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between">
                                    <div className="text-2xl font-semibold">
                                        Итого: {totalCost} руб.
                                    </div>
                                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0">
                                        <Link
                                            href="/checkout"
                                            className="bg-[#C7E07A] hover:bg-[#B4CC6E] text-black font-bold py-4 px-8 rounded-2xl transition text-center"
                                        >
                                            Перейти к оформлению
                                        </Link>
                                        <button
                                            onClick={clearCart}
                                            className="bg-foreground hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-2xl transition"
                                        >
                                            Очистить корзину
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CartPage;
