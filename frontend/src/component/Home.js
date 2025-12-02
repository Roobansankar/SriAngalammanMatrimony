// Home.js
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link, useNavigate } from "react-router-dom";
import videoSrc from "./weeding4.mp4"; // <- correct import / quotes for local video
import About1 from "./About1";
import { FeaturedProfiles } from "./FeaturedProfiles";
import { Works } from "./Works";
import { Success } from "./Success";
import CTA from "./CTA";
import Hero from "./Hero";

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
