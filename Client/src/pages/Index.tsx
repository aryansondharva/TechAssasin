import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PrizesSection from "@/components/PrizesSection";
import TracksSection from "@/components/TracksSection";
import HardwareTrackSection from "@/components/HardwareTrackSection";
import WhySection from "@/components/WhySection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <PrizesSection />
      <TracksSection />
      <HardwareTrackSection />
      <WhySection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
