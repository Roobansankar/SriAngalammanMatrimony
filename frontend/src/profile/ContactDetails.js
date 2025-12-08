// // src/profile/ContactDetails.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function ContactDetails() {
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
//   const country = user.Country || user.POC || "-";
//   const state = user.State || "-";
//   const district = user.Dist || user.District || "-";
//   const city = user.City || "-";
//   const pincode = user.Pincode || user.pin || "-";
//   const residenceIn = user.Residencystatus || user.ResidenceIn || "-";
//   const address = user.Address || user.condidaddress || "-";
//   const alternatePhone =
//     user.Mobile2 || user.Phone || user.AlternatePhone || "-";
//   const mobile = user.Mobile || user.MobileNumber || "-";
//   const whatsapp = user.Whatsapp || user.WA || user.whatsapp || mobile || "-";
//   const convenientTime =
//     user.calling_time || user.callingTime || user.working_hours || "-";

//   return (
//     <div className="min-h-screen p-6 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#a17c5b] bg-fixed bg-cover">
//       <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-20">
//         <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center tracking-wide">
//           Contact Details
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
//           <LabelValue label="Country" value={country} />
//           <LabelValue label="State" value={state} />
//           <LabelValue label="District" value={district} />
//           <LabelValue label="City" value={city} />
//           <LabelValue label="Pincode" value={pincode} />
//           <LabelValue label="Residence In" value={residenceIn} />
//           <LabelValue label="Address" value={address} />
//           <LabelValue label="Alternate Phone" value={alternatePhone} />
//           <LabelValue label="Mobile" value={mobile} />
//           <LabelValue label="WhatsApp No." value={whatsapp} />
//           <LabelValue label="Convenient Time to Call" value={convenientTime} />
//         </div>

//         {/* Action Buttons */}
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


// src/profile/ContactDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ContactDetails() {
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

  if (loading) return <ContactSkeleton />;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!user) return <div className="p-6">No user found</div>;

  // Field mappings
  const country = user.Country || user.POC || "-";
  const state = user.State || "-";
  const district = user.Dist || user.District || "-";
  const city = user.City || "-";
  const pincode = user.Pincode || user.pin || "-";
  const residenceIn = user.Residencystatus || user.ResidenceIn || "-";
  const address = user.Address || user.condidaddress || "-";
  const alternatePhone =
    user.Mobile2 || user.Phone || user.AlternatePhone || "-";
  const mobile = user.Mobile || user.MobileNumber || "-";
  const whatsapp = user.Whatsapp || user.WA || user.whatsapp || mobile || "-";
  const convenientTime =
    user.calling_time || user.callingTime || user.working_hours || "-";

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#a17c5b] bg-fixed bg-cover font-display">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-20">
        <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center tracking-wide">
          Contact Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <LabelValue label="Country" value={country} />
          <LabelValue label="State" value={state} />
          <LabelValue label="District" value={district} />
          <LabelValue label="City" value={city} />
          <LabelValue label="Pincode" value={pincode} />
          <LabelValue label="Residence In" value={residenceIn} />
          <LabelValue label="Address" value={address} />
          <LabelValue label="Alternate Phone" value={alternatePhone} />
          <LabelValue label="Mobile" value={mobile} />
          <LabelValue label="WhatsApp No." value={whatsapp} />
          <LabelValue label="Convenient Time to Call" value={convenientTime} />
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
  return (
    <div className={`animate-pulse bg-gray-300 rounded-md ${className}`}></div>
  );
}

function ContactSkeleton() {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#a17c5b] bg-fixed bg-cover">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-20">

        <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center tracking-wide">
          Contact Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border bg-gradient-to-br from-white to-gray-50 shadow-sm"
            >
              <Skeleton className="h-3 w-24 mb-2" />
              <Skeleton className="h-5 w-36" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
