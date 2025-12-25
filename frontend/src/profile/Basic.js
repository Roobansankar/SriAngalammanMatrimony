// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function Basic() {
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
//         const res = await axios.get(`${process.env.REACT_APP_API_BASE || ""}/api/auth/user`, {
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

//   const rawName = String(user.Name || "");
//   const nameParts = rawName.trim().split(/\s+/);
//   const firstName = nameParts.length
//     ? nameParts.slice(0, -1).join(" ") || nameParts[0]
//     : "-";
//   const surname =
//     nameParts.length > 1
//       ? nameParts[nameParts.length - 1]
//       : user.lastname || "-";

//   const email = user.ConfirmEmail || user.Email || "-";
//   const profileBy = user.Profilecreatedby || user.CreatorName || "-";
//   const gender = user.Gender || "-";

//   let dobDay = "-",
//     dobMonth = "-",
//     dobYear = "-";
//   if (user.DOB) {
//     const d = new Date(user.DOB);
//     if (!Number.isNaN(d.getTime())) {
//       const monthNames = [
//         "January",
//         "February",
//         "March",
//         "April",
//         "May",
//         "June",
//         "July",
//         "August",
//         "September",
//         "October",
//         "November",
//         "December",
//       ];
//       dobDay = String(d.getDate()).padStart(2, "0");
//       dobMonth = monthNames[d.getMonth()];
//       dobYear = String(d.getFullYear());
//     }
//   }

//   const maritalStatus = user.Maritalstatus || user.MaritalStatus || "-";
//   const religion = user.Religion || "-";
//   const caste = user.Caste || user.caste || "-";
//   const subcaste = user.Subcaste || user.sub_caste || user.PE_subcaste || "-";
//   const mobile =
//     user.Mobile || user.Mobile2 || user.Phone || user.MobileNumber || "-";

//   return (
//     // <div className="min-h-screen p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
//     <div className="min-h-screen p-6 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#a17c5b] bg-fixed bg-cover">
//       <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-20 border border-gray-100">
//         <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center tracking-wide">
//           Basic Profile Details
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
//           <LabelValue label="Name" value={firstName} />
//           <LabelValue label="Surname" value={surname} />
//           <LabelValue label="Email" value={email} />
//           <LabelValue label="Profile Created By" value={profileBy} />
//           <LabelValue label="Gender" value={gender} />
//           <LabelValue label="Birth Day" value={dobDay} />
//           <LabelValue label="Birth Month" value={dobMonth} />
//           <LabelValue label="Birth Year" value={dobYear} />
//           <LabelValue label="Marital Status" value={maritalStatus} />
//           <LabelValue label="Religion" value={religion} />
//           <LabelValue label="Caste" value={caste} />
//           <LabelValue label="Subcaste" value={subcaste} />
//           <LabelValue label="Mobile Number" value={mobile} />
//         </div>

//         {user.PhotoURL && (
//           <div className="mt-8 text-center">
//             <h3 className="font-semibold mb-2 text-gray-700">Profile Photo</h3>
//             <img
//               src={user.PhotoURL}
//               alt="profile"
//               className="w-40 h-40 object-cover rounded-xl shadow-md mx-auto border"
//               onError={(e) => {
//                 e.currentTarget.src = `${process.env.REACT_APP_API_BASE || ""}/gallery/nophoto.jpg`; 
//               }}
//             />
//           </div>
//         )}
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

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_BASE || "";

export default function Basic() {
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
        const res = await axios.get(`${API}/api/auth/user`, {
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
        setError("Unable to fetch profile");
        localStorage.removeItem("loggedInEmail");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!user) return <div className="p-6">No user found</div>;

  const rawName = String(user.Name || "");
  const nameParts = rawName.trim().split(/\s+/);
  const firstName = nameParts.length
    ? nameParts.slice(0, -1).join(" ") || nameParts[0]
    : "-";
  const surname =
    nameParts.length > 1
      ? nameParts[nameParts.length - 1]
      : user.lastname || "-";

  const email = user.ConfirmEmail || user.Email || "-";
  const profileBy = user.Profilecreatedby || user.CreatorName || "-";
  const gender = user.Gender || "-";

  let dobDay = "-",
    dobMonth = "-",
    dobYear = "-";
  if (user.DOB) {
    const d = new Date(user.DOB);
    if (!Number.isNaN(d.getTime())) {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      dobDay = String(d.getDate()).padStart(2, "0");
      dobMonth = monthNames[d.getMonth()];
      dobYear = String(d.getFullYear());
    }
  }

  const maritalStatus = user.Maritalstatus || user.MaritalStatus || "-";
  const religion = user.Religion || "-";
  const caste = user.Caste || user.caste || "-";
  const subcaste = user.Subcaste || user.sub_caste || user.PE_subcaste || "-";
  const mobile =
    user.Mobile || user.Mobile2 || user.Phone || user.MobileNumber || "-";

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#a17c5b] bg-fixed bg-cover font-display">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-20 border border-gray-100">
        <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center tracking-wide">
          Basic Profile Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <LabelValue label="Name" value={firstName} />
          <LabelValue label="Surname" value={surname} />
          <LabelValue label="Email" value={email} />
          <LabelValue label="Profile Created By" value={profileBy} />
          <LabelValue label="Gender" value={gender} />
          <LabelValue label="Birth Day" value={dobDay} />
          <LabelValue label="Birth Month" value={dobMonth} />
          <LabelValue label="Birth Year" value={dobYear} />
          <LabelValue label="Marital Status" value={maritalStatus} />
          <LabelValue label="Religion" value={religion} />
          <LabelValue label="Caste" value={caste} />
          <LabelValue label="Subcaste" value={subcaste} />
          <LabelValue label="Mobile Number" value={mobile} />
        </div>

        {user.PhotoURL && (
          <div className="mt-8 text-center">
            <h3 className="font-semibold mb-2 text-gray-700">Profile Photo</h3>
            <img
              src={user.PhotoURL}
              alt="profile"
              className="w-40 h-40 object-cover rounded-xl shadow-md mx-auto border"
              onError={(e) => {
                e.currentTarget.src = `${API}/gallery/nophoto.jpg`;
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------- SKELETON COMPONENTS ---------------------- */

function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-gray-300 rounded-md ${className}`}></div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#a17c5b] bg-fixed bg-cover">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-20 border border-gray-100">
        <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center tracking-wide">
          Basic Profile Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border bg-gradient-to-br from-white to-gray-50 shadow-sm"
            >
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-5 w-32" />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Skeleton className="w-40 h-40 mx-auto rounded-xl" />
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
