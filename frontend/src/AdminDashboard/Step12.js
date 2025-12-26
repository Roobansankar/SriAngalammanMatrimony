

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
//          STEP 1 — BASIC DETAILS
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
//          STEP 4 — HOROSCOPE DETAILS
//       ------------------------------------------------ */
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
//       add("kuladeivam", f.kuladeivam);
//       add("thesaiirupu", f.thesaiirupu);

//       /* ------------------------------------------------
//          STEP 5 — CONTACT DETAILS
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

//       /* ------------------------------------------------
//          STEP 6 — EDUCATION & OCCUPATION
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
//          STEP 7 — PHYSICAL DETAILS
//       ------------------------------------------------ */
//       add("HeightText", f.heightText || f.height);
//       add("weight", f.weight);
//       add("bloodGroup", f.bloodGroup);
//       add("complexion", f.complexion);
//       add("bodyType", f.bodyType);
//       add("diet", f.diet);
//       add("smoke", f.smoke);
//       add("drink", f.drink);
//       add("specialCases", f.specialCases);

//       add("hobbies", Array.isArray(f.hobbies) ? f.hobbies.join(",") : f.hobbies);
//       add("interests", Array.isArray(f.interests) ? f.interests.join(",") : f.interests);

//       add("otherHobbies", f.otherHobbies);
//       add("otherInterests", f.otherInterests);
//       add("achievement", f.achievement);
//       add("medicalHistory", f.medicalHistory);
//       add("passport", f.passport);

//       /* ------------------------------------------------
//          STEP 8 — FAMILY DETAILS
//       ------------------------------------------------ */
//       add("familyValues", f.familyValues);
//       add("familyType", f.familyType);
//       add("familyStatus", f.familyStatus);
//       add("mother_tounge", f.motherTongue);
//       add("motherTongue", f.motherTongue);

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
//       add("familyWealth", Array.isArray(f.familyWealth) ? f.familyWealth.join(",") : f.familyWealth);
//       add("familyDescription", f.familyDescription);
//       add("familyMedicalHistory", f.familyMedicalHistory);

//       /* ------------------------------------------------
//          STEP 9 — PHOTO UPLOAD
//       ------------------------------------------------ */
//       if (f.photo && typeof f.photo === "object") {
//         fd.append("photo", f.photo);
//       }

//       /* ------------------------------------------------
//          STEP 10 — PARTNER PREFERENCES
//       ------------------------------------------------ */
//       add("partner_maritalStatus", Array.isArray(f.maritalStatus) ? f.maritalStatus.join(",") : f.maritalStatus);
//       add("partner_ageFrom", f.ageFrom);
//       add("partner_ageTo", f.ageTo);
//       add("partner_heightFrom", f.heightFrom);
//       add("partner_heightTo", f.heightTo);

//       add("partner_religion", f.religion);
//       add("partner_caste", f.caste);
//       add("partner_complexion", f.complexion);
//       add("partner_residencyStatus", f.residencyStatus);
//       add("partner_countryLivingIn", f.country);
//       add("partner_state", f.state);
//       add("partner_city", f.city);
//       add("partner_education", f.education);
//       add("partner_occupation", f.occupation);
//       add("partner_motherTongue", f.motherTongue);
//       add("partnerExpectations", f.partnerExpectations);

//       /* ------------------------------------------------
//          STEP 11 — PAYMENT
//       ------------------------------------------------ */
//       add("plan", f.plan || "basic");
//       add("paymentDone", f.paymentDone ? "1" : "0");

//       /* ------------------------------------------------
//          FILE UPLOAD — HOROSCOPE FILE (correct Multer field)
//       ------------------------------------------------ */
//       if (f.horoscopeFile && typeof f.horoscopeFile === "object") {
//         fd.append("horoscopeFile", f.horoscopeFile);
//       }

//       console.log("Submitting payload:", Object.fromEntries(fd.entries()));

