// import React from "react";
// import { Link } from "react-router-dom";

// export default function About() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-rose-100 via-rose-200 to-rose-300 text-gray-900 font-display py-12 overflow-hidden">
//       <div className="relative min-h-screen w-full">
//         {/* Page Content */}
//         <div className="relative z-10 flex flex-col mt-10">
//           <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-7">
//             {/* Hero Section */}
//             <section className="relative rounded-xl overflow-hidden mb-16 lg:mb-24">
//               <div
//                 className="absolute inset-0 bg-cover bg-center md:bg-top"
//                 style={{
//                   backgroundImage:
//                     "url('https://i.pinimg.com/736x/52/c0/27/52c02707db8f603e095c748799351871.jpg')",
//                   backgroundPosition: "center 20%",
//                 }}
//               ></div>
//               <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-primary/20"></div>
//               <div className="relative z-10 flex flex-col items-center justify-center min-h-[350px] md:min-h-[400px] text-center p-8">
//                 <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">
//                   About Sriangalamman Matrimony
//                 </h1>
//                 <p className="mt-3 text-base md:text-lg text-white/90 max-w-2xl drop-shadow-md">
//                   Connecting hearts, creating destinies. Find your perfect match
//                   with us.
//                 </p>
//                 <Link to="/login">
//                   <button className="mt-6 px-6 py-2.5 rounded-full bg-white font-bold text-primary shadow-lg hover:bg-gray-100 transition-all">
//                     Get Started
//                   </button>
//                 </Link>
//               </div>
//             </section>

//             {/* Mission */}
//             <section className="text-center mb-16 lg:mb-24">
//               <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">
//                 Our Mission
//               </h2>
//               <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
//               <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
//                 At Sriangalamman Matrimony, our mission is to provide a safe,
//                 reliable, and culturally sensitive platform where individuals
//                 can connect, communicate, and build meaningful relationships
//                 that lead to lifelong happiness.
//               </p>
//             </section>

//             {/* Vision */}
//             <section className="text-center mb-16 lg:mb-24">
//               <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">
//                 Our Vision
//               </h2>
//               <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
//               <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
//                 To be the most trusted matrimonial platform that celebrates
//                 love, unity, and culture by helping individuals find their
//                 lifelong partners with dignity, respect, and joy. We envision a
//                 world where every connection is rooted in trust and guided by
//                 tradition.
//               </p>
//             </section>

//             {/* Why Choose Us */}
//             <section className="mb-16 lg:mb-24">
//               <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
//                 Why Choose Us
//               </h2>
//               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//                 {[
//                   {
//                     icon: "verified_user",
//                     title: "Verified Profiles",
//                     desc: "All profiles are manually verified to ensure authenticity.",
//                   },
//                   {
//                     icon: "groups",
//                     title: "Extensive Database",
//                     desc: "Access a vast database of eligible singles.",
//                   },
//                   {
//                     icon: "favorite",
//                     title: "Personalized Matchmaking",
//                     desc: "Advanced algorithms provide tailored matches.",
//                   },
//                   {
//                     icon: "handshake",
//                     title: "Trusted & Secure",
//                     desc: "We prioritize your privacy and security.",
//                   },
//                 ].map((item) => (
//                   <div
//                     key={item.title}
//                     className="bg-background-light dark:bg-background-dark p-8 rounded-lg shadow-md hover:shadow-lg border border-transparent hover:border-primary/50 transition-all transform hover:-translate-y-2"
//                   >
//                     <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6 mx-auto">
//                       <span className="material-symbols-outlined text-primary text-4xl">
//                         {item.icon}
//                       </span>
//                     </div>
//                     <h3 className="text-xl font-bold text-center mb-2 text-gray-800 dark:text-white">
//                       {item.title}
//                     </h3>
//                     <p className="text-center text-gray-600 dark:text-gray-400">
//                       {item.desc}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </section>

//             {/* Our Team */}
//             <section>
//               <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-800 dark:text-white">
//                 Our Team
//               </h2>
//               <div className="grid md:grid-cols-2 gap-12 lg:gap-16 max-w-4xl mx-auto">
//                 {[
//                   {
//                     name: "Priya Sharma",
//                     role: "Founder & CEO",
//                     desc: "Passionate about creating meaningful connections.",
//                     icon: "diversity_1",
//                     img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCa6g_f1EwPOL5tiAswFoKUEqzqhZCVHbHVbCg92OXv0qw_IUF9ij-I0biMQYxU3nEW4A5Awt8JEdYjcKxRr0Dos-4tuk_Ol6QATXsizejChInuuwQGML1tHTAKn0bOa8FIxhGBovcJwsmbT5s4a6fDiPAHsB-yDEw5K5Pn1-0n0AdKzHWIkkA-n1z48KL6KvZJyeENU9PzC09YJDX0wBD3cj36UD9DZK9uQSZawAawGUPAjI5yhlFolV7OLV0hNX48sfuZCdC1Zjrx",
//                   },
//                   {
//                     name: "Arjun Verma",
//                     role: "Co-Founder & CTO",
//                     desc: "Dedicated to building a secure platform for our members.",
//                     icon: "code",
//                     img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDO9Azsq_NkomcevUicy1XCld_6mYrDEy32-j2WcjSRHJdmt7y_oMalMNwPlijraNdPKymiHqTCtEs0Ei7Ftc9g50dawsluyLP01NmH-W2_iHhUAbDC3Bo4aXhNPwxiO26ZietPHCk4C_wpKKYebLVT9rU1GULqueazyQ1aoa_I9W6I70bwsK11O1Agi2NQLxz_8MceOtPbfEzMESbCCAije4E_dt_pAjOLtYkChJNYpMjQFxj45cbXEzOhyA5-_Duv1VhZvl9SAtj2",
//                   },
//                 ].map((member) => (
//                   <div
//                     key={member.name}
//                     className="flex flex-col items-center text-center"
//                   >
//                     <div className="relative mb-6">
//                       <div
//                         className="w-48 h-48 rounded-full bg-cover bg-center shadow-lg"
//                         style={{ backgroundImage: `url(${member.img})` }}
//                       ></div>
//                       <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
//                         <span className="material-symbols-outlined text-primary text-2xl">
//                           {member.icon}
//                         </span>
//                       </div>
//                     </div>
//                     <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
//                       {member.name}
//                     </h3>
//                     <p className="text-primary font-medium mb-2">
//                       {member.role}
//                     </p>
//                     <p className="text-gray-600 md:text-lg dark:text-gray-400">
//                       {member.desc}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </section>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }

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
                Sriangalamman Matrimony was founded with a heartfelt mission —
                to help individuals find genuine and meaningful relationships
                rooted in trust, culture, and mutual respect. What began as a
                small initiative to connect families has now grown into a
                trusted platform that celebrates love and unity.
              </p>
            </section>

            {/* Mission & Vision Cards */}
            <section className="grid md:grid-cols-2 gap-10 mb-16 lg:mb-24">
              {[
                {
                  title: "Our Mission",
                  desc: "To provide a safe, reliable, and culturally sensitive platform where individuals can connect, communicate, and build meaningful relationships that lead to lifelong happiness.",
                },
                {
                  title: "Our Vision",
                  desc: "To be the most trusted matrimonial platform that celebrates love, unity, and culture by helping individuals find their lifelong partners with dignity, respect, and joy.",
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
