import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link, useNavigate } from "react-router-dom";
import videoSrc from "./weeding4.mp4"; // <- correct import / quotes for local video
const Hero = () => {
  const navigate = useNavigate();

  // ----- Quick Search state -----
  const religions = ["Hindu", "Christian", "Muslim", "Sikh", "Any"];
  const hinduCastes = [
    "Brahmin",
    "Iyer",
    "Iyengar",
    "Mudaliar",
    "Pillai",
    "Naidu",
    "Nadar",
    "Gounder",
    "Vanniyar",
    "Reddy",
    "Yadav",
    "Adi Dravida",
    "Kshatriya",
    "Vaishya",
    "Others",
  ];
  const ages = Array.from({ length: 43 }, (_, i) => i + 18); // 18..60

  const [qs, setQs] = React.useState({
    lookingFor: "Bride", // Bride | Groom
    fromAge: 20,
    toAge: 28,
    religion: "Hindu",
    caste: "All Castes",
  });

  const isHindu = qs.religion === "Hindu";

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      gender: qs.lookingFor === "Bride" ? "Female" : "Male",
      fromAge: String(qs.fromAge),
      toAge: String(qs.toAge),
      religion: qs.religion,
    });

    if (isHindu && qs.caste && qs.caste !== "All Castes") {
      params.set("caste", qs.caste);
    }

    navigate(`/search?${params.toString()}`);
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);
  return (
    <div>
      {" "}
      <div className="relative h-[100vh] overflow-hidden font-sans bg-black">
        {/* Video background */}
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          // className="absolute inset-0 w-full h-full object-cover"
          className="absolute inset-0 w-full h-full object-cover filter brightness-75"
        />

        {/* optional gradient overlay to improve text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/30"></div>

        {/* Hero content overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">
          <h1
            className="text-white text-4xl md:text-6xl mb-4 animate-fadeIn"
            data-aos="zoom-in"
          >
            Find Your Soulmate
          </h1>
          <p
            className="text-pink-100 text-xl md:text-2xl mb-8 max-w-2xl"
            data-aos="fade-up"
          >
            Where love stories begin and dreams come true
          </p>
          <div className="flex gap-4">
            <Link
              to="/register"
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              data-aos="zoom-in-up"
            >
              Join Now
            </Link>
            <Link
              to="/search"
              className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              data-aos="zoom-in-up"
            >
              Browse Profiles
            </Link>
          </div>
        </div>
      </div>
      {/* Quick Search Card (UPDATED) */}
      <section className="bg-white py-12 -mt-16 relative z-20 mx-4 md:mx-auto max-w-5xl rounded-2xl shadow-lg">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-display text-center text-[#C2185B] mb-8">
            Quick Search
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4"
          >
            {/* I am looking for */}
            <select
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-[#C2185B] focus:border-[#C2185B]"
              value={qs.lookingFor}
              onChange={(e) =>
                setQs((s) => ({ ...s, lookingFor: e.target.value }))
              }
            >
              <option value="Bride">Bride</option>
              <option value="Groom">Groom</option>
            </select>

            {/* From Age */}
            <select
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-[#C2185B] focus:border-[#C2185B]"
              value={qs.fromAge}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                setQs((s) => ({
                  ...s,
                  fromAge: v,
                  toAge: Math.max(v, s.toAge),
                }));
              }}
            >
              {ages.map((a) => (
                <option key={`f-${a}`} value={a}>
                  {a}
                </option>
              ))}
            </select>

            {/* To Age */}
            <select
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-[#C2185B] focus:border-[#C2185B]"
              value={qs.toAge}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                setQs((s) => ({ ...s, toAge: Math.max(v, s.fromAge) }));
              }}
            >
              {ages
                .filter((a) => a >= qs.fromAge)
                .map((a) => (
                  <option key={`t-${a}`} value={a}>
                    {a}
                  </option>
                ))}
            </select>

            {/* Religion */}
            <select
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-[#C2185B] focus:border-[#C2185B]"
              value={qs.religion}
              onChange={(e) => {
                const rel = e.target.value;
                setQs((s) => ({
                  ...s,
                  religion: rel,
                  caste: rel === "Hindu" ? "All Castes" : "",
                }));
              }}
            >
              {religions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {/* Caste (Hindu only) */}
            <select
              className={`w-full p-3 rounded-lg border border-gray-300 focus:ring-[#C2185B] focus:border-[#C2185B] ${
                !isHindu ? "bg-gray-100 text-gray-400" : ""
              }`}
              value={isHindu ? qs.caste : ""}
              onChange={(e) => setQs((s) => ({ ...s, caste: e.target.value }))}
              disabled={!isHindu}
            >
              {isHindu ? (
                hinduCastes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))
              ) : (
                <option value="">Caste (Hindu only)</option>
              )}
            </select>

            {/* Search button */}
            <button
              type="submit"
              className="w-full p-3 rounded-lg bg-[#C2185B] text-white font-semibold hover:opacity-95 active:opacity-90 transition"
            >
              Search
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Hero;
