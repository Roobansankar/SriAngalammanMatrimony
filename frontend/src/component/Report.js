// import React from "react";

// const Report = () => {
//   return (
//     <div className="bg-gradient-to-b from-[#fee2e2] via-[#fca5a5] to-[#ef4444] py-12 px-6 md:px-24 font-display">
//       <div className="max-w-5xl mx-auto text-gray-800 leading-8 space-y-6 mt-20">
//         <h1 className="text-3xl font-semibold text-center text-pink-600 mb-4">
//           Report Misuse
//         </h1>
//         <div className="flex justify-center mb-10">
//           <div className="w-20 border-b-4 border-pink-500"></div>
//         </div>

//         <p>
//           If you have any questions about the services we provide simply use the
//           form below. We try and respond to all queries and comments within 24
//           hours.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Report;

import React from "react";

const Report = () => {
  return (
    <main className="relative min-h-[80vh] text-white font-display py-10 sm:py-12 md:py-14 overflow-hidden">
      {/* 🌄 Brightened Background Image — consistent with other pages */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/1200x/a4/27/97/a42797ac0c2a198968e9d9462d03469d.jpg')",
          backgroundPosition: "center 40%",
          filter: "blur(1px) brightness(0.85)",
          transform: "scale(1.05)",
          zIndex: 0,
        }}
      ></div>

      {/* 🖤 Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />

      {/* 📄 Foreground Content — centered and responsive */}
      <div className="relative z-10 w-full flex justify-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 mt-[50px] pb-4">
        <div className="w-full max-w-6xl leading-relaxed">
          {/* Header Section */}
          <header className="text-center mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              Report Misuse
            </h1>
            <div className="flex justify-center mt-3 sm:mt-4">
              <div className="w-20 sm:w-24 border-b-4 border-pink-500"></div>
            </div>
          </header>

          {/* ✉️ Content Section — frosted-glass layout, left aligned */}
          <section
            className="
              max-w-[98%] mx-auto
              space-y-5 sm:space-y-6 md:space-y-7
              bg-white/15 border border-white/20 backdrop-blur-md
              p-5 sm:p-8 md:p-10
              rounded-xl sm:rounded-2xl shadow-lg
              text-white
              text-[14px] sm:text-[15px]
              leading-6 sm:leading-7 md:leading-8
              text-left
            "
          >
            <p>
              If you have any questions, concerns, or wish to report misuse of
              our services, please contact our support team. We take all reports
              seriously and aim to review and respond to every query within{" "}
              <strong className="text-pink-400">24 hours</strong>.
            </p>

            <p>
              Your feedback helps us ensure that{" "}
              <strong className="text-pink-400">
                sriangalammanmatrimony.com
              </strong>{" "}
              remains a safe, genuine, and respectful platform for all members.
              We greatly appreciate your cooperation in maintaining the
              integrity of our community.
            </p>

            <p>
              To report misuse or suspicious activity, please email us directly
              at{" "}
              <a
                href="mailto:support@sriangalammanmatrimony.com"
                className="text-pink-400 underline font-semibold"
              >
                support@sriangalammanmatrimony.com
              </a>{" "}
              with relevant details and evidence (if any). Our team will review
              your report and take appropriate action promptly.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Report;
