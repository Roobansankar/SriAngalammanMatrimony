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
