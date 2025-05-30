"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFoundPage() {
    return (
        <main className="flex min-h-screen items-center justify-center px-6 py-24 sm:py-32">
            <div className="w-full max-w-[800px] text-center bg-[#F8F8F3] rounded-3xl p-10 shadow-lg">
                <motion.h1
                    className="text-9xl font-extrabold text-[#C7E07A]"
                    initial={{ y: -20, scale: 0.8, opacity: 0 }}
                    animate={{ y: 0, scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", type: "spring" }}
                >
                    404
                </motion.h1>

                <motion.h2
                    className="mt-4 text-4xl font-bold text-[#333333] sm:text-5xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                >
                    Страница не найдена
                </motion.h2>

                <motion.p
                    className="mt-6 text-lg text-[#333333] sm:text-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                >
                    Возможно, она была удалена или адрес указан неверно.
                </motion.p>

                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        href="/"
                        className="rounded-2xl bg-[#C7E07A] px-8 py-3 text-lg font-semibold text-[#333333] hover:bg-[#b0cc6d] transition"
                    >
                        На главную
                    </Link>

                    <Link
                        href="/catalog"
                        className="rounded-2xl border-2 border-[#C7E07A] px-8 py-3 text-lg font-semibold text-[#333333] hover:bg-[#C7E07A]/20 transition"
                    >
                        В каталог
                    </Link>
                </div>
            </div>
        </main>
    );
}