//       /* ------------------------------------------------
//          SUBMIT TO BACKEND
//       ------------------------------------------------ */
//       const res = await axios.post(
//         `${process.env.REACT_APP_API_BASE || ""}/api/register/complete`, 
//         fd
//       );

//       localStorage.removeItem("multiStepRegistration_form_v1");

//       setMatriId(res.data.matriId);
//       setSubmitted(true);
//     } catch (err) {
//       console.error("❌ Submit Error:", err?.response?.data || err);
//       setError(
//         err?.response?.data?.sql ||
//         err?.response?.data?.message ||
//         err?.message ||
//         "Something went wrong. Please try again."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ------------------------------------------------
//      SUCCESS SCREEN
//   ------------------------------------------------ */
//   if (submitted && matriId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="bg-white shadow-lg rounded-xl p-2 text-center">
//           <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
//           <h2 className="text-2xl font-bold mt-4">Registration Complete</h2>
//           <p className="text-xl mt-2 font-bold text-rose-700">{matriId}</p>
//           <button
//             onClick={() => navigate("/add-users")}
//             className="mt-6 px-6 py-3 bg-rose-600 text-white rounded-lg"
//           >
//             Go to Login →
//           </button>
//         </div>
//       </div>
//     );
//   }

//   /* ------------------------------------------------
//      ERROR SCREEN
//   ------------------------------------------------ */
//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="bg-white shadow-lg rounded-xl p-10 text-center">
//           <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
//           <h2 className="text-2xl font-bold text-red-600 mt-4">
//             Submission Failed
//           </h2>
//           <p className="text-gray-700 mt-4">{error}</p>

//           <button
//             onClick={() => setError("")}
//             className="mt-6 px-6 py-3 bg-rose-600 text-white rounded-lg"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   /* ------------------------------------------------
//      DEFAULT SCREEN
//   ------------------------------------------------ */
//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="bg-white shadow-lg rounded-xl p-2 text-center">
//         <h2 className="text-xl font-semibold mb-4">
//           Step 13: Submit Registration
//         </h2>

//         <button
//           onClick={handleSubmit}
//           disabled={submitting}
//           className="px-8 py-3 bg-gradient-to-r from-pink-600 to-yellow-500 text-white rounded-lg flex items-center gap-2 justify-center"
//         >
//           {submitting ? <Loader2 className="animate-spin" /> : "Submit Form"}
//         </button>
//       </div>
//     </div>
//   );
// }



import axios from "axios";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
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
      add(
        "familyWealth",
        Array.isArray(f.familyWealth)
          ? f.familyWealth.join(",")
          : f.familyWealth
      );
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
  

      add("plan", f.paymentDone ? f.plan : null);
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
      const res = await axios.post(`${process.env.REACT_APP_API_BASE || ""}/api/register/complete`, fd);

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
      // <div className="min-h-screen flex items-center justify-center">
      <div className="flex justify-center mt-10">

        <div className="bg-white shadow-lg rounded-xl p-10 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold mt-4">Registration Complete</h2>
          <p className="text-xl mt-2 font-bold text-rose-700">{matriId}</p>
    
        </div>
      </div>
    );
  }




  /* ------------------------------------------------
     ERROR SCREEN
  ------------------------------------------------ */
  if (error) {
    return (
      // <div className="min-h-screen flex items-center justify-center">
      <div className="flex justify-center mt-10">

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
    <div className="flex justify-center pt-4 pb-10">
      <div className="bg-white shadow-lg rounded-xl p-10 text-center max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">
          Step 11: Submit Registration
        </h2>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-8 py-3 bg-gradient-to-r from-pink-600 to-yellow-500 text-white rounded-lg flex items-center gap-2 justify-center mx-auto"
        >
          {submitting ? <Loader2 className="animate-spin" /> : "Submit Form"}
        </button>
      </div>
    </div>
  );
}
