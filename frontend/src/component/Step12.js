// // Step12.jsx
// import axios from "axios";
// import { AlertCircle, BadgeCheck, CheckCircle, Loader2 } from "lucide-react";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Step12({ prevStep, formData }) {
//   const navigate = useNavigate();
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [matriId, setMatriId] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async () => {
//     try {
//       setSubmitting(true);
//       setError("");

//       const f = formData || {};
//       const fd = new FormData();
//       const add = (key, val) => {
//         if (val === undefined || val === null || val === "") return;
//         fd.append(key, val);
//       };

//       /* ------------------------------------------------
//          🧍 Step 1: Basic Information
//       ------------------------------------------------ */
//       add("matriId", f.matriId);
//       add("fname", f.fname);
//       add("lname", f.lname);
//       add("email", f.email);
//       add("password", f.password);
//       add("profileBy", f.profileBy);
//       add("gender", f.gender);
//       add("dobDay", f.dobDay);
//       add("dobMonth", f.dobMonth);
//       add("dobYear", f.dobYear);
//       add("maritalStatus", f.maritalStatus);
//       add("religion", f.religion);
//       add("caste", f.caste);
//       add("subCaste", f.subCaste);
//       add("countryCode", f.countryCode);
//       add("mobile", f.mobile);
//       add("aboutus", f.aboutYourself);

//       for (let i = 1; i <= 12; i++) {
//         add(`g${i}`, f[`g${i}`] ? f[`g${i}`].join(",") : "");
//         add(`a${i}`, f[`a${i}`] ? f[`a${i}`].join(",") : "");
//       }

     

//       /* ------------------------------------------------
//    🧭 Step 4: Horoscope Details
// ------------------------------------------------ */
//       add("moonSign", f.moonSign);
//       add("star", f.star);
//       add("gothra", f.gothra);
//       add("manglik", f.manglik);
//       add("shani", f.shani);
//       add("placeOfShani", f.placeOfShani);
//       add("horoscopeMatch", f.horoscopeMatch);
//       add("parigarasevai", f.parigarasevai);
//       add("sevai", f.sevai);
//       add("raghu", f.raghu);
//       add("keethu", f.keethu);
//       add("birthHour", f.birthHour);
//       add("birthMinute", f.birthMinute);
//       add("birthSecond", f.birthSecond);
//       add("ampm", f.ampm);
//       add("placeOfBirth", f.placeOfBirth);
//       add("countryOfBirth", f.countryOfBirth);
//       add("kuladeivam", f.kuladeivam);
//       add("thesaiirupu", f.thesaiirupu);

//       // ✅ Upload Horoscope File (Store in horosother)
     

//       /* ------------------------------------------------
//          🏠 Step 5: Contact Details (✅ corrected)
//       ------------------------------------------------ */
//       add("country", f.country);
//       add("state", f.state);
//       add("district", f.district);
//       add("city", f.city);
//       add("pincode", f.pincode);
//       add("residence", f.residence);
//       add("address", f.address);
//       add("altPhone", f.altPhone);
//       add("whatsapp", f.whatsapp);
//       add("convenientTime", f.convenientTime);
//       add("altPhone", f.altPhone || "");
//       add("whatsapp", f.whatsapp || "");

//       /* ------------------------------------------------
//          🎓 Step 6: Education & Occupation
//       ------------------------------------------------ */
//       add("education", f.education);
//       add("occupation", f.occupation);
//       add("educationDetails", f.educationDetails);
//       add("occupationDetails", f.occupationDetails);
//       add("annualIncome", f.annualIncome);
//       add("incomeType", f.incomeType);
//       add("otherIncome", f.otherIncome);
//       add("employedIn", f.employedIn);
//       add("workingHours", f.workingHours);
//       add("company_name", f.company_name);
//       add("workingLocation", f.workingLocation);

    

//       /* ------------------------------------------------
//       💪 STEP 7: Physical Details & Hobbies
// ------------------------------------------------ */

//       // Height (This comes as number but DB expects HeightText)
//       add("HeightText", f.heightText || f.height);

//       // Weight & Basic Details
//       add("weight", f.weight);
//       add("bloodGroup", f.bloodGroup);
//       add("complexion", f.complexion);
//       add("bodyType", f.bodyType);
//       add("diet", f.diet);
//       add("smoke", f.smoke);
//       add("drink", f.drink);
//       add("specialCases", f.specialCases);

//       // MULTI SELECT → CSV STRING
//       add(
//         "hobbies",
//         Array.isArray(f.hobbies) ? f.hobbies.join(",") : f.hobbies
//       );
//       add(
//         "interests",
//         Array.isArray(f.interests) ? f.interests.join(",") : f.interests
//       );

//       // Other text fields
//       add("otherHobbies", f.otherHobbies);
//       add("otherInterests", f.otherInterests);

//       // Achievement, Medical History, Passport
//       add("achievement", f.achievement);
//       add("medicalHistory", f.medicalHistory);
//       add("passport", f.passport);

//       /* ------------------------------------------------
//       //    👨‍👩‍👧 Step 8: Family Details
//       // ------------------------------------------------ */
      

//       add("familyValues", f.familyValues);
//       add("familyType", f.familyType);
//       add("familyStatus", f.familyStatus);
//       add("mother_tounge", f.motherTongue || "");
//       add("motherTongue", f.motherTongue || ""); // send both to be safe

//       add("noOfBrothers", f.noOfBrothers);
//       add("noOfBrothersMarried", f.noOfBrothersMarried);
//       add("noOfSisters", f.noOfSisters);
//       add("noOfSistersMarried", f.noOfSistersMarried);
//       add("noOfBrothersUnmarried", f.noOfBrothersUnmarried);
//       add("noOfSistersUnmarried", f.noOfSistersUnmarried);

//       add("fatherName", f.fatherName);
//       add("fatherOccupation", f.fatherOccupation);
//       add("motherName", f.motherName);
//       add("motherOccupation", f.motherOccupation);

    
//       add(
//         "familyWealth",
//         Array.isArray(f.familyWealth)
//           ? f.familyWealth.join(",")
//           : typeof f.familyWealth === "string"
//           ? f.familyWealth
//           : ""
//       );

//       add("familyDescription", f.familyDescription);

//       // ❗ FIX — This must match Step 8 name
//       add("familyMedicalHistory", f.familyMedicalHistory);

//       /* ------------------------------------------------
//          📸 Step 9: Photo Upload
//       ------------------------------------------------ */
//       if (f.photo && typeof f.photo === "object") fd.append("photo", f.photo);

//       // /* -----------------------------------------------

//       /* ------------ STEP 10 : Partner Preferences (FIXED) ------------ */

//       if (Array.isArray(f.maritalStatus)) {
//         add("partner_maritalStatus", f.maritalStatus.join(","));
//       }

//       add("partner_ageFrom", f.ageFrom);
//       add("partner_ageTo", f.ageTo);

//       // IMPORTANT FIX – Your original code had a typo (duplicate heightTo)
//       add("partner_heightFrom", f.heightFrom);
//       add("partner_heightTo", f.heightTo);

//       // Religion / caste / complexion etc
//       add("partner_religion", f.religion);
//       add("partner_caste", f.caste);
//       add("partner_complexion", f.complexion);
//       add("partner_residencyStatus", f.residencyStatus);

//       // IMPORTANT FIX – Country Living In field
//       add("partner_countryLivingIn", f.country);

//       add("partner_state", f.state);
//       add("partner_city", f.city);
//       add("partner_education", f.education);
//       add("partner_occupation", f.occupation);

//       // FIX – Add mother tongue for partner preferences
//       add("partner_motherTongue", f.motherTongue);

//       add("partnerExpectations", f.partnerExpectations);

//       /* ------------------------------------------------
//          💳 Step 11: Payment Plan
//       ------------------------------------------------ */
//       add("plan", f.plan ? f.plan : "basic");
//       add("paymentDone", f.paymentDone ? "1" : "0");

//       /* ------------------------------------------------
//          🗂️ File Upload (optional horoscope file)
//       ------------------------------------------------ */
//       if (f.horoscopeFile && typeof f.horoscopeFile === "object")
//         fd.append("horoscopeFile", f.horoscopeFile);

//       console.log("✅ Final submit payload:", Object.fromEntries(fd.entries()));

//       /* ------------------------------------------------
//          🚀 Submit to backend
//       ------------------------------------------------ */
//       const res = await axios.post(
//         "http://localhost:5000/api/register/complete",
//         fd
//       );

//       localStorage.removeItem("multiStepRegistration_form_v1");

//       // Get matriId from response or formData
//       const resultMatriId = res.data.matriId || f.matriId || "—";
//       setMatriId(resultMatriId);
//       setSubmitted(true);
//     } catch (err) {
//       console.error("❌ Submit Error:", err?.response?.data || err);
//       setError(
//         err?.response?.data?.error ||
//           err?.response?.data?.sql ||
//           err?.message ||
//           "Something went wrong. Please try again."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Success state - show MatriID
//   if (submitted && matriId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-rose-50 to-rose-100">
//         <div className="max-w-lg w-full mx-auto bg-white shadow-lg rounded-2xl p-8 border border-green-200 text-center">
//           <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//           <h3 className="text-2xl font-bold text-green-600 mb-3">
//             🎉 Registration Complete!
//           </h3>

//           <div className="my-6 bg-gradient-to-r from-rose-100 to-pink-50 border border-rose-200 rounded-xl py-6 px-6">
//             <p className="text-sm text-gray-600 mb-2">Your Matri ID</p>
//             <div className="flex items-center justify-center gap-2">
//               <BadgeCheck className="w-6 h-6 text-rose-600" />
//               <p className="text-3xl font-bold text-rose-700 tracking-wider">
//                 {matriId}
//               </p>
//             </div>
//             <p className="text-xs text-gray-500 mt-3">
//               Keep this ID safe — you'll use it for login and support.
//             </p>
//           </div>

//           <p className="text-gray-600 mb-6">
//             Your profile has been created successfully. You can now login and
//             start your journey!
//           </p>

//           <button
//             onClick={() => navigate("/login")}
//             className="px-8 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
//           >
//             Go to Login →
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-rose-50 to-rose-100">
//         <div className="max-w-lg w-full mx-auto bg-white shadow-lg rounded-2xl p-8 border border-red-200 text-center">
//           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h3 className="text-2xl font-bold text-red-600 mb-3">
//             Submission Failed
//           </h3>
//           <p className="text-gray-600 mb-6">{error}</p>

//           <div className="flex justify-center gap-4">
//             <button
//               onClick={() => setError("")}
//               className="px-6 py-2 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition"
//             >
//               Try Again
//             </button>
//             <button
//               onClick={() => prevStep()}
//               className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
//             >
//               ← Go Back
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-rose-50 to-rose-100">
//       <div className="max-w-lg w-full mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200 text-center">
//         <h3 className="text-2xl font-semibold text-gray-800 mb-3">
//           Step 13: Submit Registration
//         </h3>
//         <p className="text-gray-600 mb-8">
//           Please verify all your entered information before submission.
//         </p>

//         <div className="flex justify-center gap-6">
//           <button
//             onClick={() => prevStep()}
//             disabled={submitting}
//             className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 disabled:opacity-50"
//           >
//             ← Back
//           </button>

//           <button
//             onClick={handleSubmit}
//             disabled={submitting}
//             className="px-6 py-2 bg-gradient-to-r from-pink-600 to-yellow-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-60 flex items-center gap-2"
//           >
//             {submitting ? (
//               <>
//                 <Loader2 className="animate-spin w-4 h-4" />
//                 Submitting...
//               </>
//             ) : (
//               "✅ Submit Form"
//             )}
//           </button>
//         </div>

//         <p className="text-sm text-gray-500 mt-6">
//           ⚠️ Once submitted, please wait for confirmation. Do not refresh the
//           page.
//         </p>
//       </div>
//     </div>
//   );
// }


import axios from "axios";
import { AlertCircle, BadgeCheck, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Step12({ prevStep, formData }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [matriId, setMatriId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");

      const f = formData || {};
      const fd = new FormData();
      const add = (key, val) => {
        if (val === undefined || val === null || val === "") return;
        fd.append(key, val);
      };

      /* ------------------------------------------------
         STEP 1 — BASIC DETAILS
      ------------------------------------------------ */
      add("matriId", f.matriId);
      add("fname", f.fname);
      add("lname", f.lname);
      add("email", f.email);
      add("password", f.password);
      add("profileBy", f.profileBy);
      add("gender", f.gender);
      add("dobDay", f.dobDay);
      add("dobMonth", f.dobMonth);
      add("dobYear", f.dobYear);
      add("maritalStatus", f.maritalStatus);
      add("religion", f.religion);
      add("caste", f.caste);
      add("subCaste", f.subCaste);
      add("countryCode", f.countryCode);
      add("mobile", f.mobile);
      add("aboutus", f.aboutYourself);

      for (let i = 1; i <= 12; i++) {
        add(`g${i}`, f[`g${i}`] ? f[`g${i}`].join(",") : "");
        add(`a${i}`, f[`a${i}`] ? f[`a${i}`].join(",") : "");
      }

      /* ------------------------------------------------
         STEP 4 — HOROSCOPE DETAILS
      ------------------------------------------------ */
      add("moonSign", f.moonSign);
      add("star", f.star);
      add("gothra", f.gothra);
      add("manglik", f.manglik);
      add("shani", f.shani);
      add("placeOfShani", f.placeOfShani);
      add("horoscopeMatch", f.horoscopeMatch);
      add("parigarasevai", f.parigarasevai);
      add("sevai", f.sevai);
      add("raghu", f.raghu);
      add("keethu", f.keethu);
      add("birthHour", f.birthHour);
      add("birthMinute", f.birthMinute);
      add("birthSecond", f.birthSecond);
      add("ampm", f.ampm);
      add("placeOfBirth", f.placeOfBirth);
      add("kuladeivam", f.kuladeivam);
      add("thesaiirupu", f.thesaiirupu);

      /* ------------------------------------------------
         STEP 5 — CONTACT DETAILS
      ------------------------------------------------ */
      add("country", f.country);
      add("state", f.state);
      add("district", f.district);
      add("city", f.city);
      add("pincode", f.pincode);
      add("residence", f.residence);
      add("address", f.address);
      add("altPhone", f.altPhone);
      add("whatsapp", f.whatsapp);
      add("convenientTime", f.convenientTime);

      /* ------------------------------------------------
         STEP 6 — EDUCATION & OCCUPATION
      ------------------------------------------------ */
      add("education", f.education);
      add("occupation", f.occupation);
      add("educationDetails", f.educationDetails);
      add("occupationDetails", f.occupationDetails);
      add("annualIncome", f.annualIncome);
      add("incomeType", f.incomeType);
      add("otherIncome", f.otherIncome);
      add("employedIn", f.employedIn);
      add("workingHours", f.workingHours);
      add("company_name", f.company_name);
      add("workingLocation", f.workingLocation);

      /* ------------------------------------------------
         STEP 7 — PHYSICAL DETAILS
      ------------------------------------------------ */
      add("HeightText", f.heightText || f.height);
      add("weight", f.weight);
      add("bloodGroup", f.bloodGroup);
      add("complexion", f.complexion);
      add("bodyType", f.bodyType);
      add("diet", f.diet);
      add("smoke", f.smoke);
      add("drink", f.drink);
      add("specialCases", f.specialCases);

      add("hobbies", Array.isArray(f.hobbies) ? f.hobbies.join(",") : f.hobbies);
      add("interests", Array.isArray(f.interests) ? f.interests.join(",") : f.interests);

      add("otherHobbies", f.otherHobbies);
      add("otherInterests", f.otherInterests);
      add("achievement", f.achievement);
      add("medicalHistory", f.medicalHistory);
      add("passport", f.passport);

      /* ------------------------------------------------
         STEP 8 — FAMILY DETAILS
      ------------------------------------------------ */
      add("familyValues", f.familyValues);
      add("familyType", f.familyType);
      add("familyStatus", f.familyStatus);
      add("mother_tounge", f.motherTongue);
      add("motherTongue", f.motherTongue);

      add("noOfBrothers", f.noOfBrothers);
      add("noOfBrothersMarried", f.noOfBrothersMarried);
      add("noOfSisters", f.noOfSisters);
      add("noOfSistersMarried", f.noOfSistersMarried);
      add("noOfBrothersUnmarried", f.noOfBrothersUnmarried);
      add("noOfSistersUnmarried", f.noOfSistersUnmarried);

      add("fatherName", f.fatherName);
      add("fatherOccupation", f.fatherOccupation);
      add("motherName", f.motherName);
      add("motherOccupation", f.motherOccupation);
      add("familyWealth", Array.isArray(f.familyWealth) ? f.familyWealth.join(",") : f.familyWealth);
      add("familyDescription", f.familyDescription);
      add("familyMedicalHistory", f.familyMedicalHistory);

      /* ------------------------------------------------
         STEP 9 — PHOTO UPLOAD
      ------------------------------------------------ */
      if (f.photo && typeof f.photo === "object") {
        fd.append("photo", f.photo);
      }

      /* ------------------------------------------------
         STEP 10 — PARTNER PREFERENCES
      ------------------------------------------------ */
      add("partner_maritalStatus", Array.isArray(f.maritalStatus) ? f.maritalStatus.join(",") : f.maritalStatus);
      add("partner_ageFrom", f.ageFrom);
      add("partner_ageTo", f.ageTo);
      add("partner_heightFrom", f.heightFrom);
      add("partner_heightTo", f.heightTo);

      add("partner_religion", f.religion);
      add("partner_caste", f.caste);
      add("partner_complexion", f.complexion);
      add("partner_residencyStatus", f.residencyStatus);
      add("partner_countryLivingIn", f.country);
      add("partner_state", f.state);
      add("partner_city", f.city);
      add("partner_education", f.education);
      add("partner_occupation", f.occupation);
      add("partner_motherTongue", f.motherTongue);
      add("partnerExpectations", f.partnerExpectations);

      /* ------------------------------------------------
         STEP 11 — PAYMENT
      ------------------------------------------------ */
      add("plan", f.plan || "basic");
      add("paymentDone", f.paymentDone ? "1" : "0");

      /* ------------------------------------------------
         FILE UPLOAD — HOROSCOPE FILE (correct Multer field)
      ------------------------------------------------ */
      if (f.horoscopeFile && typeof f.horoscopeFile === "object") {
        fd.append("horoscopeFile", f.horoscopeFile);
      }

      console.log("Submitting payload:", Object.fromEntries(fd.entries()));

      /* ------------------------------------------------
         SUBMIT TO BACKEND
      ------------------------------------------------ */
      const res = await axios.post("http://localhost:5000/api/register/complete", fd);

      localStorage.removeItem("multiStepRegistration_form_v1");

      setMatriId(res.data.matriId);
      setSubmitted(true);
    } catch (err) {
      console.error("❌ Submit Error:", err?.response?.data || err);
      setError(
        err?.response?.data?.sql ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------------------------------------
     SUCCESS SCREEN
  ------------------------------------------------ */
  if (submitted && matriId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-10 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold mt-4">Registration Complete</h2>
          <p className="text-xl mt-2 font-bold text-rose-700">{matriId}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 px-6 py-3 bg-rose-600 text-white rounded-lg"
          >
            Go to Login →
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------
     ERROR SCREEN
  ------------------------------------------------ */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-10 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-red-600 mt-4">
            Submission Failed
          </h2>
          <p className="text-gray-700 mt-4">{error}</p>

          <button
            onClick={() => setError("")}
            className="mt-6 px-6 py-3 bg-rose-600 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------
     DEFAULT SCREEN
  ------------------------------------------------ */
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-10 text-center">
        <h2 className="text-xl font-semibold mb-4">
          Step 13: Submit Registration
        </h2>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-8 py-3 bg-gradient-to-r from-pink-600 to-yellow-500 text-white rounded-lg flex items-center gap-2 justify-center"
        >
          {submitting ? <Loader2 className="animate-spin" /> : "Submit Form"}
        </button>
      </div>
    </div>
  );
}
