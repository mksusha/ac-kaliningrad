'use client'
import React, { createContext, useContext, useState, useEffect } from "react";

// Интерфейсы
export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    slug: string;
    type: "product" | "service";
}

interface CartContextValue {
    cart: CartItem[];
    cartCount: number;
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, newQuantity: number) => void;
    clearCart: () => void;
}

// Создаем контекст
const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartCount, setCartCount] = useState(0);

    // Загружаем корзину при монтировании (без лишних ререндеров)
    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
                setCart(storedCart);
                setCartCount(storedCart.reduce((acc: number, item: CartItem) => acc + item.quantity, 0));
            } catch (error) {
                console.error("Ошибка парсинга cart:", error);
            }
        }
    }, []);

    const updateCart = (updatedCart: CartItem[]) => {
        setCart(updatedCart);
        setCartCount(updatedCart.reduce((acc, item) => acc + item.quantity, 0));
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const addToCart = (item: CartItem) => {
        const updatedCart = [...cart];
        const existingIndex = updatedCart.findIndex((i) => i.id === item.id);

        if (existingIndex !== -1) {
            updatedCart[existingIndex].quantity += item.quantity;
        } else {
            updatedCart.push(item);
        }

        updateCart(updatedCart);
    };

    const removeFromCart = (id: string) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        updateCart(updatedCart);
    };

    const updateQuantity = (id: string, newQuantity: number) => {
        const updatedCart = cart.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity > 0 ? newQuantity : 1 } : item
        );
        updateCart(updatedCart);
    };

    const clearCart = () => {
        updateCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
