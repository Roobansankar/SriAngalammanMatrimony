import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function About1() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="py-12 bg-[#FFF8E1] overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        {/* <div className="text-center mb-10">
          <h2
            data-aos="fade-down"
            className="text-3xl md:text-4xl font-extrabold tracking-wide text-gray-900 mb-2"
          >
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-700 via-rose-600 to-red-600">
              Sriangalamman Matrimony
            </span>
          </h2>
          <div
            className="w-16 h-1 bg-blue-600 mx-auto rounded-full"
            data-aos="fade-up"
          ></div>
        </div> */}

        <div className="text-center mb-10 py-10 bg-[#FFF8E1]">
          <h2
            data-aos="fade-down"
            className="text-3xl md:text-4xl font-extrabold tracking-wide text-gray-800 mb-2"
          >
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-700 via-rose-600 to-red-600">
              Sriangalamman Matrimony
            </span>
          </h2>

          {/* Animated underline */}
          <div
            data-aos="fade-up"
            className="mx-auto mt-2 h-1 w-0 animate-[grow_1.2s_ease-in-out_forwards] bg-gradient-to-r from-rose-600 via-pink-600 to-red-500 rounded-full"
          ></div>

          <style jsx>{`
            @keyframes grow {
              from {
                width: 0;
              }
              to {
                width: 4rem; /* equals w-16 */
              }
            }
          `}</style>
        </div>

        <div
          data-aos="fade-up"
          className="flex flex-col-reverse md:flex-row items-center md:items-start gap-8 md:gap-12"
        >
          <div data-aos="fade-right" className="w-full md:w-2/3">
            <p className="mb-4 text-gray-800">
              <span className="font-semibold">Sriangalamman Matrimony</span> is
              a trusted matrimonial service that helps community members across
              India and worldwide find meaningful, long-term matches through
              verified profiles and thoughtful matchmaking.
            </p>

            <p className="mb-4 text-gray-800 leading-relaxed">
              We combine modern search features with respect for traditional
              values — dedicated support, safety checks, and easy-to-use tools
              make the process smooth and respectful.
            </p>

            <p className="mb-4 text-gray-800 leading-relaxed">
              Our platform is designed to celebrate love and commitment,
              connecting hearts with understanding and compassion.
            </p>

            <p className="mb-6 text-gray-800 leading-relaxed">
              Begin your journey today and let Sriangalamman Matrimony help you
              find a partner who complements your life beautifully.
            </p>

            <Link
              to="/about"
              data-aos="zoom-in"
              className="inline-block bg-gradient-to-r from-pink-700 to-rose-600 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
              aria-label="Read more about Sriangalamman Matrimony"
            >
              Read More
            </Link>
          </div>

          <div
            data-aos="fade-left"
            className="w-full md:w-1/3 flex justify-center md:justify-end"
          >
            <img
              src="https://i.pinimg.com/736x/cf/84/91/cf8491c803cdf39e607bb66679b4738b.jpg"
              alt="Matrimony"
              className="w-64 md:w-72 lg:w-80 h-72 md:h-80 lg:h-96 object-cover rounded-2xl shadow-sm"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// import React, { useEffect } from "react";
// import { Link } from "react-router-dom";
// import AOS from "aos";
// import "aos/dist/aos.css";

// export default function About1() {
//   useEffect(() => {
//     AOS.init({ duration: 800, once: true });
//   }, []);

//   return (
//     <section className="py-12 bg-[#FFF8E1]">
//       <div className="container mx-auto px-6 md:px-12">
//         <h2
//           data-aos="fade-down"
//           className="text-center text-3xl md:text-4xl font-black tracking-wide bg-gradient-to-r from-pink-800 via-rose-700 to-red-600 bg-clip-text text-transparent mb-8 drop-shadow-sm"
//         >
//           Welcome To Sriangalamman Matrimony
//         </h2>

//         <div
//           data-aos="fade-up"
//           className="flex flex-col-reverse md:flex-row items-center md:items-start gap-8 md:gap-12"
//         >
//           <div data-aos="fade-right" className="w-full md:w-2/3">
//             <p className="mb-4 text-gray-800">
//               <span className="font-semibold">Sriangalamman Matrimony</span> is
//               a trusted matrimonial service that helps community members across
//               India and worldwide find meaningful, long-term matches through
//               verified profiles and thoughtful matchmaking.
//             </p>

//             <p className="mb-4 text-gray-800 leading-relaxed">
//               We combine modern search features with respect for traditional
//               values — dedicated support, safety checks, and easy-to-use tools
//               make the process smooth and respectful.
//             </p>

//             <p className="mb-4 text-gray-800 leading-relaxed">
//               Our platform is designed to celebrate love and commitment,
//               connecting hearts with understanding and compassion.
//             </p>

//             <p className="mb-6 text-gray-800 leading-relaxed">
//               Begin your journey today and let Sriangalamman Matrimony help you
//               find a partner who complements your life beautifully.
//             </p>

//             <Link
//               to="/about"
//               data-aos="zoom-in"
//               className="inline-block bg-gradient-to-r from-pink-700 to-rose-600 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
//               aria-label="Read more about Sriangalamman Matrimony"
//             >
//               Read More
//             </Link>
//           </div>

//           <div
//             data-aos="fade-left"
//             className="w-full md:w-1/3 flex justify-center md:justify-end"
//           >
//             <img
//               src="https://i.pinimg.com/1200x/8e/83/31/8e83313ac0f4c16de9da2f867e92f6cf.jpg"
//               alt="Matrimony"
//               className="w-64 md:w-72 lg:w-80 h-64 md:h-72 lg:h-80 object-cover rounded-2xl shadow-sm"
//               loading="lazy"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
