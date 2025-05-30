"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AiOutlinePhone, AiOutlineClockCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { FaTelegramPlane, FaWhatsapp, FaHandsHelping } from "react-icons/fa";

const ContactPage = () => {
    return (
        <div className="flex flex-col min-h-[93vh] mt-24 bg-white">
            <Header />
            <main className="flex-grow">
                <div className="container max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Свяжитесь с нами</h1>

                    <div className="bg-background mt-10 mb-12 p-6 md:p-10 rounded-2xl shadow-lg flex flex-wrap md:flex-nowrap justify-between items-start">
                        <div className="w-full md:w-1/2 space-y-6">
                            <div className="flex items-center">
                                <AiOutlinePhone className="text-[#B4CC6E] text-3xl mr-4" />
                                <a href="tel:+79581691352" className="text-xl font-medium hover:text-[#B4CC6E] transition">
                                    +7 (958) 169-13-52
                                </a>
                            </div>
                            <div className="flex items-center">
                                <AiOutlineClockCircle className="text-[#B4CC6E] text-3xl mr-4" />
                                <p className="text-xl">Пн–Сб: 09:00 – 19:00</p>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 flex flex-col items-center md:items-end space-y-4 mt-6 md:mt-0">
                            <p className="text-lg font-medium text-gray-700 text-center md:text-right">
                                Вы можете связаться с нами в мессенджерах
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-end gap-4 w-full">
                                <a
                                    href="https://t.me/konditionerkaliningrad"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-full md:w-auto px-6 py-3 bg-[#0088cc] text-white rounded-2xl shadow-md hover:bg-[#0077b5] transition"
                                >
                                    <FaTelegramPlane className="mr-3 text-2xl" />
                                    Telegram
                                </a>
                                <a
                                    href="https://wa.me/79581691352"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-full md:w-auto px-6 py-3 bg-[#25D366] text-white rounded-2xl shadow-md hover:bg-[#1EBE5D] transition"
                                >
                                    <FaWhatsapp className="mr-3 text-2xl" />
                                    WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-wrap md:flex-nowrap rounded-3xl shadow-lg overflow-hidden">
                        <div className="w-full md:w-1/2 bg-accent p-6 md:p-8">
                            <h2 className="text-3xl font-semibold mb-6 flex items-center">
                                <FaHandsHelping className="text-foreground text-3xl mr-4"/>
                                Почему выбирают нас?
                            </h2>
                            <p className="text-lg text-foreground leading-relaxed">
                                Мы предлагаем широкий выбор кондиционеров и обеспечиваем их качественную установку.
                                Наши специалисты помогут подобрать оптимальное решение, выполнят монтаж с учетом всех
                                требований и дадут полезные рекомендации по эксплуатации.
                                Мы работаем с проверенными брендами, гарантируя надежность и долговечность оборудования.
                            </p>
                        </div>

                        <div className="w-full md:w-1/2 bg-foreground p-6 md:p-8">
                            <ul className="list-disc text-white list-inside space-y-3 text-lg">
                                <li className="flex items-center">
                                    <AiOutlineCheckCircle className="text-[#B4CC6E] text-2xl mr-3" />
                                    Широкий ассортимент моделей для дома и офиса
                                </li>
                                <li className="flex items-center">
                                    <AiOutlineCheckCircle className="text-[#B4CC6E] text-2xl mr-3" />
                                    Гарантия качества на все товары и услуги
                                </li>
                                <li className="flex items-center">
                                    <AiOutlineCheckCircle className="text-[#B4CC6E] text-2xl mr-3" />
                                    Индивидуальный подход к каждому клиенту
                                </li>
                                <li className="flex items-center">
                                    <AiOutlineCheckCircle className="text-[#B4CC6E] text-2xl mr-3" />
                                    Быстрая доставка и профессиональный монтаж
                                </li>
                                <li className="flex items-center">
                                    <AiOutlineCheckCircle className="text-[#B4CC6E] text-2xl mr-3" />
                                    Бесплатные консультации и помощь в выборе
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ContactPage;
