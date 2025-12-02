// import React from "react";

// const Returns = () => {
//   return (
//     <section className="bg-[#f0f9ff] py-6 px-6 md:px-24 font-display">
//       <div className="max-w-5xl mx-auto text-gray-800 leading-8 space-y-4 text-center mt-32">
//         <h1 className="text-3xl font-semibold text-pink-600 ">
//           Returns and Cancellation
//         </h1>
//         <div className="flex justify-center">
//           <div className="w-20 border-b-4 border-pink-500" />
//         </div>
//         <p>
//           We do not entertain Return, Refund and Cancellation in any
//           circumstances.
//         </p>
//         <p>
//           All payments made are non-refundable and non-transferable under any
//           situation.
//         </p>
//       </div>
//     </section>
//   );
// };
// export default Returns;

import React from "react";

const Returns = () => {
  return (
    <main className="relative min-h-screen text-white font-display py-10 sm:py-14 md:py-16 overflow-hidden">
      {/* 🌄 Brightened & Softened Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://dallasoasis.com/wp-content/uploads/2023/02/Indian_Wedding_Ceremony_Photos_Biyani_Photo_201.jpg')",
          backgroundPosition: "center 40%",
          filter: "blur(1px) brightness(0.55)", // brighter for visibility
          transform: "scale(1.05)",
          zIndex: 0,
        }}
      ></div>

      {/* 🖤 Overlay for clarity */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />

      {/* 📄 Foreground Content — Centered and widened */}
      <div className="relative z-10 w-full flex justify-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 mt-[50px]">
        <div className="w-full max-w-6xl leading-relaxed">
          {/* Header Section */}
          <header className="text-center mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              Returns and Cancellation
            </h1>
            <div className="flex justify-center mt-3 sm:mt-4">
              <div className="w-20 sm:w-24 border-b-4 border-pink-500"></div>
            </div>
          </header>

          {/* 📝 Content Section — Matches Terms & Privacy layout */}
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
              We do not entertain{" "}
              <strong className="text-pink-400">
                Return, Refund, or Cancellation
              </strong>{" "}
              under any circumstances.
            </p>

            <p>
              All payments made are{" "}
              <strong className="text-pink-400">non-refundable</strong> and{" "}
              <strong className="text-pink-400">non-transferable</strong> in all
              cases.
            </p>

            <p>
              Users are requested to review all entered information carefully
              before confirming any payment or subscription. Once processed, the
              payment cannot be reversed or adjusted under any situation.
            </p>

            <p>
              In case of any technical issues during payment, members are
              advised to contact our support team with transaction details.
              Resolution will be handled at our sole discretion.
            </p>

            <p>
              By continuing to use{" "}
              <strong className="text-pink-400">
                sriangalammanmatrimony.com
              </strong>
              , you acknowledge and agree to the above terms regarding payments,
              cancellations, and refunds.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Returns;
