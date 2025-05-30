"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "@/app/components/Footer";
import { AiOutlineCheckCircle, AiOutlineClose } from "react-icons/ai";

const CartPage = () => {
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [status, setStatus] = useState<"initial" | "loading" | "success" | "error">("initial");

    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const totalCost = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    useEffect(() => {
        setMounted(true);
    }, []);



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        const cleanPhoneNumber = formData.phone.replace(/\D/g, '');

        try {
            const orderData = {
                ...formData,
                phone: cleanPhoneNumber,
                items: cart.map((item) => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.price * item.quantity,
                })),
                totalCost,
            };

            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                setStatus("success");
                clearCart();
                setFormData({ firstName: "", lastName: "", email: "", phone: "" });
            } else {
                setStatus("error");
            }
        } catch (error) {
            setStatus("error");
        }
    };

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
                                    {cart.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex flex-col md:flex-row items-center p-4 md:p-6 bg-white rounded-xl shadow transition border-b-4 border-accent hover:shadow-md"
                                        >
                                            <Link href={`/catalog/${item.slug.toLowerCase()}`} className="flex flex-col md:flex-row items-center flex-1">
                                                <div
                                                    className="w-full md:w-28 h-auto md:h-28 mr-0 md:mr-6 mb-4 md:mb-0 flex-shrink-0">
                                                    {item.image ? (
                                                        typeof item.image === "string" ? (
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-24 h-24 object-cover rounded"
                                                            />
                                                        ) : "url" in item.image ? (
                                                            <img
                                                                src={item.image.url}
                                                                alt={item.name}
                                                                className="w-24 h-24 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                                                                Нет фото
                                                            </div>
                                                        )
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
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="px-4 py-2 bg-[#C7E07A] text-black rounded-lg hover:bg-[#B4CC6E] transition"
                                                    >
                                                        –
                                                    </button>
                                                    <span className="px-6 mx-1 py-2 border-2 rounded-lg border-gray-100">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="px-4 py-2 bg-[#C7E07A] text-black rounded-lg hover:bg-[#B4CC6E] transition"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="mt-4 px-4 py-2 border border-[#C7E07A] text-[#C7E07A] rounded-lg hover:bg-[#C7E07A] hover:text-white transition"
                                                >
                                                    Удалить
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {}
                                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between">
                                    <div className="text-2xl font-semibold">Итого: {totalCost} руб.</div>
                                    <div
                                        className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0">
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="bg-[#C7E07A] text-black py-4 px-8 rounded-2xl transition-colors duration-300
               border-2 border-transparent
               hover:bg-transparent hover:border-[#C7E07A]
               active:bg-gray-200"
                                        >
                                            Перейти к оформлению
                                        </button>

                                        <button
                                            onClick={clearCart}
                                            className="bg-foreground text-white py-4 px-8 rounded-2xl transition-colors duration-300
               border-2 border-transparent
               hover:bg-transparent hover:text-foreground hover:border-foreground
               active:bg-gray-200"
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


            {}
            {isModalOpen && (
                <div
                    className="fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white mx-4 p-7 rounded-2xl shadow-lg w-96 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-7 right-7 text-gray-500 text-2xl"
                        >
                            <AiOutlineClose />
                        </button>

                        <h2 className="text-xl font-bold mb-4">Оформление заказа</h2>

                        {status === "success" ? (
                            <div className="flex flex-col items-center text-center">
                                <AiOutlineCheckCircle className="text-accent text-6xl mb-4"/>
                                <p className="text-lg font-semibold">Ваш заказ оформлен!</p>
                                <p className="text-gray-600">Мы скоро с вами свяжемся.</p>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="mt-6 bg-[#C7E07A] text-black py-3 px-6 rounded-2xl transition
               hover:bg-[#B4CC6E] hover:shadow-md active:bg-[#A8BF64]"
                                >
                                    Закрыть
                                </button>

                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="firstName" className="block">Имя</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full border p-2 rounded-2xl focus:border-[#C7E07A] focus:ring-1 focus:ring-[#C7E07A] outline-none transition"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block">Фамилия</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full border p-2 rounded-2xl focus:border-[#C7E07A] focus:ring-1 focus:ring-[#C7E07A] outline-none transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full border p-2 rounded-2xl focus:border-[#C7E07A] focus:ring-1 focus:ring-[#C7E07A] outline-none transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block">Номер телефона</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full border p-2 mb-3 rounded-2xl focus:border-[#C7E07A] focus:ring-1 focus:ring-[#C7E07A] outline-none transition"
                                        required
                                        pattern="^(\+7|8)\s?\(?\d{3}\)?\s?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$"
                                        placeholder="+7 (900) 000-00-00"
                                    />

                                </div>

                                <button
                                    type="submit"
                                    className="bg-[#C7E07A] text-black py-3 px-6 rounded-2xl transition w-full
               hover:bg-[#B4CC6E] hover:shadow-md active:bg-[#A8BF64]"
                                    disabled={status === "loading"}
                                >
                                    {status === "loading" ? "Оформление..." : "Подтвердить заказ"}
                                </button>

                            </form>
                        )}
                    </div>
                </div>
            )}


            <Footer/>
        </div>
    );
};

export default CartPage;
