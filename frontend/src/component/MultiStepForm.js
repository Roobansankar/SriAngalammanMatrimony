// import React, { useState } from "react";
// import Step1 from "./Step1";
// import Step2 from "./Step2";
// import Step3 from "./Step3";
// import Step4 from "./Step4";
// import Step5 from "./Step5";
// import Step6 from "./Step6";
// import Step7 from "./Step7";
// import Step8 from "./Step8";
// import Step9 from "./Step9";
// import Step10 from "./Step10";
// import Step11 from "./Step11"; // review step
// import Step11Payment from "./Step11Payment"; // choose plan & pay
// import Step12 from "./Step12"; // submit

// export default function MultiStepForm() {
//   // NOTE: you have 13 components in your snippets (1..12 + extra),
//   // but using the components you provided here we set totalSteps = 13
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({});

//   const totalSteps = 13; // update if you add/remove steps

//   // Use functional updates to avoid stale closures
//   const nextStep = (data = {}) => {
//     setFormData((prev) => {
//       const merged = { ...prev, ...data };
//       console.log("nextStep - merged formData:", merged);
//       return merged;
//     });
//     setStep((s) => s + 1);
//   };

//   // allow prev to optionally merge partial data too
//   const prevStep = (data = {}) => {
//     setFormData((prev) => ({ ...prev, ...data }));
//     setStep((s) => Math.max(1, s - 1));
//   };

//   const progress = Math.round((step / totalSteps) * 100);

//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return <Step1 nextStep={nextStep} formData={formData} />;
//       case 2:
//         return (
//           <Step2 nextStep={nextStep} prevStep={prevStep} formData={formData} />
//         );
//       case 3:
//         return (
//           <Step3 nextStep={nextStep} prevStep={prevStep} formData={formData} />
//         );
//       case 4:
//         return (
//           <Step4 nextStep={nextStep} prevStep={prevStep} formData={formData} />
//         );
//       case 5:
//         return (
//           <Step5 nextStep={nextStep} prevStep={prevStep} formData={formData} />
//         );
//       case 6:
//         return (
//           <Step6 nextStep={nextStep} prevStep={prevStep} formData={formData} />
//         );
//       case 7:
//         return (
//           <Step7 nextStep={nextStep} prevStep={prevStep} formData={formData} />
//         );
//       case 8:
//         return (
//           <Step8 nextStep={nextStep} prevStep={prevStep} formData={formData} />
//         );
//       case 9:
//         return (
//           <Step9 nextStep={nextStep} prevStep={prevStep} formData={formData} />
//         );
//       case 10:
//         return (
//           <Step10 nextStep={nextStep} prevStep={prevStep} formData={formData} />
//         );
//       case 11:
//         // Review step (Step11)
//         return (
//           <Step11 nextStep={nextStep} prevStep={prevStep} formData={formData} />
//         );
//       case 12:
//         // Payment step (Step11Payment)
//         return (
//           <Step11Payment
//             nextStep={nextStep}
//             prevStep={prevStep}
//             formData={formData}
//             setFormData={setFormData}
//           />
//         );
//       case 13:
//         // Final submit step (Step12)
//         return <Step12 prevStep={prevStep} formData={formData} />;
//       default:
//         return <h2 className="text-center">Registration Completed!</h2>;
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-pink-50 to-rose-100 p-6 font-display">
//       <div className="w-full max-w-2xl mb-6">
//         <div className="flex justify-between items-center mb-2">
//           <span className="text-sm font-semibold text-rose-700">
//             Step {step} of {totalSteps}
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

//       <div className="w-full flex justify-center">{renderStep()}</div>

//       <p className="text-sm text-gray-500 mt-6">
//         Your information is safe and confidential.
//       </p>
//     </div>
//   );
// }

// MultiStepFormRoutes.jsx
// Router-based multistep registration component
// Place this file in your components folder and import it from App.js as shown in the App.js snippet below.

// import React, { useEffect, useState } from "react";
// import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// // import your existing step components
// import Step1 from "./Step1";
// import Step2 from "./Step2";
// import Step3 from "./Step3";
// import Step4 from "./Step4";
// import Step5 from "./Step5";
// import Step6 from "./Step6";
// import Step7 from "./Step7";
// import Step8 from "./Step8";
// import Step9 from "./Step9";
// import Step10 from "./Step10";
// import Step11 from "./Step11"; // review
// import Step11Payment from "./Step11Payment"; // payment
// import Step12 from "./Step12"; // final submit

// const STORAGE_KEY = "multiStepRegistration_form_v1";
// const TOTAL_STEPS = 13;

// export default function MultiStepForm() {
//   const navigate = useNavigate();

//   // rehydrate formData from localStorage if present
//   const [formData, setFormData] = useState(() => {
//     try {
//       const raw = localStorage.getItem(STORAGE_KEY);
//       if (!raw) return {};
//       return JSON.parse(raw) || {};
//     } catch (e) {
//       console.warn("Could not parse saved form data:", e);
//       return {};
//     }
//   });

//   // persist formData to localStorage when it changes
//   useEffect(() => {
//     try {
//       // don't persist sensitive fields like password/otp
//       const toSave = { ...formData };
//       if (toSave.password) delete toSave.password;
//       if (toSave.otp) delete toSave.otp;
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
//     } catch (e) {
//       console.warn("Could not save registration state:", e);
//     }
//   }, [formData]);

//   // helper to navigate/clamp step number
//   const goTo = (stepNumber, extra = {}) => {
//     const s = Math.max(1, Math.min(TOTAL_STEPS, Number(stepNumber) || 1));
//     // merge any passed extra data into formData
//     if (extra && Object.keys(extra).length) {
//       setFormData((prev) => ({ ...prev, ...extra }));
//     }
//     navigate(`/register/step/${s}`);
//   };

