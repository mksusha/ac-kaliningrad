"use client";

import { createClient } from "next-sanity";
import { useState, useEffect } from "react";
import { FileText, Wrench, Settings, Droplet } from "lucide-react";
import { useRouter } from "next/navigation";

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your_project_id",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2023-01-01",
    useCdn: true,
});

const SERVICES = [
    {
        title: "Стандартный монтаж",
        description: "Установка сплит-систем и кондиционеров профессионалами.",
        icon: FileText,
        bgColor: "bg-[#F8F8F3]",
        textColor: "text-[#333333]",
        borderColor: "border-[#333333]",
        bgImage: "url('/sb1.jpeg')"
    },
    {
        title: "Демонтаж и обслуживание",
        description: "Снятие и техническое обслуживание кондиционеров.",
        icon: Wrench,
        bgColor: "bg-[#333333]",
        textColor: "text-accent",
        borderColor: "border-accent",
        bgImage: "url('/sb2.jpeg')"
    },
    {
        title: "Ремонт и диагностика",
        description: "Ремонт сплит-систем и устранение неисправностей.",
        icon: Settings,
        bgColor: "bg-[#333333]",
        textColor: "text-accent",
        borderColor: "border-accent",
        bgImage: "url('/sb3.jpeg')"
    },
    {
        title: "Заправка фреоном",
        description: "Профессиональная заправка кондиционеров хладагентом.",
        icon: Droplet,
        bgColor: "bg-[#F8F8F3]",
        textColor: "text-[#333333]",
        borderColor: "border-[#333333]",
        bgImage: "url('/sb4.jpeg')"
    },
];

export default function ServicesBlock() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const handleCardClick = () => {
        router.push("/services");
    };

    if (isLoading) {
        return <div>Загрузка услуг...</div>;
    }

    return (
        <div className="bg-white text-[#333333] px-6 py-12">
            <div className="flex flex-col mb-16 sm:flex-row items-start justify-between gap-6 sm:gap-8 w-full">
                <h2 className="text-3xl sm:text-4xl font-bold leading-tight sm:leading-normal text-left w-full sm:w-auto">
                    ВЫБЕРИТЕ{" "}
                    <span className="bg-accent rounded-2xl px-3 py-1 inline-block">
                УСЛУГУ
            </span>
                </h2>
                <p className="text-lg text-black lg:max-w-[36rem] text-left leading-relaxed w-full sm:w-auto">
                    Мы предлагаем широкий спектр услуг по установке, ремонту и обслуживанию кондиционеров.
                    Выберите нужную услугу и получите качественную помощь от наших специалистов.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {SERVICES.map((service, index) => (
                    <div
                        key={index}
                        onClick={handleCardClick}
                        className={`relative ${service.bgColor} p-8 rounded-3xl border-[3px] ${service.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}
                        style={{
                            backgroundImage: service.bgImage,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        {service.bgColor === "bg-[#F8F8F3]" && (
                            <div
                                className="absolute inset-0 bg-[#F8F8F3] opacity-70 rounded-3xl"
                            />
                        )}

                        {service.bgColor === "bg-[#333333]" && (
                            <div
                                className="absolute inset-0 bg-black bg-opacity-70 rounded-3xl"
                            />
                        )}

                        <div className="relative z-10 text-center">
                            <service.icon
                                className={`w-24 h-24 mx-auto ${service.textColor} mb-6 transition-all duration-300 transform`}/>
                            <h3 className={`text-2xl font-semibold ${service.textColor} mb-2`}>{service.title}</h3>
                            <p className={`text-md ${service.textColor}`}>{service.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
