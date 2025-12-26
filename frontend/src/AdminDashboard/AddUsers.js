
// import { useEffect, useState } from "react";
// import {
//     Navigate,
//     Route,
//     Routes,
//     useNavigate
// } from "react-router-dom";

// import Step1 from "./Step1";
// import Step10 from "./Step10";
// import Step11 from "./Step11";
// import Step11Payment from "./Step11Payment";
// import Step12 from "./Step12";
// import Step2 from "./Step2";
// import Step3 from "./Step3";
// import Step4 from "./Step4";
// import Step5 from "./Step5";
// import Step6 from "./Step6";
// import Step7 from "./Step7";
// import Step8 from "./Step8";
// import Step9 from "./Step9";

// const STORAGE_KEY = "multiStepRegistration_form_v1";
// const TOTAL_STEPS = 13; // Restored payment step

// export default function AddUsers() {
//   const navigate = useNavigate();

//   // get URL step number
//   const stepFromURL = Number(window.location.pathname.split("/").pop());
//   const currentStep = isNaN(stepFromURL) ? 1 : stepFromURL;

//   // compute progress
//   const progress = Math.round((currentStep / TOTAL_STEPS) * 100);

//   // rehydrate saved form data
//   const [formData, setFormData] = useState(() => {
//     try {
//       const raw = localStorage.getItem(STORAGE_KEY);
//       return raw ? JSON.parse(raw) : {};
//     } catch {
//       return {};
//     }
//   });

//   // Helper to safely clone formData for localStorage (remove non-serializable values)
//   const getSerializableData = (data) => {
//     const clone = {};
//     for (const key of Object.keys(data)) {
//       const val = data[key];
//       // Skip sensitive fields
//       if (key === "password" || key === "otp") continue;
//       // Skip File objects, Blobs, or anything non-serializable
//       if (val instanceof File || val instanceof Blob) continue;
//       if (typeof val === "function") continue;
//       // Skip if it's an object with circular reference (like DOM nodes)
//       if (val && typeof val === "object" && val.nodeType) continue;
//       clone[key] = val;
//     }
//     return clone;
//   };

//   // save formData (excluding sensitive and non-serializable)
//   useEffect(() => {
//     try {
//       const safeData = getSerializableData(formData);
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
//     } catch (err) {
//       console.warn("Could not save form data:", err.message);
//     }
//   }, [formData]);

//   const goTo = (stepNumber, extra = {}) => {
//     const s = Math.max(1, Math.min(TOTAL_STEPS, Number(stepNumber) || 1));
//     if (Object.keys(extra).length > 0) {
//       setFormData((prev) => ({ ...prev, ...extra }));
//     }
//     navigate(`/register/step/${s}`);
//   };

//   const nextStepFactory =
//     (nextStep) =>
//     (data = {}) => {
//       setFormData((prev) => ({ ...prev, ...data }));
//       goTo(nextStep);
//     };

//   // Prevent going back to step 1 or 2 if email is already verified
//   const prevStepFactory =
//     (prevStep) =>
//     (data = {}) => {
//       // If email is verified and trying to go back to step 1 or 2, block it
//       if (formData.otpVerified && prevStep <= 2) {
//         console.log("Cannot go back - email already verified");
//         return;
//       }
//       setFormData((prev) => ({ ...prev, ...data }));
//       goTo(prevStep);
//     };


//   return (
//     <div
//       className="min-h-screen flex flex-col items-center p-4 font-display"
//     >
//       {/* ✅ TOP PROGRESS BAR (copied from your old version) */}
//       {/* <div className="w-full max-w-2xl mb-6 mt-20"> */}
//       <div className="w-full max-w-2xl mb-4 mt-0">
//         <div className="flex justify-between items-center mb-2">
//           <span className="text-sm font-semibold text-rose-700">
//             Step {currentStep} of {TOTAL_STEPS}
//           </span>
//           <span className="text-sm text-gray-600">Registration Progress</span>
//         </div>

//         <div className="w-full bg-rose-200 rounded-full h-2">
//           <div
//             className="bg-rose-600 h-2 rounded-full transition-all duration-500"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//       </div>
//       {/* END PROGRESS BAR */}

//       <div className="w-full max-w-2xl">
//         <Routes>
//           <Route path="" element={<Navigate to="step/1" replace />} />

//           <Route
//             path="step/1"
//             element={
//               <Step1 nextStep={nextStepFactory(2)} formData={formData} />
//             }
//           />

//           <Route
//             path="step/2"
//             element={
//               <Step2
//                 nextStep={nextStepFactory(3)}
//                 prevStep={prevStepFactory(1)}
//                 formData={formData}
//               />
//             }
//           />

