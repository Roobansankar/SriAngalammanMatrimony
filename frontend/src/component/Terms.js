
import React from "react";

const TermsConditions = () => {
  return (
    <main className="relative min-h-screen text-white font-display py-10 sm:py-14 md:py-16 overflow-hidden">
      {/* 🌄 Brightened Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/5a/23/53/5a2353e04ee20428123e16e4ab44b880.jpg')",
          backgroundPosition: "center 35%",
          filter: "blur(1.5px) brightness(0.55)",
          transform: "scale(1.05)",
          zIndex: 0,
        }}
      ></div>

      {/* 🖤 Overlay for readability */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />

      {/* 🧾 Foreground Content — wider and centered */}
      <div className="relative z-10 w-full flex justify-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 mt-[50px]">
        <div className="w-full max-w-6xl leading-relaxed">
          {/* Header Section */}
          <header className="text-center mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              Terms &amp; Conditions
            </h1>
            <div className="flex justify-center mt-3 sm:mt-4">
              <div className="w-20 sm:w-24 border-b-4 border-pink-500"></div>
            </div>
          </header>

          {/* 📜 Content Section */}
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
              Welcome to{" "}
              <strong className="text-pink-400">
                sriangalammanmatrimony.com
              </strong>
              . To use this website (“Site”), you must register as a member
              (“Member”) and agree to these Terms of Use (“Agreement”). If you
              wish to communicate with other Members and use our services,
              please read these Terms carefully. This Agreement outlines the
              legally binding terms for your membership. Continued use of the
              Site implies acceptance of any updates or revisions to these
              Terms.
            </p>

            {/* Section 1 */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-pink-400 mt-5 sm:mt-6 mb-2">
                1. Eligibility
              </h2>
              <p>
                You must be at least <strong>18 years of age</strong> to
                register as a member. Membership is void where prohibited by
                law. By using the Site, you represent that you have the right,
                authority, and capacity to enter into this Agreement and will
                abide by its terms.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-pink-400 mt-5 sm:mt-6 mb-2">
                2. Term
              </h2>
              <p>
                This Agreement remains effective while you use the Site or are a
                Member. You may terminate your membership anytime through your
                account settings. The platform may suspend or terminate your
                account for violations or misuse without prior notice.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-pink-400 mt-5 sm:mt-6 mb-2">
                3. Non-Commercial Use by Members
              </h2>
              <p>
                This Site is intended for personal use only. Commercial use of
                content, advertisements, or solicitations is prohibited.
                Violations may result in suspension or legal action.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-pink-400 mt-5 sm:mt-6 mb-2">
                4. Other Terms of Use by Members
              </h2>
              <p>
                Members must not send spam, use automated tools, or scripts to
                interact with the Site. Maintain respectful communication.
                Violations can lead to suspension or permanent removal.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-pink-400 mt-5 sm:mt-6 mb-2">
                5. Limitation on Liability
              </h2>
              <p>
                <strong className="text-pink-400">
                  sriangalammanmatrimony.com
                </strong>{" "}
                is not liable for any direct or indirect damages arising from
                Site usage. The Site is provided “as-is” without warranties of
                any kind. We do not guarantee uninterrupted service or
                error-free operation.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-pink-400 mt-5 sm:mt-6 mb-2">
                6. Privacy
              </h2>
              <p>
                Your data is protected as per our{" "}
                <strong className="text-pink-400">Privacy Policy</strong>. We do
                not sell or share your data. Please exercise caution when
                sharing personal details with other Members.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-pink-400 mt-5 sm:mt-6 mb-2">
                7. Indemnity
              </h2>
              <p>
                You agree to indemnify and hold harmless{" "}
                <strong className="text-pink-400">
                  sriangalammanmatrimony.com
                </strong>{" "}
                and its affiliates from any claims or damages arising from your
                use of the Site or violation of these Terms.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-pink-400 mt-5 sm:mt-6 mb-2">
                8. Other
              </h2>
              <p>
                By becoming a Member, you consent to receive essential account
                communications. Promotional messages can be unsubscribed
                anytime. These Terms form the complete agreement between you and{" "}
                <strong className="text-pink-400">
                  sriangalammanmatrimony.com
                </strong>
                .
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default TermsConditions;
