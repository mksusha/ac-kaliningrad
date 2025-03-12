'use client'
import {FaTelegramPlane, FaVk, FaWhatsapp} from "react-icons/fa"; // Иконки для Telegram и VK

const Footer = () => {
    return (
        <footer className="max-w-[1350px] mt-8 m-0 bg-[#F8F8F3] text-[#333333] rounded-t-[45px] ">
            <div className=" mx-auto px-6 py-6 lg:px-[60px] lg:py-[30px]">
            {/* Верхний блок: логотип, навигация и соцсети */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center text-center lg:text-left mb-6">
                    {/* Логотип */}
                    <div className="mb-4 lg:mb-0">
                        <img src="/logo.svg" alt="Logo" className="h-12 mx-auto lg:mx-0" />
                    </div>

                    {/* Навигация */}
                    <nav className="flex flex-col items-center space-y-4 lg:flex-row lg:space-y-0 lg:space-x-8">
                        <a
                            href="/catalog"
                            className="hover:bg-[#C7E07A] hover:bg-opacity-30 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out text-sm lg:text-base"
                        >
                            Каталог
                        </a>

                        <a
                            href="/services"
                            className="hover:bg-[#C7E07A] hover:bg-opacity-30 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out text-sm lg:text-base"
                        >
                            Услуги
                        </a>
                        <a
                            href="/portfolio"
                            className="hover:bg-[#C7E07A] hover:bg-opacity-30 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out text-sm lg:text-base"
                        >
                            Портфолио
                        </a>
                        <a
                            href="#"
                            className="hover:bg-[#C7E07A] hover:bg-opacity-30 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out text-sm lg:text-base"
                        >
                            Отзывы
                        </a>
                        <a
                            href="/contacts"
                            className="hover:bg-[#C7E07A] hover:bg-opacity-30 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out text-sm lg:text-base"
                        >
                            Контакты
                        </a>
                    </nav>

                    {/* Соцсети */}
                    <div className="flex justify-center space-x-4 mt-4 lg:mt-0">
                        <a
                            href="https://t.me/konditionerkaliningrad"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#333333] hover:text-[#B4CC6E] hover:bg-[#C7E07A] hover:bg-opacity-20 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out text-2xl"
                        >
                            <FaTelegramPlane />
                        </a>

                        <a
                            href="https://wa.me/79581691352" // Формат ссылки для WhatsApp
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#333333] hover:text-[#B4CC6E] hover:bg-[#C7E07A] hover:bg-opacity-20 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out text-2xl"
                        >
                            <FaWhatsapp />
                        </a>
                    </div>

                </div>

                {/* Центральный блок с контактами и формой */}
                <div
                    className="flex flex-col  items-center justify-center lg:flex-row lg:justify-between mb-6 space-y-6 lg:space-y-0">
                    {/* Контакты */}
                    <div className="text-center lg:text-left space-y-4"> {/* Увеличено пространство между элементами */}

                        <p className="text-lg">
                            Телефон:
                            <a
                                href="tel:+79581691352"
                                className="text-[#333333] hover:text-[#B4CC6E] transition-all duration-300"
                            >
                                +7 958-169-13-52
                            </a>
                        </p>

                    </div>


                    {/* Блок с текстом */}
                    <div
                        className="bg-[#222]/80 rounded-[14px] p-3 w-full max-w-[400px] lg:max-w-[800px] shadow-lg text-center flex items-center justify-center">
                        <p className="text-background text-lg lg:text-base font-semibold">
                            Предлагаем профессиональную установку и обслуживание кондиционеров в Калининграде.
                            Найдем идеальное решение для вашего комфорта!
                        </p>
                    </div>


                </div>

                {/* Полоска */}
                <hr className="border-gray-700 mb-6"/>

                {/* Нижний блок с копирайтом */}
                <div className="text-center text-sm">
                    <p>
                        &copy; 2025 <strong>Кондиционер-Калининград.рф</strong> — Продажа и установка кондиционеров, а
                        также обслуживание и ремонт климатической техники.
                    </p>

                </div>
            </div>
        </footer>
    );
}

export default Footer;
