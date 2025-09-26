import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhoIsItFor from "@/components/WhoIsItFor";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Index() {
  return (
    <div className="min-h-screen orion-bg">
      <Header />
      <main>
        <Hero />
        <WhoIsItFor />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
