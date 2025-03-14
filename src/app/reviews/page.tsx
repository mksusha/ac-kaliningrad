"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";
import { CheckCircle, Users, ShieldCheck, Star } from "lucide-react"; // Иконки Lucide

export default function ReviewsPage() {
    return (
        <div className="flex flex-col mt-20 text-[#333333]">
            <Header />

            <main className="flex-1">
                {/* Верхний CTA блок */}

                {/* Блок "Почему выбирают нас?" */}
                <section className="py-12">
                    <div className="max-w-[1350px] mx-auto px-6">
                        <div className="flex flex-col mb-8 sm:flex-row items-start justify-between gap-6 sm:gap-8 w-full">
                            <h2 className="text-3xl sm:text-4xl font-bold leading-tight sm:leading-normal text-left w-full sm:w-auto">
                                ЗАЧЕМ ПЕРЕХОДИТЬ НА{" "}
                                <span className="bg-accent rounded-2xl px-3 py-1 inline-block">
                                    АВИТО?
                                </span>
                            </h2>
                            <p className="text-lg text-black lg:max-w-[36rem] text-left leading-relaxed w-full sm:w-auto">
                                Avito — крупнейший онлайн-ресурс для поиска товаров и услуг, где реальные покупатели оставляют честные отзывы. Мы всегда работаем честно и открыто, а покупатели ценят наш сервис за прозрачность сделок и высокое качество товаров.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Большой блок слева */}
                            <div className="bg-accent p-8 rounded-3xl shadow-md flex flex-col justify-center text-center">
                                <CheckCircle className="text-foreground w-12 h-12 mb-4 mx-auto"/>
                                <h3 className="text-2xl font-semibold mb-3">Честные сделки</h3>
                                <p className="text-foreground text-lg">
                                    Мы предоставляем полную информацию о товарах, никаких скрытых условий. Все сделки
                                    проходят прозрачно и надежно.
                                </p>
                            </div>

                            {/* Два блока справа */}
                            <div className="flex flex-col gap-6">
                                <div className="bg-foreground p-8 rounded-3xl shadow-md flex flex-col items-center text-center">
                                    <Users className="text-[#C7E07A] w-12 h-12 mb-3"/>
                                    <h3 className="text-xl text-white font-semibold mb-2">Реальные отзывы</h3>
                                    <p className="text-white text-lg">
                                        Наши клиенты подтверждают надежность товаров и уровень сервиса.
                                    </p>
                                </div>
                                <div className="bg-white p-8 border-2 border-foreground rounded-3xl shadow-md flex flex-col items-center text-center">
                                    <ShieldCheck className="text-[#C7E07A] w-12 h-12 mb-3"/>
                                    <h3 className="text-xl font-semibold mb-2">Безопасные покупки</h3>
                                    <p className="text-gray-600 text-lg">
                                        Оплата только проверенными способами, никаких рисков.
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Кнопка с переходом на Avito на всю ширину экрана */}
                        <div className="w-full  mt-10">
                            <a
                                href="https://www.avito.ru/user/7d963573f9ab4eeaaf03b68604faada8/profile/all"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-full bg-accent/50 text-[#333333] px-8 py-4 text-lg font-semibold rounded-3xl shadow-lg hover:bg-[#b0cc6d] transition duration-300 ease-in-out transform "
                            >
                                Перейти на
                                <Image
                                    src="/Avito.svg" // Путь к файлу в папке public
                                    alt="Avito"
                                    width={65}
                                    height={65}
                                    className="ml-2"
                                />
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
