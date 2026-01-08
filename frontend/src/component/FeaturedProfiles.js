// import axios from "axios";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { API } from "../config/api";

// export const FeaturedProfiles = () => {
//   const [profiles, setProfiles] = useState([]);

//   useEffect(() => {
//     axios
//       .get(`${API}/admin/featured-profiles`) 
//       .then((res) => setProfiles(res.data.profiles))
//       .catch(console.error);
//   }, []);

//   return (
//     <section className="py-20 bg-[#FFF8E1]">
//       <div className="container mx-auto px-6">
//         <h2 className="text-4xl font-bold text-center mb-12">
//           Featured Profiles
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
//           {profiles.map((p) => (
//             <div
//               key={p.MatriID}
//               className="bg-white rounded-xl shadow-md overflow-hidden"
//             >
//               <img
//                 src={p.PhotoURL}
//                 alt={p.Name}
//                 className="w-full h-64 object-cover"
//               />

//               <div className="p-5 text-center">
//                 <p className="text-rose-600 text-sm font-semibold">
//                   Matri ID: {p.MatriID}
//                 </p>
//                 <h3 className="font-bold text-xl">
//                   {p.Name}, {p.Age}
//                 </h3>
//                 <p className="text-gray-600">{p.Occupation}</p>

//                 <Link
//                   to="/login"
//                   className="inline-block mt-3 px-4 py-2 bg-rose-500 text-white rounded-full"
//                 >
//                   View Profile
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };






// import axios from "axios";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { API } from "../config/api";

// export const FeaturedProfiles = () => {
//   const [profiles, setProfiles] = useState([]);

//   useEffect(() => {
//     axios
//       .get(`${API}/admin/featured-profiles`) 
//       .then((res) => setProfiles(res.data.profiles))
//       .catch(console.error);
//   }, []);

//   return (
//     <section className="py-16 bg-white overflow-hidden">
//       <div className="container mx-auto px-6">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-gray-900">
//             Featured Profiles
//           </h2>
//         </div>

//         {/* Scrolling Row */}
//         <div className="mb-8 overflow-hidden">
//           <div className="flex gap-6 animate-scroll-right">
//             {profiles.slice(0, 4).map((p) => (
//               <div
//                 key={p.MatriID}
//                 className="flex-shrink-0 w-64 bg-gradient-to-br from-pink-50 to-rose-100 rounded-3xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300"
//               >
//                 <img
//                   src={p.PhotoURL}
//                   alt={p.Name}
//                   className="w-40 h-40 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-md"
//                 />
//                 <p className="text-rose-600 text-xs font-semibold mb-2">
//                   ID: {p.MatriID}
//                 </p>
//                 <h3 className="font-bold text-base text-gray-900 mb-1">
//                   {p.Name}, {p.Age}
//                 </h3>
//                 <p className="text-xs text-gray-600 mb-4">{p.Occupation}</p>

//                 <Link
//                   to="/login"
//                   className="inline-block px-6 py-2 bg-rose-500 text-white text-xs font-medium rounded-full hover:bg-rose-600 transition-all duration-200"
//                 >
//                   View Profile
//                 </Link>
//               </div>
//             ))}
//             {/* Duplicate for infinite scroll effect */}
//             {profiles.slice(0, 4).map((p) => (
//               <div
//                 key={`dup1-${p.MatriID}`}
//                 className="flex-shrink-0 w-64 bg-gradient-to-br from-pink-50 to-rose-100 rounded-3xl p-6 text-center shadow-lg"
//               >
//                 <img
//                   src={p.PhotoURL}
//                   alt={p.Name}
//                   className="w-40 h-40 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-md"
//                 />
//                 <p className="text-rose-600 text-xs font-semibold mb-2">
//                   ID: {p.MatriID}
//                 </p>
//                 <h3 className="font-bold text-base text-gray-900 mb-1">
//                   {p.Name}, {p.Age}
//                 </h3>
//                 <p className="text-xs text-gray-600 mb-4">{p.Occupation}</p>

//                 <Link
//                   to="/login"
//                   className="inline-block px-6 py-2 bg-rose-500 text-white text-xs font-medium rounded-full hover:bg-rose-600 transition-all duration-200"
//                 >
//                   View Profile
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes scroll-right {
//           0% {
//             transform: translateX(0);
//           }
//           100% {
//             transform: translateX(-50%);
//           }
//         }

//         .animate-scroll-right {
//           animation: scroll-right 30s linear infinite;
//         }

//         .animate-scroll-right:hover {
//           animation-play-state: paused;
//         }
//       `}</style>
//     </section>
//   );
// };




import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../config/api";

export const FeaturedProfiles = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/admin/featured-profiles`) 
      .then((res) => setProfiles(res.data.profiles))
      .catch(console.error);
  }, []);

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Profiles
          </h2>
        </div>

        {/* Scrolling Row */}
        <div className="mb-8 overflow-hidden">
          <div className="flex gap-6 animate-scroll-right">
            {profiles.slice(0, 6).map((p) => (
              <div
                key={p.MatriID}
                className="flex-shrink-0 w-64 bg-gradient-to-br from-pink-50 to-rose-100 rounded-3xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={p.PhotoURL}
                  alt={p.Name}
                  className="w-40 h-40 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-md"
                />
                <p className="text-rose-600 text-xs font-semibold mb-2">
                  ID: {p.MatriID}
                </p>
                <h3 className="font-bold text-base text-gray-900 mb-1">
                  {p.Name}, {p.Age}
                </h3>
                <p className="text-xs text-gray-600 mb-4">{p.Occupation}</p>

                <Link
                  to="/login"
                  className="inline-block px-6 py-2 bg-rose-500 text-white text-xs font-medium rounded-full hover:bg-rose-600 transition-all duration-200"
                >
                  View Profile
                </Link>
              </div>
            ))}
            {/* Duplicate for infinite scroll effect */}
            {profiles.slice(0, 6).map((p) => (
              <div
                key={`dup1-${p.MatriID}`}
                className="flex-shrink-0 w-64 bg-gradient-to-br from-pink-50 to-rose-100 rounded-3xl p-6 text-center shadow-lg"
              >
                <img
                  src={p.PhotoURL}
                  alt={p.Name}
                  className="w-40 h-40 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-md"
                />
                <p className="text-rose-600 text-xs font-semibold mb-2">
                  ID: {p.MatriID}
                </p>
                <h3 className="font-bold text-base text-gray-900 mb-1">
                  {p.Name}, {p.Age}
                </h3>
                <p className="text-xs text-gray-600 mb-4">{p.Occupation}</p>

                <Link
                  to="/login"
                  className="inline-block px-6 py-2 bg-rose-500 text-white text-xs font-medium rounded-full hover:bg-rose-600 transition-all duration-200"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-right {
          animation: scroll-right 30s linear infinite;
        }

        .animate-scroll-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};