//   // helpers passed to steps to keep API similar to your current components
//   const nextStepFactory =
//     (nextStepNumber) =>
//     (data = {}) => {
//       setFormData((prev) => ({ ...prev, ...data }));
//       goTo(nextStepNumber);
//     };

//   const prevStepFactory =
//     (prevStepNumber) =>
//     (data = {}) => {
//       setFormData((prev) => ({ ...prev, ...data }));
//       goTo(prevStepNumber);
//     };

//   // optional: explicit reset (useful for a "start over" button)
//   const resetForm = () => {
//     localStorage.removeItem(STORAGE_KEY);
//     setFormData({});
//     navigate("/register/step/1");
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-pink-50 to-rose-100 p-6 font-display">
//       <div className="w-full max-w-2xl mb-6">
//         {/* You can add a progress bar here if you prefer — since route controls step, you can compute it from URL */}
//       </div>

//       <div className="w-full max-w-2xl">
//         <Routes>
//           {/* default to step 1 */}
//           <Route path="" element={<Navigate to="step/1" replace />} />
//           <Route path="step/" element={<Navigate to="../step/1" replace />} />

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

//           {/* payment step uses Step11Payment component (we route it as step/12) */}
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

//           {/* final submit */}
//           <Route
//             path="step/13"
//             element={
//               <Step12 prevStep={prevStepFactory(12)} formData={formData} />
//             }
//           />

//           {/* catch-all: redirect to step/1 (or you could redirect to last valid step) */}
//           <Route path="*" element={<Navigate to="step/1" replace />} />
//         </Routes>
//       </div>

//       {/* Optional Reset button for debugging */}
//       <div className="w-full max-w-2xl mt-6 text-center">
//         <button
//           onClick={resetForm}
//           className="text-xs text-rose-600 hover:underline"
//         >
//           Start Over (clear saved data)
//         </button>
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

import Step1 from "./Step1";
import Step10 from "./Step10";
import Step11 from "./Step11";
import Step11Payment from "./Step11Payment";
import Step12 from "./Step12";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";
import Step8 from "./Step8";
import Step9 from "./Step9";

const STORAGE_KEY = "multiStepRegistration_form_v1";
const TOTAL_STEPS = 13; // Restored payment step

export default function MultiStepForm() {
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
    navigate(`/register/step/${s}`);
  };

  const nextStepFactory =
    (nextStep) =>
    (data = {}) => {
      setFormData((prev) => ({ ...prev, ...data }));
      goTo(nextStep);
    };

  // Prevent going back to step 1 or 2 if email is already verified
  const prevStepFactory =
    (prevStep) =>
    (data = {}) => {
      // If email is verified and trying to go back to step 1 or 2, block it
      if (formData.otpVerified && prevStep <= 2) {
        console.log("Cannot go back - email already verified");
        return;
      }
      setFormData((prev) => ({ ...prev, ...data }));
      goTo(prevStep);
    };


  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-pink-50 to-rose-100 p-6 font-display">
      {/* ✅ TOP PROGRESS BAR (copied from your old version) */}
      <div className="w-full max-w-2xl mb-6 mt-20">
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

          <Route
            path="step/1"
            element={
              <Step1 nextStep={nextStepFactory(2)} formData={formData} />
            }
          />

          <Route
            path="step/2"
            element={
              <Step2
                nextStep={nextStepFactory(3)}
                prevStep={prevStepFactory(1)}
                formData={formData}
              />
            }
          />

          <Route
            path="step/3"
            element={
              <Step3
                nextStep={nextStepFactory(4)}
                prevStep={prevStepFactory(2)}
                formData={formData}
              />
            }
          />

          <Route
            path="step/4"
            element={
              <Step4
                nextStep={nextStepFactory(5)}
                prevStep={prevStepFactory(3)}
                formData={formData}
              />
            }
          />

          <Route
            path="step/5"
            element={
              <Step5
                nextStep={nextStepFactory(6)}
                prevStep={prevStepFactory(4)}
                formData={formData}
              />
            }
          />

          <Route
            path="step/6"
            element={
              <Step6
                nextStep={nextStepFactory(7)}
                prevStep={prevStepFactory(5)}
                formData={formData}
              />
            }
          />

          <Route
            path="step/7"
            element={
              <Step7
                nextStep={nextStepFactory(8)}
                prevStep={prevStepFactory(6)}
                formData={formData}
              />
            }
          />

          <Route
            path="step/8"
            element={
              <Step8
                nextStep={nextStepFactory(9)}
                prevStep={prevStepFactory(7)}
                formData={formData}
              />
            }
          />

          <Route
            path="step/9"
            element={
              <Step9
                nextStep={nextStepFactory(10)}
                prevStep={prevStepFactory(8)}
                formData={formData}
              />
            }
          />

          <Route
            path="step/10"
            element={
              <Step10
                nextStep={nextStepFactory(11)}
                prevStep={prevStepFactory(9)}
                formData={formData}
              />
            }
          />

          <Route
            path="step/11"
            element={
              <Step11
                nextStep={nextStepFactory(12)}
                prevStep={prevStepFactory(10)}
                formData={formData}
              />
            }
          />

          {/* Step 12: Payment */}
          <Route
            path="step/12"
            element={
              <Step11Payment
                nextStep={nextStepFactory(13)}
                prevStep={prevStepFactory(11)}
                formData={formData}
                setFormData={setFormData}
              />
            }
          />

          {/* Step 13: Final Submit */}
          <Route
            path="step/13"
            element={
              <Step12 prevStep={prevStepFactory(12)} formData={formData} />
            }
          />

          <Route path="*" element={<Navigate to="step/1" replace />} />
        </Routes>
      </div>

     
    </div>
  );
}
