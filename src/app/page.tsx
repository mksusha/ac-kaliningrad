import Image from "next/image";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "@/app/components/Footer";
import SecondSection from "@/app/components/SecondSection";
// import ThirdSection from "@/app/components/ThirdSection";

export default function Home() {
  return (
      <>
        <Header />
        <Hero />
          <SecondSection></SecondSection>
          {/*<ThirdSection></ThirdSection>*/}
<Footer></Footer>
      </>
  );
}