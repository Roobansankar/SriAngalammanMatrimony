// // src/profile/FamilyDetails.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function FamilyDetails() {
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

//   // Field mappings & fallbacks (based on your sample API)
//   const familyValues = user.Familyvalues || user.FamilyValues || "-";
//   const familyType = user.FamilyType || "-";
//   const familyStatus = user.FamilyStatus || "-";
//   const motherTongue =
//     user.mother_tounge || user.MotherTongue || user.PE_MotherTongue || "-";

//   const noOfBrothers = user.noofbrothers ?? user.noyubrothers ?? "-";
//   const noOfBrothersMarried = user.nbm ?? user.noofbrothersmarried ?? "-";
//   const noOfSisters = user.noofsisters ?? user.noyusisters ?? "-";
//   const noOfSistersMarried = user.nsm ?? user.noofsistersmarried ?? "-";

//   const fatherName =
//     user.Fathername || user.fathername || user.fatherName || "-";
//   const fatherOccupation =
//     user.Fathersoccupation ||
//     user.FathersOccupation ||
//     user.fathersoccupation ||
//     "-";
//   const motherName = user.Mothersname || user.mothername || "-";
//   const motherOccupation =
//     user.Mothersoccupation || user.MothersOccupation || "-";

//   const parentsStay =
//     user.parents_stay || user.ParentsStay || user.parentsStay || "-";
//   const familyWealth =
//     user.family_wealth || user.Family_Wealth || user.FamilyWealth || "-";
//   const aboutFamily =
//     user.FamilyDetails || user.FamilyDetails_new || user.aboutus || "-";
//   const familyMedicalHistory =
//     user.familymedicalhistory || user.FamilyMedicalHistory || "-";

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 font-display">
//       <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-20">
//         <h2 className="text-2xl font-bold mb-4">Family Details</h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <LabelValue label="Family Values" value={familyValues} />
//           <LabelValue label="Family Type" value={familyType} />
//           <LabelValue label="Family Status" value={familyStatus} />
//           <LabelValue label="Mother Tongue" value={motherTongue} />

//           <LabelValue label="No. of Brothers" value={noOfBrothers} />
//           <LabelValue
//             label="No. of Brothers Married"
//             value={noOfBrothersMarried}
//           />
//           <LabelValue label="No. of Sisters" value={noOfSisters} />
//           <LabelValue
//             label="No. of Sisters Married"
//             value={noOfSistersMarried}
//           />

//           <LabelValue label="Father Name" value={fatherName} />
//           <LabelValue label="Father Occupation" value={fatherOccupation} />
//           <LabelValue label="Mother Name" value={motherName} />
//           <LabelValue label="Mother Occupation" value={motherOccupation} />

//           <LabelValue label="Parents Stay" value={parentsStay} />
//           <LabelValue label="Your Family Wealth" value={familyWealth} />
//           <LabelValue label="About Your Family" value={aboutFamily} />
//           <LabelValue
//             label="Family Medical History"
//             value={familyMedicalHistory}
//           />
//         </div>

//         <div className="mt-6 text-sm text-gray-600">
//           Tip: If any fields look empty, share the exact MySQL column names and
//           I’ll remap exactly to your DB columns.
//         </div>
//       </div>
//     </div>
//   );
// }

// function LabelValue({ label, value }) {
//   return (
//     <div className="border p-3 rounded">
//       <div className="text-xs text-gray-500">{label}</div>
//       <div className="text-sm font-medium break-words">
//         {value === null || value === "" ? "-" : String(value)}
//       </div>
//     </div>
//   );
// }

// src/profile/FamilyDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FamilyDetails() {
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

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!user) return <div className="p-6">No user found</div>;

  // Field mappings
  const familyValues = user.Familyvalues || user.FamilyValues || "-";
  const familyType = user.FamilyType || "-";
  const familyStatus = user.FamilyStatus || "-";
  const motherTongue =
    user.mother_tounge || user.MotherTongue || user.PE_MotherTongue || "-";

  const noOfBrothers = user.noofbrothers ?? user.noyubrothers ?? "-";
  const noOfBrothersMarried = user.nbm ?? user.noofbrothersmarried ?? "-";
  const noOfSisters = user.noofsisters ?? user.noyusisters ?? "-";
  const noOfSistersMarried = user.nsm ?? user.noofsistersmarried ?? "-";

  const fatherName =
    user.Fathername || user.fathername || user.fatherName || "-";
  const fatherOccupation =
    user.Fathersoccupation ||
    user.FathersOccupation ||
    user.fathersoccupation ||
    "-";
  const motherName = user.Mothersname || user.mothername || "-";
  const motherOccupation =
    user.Mothersoccupation || user.MothersOccupation || "-";

  const parentsStay =
    user.parents_stay || user.ParentsStay || user.parentsStay || "-";
  const familyWealth =
    user.family_wealth || user.Family_Wealth || user.FamilyWealth || "-";
  const aboutFamily =
    user.FamilyDetails || user.FamilyDetails_new || user.aboutus || "-";
  const familyMedicalHistory =
    user.familymedicalhistory || user.FamilyMedicalHistory || "-";

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#a17c5b] bg-fixed bg-cover">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-20">
        <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center tracking-wide">
          Family Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <LabelValue label="Family Values" value={familyValues} />
          <LabelValue label="Family Type" value={familyType} />
          <LabelValue label="Family Status" value={familyStatus} />
          <LabelValue label="Mother Tongue" value={motherTongue} />

          <LabelValue label="No. of Brothers" value={noOfBrothers} />
          <LabelValue label="Brothers Married" value={noOfBrothersMarried} />
          <LabelValue label="No. of Sisters" value={noOfSisters} />
          <LabelValue label="Sisters Married" value={noOfSistersMarried} />

          <LabelValue label="Father Name" value={fatherName} />
          <LabelValue label="Father Occupation" value={fatherOccupation} />
          <LabelValue label="Mother Name" value={motherName} />
          <LabelValue label="Mother Occupation" value={motherOccupation} />

          <LabelValue label="Parents Stay" value={parentsStay} />
          <LabelValue label="Family Wealth" value={familyWealth} />
          <LabelValue label="About Family" value={aboutFamily} />
          <LabelValue
            label="Family Medical History"
            value={familyMedicalHistory}
          />
        </div>
      </div>
    </div>
  );
}

function LabelValue({ label, value }) {
  return (
    <div className="p-4 rounded-xl border bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition">
      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
        {label}
      </div>
      <div className="text-base font-semibold text-gray-800 mt-1 break-words">
        {value === null || value === "" ? "-" : String(value)}
      </div>
    </div>
  );
}
