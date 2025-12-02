// import React from "react";

// const Privacy = () => {
//   return (
//     // <div className="min-h-screen bg-white py-12 px-6 md:px-24 font-display">
//     <div className="min-h-screen bg-[#fff8f0] text-gray-800 py-12 px-6 md:px-24 font-display">
//       <div className="max-w-5xl mx-auto text-gray-800 leading-8 space-y-6 mt-14">
//         <h1 className="text-3xl font-semibold text-center text-pink-600 mb-4">
//           Privacy Policy
//         </h1>
//         <div className="flex justify-center mb-10">
//           <div className="w-20 border-b-4 border-pink-500"></div>
//         </div>

//         <p>
//           This electronic website is being operated and owned by
//           <b> sriangalammanmatrimony.com </b> This PRIVACY POLICY STATEMENT is
//           made/published in the internet web site to protect the user’s privacy
//           and it is connected to our terms and conditions.
//         </p>

//         <p>
//           A user/member, when he is entering our web site after accepting our
//           full terms and conditions of sriangalammanmatrimony.com should provide
//           the mandatory information, he has the option of not providing the
//           information which is not mandatory. User/Member is solely responsible
//           for maintaining confidentiality of the User Name/Identity and User
//           Password and all activities and transmission/transactions performed by
//           the User through his/her user identity/name and shall be solely
//           responsible for carrying out any online or off-line transactions
//           involving credit/debit cards or such other forms of instruments or
//           documents for making such transactions. As such, while doing so any
//           negligence of your act, sriangalammanmatrimony.com assumes no
//           responsibility / liability for their improper use of information
//           relating to such usage of credit/debit cards used by the subscriber
//           online/offline.
//         </p>

//         <p>
//           sriangalammanmatrimony.com is connected / link to service partners,
//           such as servers/administrators. We may use your IP address and other
//           information provided by like Email address, Contact name, User-created
//           password, Address , Pin code, Telephone number or other contact number
//           etc; to help diagnose problems with our server, and to manage our Web
//           site. Your IP address may be also used to gather broad demographic
//           information. And the information will be used by us to contact you and
//           to deliver information to you that, in some cases, are targeted to
//           your interests, such as targeted banner advertisements, administrative
//           notices, product offerings, and communications relevant to your use of
//           the web site. To receive such information, you accept for our terms
//           and condition and privacy policy.
//         </p>

//         <p>
//           Unless otherwise you give your consent, it doesn’t sell, rent, share,
//           trade or give away or share with any third party. The users who enter
//           into site such as Builders, Agents/Brokers or any individual has
//           provided their contact information for advertisement on our portal
//           then users can contact them at their request through us.
//         </p>
//         <p>
//           Any changes in the privacy policy will be changed without any prior
//           notice to any type of users, of our web site. We suggest you to review
//           our privacy policy from time to time/ periodically, so as to see if
//           any changes are made.
//         </p>

//         <p>
//           sriangalammanmatrimony.com cannot be held liable for any errors or
//           inconsistencies. But we take every care to give you accuracy and
//           clarity of the information.
//         </p>
//         <p>
//           sriangalammanmatrimony.com disclaims any and all responsibility or
//           liability for the accuracy, content, completeness, legality,
//           reliability, or operability or availability of information or material
//           displayed on this web site by the third parties..
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Privacy;

import React from "react";

const Privacy = () => {
  return (
    <main className="relative min-h-screen text-white font-display py-10 sm:py-14 md:py-16 overflow-hidden">
      {/* 🌄 Brightened Background Image — consistent style */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/63/b9/49/63b9499ff68094530ff5b83563ac51bc.jpg')",
          backgroundPosition: "center 40%",
          filter: "blur(2px) brightness(0.55)",
          transform: "scale(1.08)",
          zIndex: 0,
        }}
      ></div>

      {/* 🖤 Overlay for contrast */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />

      {/* 🧾 Foreground Content — Centered with wide content area */}
      <div className="relative z-10 w-full flex justify-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 mt-[50px]">
        <div className="w-full max-w-6xl leading-relaxed">
          {/* Header — 50px gap, line retained, no subtext */}
          <header className="text-center mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              Privacy Policy
            </h1>
            <div className="flex justify-center mt-3 sm:mt-4">
              <div className="w-20 sm:w-24 border-b-4 border-pink-500"></div>
            </div>
          </header>

          {/* 📜 Content Section — Wider and left-aligned */}
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
              This website is operated and owned by{" "}
              <strong className="text-pink-400">
                sriangalammanmatrimony.com
              </strong>
              . This Privacy Policy explains how we collect, use, and protect
              your personal information. It forms part of our{" "}
              <strong className="text-pink-400">Terms &amp; Conditions</strong>.
            </p>

            <p>
              When a user registers on{" "}
              <strong className="text-pink-400">
                sriangalammanmatrimony.com
              </strong>
              , they must provide required information such as name, contact
              details, and email address. You are responsible for maintaining
              the confidentiality of your account credentials, including
              passwords and any financial information (such as debit or credit
              card details).{" "}
              <strong className="text-pink-400">
                sriangalammanmatrimony.com
              </strong>{" "}
              is not liable for misuse or loss of data caused by user
              negligence.
            </p>

            <p>
              Our platform may work with trusted partners, administrators, and
              service providers. We may collect your IP address, device details,
              and contact information to improve our website performance, manage
              user interactions, and provide personalized services or updates.
            </p>

            <p>
              Unless explicit consent is provided,{" "}
              <strong className="text-pink-400">
                sriangalammanmatrimony.com
              </strong>{" "}
              does not sell, rent, or disclose your personal data to third
              parties. Any contact information you choose to share publicly
              (such as phone number or email) may be visible to others based on
              your privacy preferences.
            </p>

            <p>
              We may send administrative, promotional, or service-related
              messages based on your activity. You may opt out of non-essential
              notifications at any time.
            </p>

            <p>
              We reserve the right to modify this Privacy Policy at any time.
              You are encouraged to check this page periodically to remain
              informed about updates or changes to our practices.
            </p>

            <p>
              While we strive for accuracy and transparency,{" "}
              <strong className="text-pink-400">
                sriangalammanmatrimony.com
              </strong>{" "}
              cannot be held responsible for errors or third-party content.
              Users should exercise discretion when sharing personal or
              financial information.
            </p>

            <p>
              By continuing to use this website, you consent to the collection
              and use of information in accordance with this Privacy Policy.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Privacy;
