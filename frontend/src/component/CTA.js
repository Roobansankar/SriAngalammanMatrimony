// import React from "react";

// const CTA = () => {
//   return (
//     <div>
//       {" "}
//       {/* <!-- CTA --> */}
//       <section className="py-16 bg-[#7b1c2e] text-white text-center mb-20">
//         <div className="container mx-auto px-6">
//           <h2 className="text-3xl md:text-4xl font-bold mb-6">
//             Ready to Begin Your Sacred Journey?
//           </h2>
//           <p className="text-xl max-w-2xl mx-auto mb-10 opacity-90">
//             Join thousands of families who have found blessed unions through{" "}
//             <span className="font-semibold text-yellow-300">
//               Sri Angalamman Matrimony
//             </span>
//           </p>

//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <button className="bg-yellow-400 hover:bg-yellow-500 text-[#7b1c2e] font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105">
//               Register Free
//             </button>

//             <button className="border-2 border-yellow-400 hover:bg-yellow-400/20 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105">
//               Contact Us
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default CTA;

import React from "react";

const CTA = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-[#FFD6A5] via-[#FFE6B7] to-[#FFF8E1] text-[#3B0A0A] text-center mb-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-[#6A1B1B]">
          Ready to Begin Your Sacred Journey?
        </h2>

        <p className="text-xl max-w-2xl mx-auto mb-10 text-[#4E342E] opacity-90">
          Join thousands of families who have found blessed unions through{" "}
          <span className="font-semibold text-[#C2185B]">
            Sri Angalamman Matrimony
          </span>
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-[#C2185B] hover:bg-[#AD1457] text-white font-bold py-3 px-8 rounded-full shadow-md transition duration-300 transform hover:scale-105">
            Register Free
          </button>

          <button className="border-2 border-[#C2185B] hover:bg-[#C2185B]/10 text-[#6A1B1B] font-bold py-3 px-8 rounded-full shadow-md transition duration-300 transform hover:scale-105">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
