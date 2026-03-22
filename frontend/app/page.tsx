import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import WhatSetsUsApart from "@/components/home/WhatSetsUsApart";
import OurProcess from "@/components/home/OurProcess";
import BrandGrid from "@/components/home/BrandGrid";
import TrustCounter from "@/components/home/TrustCounter";
import CheckStats from "@/components/home/CheckStats";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorks />
      <WhatSetsUsApart />
      <OurProcess />
      <BrandGrid />
      <TrustCounter />
      <CheckStats />
    </div>
  );
}
