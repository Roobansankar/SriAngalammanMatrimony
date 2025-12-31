

import React from "react";
import { Link } from "react-router-dom";
import "aos/dist/aos.css";
import AOS from "aos";

export default function About() {
  React.useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 via-rose-200 to-rose-300 text-gray-900 font-display py-12 overflow-hidden">
      <div className="relative min-h-screen w-full">
        {/* Page Content */}
        <div className="relative z-10 flex flex-col mt-10">
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-7">
            {/* Hero Section */}
            <section
              className="relative rounded-xl overflow-hidden mb-16 lg:mb-24"
              data-aos="fade-up"
            >
              <div
                className="absolute inset-0 bg-cover bg-center md:bg-top"
                style={{
                  backgroundImage:
                    "url('https://i.pinimg.com/736x/52/c0/27/52c02707db8f603e095c748799351871.jpg')",
                  backgroundPosition: "center 20%",
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-primary/20"></div>

              <div className="relative z-10 flex flex-col items-center justify-center min-h-[350px] md:min-h-[400px] text-center p-8">
                <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">
                  About Sriangalamman Matrimony
                </h1>
                <p className="mt-3 text-base md:text-lg text-white/90 max-w-2xl drop-shadow-md">
                  Connecting hearts, creating destinies. Find your perfect match
                  with us.
                </p>
                <Link to="/login">
                  <button className="mt-6 px-6 py-2.5 rounded-full bg-white font-bold text-primary shadow-lg hover:bg-gray-100 transition-all">
                    Get Started
                  </button>
                </Link>
              </div>
            </section>

            {/* Our Story */}
            <section
              className="text-center mb-16 lg:mb-24 bg-white/60 backdrop-blur-lg rounded-xl p-10 shadow-md hover:shadow-xl transition-all"
              data-aos="fade-up"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                Our Story
              </h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
              <p className="max-w-3xl mx-auto text-gray-700 leading-relaxed text-lg">
                Sri Angalamman Manamalai was established on the joyful occasion
                of my 60th birthday and has been functioning successfully for
                the past five and a half years with dedication, happiness, and
                goodwill. This service helps connect two families by enabling
                bride and groom seekers to find suitable life partners among
                relatives and trusted connections with ease.
                <br />
                <br />
                So far, we have proudly facilitated over{" "}
                <span className="font-semibold">8,600 marriages</span>. With a
                strong focus on trust, convenience, and genuine relationships,
                Sri Angalamman Manamalai continues to support individuals in
                finding their life partners smoothly and respectfully.
              </p>
            </section>

            {/* Mission & Vision Cards */}
            <section className="grid md:grid-cols-2 gap-10 mb-16 lg:mb-24">
              {[
                {
                  title: "Our Mission",
                  desc: "Our mission is to bring families together by helping bride and groom seekers find suitable life partners in a simple, transparent, and respectful manner. We strive to make the matchmaking process easy and meaningful, guided by trust, clarity, and genuine intentions, without any expectations or commercial pressure.",
                },

                {
                  title: "Our Vision",
                  desc: "Our vision is to build a trusted matrimony platform that strengthens family bonds and supports lasting marriages. We aim to create a reliable space where relationships begin with honesty, cultural values, and mutual respect, helping individuals find their life partners with confidence and peace of mind.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-gradient-to-br from-rose-100 to-rose-300 shadow-md p-10 rounded-xl border hover:shadow-xl hover:-translate-y-2 transition-all backdrop-blur-lg"
                  data-aos="zoom-in"
                >
                  <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed text-lg">
                    {item.desc}
                  </p>
                </div>
              ))}
            </section>

            {/* Why Choose Us */}
            <section className="mb-16 lg:mb-24">
              <h2
                className="text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-12"
                data-aos="fade-up"
              >
                Why Choose Us
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: "verified_user",
                    title: "Verified Profiles",
                    desc: "All profiles are manually verified to ensure authenticity.",
                  },
                  {
                    icon: "groups",
                    title: "Extensive Database",
                    desc: "Access a vast database of eligible singles.",
                  },
                  {
                    icon: "favorite",
                    title: "Personalized Matchmaking",
                    desc: "Advanced algorithms provide tailored matches.",
                  },
                  {
                    icon: "handshake",
                    title: "Trusted & Secure",
                    desc: "We prioritize your privacy and security.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-gradient-to-br from-rose-200 to-rose-300 p-8 rounded-lg shadow-md hover:shadow-xl border hover:border-primary/50 transition-all transform hover:-translate-y-2"
                    data-aos="fade-up"
                  >
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6 mx-auto">
                      <span className="material-symbols-outlined text-primary text-4xl">
                        {item.icon}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-center mb-2 text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-center text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
            {/* Call to Action Section */}
            <section className="text-center mt-20 mb-10" data-aos="fade-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                Join Sriangalamman Matrimony
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto mb-6 text-lg">
                Create your profile today and take the first step toward finding
                your perfect match.
              </p>
              <Link to="/register/step/1">
                <button className="px-8 py-3 rounded-full bg-primary text-white font-bold shadow-lg hover:bg-primary/80 transition-all text-lg">
                  Register Now
                </button>
              </Link>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}


