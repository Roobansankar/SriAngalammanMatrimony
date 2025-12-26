
// import React from "react";
// import { Link } from "react-router-dom";


// export const FeaturedProfiles = () => {
//   return (
//     <div>
//       <section className="py-20 bg-[#FFF8E1]">
//         <div className="container mx-auto px-6">
//           {/* Heading */}
//           <h2
//             data-aos="fade-down"
//             className="text-3xl md:text-4xl font-extrabold tracking-wide text-center mb-12 text-gray-900"
//           >
//             Welcome to{" "}
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-700 via-rose-600 to-red-600">
//               Bride & Groom Profiles
//             </span>
//           </h2>

//           {/* Profile Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//             {/* Priya */}
//             <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
//               <img
//                 alt="Priya"
//                 className="w-full h-64 object-cover"
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_WNKCBPJfwxpFa_RLIn_a74sgSYgQ47nuJCjklEZ9uYTYsdjOQOrFN9HT_TglUkUGiaFnGnRv39aF3iSN2OoUy1jvE549aWcJ2Z8vlaYo4Rc8tvWgs68_HeOiSFDRpLaqEOf4RZgRqvmvfarxxsnlAl6u-gv6b7eI5OO_qBdZi_4CLX9NH-SKzBgAbX4pwLzs3DXhk7xpUav-U30CS_bd8EkMipGq8hPLEYQHeHw6G6rVWvhosFjCV91Tuv8bLfOfen0SuvY1JM5U"
//               />
//               <div className="p-6 text-center">
//                 <p className="text-sm text-rose-600 font-semibold mb-1">
//                   Matri ID: KS10074
//                 </p>
//                 <h3 className="text-xl font-bold text-[#4d4d4d]">Priya, 28</h3>
//                 <p className="text-gray-600">IT Professional</p>

//                 <Link
//                   to="/login"
//                   className="inline-block mt-4 px-5 py-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-semibold rounded-full hover:from-pink-700 hover:to-rose-600 transition-all duration-300 shadow-md"
//                 >
//                   View Profile
//                 </Link>
//               </div>
//             </div>

//             {/* Arjun */}
//             <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
//               <img
//                 alt="Arjun"
//                 className="w-full h-64 object-cover"
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1I32bOMXRa4Fn9-qRZeJgx8edyvSOiYxcnrflfYfyHVLQKDtKceU6QN38_yIfuuDkP0KYxSVgv6TgyZRbtWD2DDzAB9KPZgcWK1mjqbs2p9zylGx8ZSFBdXqaen4uJNXzz57xXO3BONvc4rDUw7zid_Qx5XPkM0kXSNPDqdEoZeMN9qAYGZ6rfhn8t3FGhN3ZNOragp1Q9zCgozGwNrnC_9AZGyH0vhXHacCB0c5hMVv7Xkg_45-XROQ9JvmaRFaPztXuTitjm2K3"
//               />
//               <div className="p-6 text-center">
//                 <p className="text-sm text-rose-600 font-semibold mb-1">
//                   Matri ID: KS10075
//                 </p>
//                 <h3 className="text-xl font-bold text-[#4d4d4d]">Arjun, 32</h3>
//                 <p className="text-gray-600">Govt Employee</p>

//                 <Link
//                   to="/login"
//                   className="inline-block mt-4 px-5 py-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-semibold rounded-full hover:from-pink-700 hover:to-rose-600 transition-all duration-300 shadow-md"
//                 >
//                   View Profile
//                 </Link>
//               </div>
//             </div>

//             {/* Meera */}
//             <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
//               <img
//                 alt="Meera"
//                 className="w-full h-64 object-cover"
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw-QaCQWWW1ArIz8f970PDdft6Ku6SRT0gjQfd93TK57Nn8qDkM3rR5rQRPRjLoZxuF6AWw8hDRoH_kH97peBsBS7-9QbkrrnROrNGp1Fo-BhOW8rDDaPDMiR5TO0pNQtHeAHI1sDB-QJgtcwnkJnZAvesanqhY_fxsdMfF9WJ6eWU7ZTmfgIqQMcrDXjVUuTJRQw4qZYX0xuBJl_-fRyZjfddaET7Ou1sD6wsRyowb_q1zh6w6udAwQN0V2-ZyoqtCHNqSGPczgeS"
//               />
//               <div className="p-6 text-center">
//                 <p className="text-sm text-rose-600 font-semibold mb-1">
//                   Matri ID: KS10076
//                 </p>
//                 <h3 className="text-xl font-bold text-[#4d4d4d]">Meera, 25</h3>
//                 <p className="text-gray-600">Fashion & Jewellery</p>

//                 <Link
//                   to="/login"
//                   className="inline-block mt-4 px-5 py-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-semibold rounded-full hover:from-pink-700 hover:to-rose-600 transition-all duration-300 shadow-md"
//                 >
//                   View Profile
//                 </Link>
//               </div>
//             </div>

//             {/* Vikram */}
//             <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
//               <img
//                 alt="Vikram"
//                 className="w-full h-64 object-cover"
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-BRp-XGlJuJswtVsDQ_b9cy23_QuaOjVjdSKM-Pn6tkXuGB3mpewC4yAQtOd0sjj3JEwgR2jtjM68YRNTBhKy-rbeYmlTk2xv2tSFz1DkMpzkVA7k6zRGJniTgd38uREoBiDudweQ8PfCcco7s-z813uG_9o1WLS0DGKffTjQTL1Cw3_UUVZLrjbbSwl6j4czFGhHmA6wWg0nK7ZrhVh5x3L6RO-ylvGFOHoqSwrzyiooV4tCb3j4Q_XPv7n--uPbV4KdA5rw-rzv"
//               />
//               <div className="p-6 text-center">
//                 <p className="text-sm text-rose-600 font-semibold mb-1">
//                   Matri ID: KS10077
//                 </p>
//                 <h3 className="text-xl font-bold text-[#4d4d4d]">Vikram, 30</h3>
//                 <p className="text-gray-600">Business Owner</p>

//                 <Link
//                   to="/login"
//                   className="inline-block mt-4 px-5 py-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-semibold rounded-full hover:from-pink-700 hover:to-rose-600 transition-all duration-300 shadow-md"
//                 >
//                   View Profile
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const FeaturedProfiles = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE || "http://localhost:5000"}/api/admin/featured-profiles`)
      .then((res) => setProfiles(res.data.profiles))
      .catch(console.error);
  }, []);

  return (
    <section className="py-20 bg-[#FFF8E1]">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Featured Profiles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {profiles.map((p) => (
            <div
              key={p.MatriID}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={p.PhotoURL}
                alt={p.Name}
                className="w-full h-64 object-cover"
              />

              <div className="p-5 text-center">
                <p className="text-rose-600 text-sm font-semibold">
                  Matri ID: {p.MatriID}
                </p>
                <h3 className="font-bold text-xl">
                  {p.Name}, {p.Age}
                </h3>
                <p className="text-gray-600">{p.Occupation}</p>

                <Link
                  to="/login"
                  className="inline-block mt-3 px-4 py-2 bg-rose-500 text-white rounded-full"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
