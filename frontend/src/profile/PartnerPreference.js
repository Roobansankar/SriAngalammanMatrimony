// // src/profile/PartnerPreference.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function PartnerPreference() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const email = localStorage.getItem("loggedInEmail");
//     if (!email) {
//       navigate("/login");
//       return;
//     }

//     const fetchUser = async () => {
//       try {
//         const res = await axios.get(`${process.env.REACT_APP_API_BASE || "http://localhost:5000"}/api/auth/user`, {
//           params: { email },
//         });

//         if (res.data?.success && res.data.user) {
//           setUser(res.data.user);
//           localStorage.setItem("userData", JSON.stringify(res.data.user));
//         } else {
//           localStorage.removeItem("loggedInEmail");
//           navigate("/login");
//         }
//       } catch (err) {
//         console.error("fetch user error", err);
//         setError("Unable to fetch profile");
//         localStorage.removeItem("loggedInEmail");
//         navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [navigate]);

//   if (loading) return <div className="p-6">Loading...</div>;
//   if (error) return <div className="p-6 text-red-600">{error}</div>;
//   if (!user) return <div className="p-6">No user found</div>;

//   // Pref fields
//   const maritalStatusPref =
//     user.PE_MaritalStatus ||
//     user.PE_HaveChildren ||
//     user.Looking ||
//     user.Maritalstatus ||
//     "-";

//   const ageFrom = user.PE_FromAge || "-";
//   const ageTo = user.PE_ToAge || "-";

//   const heightFrom = user.PE_from_Height || user.PE_Height2 || "-";
//   const heightTo = user.PE_to_Height || "-";

//   const religionPref = user.PE_Religion || "-";
//   const castePref = user.PE_Caste || user.PE_subcaste || "-";
//   const complexionPref = user.PE_Complexion || "-";

//   const residencyStatusPref =
//     user.PE_Residentstatus || user.PE_ResidentStatus || "-";
//   const countryPref =
//     user.PE_Countrylivingin || user.PE_Country || user.PE_Countryliving || "-";
//   const statePref = user.PE_State || "-";
//   const cityPref = user.PE_City || "-";

//   const educationPref = user.PE_Education || "-";
//   const occupationPref =
//     user.PE_Occupation || user.PE_Occuption || user.PE_Occupation || "-";

//   const partnerExpectations =
//     user.PartnerExpectations || user.PartnerExpectations_new || "-";

//   return (
//     <div className="min-h-screen p-6 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#a17c5b] bg-fixed bg-cover">
//       <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-20">
//         <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center tracking-wide">
//           Partner Preference
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
//           <LabelValue
//             label="Marital Status (Preferred)"
//             value={maritalStatusPref}
//           />
//           <LabelValue label="Age From" value={ageFrom} />
//           <LabelValue label="Age To" value={ageTo} />
//           <LabelValue label="Height From" value={heightFrom} />
//           <LabelValue label="Height To" value={heightTo} />
//           <LabelValue label="Religion" value={religionPref} />
//           <LabelValue label="Caste" value={castePref} />
//           <LabelValue label="Complexion" value={complexionPref} />
//           <LabelValue label="Residency Status" value={residencyStatusPref} />
//           <LabelValue label="Country (Preferred)" value={countryPref} />
//           <LabelValue label="State (Preferred)" value={statePref} />
//           <LabelValue label="City (Preferred)" value={cityPref} />
//           <LabelValue label="Education (Preferred)" value={educationPref} />
//           <LabelValue label="Occupation (Preferred)" value={occupationPref} />

//           {/* Partner Expectations - Full Width Box */}
//           <div className="col-span-1 sm:col-span-2 md:col-span-3 p-4 rounded-xl border bg-gradient-to-br from-white to-gray-50 shadow-sm">
//             <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
//               Partner Expectations
//             </div>
//             <div className="text-base font-semibold text-gray-800 mt-1 break-words">
//               {partnerExpectations}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function LabelValue({ label, value }) {
//   return (
//     <div className="p-4 rounded-xl border bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition">
//       <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
//         {label}
//       </div>
//       <div className="text-base font-semibold text-gray-800 mt-1 break-words">
//         {value ?? "-"}
//       </div>
//     </div>
//   );
// }


