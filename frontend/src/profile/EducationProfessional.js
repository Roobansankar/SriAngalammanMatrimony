// // src/profile/EducationProfessional.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function EducationProfessional() {
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

//   // Field mappings & fallbacks
//   const education = user.Education || user.EducationDetails || "-";
//   const educationDetails = user.EducationDetails || user.Education_other || "-";
//   const occupation = user.Occupation || user.occu_details || "-";
//   const occupationDetails = user.occu_details || user.OccupationDetails || "-";
//   const annualIncome = user.Annualincome || user.income || user.Income || "-";
//   const incomeType = user.income_in || user.Income_in || user.IncomeType || "-";
//   const otherIncome = user.anyotherincome || user.AnyOtherIncome || "-";
//   const employedIn = user.Employedin || user.EmployedIn || "-";
//   const workingHours =
//     user.working_hours || user.Working_hours || user.workingHours || "-";
//   const workingLocation =
//     user.workinglocation ||
//     user.working_location ||
//     user.WorkingLocation ||
//     user.workingLocation ||
//     "-";

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 font-display">
//       <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-20">
//         <h2 className="text-2xl font-bold mb-4">Education & Professional</h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <LabelValue label="Education" value={education} />
//           <LabelValue label="Occupation" value={occupation} />
//           <LabelValue label="Education Details" value={educationDetails} />
//           <LabelValue label="Occupation Details" value={occupationDetails} />
//           <LabelValue label="Annual Income" value={annualIncome} />
//           <LabelValue label="Income Type" value={incomeType} />
//           <LabelValue label="Any Other Income" value={otherIncome} />
//           <LabelValue label="Employed In" value={employedIn} />
//           <LabelValue label="Working Hours" value={workingHours} />
//           <LabelValue label="Working Location / City" value={workingLocation} />
//         </div>

//         {/* optional quick info */}
//         <div className="mt-6 text-sm text-gray-600">
//           Tip: If any field looks missing, double-check your database column
//           names — tell me the exact MySQL column names and I’ll map them
//           explicitly.
//         </div>
//       </div>
//     </div>
//   );
// }

// function LabelValue({ label, value }) {
//   return (
//     <div className="border p-3 rounded">
//       <div className="text-xs text-gray-500">{label}</div>
//       <div className="text-sm font-medium break-words">{value ?? "-"}</div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EducationProfessional() {
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

  // Field mappings & fallbacks
  const education = user.Education || user.EducationDetails || "-";
  const educationDetails = user.EducationDetails || user.Education_other || "-";
  const occupation = user.Occupation || user.occu_details || "-";
  const occupationDetails = user.occu_details || user.OccupationDetails || "-";
  const annualIncome = user.Annualincome || user.income || user.Income || "-";
  const incomeType = user.income_in || user.Income_in || user.IncomeType || "-";
  const otherIncome = user.anyotherincome || user.AnyOtherIncome || "-";
  const employedIn = user.Employedin || user.EmployedIn || "-";
  const workingHours =
    user.working_hours || user.Working_hours || user.workingHours || "-";
  const workingLocation =
    user.workinglocation ||
    user.working_location ||
    user.WorkingLocation ||
    user.workingLocation ||
    "-";

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#a17c5b] bg-fixed bg-cover">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-20">
        <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center tracking-wide">
          Education & Professional Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <LabelValue label="Education" value={education} />
          <LabelValue label="Occupation" value={occupation} />
          <LabelValue label="Education Details" value={educationDetails} />
          <LabelValue label="Occupation Details" value={occupationDetails} />
          <LabelValue label="Annual Income" value={annualIncome} />
          <LabelValue label="Income Type" value={incomeType} />
          <LabelValue label="Any Other Income" value={otherIncome} />
          <LabelValue label="Employed In" value={employedIn} />
          <LabelValue label="Working Hours" value={workingHours} />
          <LabelValue label="Working Location / City" value={workingLocation} />
        </div>

        {/* Optional note */}
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
        {value ?? "-"}
      </div>
    </div>
  );
}
