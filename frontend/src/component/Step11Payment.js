// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export default function Step11Payment({
//   nextStep,
//   prevStep,
//   formData,
//   setFormData,
// }) {
//   const [loading, setLoading] = useState(false);
//   const [plan, setPlan] = useState("basic");

//   // ✅ Load Razorpay script once
//   useEffect(() => {
//     const loadRazorpay = () => {
//       return new Promise((resolve) => {
//         if (window.Razorpay) {
//           resolve(true);
//           return;
//         }
//         const script = document.createElement("script");
//         script.src = "https://checkout.razorpay.com/v1/checkout.js";
//         script.onload = () => resolve(true);
//         script.onerror = () => resolve(false);
//         document.body.appendChild(script);
//       });
//     };
//     loadRazorpay();
//   }, []);

//   const handlePayment = async () => {
//     if (!window.Razorpay) {
//       alert("Razorpay SDK not loaded. Please try again.");
//       return;
//     }

//     try {
//       setLoading(true);

//       // 1️⃣ Create Order on Backend
//       const res = await axios.post(
//         "http://localhost:5000/api/payment/create-order",
//         {
//           plan,
//           email: formData.email,
//         }
//       );

//       const { key, orderId, amount, currency } = res.data;

//       // 2️⃣ Open Razorpay Checkout
//       const options = {
//         key,
//         amount: amount * 100,
//         currency,
//         name: "Sri Angalamman Matrimony",
//         description: `${plan} plan payment`,
//         order_id: orderId,

//         handler: async function (response) {
//           const verifyRes = await axios.post(
//             "http://localhost:5000/api/payment/verify",
//             {
//               ...response,
//               email: formData.email,
//               plan,
//             }
//           );

//           if (verifyRes.data.success) {
//             alert("✅ Payment Successful!");

//             // ✅ Update plan properly before moving
//             setFormData((prev) => ({ ...prev, plan, paymentDone: true }));

//             // Wait a bit before going to next step
//             setTimeout(() => nextStep(), 200);
//           } else {
//             alert("❌ Payment verification failed!");
//           }
//         },

//         prefill: {
//           name: formData.fname,
//           email: formData.email,
//           contact: formData.mobile,
//         },
//         theme: { color: "#e11d48" },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error(err);
//       alert("Payment initialization failed!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto mt-12 bg-white shadow-lg rounded-2xl p-8 border text-center">
//       <h3 className="text-2xl font-semibold mb-6 text-gray-800">
//         Step 11: Choose Your Plan
//       </h3>

//       <div className="grid grid-cols-2 gap-6 mb-8">
//         <div
//           onClick={() => setPlan("basic")}
//           className={`p-6 rounded-xl border cursor-pointer ${
//             plan === "basic" ? "border-rose-500 bg-rose-50" : "border-gray-200"
//           }`}
//         >
//           <h4 className="font-bold text-lg mb-2 text-rose-700">Basic Plan</h4>
//           <p className="text-gray-700">₹1 - View limited profiles</p>
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
//           <p className="text-gray-700">₹2 - View all profiles</p>
//         </div>
//       </div>

//       <div className="flex justify-center gap-4">
//         <button
//           onClick={prevStep}
//           className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
//         >
//           ← Back
//         </button>
//         <button
//           onClick={handlePayment}
//           disabled={loading}
//           className="px-6 py-2 bg-gradient-to-r from-pink-600 to-yellow-500 text-white rounded-lg shadow hover:scale-105 transition"
//         >
//           {loading ? "Processing..." : "Proceed to Pay"}
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Step11Payment({
  nextStep,
  prevStep,
  formData,
  setFormData,
}) {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(formData.plan || "basic");

  // Load Razorpay script once
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };
    loadRazorpay();
  }, []);

  const handlePayment = async () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please try again.");
      return;
    }

    try {
      setLoading(true);

      // Create order on backend
      const res = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        {
          plan,
          email: formData.email,
        }
      );

      const { key, orderId, amount, currency } = res.data;

      const options = {
        key,
        amount: amount * 100,
        currency,
        name: "Sri Angalamman Matrimony",
        description: `${plan} plan payment`,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:5000/api/payment/verify",
              {
                ...response,
                email: formData.email,
                plan,
              }
            );

            if (verifyRes.data.success) {
              alert("✅ Payment Successful!");

              // create a snapshot with the chosen plan
              const updated = { ...formData, plan, paymentDone: true };

              // update parent state immediately
              setFormData(updated);

              // pass the snapshot to nextStep so parent merges same object
              nextStep(updated);
            } else {
              alert("❌ Payment verification failed!");
            }
          } catch (e) {
            console.error("verification error:", e);
            alert("❌ Payment verification error");
          }
        },
        prefill: {
          name: formData.fname,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: { color: "#e11d48" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment initialization failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 bg-white shadow-lg rounded-2xl p-8 border text-center">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">
        Step 12: Choose Your Plan
      </h3>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div
          onClick={() => setPlan("basic")}
          className={`p-6 rounded-xl border cursor-pointer ${
            plan === "basic" ? "border-rose-500 bg-rose-50" : "border-gray-200"
          }`}
        >
          <h4 className="font-bold text-lg mb-2 text-rose-700">Basic Plan</h4>
          <p className="text-gray-700">₹1 - View limited profiles</p>
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
          <p className="text-gray-700">₹2 - View all profiles</p>
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
