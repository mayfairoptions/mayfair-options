import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import About from "@/components/About";
import BestPlays from "@/components/BestPlays";
import AnalystTracker from "@/components/AnalystTracker";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Stats />
        <About />
        <BestPlays />
        <AnalystTracker />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
