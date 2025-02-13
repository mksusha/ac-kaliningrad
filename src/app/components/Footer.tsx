'use client'
import {FaTelegramPlane, FaVk, FaWhatsapp} from "react-icons/fa"; // Иконки для Telegram и VK

const Footer = () => {
    return (
        <footer className="max-w-[1350px] m-auto bg-[#F8F8F3] text-[#333333] rounded-t-[45px] mt-auto">
            <div className="mt-10 mx-auto px-6 py-6 lg:px-[60px] lg:py-[30px]">
            {/* Верхний блок: логотип, навигация и соцсети */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center text-center lg:text-left mb-6">
                    {/* Логотип */}
                    <div className="mb-4 lg:mb-0">
                        <img src="/logo.svg" alt="Logo" className="h-12 mx-auto lg:mx-0" />
                    </div>

                    {/* Навигация */}
                    <nav className="flex flex-col items-center space-y-4 lg:flex-row lg:space-y-0 lg:space-x-8">
                        <a
                            href="#"
                            className="hover:bg-[#C7E07A] hover:bg-opacity-30 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out text-sm lg:text-base"
                        >
                            Каталог
                        </a>

                        <a
                            href="#"
                            className="hover:bg-[#C7E07A] hover:bg-opacity-30 px-2 py-1 rounded-xl transition-all duration-300 ease-in-out text-sm lg:text-base"
                        >
                            Услуги
                        </a>
                        <a
                            href="#"
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
                            href="#"
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
                    className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6 space-y-6 lg:space-y-0">
                    {/* Контакты */}
                    <div className="text-center lg:text-left space-y-4"> {/* Увеличено пространство между элементами */}
                        <p className="text-lg "> {/* Увеличен размер текста */}
                            Почта:{" "}
                            <a
                                href={`mailto:info@company.com`}
                                className="hover:underline"
                            >
                                info@company.com
                            </a>
                        </p>
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


                    {/* Форма подписки */}
                    <div
                        className="bg-[#333] rounded-[14px] p-4 w-full max-w-[500px] lg:max-w-[630px]"
                    >
                    <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 items-center">
                            {/* Поле Email */}
                            <input
                                type="email"
                                placeholder="Email"
                                className="border border-[#333333] rounded-[14px] px-4 py-3 w-full lg:w-1/2 text-[#333333] text-sm lg:text-base"
                            />
                            {/* Кнопка Подписаться */}
                            <button
                                className="bg-accent text-foreground border-2 border-transparent hover:bg-transparent hover:border-accent hover:text-accent px-4 py-3 w-full lg:w-1/2 rounded-[14px] text-sm lg:text-base transition-all duration-300 ease-in-out"
                            >
                                Подписаться на новости
                            </button>
                        </div>
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
