// // src/profile/BasicsLifestyle.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function BasicsLifestyle() {
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
//         const res = await axios.get("http://localhost:5000/api/auth/user", {
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

//   // Field mappings
//   const height = user.Height ?? user.Heightcm ?? "-";
//   const weight = user.Weight ?? "-";
//   const bloodGroup = user.BloodGroup || user.bloodgroup || "-";
//   const complexion = user.Complexion || user.complexion || "-";
//   const bodyType = user.Bodytype || user.bodytype || "-";
//   const diet = user.Diet || "-";
//   const smoke = user.Smoke ?? "-";
//   const drink = user.Drink ?? "-";
//   const specialCases =
//     user.spe_cases || user.spe_reason || user.SpecialCases || "-";
//   const hobbies = user.Hobbies || "-";
//   const otherHobbies = user.OtherHobbies || user.other_hobbies || "-";
//   const interests = user.Interests || "-";
//   const otherInterests = user.OtherInterests || user.other_interests || "-";
//   const achievement = user.achievement || user.AnyAchievement || "-";
//   const medicalHistory = user.medicalhistory || user.MedicalHistory || "-";
//   const passport = user.passport !== undefined ? String(user.passport) : "-";
//   const cardType = user.cardtype || user.CardType || "-";

//   return (
//     <div className="min-h-screen p-6 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#a17c5b] bg-fixed bg-cover">
//       <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-20">
//         <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center tracking-wide">
//           Basics & Lifestyle
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
//           <LabelValue label="Height" value={height} />
//           <LabelValue label="Weight" value={weight} />
//           <LabelValue label="Blood Group" value={bloodGroup} />
//           <LabelValue label="Complexion" value={complexion} />
//           <LabelValue label="Body Type" value={bodyType} />
//           <LabelValue label="Diet" value={diet} />
//           <LabelValue label="Smoke" value={smoke} />
//           <LabelValue label="Drink" value={drink} />
//           <LabelValue label="Special Cases" value={specialCases} />
//           <LabelValue label="Hobbies" value={hobbies} />
//           <LabelValue label="Other Hobbies" value={otherHobbies} />
//           <LabelValue label="Interests" value={interests} />
//           <LabelValue label="Other Interests" value={otherInterests} />
//           <LabelValue label="Any Achievement" value={achievement} />
//           <LabelValue label="Medical History" value={medicalHistory} />
//           <LabelValue label="Passport" value={passport} />
//           <LabelValue label="Card Type" value={cardType} />
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


// src/profile/BasicsLifestyle.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BasicsLifestyle() {
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
        const res = await axios.get("http://localhost:5000/api/auth/user", {
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

  if (loading) return <BasicsSkeleton />;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!user) return <div className="p-6">No user found</div>;

  // Field mappings
  const height = user.Height ?? user.Heightcm ?? "-";
  const weight = user.Weight ?? "-";
  const bloodGroup = user.BloodGroup || user.bloodgroup || "-";
  const complexion = user.Complexion || user.complexion || "-";
  const bodyType = user.Bodytype || user.bodytype || "-";
  const diet = user.Diet || "-";
  const smoke = user.Smoke ?? "-";
  const drink = user.Drink ?? "-";
  const specialCases =
    user.spe_cases || user.spe_reason || user.SpecialCases || "-";
  const hobbies = user.Hobbies || "-";
  const otherHobbies = user.OtherHobbies || user.other_hobbies || "-";
  const interests = user.Interests || "-";
  const otherInterests = user.OtherInterests || user.other_interests || "-";
  const achievement = user.achievement || user.AnyAchievement || "-";
  const medicalHistory = user.medicalhistory || user.MedicalHistory || "-";
  const passport = user.passport !== undefined ? String(user.passport) : "-";
  const cardType = user.cardtype || user.CardType || "-";

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#a17c5b] bg-fixed bg-cover">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-20">
        <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center tracking-wide">
          Basics & Lifestyle
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <LabelValue label="Height" value={height} />
          <LabelValue label="Weight" value={weight} />
          <LabelValue label="Blood Group" value={bloodGroup} />
          <LabelValue label="Complexion" value={complexion} />
          <LabelValue label="Body Type" value={bodyType} />
          <LabelValue label="Diet" value={diet} />
          <LabelValue label="Smoke" value={smoke} />
          <LabelValue label="Drink" value={drink} />
          <LabelValue label="Special Cases" value={specialCases} />
          <LabelValue label="Hobbies" value={hobbies} />
          <LabelValue label="Other Hobbies" value={otherHobbies} />
          <LabelValue label="Interests" value={interests} />
          <LabelValue label="Other Interests" value={otherInterests} />
          <LabelValue label="Any Achievement" value={achievement} />
          <LabelValue label="Medical History" value={medicalHistory} />
          <LabelValue label="Passport" value={passport} />
          <LabelValue label="Card Type" value={cardType} />
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

function BasicsSkeleton() {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#a17c5b] bg-fixed bg-cover">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-20">

        <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center tracking-wide">
          Basics & Lifestyle
        </h2>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {Array.from({ length: 17 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border bg-gradient-to-br from-white to-gray-50 shadow-sm"
            >
              <Skeleton className="h-3 w-24 mb-2" />
              <Skeleton className="h-5 w-40" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
