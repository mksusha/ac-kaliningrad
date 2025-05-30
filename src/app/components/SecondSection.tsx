import type { NextPage } from 'next'
import Link from 'next/link'

const Home: NextPage = () => {
    return (
        <main className="bg mb-10 mx-5 text-[#333333] py-12 flex flex-col">
            <div className="container mx-auto px-4 md:px-0 flex-grow">
                <div className="grid grid-cols-1 mb-20 md:grid-cols-2 gap-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold uppercase leading-snug tracking-[0.05em]">
                            ОБЕСПЕЧИВАЕМ <span className="bg-[#C7E07A] text-black px-1.5 rounded-2xl">УЮТ</span>
                            <br />
                            В ВАШЕМ ДОМЕ И ОФИСЕ
                        </h1>
                    </div>
                    <div>
                        <p className="text-base md:text-xl leading-relaxed">
                            «Кондиционер-Калининград.рф» — это эксперт в продаже, установке и
                            обслуживании кондиционеров. Мы помогаем создать идеальный микроклимат
                            в вашем помещении, обеспечивая комфорт в любое время года.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    <div className="relative border border-[#333333] rounded-3xl p-6 flex flex-col bg-white flex-auto min-h-[300px] md:min-h-[350px] lg:min-h-[450px]">
                        <div className="absolute top-4 right-4 w-6 h-6 bg-black text-white flex items-center justify-center rounded-full font-bold text-base">+</div>
                        <h2 className="text-xl w-3/5 md:text-3xl font-bold uppercase mb-6">
                            БОЛЕЕ 5 ЛЕТ ОПЫТА В СФЕРЕ КЛИМАТИЧЕСКОГО ОБОРУДОВАНИЯ
                        </h2>
                        <p className="text-sm md:text-lg leading-relaxed mb-6">
                            Мы установили сотни кондиционеров, обеспечивая надежное охлаждение
                            и обогрев для домов, офисов и коммерческих объектов.
                        </p>
                        <Link
                            href="/services"
                            className="mt-auto border-2 border-[#333333] py-1.5 px-3 text-lg font-bold uppercase rounded-full
    hover:bg-[#C7E07A] active:bg-[#879a4f] transition-colors duration-200 text-center block"
                        >
                            НАШИ УСЛУГИ
                        </Link>
                    </div>

                    <div className="relative border border-[#333333] rounded-3xl p-6 flex flex-col bg-black bg-opacity-85 text-[#C7E07A] pt-4 bg-cover bg-center flex-auto min-h-[300px] md:min-h-[350px] lg:min-h-[200px]" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/111.jpg')" }}>
                        <div className="absolute top-4 right-4 w-6 h-6 bg-[#C7E07A] text-black flex items-center justify-center rounded-full font-bold text-base">+</div>
                        <h2 className="text-xl w-3/5 md:text-3xl font-bold uppercase mb-6">
                            НАШЕ ОБОРУДОВАНИЕ — НАДЕЖНОСТЬ И КАЧЕСТВО
                        </h2>
                        <p className="text-sm md:text-lg leading-relaxed mb-6">
                            Мы работаем только с проверенными брендами, гарантируя долговечность
                            и эффективность каждого кондиционера.
                        </p>
                        <Link
                            href="/portfolio"
                            className="mt-auto border-2 border-[#C7E07A] py-1.5 px-3 text-lg font-bold uppercase rounded-full
    hover:bg-[#C7E07A] hover:text-black active:bg-[#879a4f] transition-colors duration-200 flex items-center justify-center"
                        >
                            ПОДРОБНЕЕ
                        </Link>

                    </div>
                </div>
            </div>
        </main>
    )
}

export default Home
