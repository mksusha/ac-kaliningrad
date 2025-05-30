"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";

export interface Service {
    id: string;
    title: string;
    description?: string;
    price?: number;
    priceLabel?: string;
    slug: string;
    serviceType?: string;
    imageUrl?: string;
}

interface ServiceCardProps {
    service: Service;
    className?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
    const { addToCart, cart } = useCart();
    const [quantityInCart, setQuantityInCart] = useState(0);


    useEffect(() => {
        const itemInCart = cart?.find((item: any) => item.id === service.id);
        setQuantityInCart(itemInCart ? itemInCart.quantity : 0);
    }, [cart, service.id]);

    const handleAddToCart = () => {
        if (!service.price || !service.slug) {
            console.log("Некорректные данные услуги:", service);
            return;
        }
        const cartItem = {
            id: service.id,
            name: service.title,
            price: service.price,
            quantity: 1,
            image: service.imageUrl || "/default.jpg",
            slug: service.slug,
            type: "service" as const,
        };
        console.log("Добавляем в корзину:", cartItem);
        addToCart(cartItem);
    };

    return (
        <div
            className="relative flex flex-col border border-gray-200 rounded-2xl overflow-hidden shadow-md bg-white group hover:shadow-lg transition-all duration-300 ease-in-out">


            <img
                src={service.imageUrl || "/default.jpg"}
                alt={service.title}
                className="w-full h-52 object-cover transition-all duration-300 ease-in-out group-hover:brightness-90"
            />


            <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold bg-accent px-2 py-1 rounded-md text-gray-900">
                    {service.title}
                </h2>
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

            <div className="p-6 pt-0">
                <button
                    onClick={handleAddToCart}
                    disabled={quantityInCart > 0}
                    className={`w-full px-4 py-3 text-sm font-medium rounded-xl relative transition-all duration-300 ${
                        quantityInCart > 0
                            ? "bg-foreground/80 text-white"  
                            : "bg-foreground text-white hover:bg-accentHover transition-colors duration-300" 
                    }`}
                >
                    {quantityInCart > 0 ? (
                        <>
                            В корзине
                            <span className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-accent/90 text-foreground text-base rounded-full">
                                {quantityInCart}
                            </span>
                        </>
                    ) : (
                        "Добавить в корзину"
                    )}
                </button>
            </div>
        </div>
    );
};

export default ServiceCard;
