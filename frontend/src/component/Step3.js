

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { BadgeCheck, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

// export default function Step3({ nextStep, prevStep, formData }) {
//   const [matriId, setMatriId] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!formData.gender) {
//       console.warn("Gender is missing — cannot generate MatriID yet.");
//       setLoading(false);
//       return;
//     }

//     axios
//       .get(
//         `http://localhost:5000/api/register/generate-matriid/${formData.gender}`
//       )
//       .then((res) => setMatriId(res.data.matriId))
//       .catch((err) => {
//         console.error("Error fetching MatriID:", err);
//         alert("Could not generate MatriID. Try again.");
//       })
//       .finally(() => setLoading(false));
//   }, [formData.gender]);

//   const handleNext = () => nextStep({ matriId });

//   return (
//     <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6 border border-rose-100 text-center mt-12">
//       {/* Header */}
//       <div className="flex flex-col items-center mb-4">
//         <BadgeCheck className="w-10 h-10 text-rose-600 mb-2" />
//         <h3 className="text-2xl font-bold text-rose-700 mb-1">
//           Your Matri ID is Ready
//         </h3>
//         <p className="text-sm text-gray-600">
//           This unique ID helps identify your profile on our matrimony platform.
//         </p>
//       </div>

//       {/* Matri ID Display */}
//       <div className="my-6">
//         {loading ? (
//           <div className="flex items-center justify-center text-rose-600 font-semibold">
//             <Loader2 className="w-5 h-5 animate-spin mr-2" />
//             Generating your Matri ID...
//           </div>
//         ) : matriId ? (
//           <div className="bg-gradient-to-r from-rose-100 to-pink-50 border border-rose-200 rounded-xl py-4 px-6 shadow-inner">
//             <p className="text-sm text-gray-700">Your Matri ID</p>
//             <p className="text-2xl font-bold text-rose-700 tracking-wide mt-1">
//               {matriId}
//             </p>
//           </div>
//         ) : (
//           <p className="text-gray-500 italic">
//             Unable to generate ID. Please go back and try again.
//           </p>
//         )}
//       </div>

//       {/* Buttons */}
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
//         <button
//           onClick={prevStep}
//           className="flex items-center justify-center gap-1 w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back
//         </button>

//         <button
//           onClick={handleNext}
//           disabled={!matriId || loading}
//           className="flex items-center justify-center gap-2 bg-rose-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-rose-700 transition disabled:opacity-60 w-full sm:w-auto"
//         >
//           {loading ? (
//             <>
//               <Loader2 className="animate-spin w-4 h-4" /> Please wait...
//             </>
//           ) : (
//             <>
//               Continue
//               <ArrowRight className="w-4 h-4" />
//             </>
//           )}
//         </button>
//       </div>

//       {/* Footer */}
//       <p className="text-xs text-gray-500 mt-6">
//         Keep this Matri ID safe — you’ll use it for login and support.
//       </p>
//     </div>
//   );
// }


import axios from "axios";
import { ArrowLeft, ArrowRight, BadgeCheck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Step3({ nextStep, prevStep, formData }) {
  const [matriId, setMatriId] = useState(formData.matriId || "");
  const [loading, setLoading] = useState(!formData.matriId);

  useEffect(() => {
    if (formData.matriId) {
      setMatriId(formData.matriId);
      setLoading(false);
      return;
    }
    
    if (!formData.gender) {
      console.warn("Gender is missing — cannot generate MatriID yet.");
      setLoading(false);
      return;
    }

    axios
      .get(
        `http://localhost:5000/api/register/generate-matriid/${formData.gender}`
      )
      .then((res) => setMatriId(res.data.matriId))
      .catch((err) => {
        console.error("Error fetching MatriID:", err);
        alert("Could not generate MatriID. Try again.");
      })
      .finally(() => setLoading(false));
  }, [formData.gender, formData.matriId]);

  const handleNext = () => nextStep({ matriId });

  return (
    // ✅ Full page center wrapper
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-rose-50 to-rose-100">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6 border border-rose-100 text-center">
        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <BadgeCheck className="w-10 h-10 text-rose-600 mb-2" />
          <h3 className="text-2xl font-bold text-rose-700 mb-1">
            Your Matri ID is Ready
          </h3>
          <p className="text-sm text-gray-600">
            This unique ID helps identify your profile on our matrimony
            platform.
          </p>
        </div>

        {/* Matri ID Display */}
        <div className="my-6">
          {loading ? (
            <div className="flex items-center justify-center text-rose-600 font-semibold">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Generating your Matri ID...
            </div>
          ) : matriId ? (
            <div className="bg-gradient-to-r from-rose-100 to-pink-50 border border-rose-200 rounded-xl py-4 px-6 shadow-inner">
              <p className="text-sm text-gray-700">Your Matri ID</p>
              <p className="text-2xl font-bold text-rose-700 tracking-wide mt-1">
                {matriId}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 italic">
              Unable to generate ID. Please go back and try again.
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          <button
            onClick={prevStep}
            className="flex items-center justify-center gap-1 w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!matriId || loading}
            className="flex items-center justify-center gap-2 bg-rose-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-rose-700 transition disabled:opacity-60 w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" /> Please wait...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 mt-6">
          Keep this Matri ID safe — you’ll use it for login and support.
        </p>
      </div>
    </div>
  );
}
