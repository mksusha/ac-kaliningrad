import MapComponent from "@/app/components/MapComponent";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Portfolio from "../components/Portfolio";

export default function PortfolioPage() {
    return (
        <>
            <Header />
        <main className="flex mt-20 flex-col items-center justify-center py-12">
            <h1 className="text-4xl font-bold text-center mb-6">Наши работы</h1>
            <p className="text-lg text-gray-600 text-center mb-8">
                Здесь вы можете увидеть места, где мы устанавливали кондиционеры.
            </p>
            <div className="w-full max-w-[1350px] px-4">
                <MapComponent />

            </div>
            <Portfolio></Portfolio>
        </main>
            <Footer />
        </>
    );
}