// src/profile/PartnerPreference.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PartnerPreference() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("loggedInEmail");
    if (!email) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE || "http://localhost:5000"}/api/auth/user`, {
          params: { email },
        });

        if (res.data?.success && res.data.user) {
          setUser(res.data.user);
          localStorage.setItem("userData", JSON.stringify(res.data.user));
        } else {
          localStorage.removeItem("loggedInEmail");
          navigate("/login");
        }
      } catch (err) {
        console.error("fetch user error", err);
        setError("Unable to fetch profile");
        localStorage.removeItem("loggedInEmail");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) return <PartnerPrefSkeleton />;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!user) return <div className="p-6">No user found</div>;

  // Pref fields
  const maritalStatusPref =
    user.PE_MaritalStatus ||
    user.PE_HaveChildren ||
    user.Looking ||
    user.Maritalstatus ||
    "-";

  const ageFrom = user.PE_FromAge || "-";
  const ageTo = user.PE_ToAge || "-";

  const heightFrom = user.PE_from_Height || user.PE_Height2 || "-";
  const heightTo = user.PE_to_Height || "-";

  const religionPref = user.PE_Religion || "-";
  const castePref = user.PE_Caste || user.PE_subcaste || "-";
  const complexionPref = user.PE_Complexion || "-";

  const residencyStatusPref =
    user.PE_Residentstatus || user.PE_ResidentStatus || "-";
  const countryPref =
    user.PE_Countrylivingin || user.PE_Country || user.PE_Countryliving || "-";
  const statePref = user.PE_State || "-";
  const cityPref = user.PE_City || "-";

  const educationPref = user.PE_Education || "-";
  const occupationPref =
    user.PE_Occupation || user.PE_Occuption || user.PE_Occupation || "-";

  const partnerExpectations =
    user.PartnerExpectations || user.PartnerExpectations_new || "-";

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#a17c5b] bg-fixed bg-cover font-display">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-20">
        <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center tracking-wide">
          Partner Preference
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <LabelValue
            label="Marital Status (Preferred)"
            value={maritalStatusPref}
          />
          <LabelValue label="Age From" value={ageFrom} />
          <LabelValue label="Age To" value={ageTo} />
          <LabelValue label="Height From" value={heightFrom} />
          <LabelValue label="Height To" value={heightTo} />
          <LabelValue label="Religion" value={religionPref} />
          <LabelValue label="Caste" value={castePref} />
          <LabelValue label="Complexion" value={complexionPref} />
          <LabelValue label="Residency Status" value={residencyStatusPref} />
          <LabelValue label="Country (Preferred)" value={countryPref} />
          <LabelValue label="State (Preferred)" value={statePref} />
          <LabelValue label="City (Preferred)" value={cityPref} />
          <LabelValue label="Education (Preferred)" value={educationPref} />
          <LabelValue label="Occupation (Preferred)" value={occupationPref} />

          {/* Full-width section */}
          <div className="col-span-1 sm:col-span-2 md:col-span-3 p-4 rounded-xl border bg-gradient-to-br from-white to-gray-50 shadow-sm">
            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
              Partner Expectations
            </div>
            <div className="text-base font-semibold text-gray-800 mt-1 break-words">
              {partnerExpectations}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------- LABEL COMPONENT ---------------------- */

function LabelValue({ label, value }) {
  return (
    <div className="p-4 rounded-xl border bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition">
      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
        {label}
      </div>
      <div className="text-base font-semibold text-gray-800 mt-1 break-words">
        {value ?? "-"}
      </div>
    </div>
  );
}

/* ---------------------- SKELETON COMPONENTS ---------------------- */

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-gray-300 rounded-md ${className}`} />;
}

function PartnerPrefSkeleton() {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#a17c5b] bg-fixed bg-cover">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-20">

        <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center tracking-wide">
          Partner Preference
        </h2>

        {/* Skeleton grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">

          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border bg-gradient-to-br from-white to-gray-50 shadow-sm"
            >
              <Skeleton className="h-3 w-28 mb-2" />
              <Skeleton className="h-5 w-40" />
            </div>
          ))}

          {/* Full-width skeleton */}
          <div className="col-span-1 sm:col-span-2 md:col-span-3 p-4 rounded-xl border bg-gradient-to-br from-white to-gray-50 shadow-sm">
            <Skeleton className="h-3 w-40 mb-2" />
            <Skeleton className="h-5 w-full" />
          </div>

        </div>
      </div>
    </div>
  );
}
