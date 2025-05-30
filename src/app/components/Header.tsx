'use client'
import { FiShoppingCart } from "react-icons/fi";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import Link from "next/link";
import {useCart} from "@/hooks/useCart";


const Header = () => {
    const { cartCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

        return (
            <header
                className="md:bg-transparent bg-background/50 backdrop-blur-sm p-0 lg:py-4 shadow-sm lg:bg-background/70 fixed top-0 left-0 w-full z-50">
                <div
                    className="container mx-auto flex items-center justify-between px-6 lg:py-1.5 max-w-[1350px] w-full">
                    <a href="/" className="flex items-center text-xl font-bold text-foreground">
                        <img src="/logo.svg" alt="Кондиционер Калининград" className="w-36 h-14 lg:w-30 lg:h-10 mr-2"/>
                    </a>

                    <div className="relative flex items-center">
                        <div
                            className="hidden md:block absolute w-auto md:w-[430px] lg:w-[550px] h-[40px] bg-[#C7E07A] opacity-60 rounded-full -z-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        </div>

                        <nav className="hidden md:flex  space-x-1 z-10">
                            {[
                                {text: "Каталог", url: "/catalog"},
                                {text: "Услуги", url: "/services"},
                                {text: "Портфолио", url: "/portfolio"},
                                {text: "Отзывы", url: "/reviews"},
                                {text: "Контакты", url: "/contacts"},
                            ].map(({text, url}, index) => (
                                <Link
                                    key={index}
                                    href={url}
                                    className="text-foreground hover:text-accentHover2 transition md:px-1.5 lg:px-3 py-2"
                                >
                                    {text}
                                </Link>
                            ))}
                        </nav>


                    </div>


                    <div className="hidden md:flex items-center">
                        <Link
                            href="/cart"
                            className="relative bg-accent hover:bg-accentHover text-black font-medium py-2 px-6 rounded-full transition flex items-center space-x-2"
                            aria-label="Перейти в корзину"
                        >
                            <span>Купить</span>
                            <FiShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent/70 text-xs font-bold text-foreground">
                {cartCount}
            </span>
                            )}
                        </Link>
                    </div>


                    <button
                        className="md:hidden text-foreground text-3xl"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Меню"
                    >
                        {isMenuOpen ? <HiX/> : <HiMenu/>}
                    </button>
                </div>


                <div
                    className={`fixed top-0 left-0 w-full max-h-[80vh] bg-white shadow-md px-6 py-4 transition-transform transform ${
                        isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                    }`}
                    style={{
                        transition: "transform 0.4s ease, opacity 0.4s ease",
                        zIndex: 100,
                    }}
                >
                    <button
                        className="text-foreground text-3xl absolute top-6 right-6"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <HiX/>
                    </button>

                    <nav className="flex flex-col space-y-4 mt-16">
                        <a href="/catalog" className="text-foreground hover:text-accentHover">
                            Каталог
                        </a>
                        <a href="/services" className="text-foreground hover:text-accentHover">
                            Услуги
                        </a>
                        <a href="/portfolio" className="text-foreground hover:text-accentHover">
                            Портфолио
                        </a>
                        <a href="/reviews" className="text-foreground hover:text-accentHover">
                            Отзывы
                        </a>
                        <a href="/contacts" className="text-foreground hover:text-accentHover">
                            Контакты
                        </a>

                        <div className="flex flex-col space-y-4 mt-4">
                            <Link
                                href="/cart"
                                className="relative bg-accent hover:bg-accentHover text-foreground font-medium py-2 px-4 rounded-full transition flex items-center justify-center space-x-2"
                                aria-label="Перейти в корзину"
                            >
                                <span>Купить</span>
                                <FiShoppingCart size={20} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent/70 text-base font-bold text-foreground">
                {cartCount}
            </span>
                                )}
                            </Link>
                        </div>

                    </nav>
                </div>
            </header>
        );
};


export default Header;