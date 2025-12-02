// import React from "react";

// const Disclaimer = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#ecfdf5]  py-12 px-6 md:px-24 font-display overflow-hidden">

//       <div className="max-w-5xl mx-auto text-gray-800 leading-8 space-y-6 mt-14">
//         <h1 className="text-3xl font-semibold text-center text-pink-600 mb-4">
//           Disclaimer
//         </h1>
//         <div className="flex justify-center mb-10">
//           <div className="w-20 border-b-4 border-pink-500"></div>
//         </div>

//         <p>
//           sriangalammanmatrimony.com is not responsible for any incorrect or
//           inaccurate Content posted on the Site or in connection with the
//           sriangalammanmatrimony.com Service, whether caused by users visiting
//           the Site, Members or by any of the equipment or programming associated
//           with or utilized in the Service, nor for the conduct of any user
//           and/or Member of the sriangalammanmatrimony.com Service whether online
//           or offline.sriangalammanmatrimony.com assumes no responsibility for
//           any error, omission, interruption, deletion, defect, delay in
//           operation or transmission, communications line failure, theft or
//           destruction or unauthorized access to, or alteration of, user and/or
//           Member communications. sriangalammanmatrimony.com is not responsible
//           for any problems or technical malfunction of any telephone network or
//           lines, computer on-line-systems, servers or providers, computer
//           equipment, software, failure of email or players on account of
//           technical problems or traffic congestion on the Internet or at any
//           website or combination thereof, including injury or damage to users
//           and/or Members or to any other person's keralaweds related to or
//           resulting from participating or downloading materials in connection
//           with the sriangalammanmatrimony.com Site and/or in connection with the
//           sriangalammanmatrimony.com Service.
//         </p>

//         <p>
//           Under no circumstances will sriangalammanmatrimony.com be responsible
//           for any loss or damage to any person resulting from anyone's use of
//           the Site or the Service and/or any Content posted on the
//           sriangalammanmatrimony.com Site or transmitted to
//           sriangalammanmatrimony.com Members.
//         </p>

//         <p>
//           The exchange of profile(s) through or by sriangalammanmatrimony.com
//           Should not in any way be construed as any offer and/or recommendation
//           from/by sriangalammanmatrimony.com sriangalammanmatrimony.com Shall
//           not be responsible for any loss or damage to any individual arising
//           out of, or subsequent to, relations established pursuant to the use of
//           sriangalammanmatrimony.com The Site and the Service are provided
//           "AS-IS AVALIABLE BASIS" and sriangalammanmatrimony.com expressly
//           disclaims any warranty of fitness for a particular purpose or
//           non-infringement. sriangalammanmatrimony.com cannot guarantee and does
//           not promise any specific results from use of the Site and/or the
//           sriangalammanmatrimony.com Service.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Disclaimer;

import React from "react";

const Disclaimer = () => {
  return (
    <main className="relative min-h-screen text-white font-display py-10 sm:py-14 md:py-16 overflow-hidden">
      {/* 🌄 Brightened Background Image — visible but soft */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/1200x/70/4d/86/704d861e703809675b010cb3c432f670.jpg')",
          backgroundPosition: "center 45%",
          filter: "blur(0.8px) brightness(0.85)", // Brightened background
          transform: "scale(1.05)",
          zIndex: 0,
        }}
      ></div>

      {/* 🖤 Overlay for readability */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />

      {/* 📄 Foreground Content — centered and responsive */}
      <div className="relative z-10 w-full flex justify-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 mt-[50px]">
        <div className="w-full max-w-6xl leading-relaxed">
          {/* Header Section */}
          <header className="text-center mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              Disclaimer
            </h1>
            <div className="flex justify-center mt-3 sm:mt-4">
              <div className="w-20 sm:w-24 border-b-4 border-pink-500"></div>
            </div>
          </header>

          {/* 📜 Content Section — same layout as other pages */}
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
              <strong className="text-pink-400">
                sriangalammanmatrimony.com
              </strong>{" "}
              is not responsible for any incorrect or inaccurate content posted
              on the site or in connection with the{" "}
              <strong className="text-pink-400">
                sriangalammanmatrimony.com
              </strong>{" "}
              service, whether caused by users visiting the site, members, or by
              any of the equipment or programming associated with or utilized in
              the service. We are also not responsible for the conduct of any
              user or member of the service, whether online or offline.{" "}
              <strong className="text-pink-400">
                sriangalammanmatrimony.com
              </strong>{" "}
              assumes no responsibility for any error, omission, interruption,
              deletion, defect, delay in operation or transmission,
              communication line failure, theft, destruction, or unauthorized
              access to or alteration of user or member communications.
            </p>

            <p>
              <strong className="text-pink-400">
                sriangalammanmatrimony.com
              </strong>{" "}
              is not responsible for any technical malfunction or problem
              affecting telephone networks, computer systems, servers,
              providers, or software — including failures of email or data
              transmission caused by technical issues or internet congestion.
              This includes any injury or damage to users, members, or their
              data resulting from participation in or download of materials
              related to the{" "}
              <strong className="text-pink-400">
                sriangalammanmatrimony.com
              </strong>{" "}
              site or its services.
            </p>

            <p>
              Under no circumstances will{" "}
              <strong className="text-pink-400">
                sriangalammanmatrimony.com
              </strong>{" "}
              be responsible for any loss or damage to any person resulting from
              anyone’s use of the site or the service and/or any content posted
              or transmitted to members through the platform.
            </p>

            <p>
              The exchange of profiles through or by{" "}
              <strong className="text-pink-400">
                sriangalammanmatrimony.com
              </strong>{" "}
              should not be construed as an offer, recommendation, or guarantee
              of compatibility.{" "}
              <strong className="text-pink-400">
                sriangalammanmatrimony.com
              </strong>{" "}
              shall not be responsible for any loss, harm, or damage arising out
              of relationships formed through the site. The site and the service
              are provided strictly on an{" "}
              <strong className="text-pink-400">“AS-IS, AS-AVAILABLE”</strong>{" "}
              basis, and{" "}
              <strong className="text-pink-400">
                sriangalammanmatrimony.com
              </strong>{" "}
              expressly disclaims any warranty of fitness for a particular
              purpose, reliability, or non-infringement. We do not guarantee or
              promise any specific results from the use of our site or services.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Disclaimer;
