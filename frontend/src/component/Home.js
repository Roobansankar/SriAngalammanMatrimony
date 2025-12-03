// Home.js
import About1 from "./About1";
import CTA from "./CTA";
import { FeaturedProfiles } from "./FeaturedProfiles";
import Hero from "./Hero";
import { Success } from "./Success";
import { Works } from "./Works";

export default function Home() {
  return (
    <div className="bg-[#FFF8E1] text-[#4d4d4d] font-display min-h-screen overflow-hidden">
      {/* Hero */}
      <main>
        <Hero />
        <About1 />
        <FeaturedProfiles />
        <Works />
        <Success />
        <CTA />
      </main>
    </div>
  );
}
