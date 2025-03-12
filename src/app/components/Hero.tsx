"use client";
import { FaSnowflake, FaTools, FaShoppingCart, FaPhone } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import RequestFormContainer from "@/app/components/RequestFormContainer";

// Хук для динамического изменения размера иконок
const useIconSize = () => {
    const [iconSize, setIconSize] = useState(30);

    useEffect(() => {
        const updateSize = () => {
            setIconSize(window.innerWidth <= 1012 ? 20 : 30);
        };

        updateSize(); // Устанавливаем сразу при загрузке
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return iconSize;
};

const Hero = () => {
    const iconSize = useIconSize(); // Подключаем динамический размер иконок

    const advantages = [
        { icon: <FaSnowflake size={iconSize} className="text-[#C7E07A]" />, title: "Современные технологии", description: "Эффективное охлаждение и обогрев." },
        { icon: <FaTools size={iconSize} className="text-[#C7E07A]" />, title: "Профессиональный монтаж", description: "Гарантия надежности и долговечности." },
        { icon: <FaShoppingCart size={iconSize} className="text-[#C7E07A]" />, title: "Широкий выбор", description: "Кондиционеры и комплектующие от ведущих брендов." },
        { icon: <FaPhone size={iconSize} className="text-[#C7E07A]" />, title: "Бесплатная консультация", description: "Поможем выбрать подходящий вариант." },
    ];

    const infiniteAdvantages = [...advantages, ...advantages, ...advantages];

    return (
        <section id="hero" className="relative mb-10 py-10 sm:py-12 md:py-16 lg:py-12 mx-auto max-w-[1350px] bg-white overflow-hidden">
            <div className="container mx-auto mt-8 sm:mt-12 md:mt-16 lg:mt-24 max-w-[1350px] h-auto lg:h-[800px] xl:h-[650px] px-4 sm:px-6 md:px-8 lg:px-12">
                <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-8 lg:gap-12 xl:h-[650px] justify-center">

                    {/* Левый блок */}
                    <div
                        className="relative bg-[#333] md:w-full rounded-xl md:rounded-2xl lg:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 w-full lg:w-[60%] lg:max-w-[750px] flex flex-col justify-between shadow-md">
                        {/* Заголовок */}
                        <div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-4 sm:mt-6 md:mt-8 font-bold leading-tight tracking-tight text-white text-center md:text-left">
                                Комфортный климат <br className="hidden sm:block"/> в каждом доме
                            </h1>
                            <p className="mt-3 sm:mt-4 md:mt-5 text-base sm:text-lg md:text-lg lg:text-xl text-[#999] leading-relaxed text-center md:text-left">
                                Продажа и установка кондиционеров в Калининграде. Подберем оптимальное решение для
                                вашего помещения!
                            </p>
                        </div>

                        {/* 🔥 Бесконечная анимация преимуществ */}
                        <div className="mt-6 sm:mt-8 md:mt-10 overflow-hidden w-full relative">
                            <motion.div
                                className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6"
                                animate={{x: ["0%", "-66.66%"]}}
                                transition={{duration: 30, repeat: Infinity, ease: "linear"}}
                                style={{width: "max-content", display: "flex"}}
                            >
                                {infiniteAdvantages.map((item, index) => (
                                    <div key={index}
                                         className="flex bg-[#666] border-accent border-b-2 items-center sm:items-start h-28 sm:h-28 md:h-36 lg:h-40 w-[180px] sm:w-[190px] md:w-[220px] lg:w-[260px] gap-3 sm:gap-4 md:gap-5 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg md:rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition">
                                        <div>{item.icon}</div>
                                        <div>
                                            <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-[#ffffff]">{item.title}</h3>
                                            <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-[#dddddd]">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Кнопки */}
                        <div
                            className="mt-6 sm:mt-8 md:mt-10 flex flex-wrap justify-center sm:justify-center md:justify-start gap-4 sm:gap-5 md:gap-6 flex-col sm:flex-row"
                        >
                            {/* Первая кнопка */}
                            <Link
                                href="/catalog"
                                className="bg-[#C7E07A] text-[#333333] font-semibold text-sm sm:text-base md:text-lg lg:text-base xl:text-lg
    py-3 px-6 sm:py-4 sm:px-8 md:py-4 md:px-10 lg:py-3 lg:px-8 xl:py-4 xl:px-10 rounded-full shadow-md
    border-2 border-[#C7E07A] transition-all duration-300 hover:bg-transparent hover:text-[#C7E07A]
    flex items-center justify-center"
                            >
                                Каталог товаров
                            </Link>

                            {/* Вторая кнопка */}
                          <RequestFormContainer></RequestFormContainer>
                        </div>


                    </div>
                    {/* Правый блок */}
                    <div className="flex flex-col w-full lg:w-[40%] md:w-full lg:max-w-[600px] gap-4 sm:gap-6 md:gap-8">
                        <div
                            className="relative overflow-hidden rounded-xl md:rounded-2xl lg:rounded-3xl shadow-xl transition-transform
              hover:shadow-2xl">
                            <img
                                src="/3.jpg"
                                alt="Кондиционеры"
                                className="w-full h-auto object-cover
                   sm:max-h-[250px] md:max-h-[300px] lg:max-h-[400px] max-h-[250px]"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 md:gap-8">
                            {[
                                {
                                    title: "Товары",
                                    description: "Широкий выбор кондиционеров под любые задачи.",
                                    href: "/catalog",
                                },
                                {
                                    title: "Наши услуги",
                                    description: "Монтаж, сервисное обслуживание, ремонт.",
                                    href: "/services",
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl md:rounded-2xl lg:rounded-3xl shadow-lg p-5 sm:p-6 md:p-7 lg:p-5 flex flex-col justify-between
                w-full sm:w-1/2  !sm:min-h-[220px] !md:min-h-[220px] relative transition-all duration-300 hover:shadow-xl group flex-1"
                                    style={{
                                        background: "linear-gradient(135deg, #F3F3ED, #EAEADE)",
                                        border: "2px solid #333",
                                        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.08)",
                                    }}
                                >
                                    <div>
                                        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-[#333333]">{item.title}</h3>
                                        <p className="mt-2 sm:mt-3 md:mt-4 lg:mt-5 text-xs sm:text-sm md:text-base lg:text-lg text-[#666]">{item.description}</p>
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 5 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ duration: 2, ease: "easeOut" }}
                                    >
                                        <Link
                                            href={item.href}
                                            className="mt-4 bg-[#C7E07A] text-[#333] font-medium py-2 px-4 rounded-full shadow-md hover:bg-[#B4CC6E] transition
                    lg:opacity-100 block w-full text-center"
                                        >
                                            Перейти
                                        </Link>
                                    </motion.div>
                                </div>
                            ))}
                        </div>


                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
