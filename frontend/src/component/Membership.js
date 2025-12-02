// import React from "react";

// export default function MembershipPage() {
//   return (
//     <div className="font-display bg-[#fffafc] text-[#111]">
//       <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#fffafc]">
//         {/* Background glow */}
//         <div className="absolute inset-0 z-0 opacity-20">
//           <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-pink-300 blur-3xl" />
//           <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-amber-200 blur-3xl" />
//         </div>

//         <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
//           {/* Header */}
//           <header className="mb-12 text-center md:mb-20">
//             <h1 className="font-display text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
//               Choose Your <span className="text-pink-600">Perfect Plan</span>
//             </h1>
//             <p className="mt-4 text-lg text-gray-600">
//               Select the membership that best fits your journey.
//             </p>
//           </header>

//           {/* Plans Grid */}
//           <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
//             {/* Basic Plan */}
//             <div className="flex flex-col rounded-xl border border-pink-200 bg-white p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
//               <div className="flex-grow">
//                 <h2 className="font-display text-3xl font-bold text-gray-900">
//                   Basic
//                 </h2>
//                 <p className="mt-4 text-gray-600">
//                   Essential access to start your journey.
//                 </p>

//                 <div className="my-8">
//                   <span className="font-display text-5xl font-bold text-gray-900">
//                     ₹1,500
//                   </span>
//                   <span className="text-gray-500"> / 3 months</span>
//                 </div>

//                 <ul className="space-y-4 text-gray-800">
//                   {[
//                     "Create and manage your profile",
//                     "Browse and view profiles",
//                     "Send interests to members",
//                   ].map((item) => (
//                     <li key={item} className="flex items-center">
//                       <svg
//                         className="mr-3 h-6 w-6 text-pink-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           d="M5 13l4 4L19 7"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                         />
//                       </svg>
//                       {item}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <button className="mt-8 w-full rounded-lg bg-pink-100 px-6 py-3 font-semibold text-pink-700 transition-colors duration-300 hover:bg-pink-200">
//                 Choose Plan
//               </button>
//             </div>

//             {/* Premium Plan */}
//             <div className="relative flex -translate-y-4 flex-col rounded-xl border-2 border-pink-600 bg-white p-8 shadow-2xl backdrop-blur-sm transition-all duration-300">
//               <div className="absolute top-0 right-8 -translate-y-1/2 rounded-full bg-pink-600 px-4 py-1.5 text-sm font-semibold text-white shadow">
//                 Recommended
//               </div>

//               <div className="flex-grow">
//                 <h2 className="font-display text-3xl font-bold text-gray-900">
//                   Premium
//                 </h2>
//                 <p className="mt-4 text-gray-600">
//                   Enjoy full access and connect faster with your matches.
//                 </p>

//                 <div className="my-8">
//                   <span className="font-display text-5xl font-bold text-gray-900">
//                     ₹4,000
//                   </span>
//                   <span className="text-gray-500"> / 6 months</span>
//                 </div>

//                 <ul className="space-y-4 text-gray-800">
//                   {[
//                     "All Basic features",
//                     "View contact details",
//                     "Unlimited messaging",
//                     "Priority profile visibility",
//                   ].map((item) => (
//                     <li key={item} className="flex items-center">
//                       <svg
//                         className="mr-3 h-6 w-6 text-pink-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           d="M5 13l4 4L19 7"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                         />
//                       </svg>
//                       {item}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <button className="mt-8 w-full rounded-lg bg-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-700">
//                 Choose Plan
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { Link } from "react-router-dom";

export default function MembershipPage() {
  return (
    <div className="font-display bg-[#fffafc] text-[#111]">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#fffafc]">
        {/* Background glow */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-1/4 h-56 w-56 rounded-full bg-pink-300 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-amber-200 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 mt-16">
          {/* Header */}
          <header className="mb-10 text-center md:mb-16">
            <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
              Choose Your <span className="text-pink-600">Perfect Plan</span>
            </h1>
            <p className="mt-3 text-base text-gray-600">
              Select the membership that best fits your journey.
            </p>
          </header>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
            {/* Basic Plan - soft gradient */}
            <div
              className="flex flex-col rounded-xl border border-pink-200 p-6 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-xl
                            bg-gradient-to-br from-pink-50 to-white min-h-[340px]"
            >
              <div className="flex-grow">
                <h2 className="font-display text-2xl font-bold text-gray-900">
                  Basic
                </h2>
                <p className="mt-3 text-gray-600 text-sm">
                  Essential access to start your journey.
                </p>

                <div className="my-6">
                  <span className="font-display text-4xl font-bold text-gray-900">
                    ₹1,500
                  </span>
                  <span className="text-gray-500 text-sm"></span>
                </div>

                <ul className="space-y-3 text-gray-800 text-sm">
                  {[
                    "Create and manage your profile",
                    "Browse and view profiles",
                    "Send interests to members",
                  ].map((item) => (
                    <li key={item} className="flex items-center">
                      <svg
                        className="mr-2 h-5 w-5 text-pink-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/register"
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg border-2 border-pink-600 bg-white px-5 py-2.5 text-sm font-semibold text-pink-600 transition-colors duration-200 hover:bg-pink-50"
              >
                Choose Plan / Register
              </Link>
            </div>

            {/* Premium Plan - bold gradient */}
            <div
              className="relative flex -translate-y-2 flex-col rounded-xl p-6 shadow-xl backdrop-blur-sm transition-all duration-300 min-h-[340px]
                            bg-gradient-to-br from-pink-600 via-pink-500 to-rose-400 text-white border-0"
            >
              <div className="flex-grow">
                <h2 className="font-display text-2xl font-bold text-white">
                  Premium
                </h2>
                <p className="mt-3 text-white/90 text-sm">
                  Enjoy full access and connect faster with your matches.
                </p>

                <div className="my-6">
                  <span className="font-display text-4xl font-bold text-white">
                    ₹4,000
                  </span>
                  <span className="text-white/90 text-sm"></span>
                </div>

                <ul className="space-y-3 text-white text-sm">
                  {[
                    "All Basic features",
                    "View contact details",
                    "Unlimited messaging",
                    "Priority profile visibility",
                  ].map((item) => (
                    <li key={item} className="flex items-center">
                      <svg
                        className="mr-2 h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/register"
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-pink-600 shadow-md transition-transform duration-150 hover:-translate-y-0.5"
              >
                Choose Plan / Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
