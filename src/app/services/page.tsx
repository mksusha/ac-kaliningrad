import { notFound } from "next/navigation";
import { FileText, Wrench, Settings, Droplet } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ServiceCard from "@/app/catalog/components/ServiceCard";

export interface Service {
    id: string;
    title: string;
    description?: string;
    price?: number;
    priceLabel?: string;
    slug: string;
    serviceType?: string;
    imageUrl?: string;
}
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
async function fetchServices(): Promise<Service[]> {
    const res = await fetch(`${baseUrl}/api/services`, {
        cache: 'no-store',
    });


    if (!res.ok) {
        throw new Error('Ошибка при загрузке услуг');
    }

    return res.json();
}

export default async function ServicesPage() {
    const services = await fetchServices();

    if (!services.length) {
        notFound();
    }

    return (
        <div className="flex flex-col mt-16 max-w-[1350px] w-full">
            <Header />
            <main className="flex-1 container mb-5 mx-auto px-4 sm:px-0">
                <section className="py-8 sm:py-12 bg-foreground rounded-3xl my-5 sm:my-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-white">
                        Наши услуги
                    </h1>
                    <div className="grid px-10 gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-auto max-w-[1350px]">
                        {[
                            {
                                icon: FileText,
                                title: "Стандартный монтаж",
                                description: "Установка сплит-систем и кондиционеров профессионалами.",
                            },
                            {
                                icon: Wrench,
                                title: "Демонтаж и обслуживание",
                                description: "Снятие и техническое обслуживание кондиционеров.",
                            },
                            {
                                icon: Settings,
                                title: "Ремонт и диагностика",
                                description: "Ремонт сплит-систем и устранение неисправностей.",
                            },
                            {
                                icon: Droplet,
                                title: "Заправка фреоном",
                                description: "Профессиональная заправка кондиционеров хладагентом.",
                            },
                        ].map(({ icon: Icon, title, description }) => (
                            <div
                                key={title}  // уникальный ключ по title
                                className="bg-white/40 py-4 sm:py-5 px-3 sm:px-4 rounded-3xl shadow-md text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-2"
                            >
                                <Icon className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-3 sm:mb-4 text-accent" />
                                <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">
                                    {title}
                                </h3>
                                <p className="text-white/50 text-sm sm:text-base">{description}</p>
                            </div>
                        ))}

                    </div>
                </section>
                <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
