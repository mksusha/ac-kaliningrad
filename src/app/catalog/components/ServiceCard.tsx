"use client";

import React from "react";
import { useCart } from "@/hooks/useCart";

const theme = {
    background: "#F8F8F3",
    foreground: "#333333",
    accent: "#A5FF00",
    accentHover: "#8FDA00",
    accentHover2: "#7AB200",
};

export interface Service {
    _id: string;
    title: string;
    description?: string;
    price?: number;
    priceLabel?: string;
    slug: string;
    serviceType?: string;
}

interface ServiceCardProps {
    service: Service;
    background: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, background }) => {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        if (!service.price || !service.slug) {
            console.log("Некорректные данные услуги:", service);
            return;
        }
        const cartItem = {
            id: service._id,
            name: service.title,
            price: service.price,
            quantity: 1,
            image: background,
            slug: service.slug,
            type: "service" as const,
        };
        console.log("Добавляем в корзину:", cartItem);
        addToCart(cartItem);
    };

    return (
        <div className="relative flex flex-col border border-gray-200 rounded-2xl overflow-hidden shadow-md bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            {/* Блок с изображением */}
            <div
                className="w-full h-52 bg-cover bg-center"
                style={{ backgroundImage: `url(${background})` }}
            />

            {/* Контент карточки */}
            <div className="p-6 flex bg-white flex-col flex-grow">
                <h2 className="text-xl font-semibold bg-accent px-1 rounded-xl text-gray-900">{service.title}</h2>
                {service.description && (
                    <p className="text-gray-600 text-sm mt-2">{service.description}</p>
                )}
                {service.price && (
                    <p className="mt-4 text-lg font-semibold text-gray-900">
                        {service.priceLabel ?? "От"}{" "}
                        <span className="text-[#7AB200]">{service.price}₽</span>
                    </p>
                )}
            </div>

            {/* Кнопка */}
            <div className="p-6  pt-0">
                <button
                    className="w-full px-4 py-3 text-sm font-medium rounded-xl bg-foreground text-white transition-all duration-300 hover:bg-accentHover"
                    onClick={handleAddToCart}
                >
                    Добавить в корзину
                </button>
            </div>
        </div>
    );
};

export default ServiceCard;
