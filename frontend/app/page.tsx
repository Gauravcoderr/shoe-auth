import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import BrandGrid from "@/components/home/BrandGrid";
import CheckStats from "@/components/home/CheckStats";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorks />
      <BrandGrid />
      <CheckStats />
    </div>
  );
}
