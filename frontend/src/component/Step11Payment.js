
// import axios from "axios";
// import { useEffect, useState } from "react";

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
//       alert("Please select a plan");
//       return;
//     }

//     const res = await axios.post(
//   "https://www.sriangalammanmatrimony.com/api/payment/ccavenue-init",
//   {
//     plan,
//     email: formData.email,
//   }
// );

//     const form = document.createElement("form");
//     form.method = "POST";
//     form.action = res.data.ccUrl;

//     form.innerHTML = `
//     <input type="hidden" name="encRequest" value="${res.data.encRequest}" />
//     <input type="hidden" name="access_code" value="${res.data.accessCode}" />
//   `;

//     document.body.appendChild(form);
//     form.submit();
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
//           {loading ? "Processing..." : "Proceed to Pay"}
//         </button>
//       </div>
//     </div>
//   );
// }


// import axios from "axios";
// import { useState } from "react";

// export default function Step11Payment({ nextStep, prevStep, formData }) {
//   const [plan, setPlan] = useState(formData.plan || null);
//   const [loading, setLoading] = useState(false);

// const handlePayment = async () => {
//   if (!plan) {
//     alert("Please select a plan");
//     return;
//   }

//   try {
//     setLoading(true);

//     const res = await axios.post(
//       "http://localhost:5000/api/payment/ccavenue-init",
//       {
//         plan,
//         email: formData.email,
//         // formData,
//         formData: JSON.stringify(formData),
//       },
//     );

//     const form = document.createElement("form");
//     form.method = "POST";
//     form.action = res.data.ccUrl;

//     form.innerHTML = `
//       <input type="hidden" name="encRequest" value="${res.data.encRequest}" />
//       <input type="hidden" name="access_code" value="${res.data.accessCode}" />
//     `;

//     document.body.appendChild(form);
//     form.submit();
//   } catch {
//     alert("Payment init failed");
//     setLoading(false);
//   }
// };

//   return (
//     <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-xl shadow text-center">
//       <h2 className="text-xl font-bold mb-6">Choose Your Plan</h2>

//       <div className="grid grid-cols-2 gap-4 mb-6">
//         <div
//           onClick={() => setPlan("basic")}
//           className={`p-5 border rounded-lg cursor-pointer ${
//             plan === "basic" && "border-rose-500 bg-rose-50"
//           }`}
//         >
//           <h3 className="font-semibold">Basic</h3>
//           <p>₹5</p>
//         </div>

//         <div
//           onClick={() => setPlan("premium")}
//           className={`p-5 border rounded-lg cursor-pointer ${
//             plan === "premium" && "border-rose-500 bg-rose-50"
//           }`}
//         >
//           <h3 className="font-semibold">Premium</h3>
//           <p>₹10</p>
//         </div>
//       </div>

//       <div className="flex justify-between">
//         <button
//           onClick={() => prevStep({ plan })}
//           className="px-4 py-2 bg-gray-300 rounded"
//         >
//           Back
//         </button>

//         <button
//           onClick={handlePayment}
//           disabled={loading}
//           className="px-6 py-2 bg-gradient-to-r from-pink-600 to-yellow-500 text-white rounded"
//         >
//           {loading ? "Redirecting..." : "Pay Now"}
//         </button>
//       </div>
//     </div>
//   );
// }


// import axios from "axios";
// import { useState } from "react";

// export default function Step11Payment({ prevStep, formData }) {
//   const [plan, setPlan] = useState(formData.plan || null);

//   const [loading, setLoading] = useState(false);

//   const handlePayment = async () => {
//     if (!plan) {
//       alert("Please select a plan");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await axios.post(
//         "http://localhost:5000/api/payment/ccavenue-init",
//         {
//           plan,
//           email: formData.email,
//           formData: JSON.stringify(formData),
//         },
//       );

//       const form = document.createElement("form");

//       form.method = "POST";
//       form.action = res.data.ccUrl;

//       form.innerHTML = `
//         <input type="hidden" name="encRequest" value="${res.data.encRequest}" />
//         <input type="hidden" name="access_code" value="${res.data.accessCode}" />
//       `;

//       document.body.appendChild(form);
//       form.submit();
//     } catch (err) {
//       console.error(err);
//       alert("Payment init failed");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-xl shadow text-center">
//       <h2 className="text-xl font-bold mb-6">Choose Your Plan</h2>

//       <div className="grid grid-cols-2 gap-4 mb-6">
//         <div
//           onClick={() => setPlan("basic")}
//           className={`p-5 border rounded-lg cursor-pointer ${
//             plan === "basic" && "border-rose-500 bg-rose-50"
//           }`}
//         >
//           <h3>Basic</h3>
//           <p>₹5</p>
//         </div>

//         <div
//           onClick={() => setPlan("premium")}
//           className={`p-5 border rounded-lg cursor-pointer ${
//             plan === "premium" && "border-rose-500 bg-rose-50"
//           }`}
//         >
//           <h3>Premium</h3>
//           <p>₹10</p>
//         </div>
//       </div>

//       <button
//         onClick={handlePayment}
//         disabled={loading}
//         className="px-6 py-2 bg-gradient-to-r from-pink-600 to-yellow-500 text-white rounded"
//       >
//         {loading ? "Redirecting..." : "Pay Now"}
//       </button>
//     </div>
//   );
// }




import axios from "axios";
import { useState } from "react";

export default function Step11Payment({ formData }) {
  const [plan, setPlan] = useState(formData.plan || null);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!plan) {
      alert("Please select a plan");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://www.sriangalammanmatrimony.com/api/payment/ccavenue-init",
        {
          plan,
          email: formData.email,
          formData: JSON.stringify(formData),
        },
      );

      const form = document.createElement("form");
      form.method = "POST";
      form.action = res.data.ccUrl;

      form.innerHTML = `
        <input type="hidden" name="encRequest" value="${res.data.encRequest}" />
        <input type="hidden" name="access_code" value="${res.data.accessCode}" />
      `;

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error(err);
      alert("Payment init failed");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-xl shadow text-center">
      <h2 className="text-xl font-bold mb-6">Choose Your Plan</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          onClick={() => setPlan("basic")}
          className={`p-5 border rounded-lg cursor-pointer ${
            plan === "basic" && "border-rose-500 bg-rose-50"
          }`}
        >
          <h3>Basic</h3>
          <p>₹5</p>
        </div>

        <div
          onClick={() => setPlan("premium")}
          className={`p-5 border rounded-lg cursor-pointer ${
            plan === "premium" && "border-rose-500 bg-rose-50"
          }`}
        >
          <h3>Premium</h3>
          <p>₹10</p>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="px-6 py-2 bg-gradient-to-r from-pink-600 to-yellow-500 text-white rounded"
      >
        {loading ? "Redirecting..." : "Pay Now"}
      </button>
    </div>
  );
}
