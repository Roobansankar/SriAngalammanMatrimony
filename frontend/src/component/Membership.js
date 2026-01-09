// import React from "react";
// import { Link } from "react-router-dom";

// export default function MembershipPage() {
//   return (
//     <div className="font-display bg-[#fffafc] text-[#111]">
//       <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#fffafc]">
//         {/* Background glow */}
//         <div className="absolute inset-0 z-0 opacity-20">
//           <div className="absolute top-0 left-1/4 h-56 w-56 rounded-full bg-pink-300 blur-3xl" />
//           <div className="absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-amber-200 blur-3xl" />
//         </div>

//         <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 mt-16">
//           {/* Header */}
//           <header className="mb-10 text-center md:mb-16">
//             <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
//               Choose Your <span className="text-pink-600">Perfect Plan</span>
//             </h1>
//             <p className="mt-3 text-base text-gray-600">
//               Select the membership that best fits your journey.
//             </p>
//           </header>

//           {/* Plans Grid */}
//           <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
//             {/* Basic Plan - soft gradient */}
//             <div
//               className="flex flex-col rounded-xl border border-pink-200 p-6 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-xl
//                             bg-gradient-to-br from-pink-50 to-white min-h-[340px]"
//             >
//               <div className="flex-grow">
//                 <h2 className="font-display text-2xl font-bold text-gray-900">
//                   Basic
//                 </h2>
//                 <p className="mt-3 text-gray-600 text-sm">
//                   Essential access to start your journey.
//                 </p>

//                 <div className="my-6">
//                   <span className="font-display text-4xl font-bold text-gray-900">
//                     ₹1,500
//                   </span>
//                   <span className="text-gray-500 text-sm"></span>
//                 </div>

//                 <ul className="space-y-3 text-gray-800 text-sm">
//                   {[
//                     "Create and manage your profile",
//                     "Browse and view profiles",
//                     "Send interests to members",
//                   ].map((item) => (
//                     <li key={item} className="flex items-center">
//                       <svg
//                         className="mr-2 h-5 w-5 text-pink-600"
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

//               <Link
//                 to="/register"
//                 className="mt-6 inline-flex w-full items-center justify-center rounded-lg border-2 border-pink-600 bg-white px-5 py-2.5 text-sm font-semibold text-pink-600 transition-colors duration-200 hover:bg-pink-50"
//               >
//                 Choose Plan / Register
//               </Link>
//             </div>

//             {/* Premium Plan - bold gradient */}
//             <div
//               className="relative flex -translate-y-2 flex-col rounded-xl p-6 shadow-xl backdrop-blur-sm transition-all duration-300 min-h-[340px]
//                             bg-gradient-to-br from-pink-600 via-pink-500 to-rose-400 text-white border-0"
//             >
//               <div className="flex-grow">
//                 <h2 className="font-display text-2xl font-bold text-white">
//                   Premium
//                 </h2>
//                 <p className="mt-3 text-white/90 text-sm">
//                   Enjoy full access and connect faster with your matches.
//                 </p>

//                 <div className="my-6">
//                   <span className="font-display text-4xl font-bold text-white">
//                     ₹4,000
//                   </span>
//                   <span className="text-white/90 text-sm"></span>
//                 </div>

//                 <ul className="space-y-3 text-white text-sm">
//                   {[
//                     "All Basic features",
//                     "View contact details",
//                     "Unlimited messaging",
//                     "Priority profile visibility",
//                   ].map((item) => (
//                     <li key={item} className="flex items-center">
//                       <svg
//                         className="mr-2 h-5 w-5 text-white"
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

//               <Link
//                 to="/register"
//                 className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-pink-600 shadow-md transition-transform duration-150 hover:-translate-y-0.5"
//               >
//                 Choose Plan / Register
//               </Link>
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
            {/* ================= BASIC PLAN ================= */}
            <div className="flex flex-col rounded-xl border border-pink-200 p-6 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-pink-50 to-white min-h-[380px]">
              <div className="flex-grow">
                <h2 className="font-display text-2xl font-bold text-gray-900">
                  Basic
                </h2>

                <p className="mt-3 text-gray-600 text-sm">
                  Open for everyone to begin their journey.
                </p>

                <div className="my-6">
                  <span className="font-display text-4xl font-bold text-gray-900">
                    ₹1,500
                  </span>
                  <span className="text-gray-500 text-sm"> (One-time fee)</span>
                </div>

                <ul className="space-y-3 text-gray-800 text-sm">
                  {[
                    "Anyone can join",
                    "Create and manage profile",
                    "View only Basic member profiles",
                    "Send interests to members",
                  ].map((item) => (
                    <li key={item} className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-5 w-5 text-pink-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
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
                Choose Basic / Register
              </Link>
            </div>

            {/* ================= PREMIUM PLAN ================= */}
            <div className="relative flex -translate-y-2 flex-col rounded-xl p-6 shadow-xl backdrop-blur-sm transition-all duration-300 min-h-[380px] bg-gradient-to-br from-pink-600 via-pink-500 to-rose-400 text-white">
              <div className="flex-grow">
                <h2 className="font-display text-2xl font-bold">Premium</h2>

                <p className="mt-3 text-white/90 text-sm">
                  Exclusive access for elite & well-settled members.
                </p>

                <div className="my-6">
                  <span className="font-display text-4xl font-bold">
                    ₹4,000
                  </span>
                </div>

                {/* Eligibility */}
                <div className="mb-4 rounded-lg bg-white/15 p-3 text-xs">
                  <p className="font-semibold mb-1">Premium Eligibility</p>
                  <ul className="space-y-1">
                    <li>• Income above ₹5,00,000 per month</li>
                    <li>• Asset value above ₹10 Crore</li>
                    <li>• Well-settled family background</li>
                    <li>• High-profile / elite category</li>
                  </ul>
                </div>

                <ul className="space-y-3 text-sm">
                  {[
                    "Access to Basic & Premium profiles",
                    
                    "Unlimited messaging",
                    "Priority profile visibility",
                  ].map((item) => (
                    <li key={item} className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
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
                Apply for Premium
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