//           <Route
//             path="step/3"
//             element={
//               <Step3
//                 nextStep={nextStepFactory(4)}
//                 prevStep={prevStepFactory(2)}
//                 formData={formData}
//               />
//             }
//           />

//           <Route
//             path="step/4"
//             element={
//               <Step4
//                 nextStep={nextStepFactory(5)}
//                 prevStep={prevStepFactory(3)}
//                 formData={formData}
//               />
//             }
//           />

//           <Route
//             path="step/5"
//             element={
//               <Step5
//                 nextStep={nextStepFactory(6)}
//                 prevStep={prevStepFactory(4)}
//                 formData={formData}
//               />
//             }
//           />

//           <Route
//             path="step/6"
//             element={
//               <Step6
//                 nextStep={nextStepFactory(7)}
//                 prevStep={prevStepFactory(5)}
//                 formData={formData}
//               />
//             }
//           />

//           <Route
//             path="step/7"
//             element={
//               <Step7
//                 nextStep={nextStepFactory(8)}
//                 prevStep={prevStepFactory(6)}
//                 formData={formData}
//               />
//             }
//           />

//           <Route
//             path="step/8"
//             element={
//               <Step8
//                 nextStep={nextStepFactory(9)}
//                 prevStep={prevStepFactory(7)}
//                 formData={formData}
//               />
//             }
//           />

//           <Route
//             path="step/9"
//             element={
//               <Step9
//                 nextStep={nextStepFactory(10)}
//                 prevStep={prevStepFactory(8)}
//                 formData={formData}
//               />
//             }
//           />

//           <Route
//             path="step/10"
//             element={
//               <Step10
//                 nextStep={nextStepFactory(11)}
//                 prevStep={prevStepFactory(9)}
//                 formData={formData}
//               />
//             }
//           />

//           <Route
//             path="step/11"
//             element={
//               <Step11
//                 nextStep={nextStepFactory(12)}
//                 prevStep={prevStepFactory(10)}
//                 formData={formData}
//               />
//             }
//           />

//           {/* Step 12: Payment */}
//           <Route
//             path="step/12"
//             element={
//               <Step11Payment
//                 nextStep={nextStepFactory(13)}
//                 prevStep={prevStepFactory(11)}
//                 formData={formData}
//                 setFormData={setFormData}
//               />
//             }
//           />

//           {/* Step 13: Final Submit */}
//           <Route
//             path="step/13"
//             element={
//               <Step12 prevStep={prevStepFactory(12)} formData={formData} />
//             }
//           />

//           <Route path="*" element={<Navigate to="step/1" replace />} />
//         </Routes>
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import {
    Navigate,
    Route,
    Routes,
    useNavigate
} from "react-router-dom";

import Step1 from "./Step1"; // Merged with OTP verification
// Step2 and Step3 are now removed - merged into Step1
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";
import Step8 from "./Step8";
import Step9 from "./Step9";
import Step10 from "./Step10";
import Step11 from "./Step11";
import Step11Payment from "./Step11Payment";
import Step12 from "./Step12";

const STORAGE_KEY = "multiStepRegistration_form_v1";
const TOTAL_STEPS = 11; // Reduced from 13 to 11 (removed Step2 and Step3)

