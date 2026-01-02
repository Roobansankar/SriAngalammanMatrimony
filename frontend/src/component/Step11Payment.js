
import axios from "axios";
import { useEffect, useState } from "react";

export default function Step11Payment({
  nextStep,
  prevStep,
  formData,
  setFormData,
}) {
  const [loading, setLoading] = useState(false);

  const [plan, setPlan] = useState(formData.plan || null);


  // Load Razorpay script once
  // useEffect(() => {
  //   const loadRazorpay = () => {
  //     return new Promise((resolve) => {
  //       if (window.Razorpay) {
  //         resolve(true);
  //         return;
  //       }
  //       const script = document.createElement("script");
  //       script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //       script.onload = () => resolve(true);
  //       script.onerror = () => resolve(false);
  //       document.body.appendChild(script);
  //     });
  //   };
  //   loadRazorpay();
  // }, []);

 
  const handlePayment = async () => {
    if (!plan) {
      alert("Please select a plan");
      return;
    }

    const res = await axios.post("/api/payment/ccavenue-init", {
      plan,
      email: formData.email,
      occupation: formData.occupation,
      maritalStatus: formData.maritalStatus,
      gender: formData.gender,
    });

    const form = document.createElement("form");
    form.method = "POST";
    form.action = res.data.ccUrl;

    form.innerHTML = `
    <input type="hidden" name="encRequest" value="${res.data.encRequest}" />
    <input type="hidden" name="access_code" value="${res.data.accessCode}" />
  `;

    document.body.appendChild(form);
    form.submit();
  };


  return (
    <div className="max-w-lg mx-auto mt-12 bg-white shadow-lg rounded-2xl p-8 border text-center">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">
        Step 6: Choose Your Plan
      </h3>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div
          onClick={() => setPlan("basic")}
          className={`p-6 rounded-xl border cursor-pointer ${
            plan === "basic" ? "border-rose-500 bg-rose-50" : "border-gray-200"
          }`}
        >
          <h4 className="font-bold text-lg mb-2 text-rose-700">Basic Plan</h4>
          <p className="text-gray-700">₹1500 - View limited profiles</p>
        </div>

        <div
          onClick={() => setPlan("premium")}
          className={`p-6 rounded-xl border cursor-pointer ${
            plan === "premium"
              ? "border-rose-500 bg-rose-50"
              : "border-gray-200"
          }`}
        >
          <h4 className="font-bold text-lg mb-2 text-rose-700">Premium Plan</h4>
          <p className="text-gray-700">₹4000 - View all profiles</p>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => prevStep({ plan })}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
        >
          ← Back
        </button>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="px-6 py-2 bg-gradient-to-r from-pink-600 to-yellow-500 text-white rounded-lg shadow hover:scale-105 transition"
        >
          {loading ? "Processing..." : "Proceed to Pay"}
        </button>
      </div>
    </div>
  );
}


// import axios from "axios";
// import { useState } from "react";

// export default function Step11Payment({
//   nextStep,
//   prevStep,
//   formData,
//   setFormData,
// }) {
//   const [loading, setLoading] = useState(false);
//   const [plan, setPlan] = useState(formData.plan || null);

//   const handlePayment = async () => {
//     if (!plan) {
//       alert("Please select a plan before proceeding");
//       return;
//     }

//     try {
//       setLoading(true);

//       // 🔹 Call backend to initiate CCAvenue payment
//       const res = await axios.post(
//         `${process.env.REACT_APP_API_BASE}/api/ccavenue/initiate`,
//         {
//           plan,
//           email: formData.email,

//           // Optional: pass these if you want backend to store before redirect
//           occupation: formData.occupation,
//           maritalStatus: formData.maritalStatus,
//           gender: formData.gender,
//         },
//         {
//           responseType: "text", // IMPORTANT
//         }
//       );

//       // 🔹 CCAvenue returns auto-submit HTML form
//       document.open();
//       document.write(res.data);
//       document.close();
//     } catch (err) {
//       console.error(err);
//       alert("Payment initiation failed");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto mt-12 bg-white shadow-lg rounded-2xl p-8 border text-center">
//       <h3 className="text-2xl font-semibold mb-6 text-gray-800">
//         Step 6: Choose Your Plan
//       </h3>

//       <div className="grid grid-cols-2 gap-6 mb-8">
//         <div
//           onClick={() => setPlan("basic")}
//           className={`p-6 rounded-xl border cursor-pointer ${
//             plan === "basic" ? "border-rose-500 bg-rose-50" : "border-gray-200"
//           }`}
//         >
//           <h4 className="font-bold text-lg mb-2 text-rose-700">Basic Plan</h4>
//           <p className="text-gray-700">₹1500 - View limited profiles</p>
//         </div>

//         <div
//           onClick={() => setPlan("premium")}
//           className={`p-6 rounded-xl border cursor-pointer ${
//             plan === "premium"
//               ? "border-rose-500 bg-rose-50"
//               : "border-gray-200"
//           }`}
//         >
//           <h4 className="font-bold text-lg mb-2 text-rose-700">Premium Plan</h4>
//           <p className="text-gray-700">₹4000 - View all profiles</p>
//         </div>
//       </div>

//       <div className="flex justify-center gap-4">
//         <button
//           onClick={() => prevStep({ plan })}
//           className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
//         >
//           ← Back
//         </button>

//         <button
//           onClick={handlePayment}
//           disabled={loading}
//           className="px-6 py-2 bg-gradient-to-r from-pink-600 to-yellow-500 text-white rounded-lg shadow hover:scale-105 transition"
//         >
//           {loading ? "Redirecting..." : "Proceed to Pay"}
//         </button>
//       </div>
//     </div>
//   );
// }
