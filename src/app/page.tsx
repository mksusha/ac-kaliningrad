import Image from "next/image";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
      <>
        <Header />
        <Hero />
          <Footer />
      </>
  );
}