export default function AddUsers() {
  const navigate = useNavigate();

  // get URL step number
  const stepFromURL = Number(window.location.pathname.split("/").pop());
  const currentStep = isNaN(stepFromURL) ? 1 : stepFromURL;

  // compute progress
  const progress = Math.round((currentStep / TOTAL_STEPS) * 100);

  // rehydrate saved form data
  const [formData, setFormData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // Helper to safely clone formData for localStorage (remove non-serializable values)
  const getSerializableData = (data) => {
    const clone = {};
    for (const key of Object.keys(data)) {
      const val = data[key];
      // Skip sensitive fields
      if (key === "password" || key === "otp") continue;
      // Skip File objects, Blobs, or anything non-serializable
      if (val instanceof File || val instanceof Blob) continue;
      if (typeof val === "function") continue;
      // Skip if it's an object with circular reference (like DOM nodes)
      if (val && typeof val === "object" && val.nodeType) continue;
      clone[key] = val;
    }
    return clone;
  };

  // save formData (excluding sensitive and non-serializable)
  useEffect(() => {
    try {
      const safeData = getSerializableData(formData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
    } catch (err) {
      console.warn("Could not save form data:", err.message);
    }
  }, [formData]);

  const goTo = (stepNumber, extra = {}) => {
    const s = Math.max(1, Math.min(TOTAL_STEPS, Number(stepNumber) || 1));
    if (Object.keys(extra).length > 0) {
      setFormData((prev) => ({ ...prev, ...extra }));
    }
    navigate(`/admin/add-users/step/${s}`);
  };

  const nextStepFactory =
    (nextStep) =>
    (data = {}) => {
      setFormData((prev) => ({ ...prev, ...data }));
      goTo(nextStep);
    };

  // Prevent going back to step 1 if email is already verified
  const prevStepFactory =
    (prevStep) =>
    (data = {}) => {
      // If email is verified and trying to go back to step 1, block it
      if (formData.otpVerified && prevStep <= 1) {
        console.log("Cannot go back - email already verified");
        return;
      }
      setFormData((prev) => ({ ...prev, ...data }));
      goTo(prevStep);
    };

  return (
    <div className="min-h-screen flex flex-col p-6 items-center font-display">
      {/* TOP PROGRESS BAR */}
      <div className="w-full max-w-2xl mb-6 mt-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-rose-700">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
          <span className="text-sm text-gray-600">Registration Progress</span>
        </div>

        <div className="w-full bg-rose-200 rounded-full h-2">
          <div
            className="bg-rose-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      {/* END PROGRESS BAR */}

      <div className="w-full max-w-2xl">
        <Routes>
          <Route path="" element={<Navigate to="step/1" replace />} />

          {/* Step 1: Basic Info + Email Verification (merged from old Step1, Step2, Step3) */}
          <Route
            path="step/1"
            element={
              <Step1 nextStep={nextStepFactory(2)} formData={formData} />
            }
          />

          {/* Step 2-9: Remaining steps (old Step4-11) */}
          <Route
            path="step/2"
            element={
              <Step4
                nextStep={nextStepFactory(3)}
                prevStep={prevStepFactory(1)}
                formData={formData}
              />
            }
          />

          <Route
            path="step/3"
            element={
              <Step5
                nextStep={nextStepFactory(4)}
                prevStep={prevStepFactory(2)}
                formData={formData}
              />
            }
          />

          <Route
            path="step/4"
            element={
              <Step6
                nextStep={nextStepFactory(5)}
                prevStep={prevStepFactory(3)}
                formData={formData}
              />
            }
          />

          <Route
            path="step/5"
            element={
              <Step7
                nextStep={nextStepFactory(6)}
                prevStep={prevStepFactory(4)}
                formData={formData}
              />
            }
          />

          <Route
            path="step/6"
            element={
              <Step8
                nextStep={nextStepFactory(7)}
                prevStep={prevStepFactory(5)}
                formData={formData}
              />
            }
          />

          <Route
            path="step/7"
            element={
              <Step9
                nextStep={nextStepFactory(8)}
                prevStep={prevStepFactory(6)}
                formData={formData}
              />
            }
          />

          <Route
            path="step/8"
            element={
              <Step10
                nextStep={nextStepFactory(9)}
                prevStep={prevStepFactory(7)}
                formData={formData}
              />
            }
          />

          <Route
            path="step/9"
            element={
              <Step11
                nextStep={nextStepFactory(10)}
                prevStep={prevStepFactory(8)}
                formData={formData}
              />
            }
          />

          {/* Step 10: Payment */}
          <Route
            path="step/10"
            element={
              <Step11Payment
                nextStep={nextStepFactory(11)}
                prevStep={prevStepFactory(9)}
                formData={formData}
                setFormData={setFormData}
              />
            }
          />

          {/* Step 11: Final Submit */}
          <Route
            path="step/11"
            element={
              <Step12 prevStep={prevStepFactory(10)} formData={formData} />
            }
          />

          <Route path="*" element={<Navigate to="step/1" replace />} />
        </Routes>
      </div>
    </div>
  );
}



// import { useEffect, useState } from "react";
// import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

// import Step1 from "./Step1";
// import Step4 from "./Step4";
// import Step5 from "./Step5";
// import Step6 from "./Step6";
// import Step7 from "./Step7";
// import Step8 from "./Step8";
// import Step9 from "./Step9";
// import Step10 from "./Step10";
// import Step11 from "./Step11";
// import Step11Payment from "./Step11Payment";
// import Step12 from "./Step12";

// const STORAGE_KEY = "multiStepRegistration_form_v1";
// const TOTAL_STEPS = 11;

// export default function AddUsers() {
//   const navigate = useNavigate();

//   // Get step from URL
//   const stepFromURL = Number(window.location.pathname.split("/").pop());
//   const currentStep = isNaN(stepFromURL) ? 1 : stepFromURL;

//   const progress = Math.round((currentStep / TOTAL_STEPS) * 100);
//   const isFinalStep = currentStep === TOTAL_STEPS;

//   // Rehydrate form data
//   const [formData, setFormData] = useState(() => {
//     try {
//       const raw = localStorage.getItem(STORAGE_KEY);
//       return raw ? JSON.parse(raw) : {};
//     } catch {
//       return {};
//     }
//   });

//   // Remove non-serializable fields before saving
//   const getSerializableData = (data) => {
//     const clone = {};
//     for (const key of Object.keys(data)) {
//       const val = data[key];
//       if (key === "password" || key === "otp") continue;
//       if (val instanceof File || val instanceof Blob) continue;
//       if (typeof val === "function") continue;
//       if (val && typeof val === "object" && val.nodeType) continue;
//       clone[key] = val;
//     }
//     return clone;
//   };

//   // Persist form data
//   useEffect(() => {
//     try {
//       const safeData = getSerializableData(formData);
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
//     } catch (err) {
//       console.warn("LocalStorage save failed:", err.message);
//     }
//   }, [formData]);

//   // Navigation helpers
//   const goTo = (stepNumber, extra = {}) => {
//     const s = Math.max(1, Math.min(TOTAL_STEPS, Number(stepNumber) || 1));
//     if (Object.keys(extra).length > 0) {
//       setFormData((prev) => ({ ...prev, ...extra }));
//     }
//     navigate(`/admin/add-users/step/${s}`);
//   };

//   const nextStepFactory = (nextStep) => (data = {}) => {
//     setFormData((prev) => ({ ...prev, ...data }));
//     goTo(nextStep);
//   };

//   const prevStepFactory = (prevStep) => (data = {}) => {
//     if (formData.otpVerified && prevStep <= 1) return;
//     setFormData((prev) => ({ ...prev, ...data }));
//     goTo(prevStep);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center p-6 font-display">

//       {/* 🔹 Progress Bar (hidden on final step) */}
//       {!isFinalStep && (
//         <div className="w-full max-w-2xl mb-6">
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-sm font-semibold text-rose-700">
//               Step {currentStep} of {TOTAL_STEPS}
//             </span>
//             <span className="text-sm text-gray-600">
//               Registration Progress
//             </span>
//           </div>

//           <div className="w-full bg-rose-200 rounded-full h-2">
//             <div
//               className="bg-rose-600 h-2 rounded-full transition-all duration-500"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//         </div>
//       )}

//       {/* 🔹 Steps Container */}
//       <div className="w-full max-w-2xl">
//         <Routes>
//           <Route path="" element={<Navigate to="step/1" replace />} />

//           <Route
//             path="step/1"
//             element={<Step1 nextStep={nextStepFactory(2)} formData={formData} />}
//           />

//           <Route
//             path="step/2"
//             element={
//               <Step4
//                 nextStep={nextStepFactory(3)}
//                 prevStep={prevStepFactory(1)}
//                 formData={formData}
//               />
//             }
//           />

//           <Route
//             path="step/3"
//             element={
//               <Step5
//                 nextStep={nextStepFactory(4)}
//                 prevStep={prevStepFactory(2)}
//                 formData={formData}
//               />
//             }
//           />

//           <Route
//             path="step/4"
//             element={
//               <Step6
//                 nextStep={nextStepFactory(5)}
//                 prevStep={prevStepFactory(3)}
//                 formData={formData}
//               />
//             }
//           />

//           <Route
//             path="step/5"
//             element={
//               <Step7
//                 nextStep={nextStepFactory(6)}
//                 prevStep={prevStepFactory(4)}
//                 formData={formData}
//               />
//             }
//           />

//           <Route
//             path="step/6"
//             element={
//               <Step8
//                 nextStep={nextStepFactory(7)}
//                 prevStep={prevStepFactory(5)}
//                 formData={formData}
//               />
//             }
//           />

//           <Route
//             path="step/7"
//             element={
//               <Step9
//                 nextStep={nextStepFactory(8)}
//                 prevStep={prevStepFactory(6)}
//                 formData={formData}
//               />
//             }
//           />

//           <Route
//             path="step/8"
//             element={
//               <Step10
//                 nextStep={nextStepFactory(9)}
//                 prevStep={prevStepFactory(7)}
//                 formData={formData}
//               />
//             }
//           />

//           <Route
//             path="step/9"
//             element={
//               <Step11
//                 nextStep={nextStepFactory(10)}
//                 prevStep={prevStepFactory(8)}
//                 formData={formData}
//               />
//             }
//           />

//           <Route
//             path="step/10"
//             element={
//               <Step11Payment
//                 nextStep={nextStepFactory(11)}
//                 prevStep={prevStepFactory(9)}
//                 formData={formData}
//                 setFormData={setFormData}
//               />
//             }
//           />

//           <Route
//             path="step/11"
//             element={<Step12 formData={formData} />}
//           />

//           <Route path="*" element={<Navigate to="step/1" replace />} />
//         </Routes>
//       </div>
//     </div>
//   );
// }
