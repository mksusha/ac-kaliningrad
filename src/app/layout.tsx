import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Footer from "@/app/components/Footer";
import { CartProvider } from "@/hooks/useCart";
import { FiltersProvider } from "@/app/components/FiltersContext";


const nunito = Nunito({
    subsets: ["latin"],
    weight: ["400", "600", "700", "800"],
    variable: "--font-nunito",
});

export const metadata: Metadata = {
    title: "Кондиционер-Калининград.рф",
    description: "Продажа, установка и обслуживание кондиционеров в Калининграде. Широкий выбор моделей, профессиональный монтаж и выгодные цены. Создадим комфорт в вашем доме и офисе!"
};


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={nunito.variable}>
        <body className="antialiased text-foreground flex flex-col min-h-screen">
        <CartProvider>
            <FiltersProvider>
                <div className="max-w-[1350px] w-full mx-auto flex-1">
                    <main className="flex-1">{children}</main>
                </div>
            </FiltersProvider>
        </CartProvider>
        </body>
        </html>
    );
}
