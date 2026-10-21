import AboutSection from "@/components/AboutSection";
import CorporateGiftsSection from "@/components/Corporategiftssection";
import CustomCakeSection from "@/components/Customcakesection";
import FeaturesBar from "@/components/FeautersBar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import OccasionPickerSection from "@/components/Occasionpickersection";
import SaadeddinOccasionsSection from "@/components/Occasionssection";
import ProductsSection from "@/components/ProductSection";
import SupportSection from "@/components/SupportSection";
import TopBar from "@/components/Topbar";

export default function Home() {
  return (
    <>
      <TopBar />
      <Navbar />
      <HeroSection />
      <FeaturesBar />
      <ProductsSection />
      <SaadeddinOccasionsSection />
      <OccasionPickerSection />
      <CorporateGiftsSection />
      <CustomCakeSection />
      <AboutSection />
      <SupportSection />
      <Footer />
    </>
  );
}
