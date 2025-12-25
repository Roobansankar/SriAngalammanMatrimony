// import axios from "axios";
// import { useEffect, useState } from "react";

// const API_BASE = (process.env.REACT_APP_API_BASE || "") + "/api/";

// // Only allow letters and spaces for names
// const formatName = (value) => {
//   if (!value) return "";
//   return value.replace(/[^a-zA-Z\s'.,-]/g, "");
// };

// export default function Step8({ nextStep, prevStep, formData = {} }) {
//   const [options, setOptions] = useState({
//     familyValues: [],
//     familyTypes: [],
//     familyStatus: [],
//     motherTongues: [],
//     brothers: [],
//     brothersMarried: [],
//     sisters: [],
//     sistersMarried: [],
//     familyWealth: [],
//   });

//   const [errors, setErrors] = useState({});

//   const [data, setData] = useState({
//     familyValues: formData.familyValues || "",
//     familyType: formData.familyType || "",
//     familyStatus: formData.familyStatus || "",
//     motherTongue: formData.motherTongue || "",
//     noOfBrothers: formData.noOfBrothers || "",
//     noOfBrothersMarried: formData.noOfBrothersMarried || "",
//     noOfSisters: formData.noOfSisters || "",
//     noOfSistersMarried: formData.noOfSistersMarried || "",
//     fatherName: formData.fatherName || "",
//     fatherOccupation: formData.fatherOccupation || "",
//     motherName: formData.motherName || "",
//     motherOccupation: formData.motherOccupation || "",
//     parentsStay: formData.parentsStay || "",
//     familyWealth: formData.familyWealth || "",
//     familyDescription: formData.familyDescription || "",
//     familyMedicalHistory: formData.familyMedicalHistory || "",
//   });

//   // Sync local state when formData prop changes (e.g., after localStorage load)
//   useEffect(() => {
//     if (Object.keys(formData).length > 0) {
//       setData((prev) => ({
//         ...prev,
//         familyValues: formData.familyValues || prev.familyValues,
//         familyType: formData.familyType || prev.familyType,
//         familyStatus: formData.familyStatus || prev.familyStatus,
//         motherTongue: formData.motherTongue || prev.motherTongue,
//         noOfBrothers: formData.noOfBrothers || prev.noOfBrothers,
//         noOfBrothersMarried:
//           formData.noOfBrothersMarried || prev.noOfBrothersMarried,
//         noOfSisters: formData.noOfSisters || prev.noOfSisters,
//         noOfSistersMarried:
//           formData.noOfSistersMarried || prev.noOfSistersMarried,
//         fatherName: formData.fatherName || prev.fatherName,
//         fatherOccupation: formData.fatherOccupation || prev.fatherOccupation,
//         motherName: formData.motherName || prev.motherName,
//         motherOccupation: formData.motherOccupation || prev.motherOccupation,
//         noOfBrothersUnmarried: formData.noOfBrothersUnmarried || "",
//         noOfSistersUnmarried: formData.noOfSistersUnmarried || "",

//         familyWealth: formData.familyWealth || prev.familyWealth,
//         familyDescription: formData.familyDescription || prev.familyDescription,
//         familyMedicalHistory:
//           formData.familyMedicalHistory || prev.familyMedicalHistory,
//       }));
//     }
//   }, [formData]);

//   useEffect(() => {
//     async function loadDropdowns() {
//       try {
//         const [
//           valuesRes,
//           typesRes,
//           statusRes,
//           tonguesRes,
//           broRes,
//           broMarriedRes,
//           sisRes,
//           sisMarriedRes,
//           wealthRes,
//         ] = await Promise.all([
//           axios.get(`${API_BASE}family-values`),
//           axios.get(`${API_BASE}family-types`),
//           axios.get(`${API_BASE}family-status`),
//           axios.get(`${API_BASE}mother-tongues`),
//           axios.get(`${API_BASE}no-of-brothers`),
//           axios.get(`${API_BASE}no-of-brothers-married`),
//           axios.get(`${API_BASE}no-of-sisters`),
//           axios.get(`${API_BASE}no-of-sisters-married`),
//           axios.get(`${API_BASE}family-wealth`),
//         ]);

//         setOptions({
//           familyValues: valuesRes.data,
//           familyTypes: typesRes.data,
//           familyStatus: statusRes.data,
//           motherTongues: tonguesRes.data,
//           brothers: broRes.data,
//           brothersMarried: broMarriedRes.data,
//           sisters: sisRes.data,
//           sistersMarried: sisMarriedRes.data,
//           familyWealth: wealthRes.data,
//         });
//       } catch (err) {
//         console.error("Error loading dropdowns:", err);
//       }
//     }

//     loadDropdowns();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let formattedValue = value;

//     // Format name fields to only allow letters and spaces
//     if (name === "fatherName" || name === "motherName") {
//       formattedValue = formatName(value);
//     }

//     setData({ ...data, [name]: formattedValue });

//     // Clear error when typing
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleRadio = (e) => setData({ ...data, parentsStay: e.target.value });

//   const handleNext = () => nextStep(data);

//   return (
//     <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#fff8f0] to-[#fff0e6] shadow-xl rounded-2xl p-8 border border-[#f3cba5] mt-12">
//       <h3 className="text-2xl font-bold text-[#7b1113] text-center mb-6 border-b-2 border-[#f3cba5] pb-3">
//         Step 8: Family Details
//       </h3>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Family Values */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">
//             Family Values
//           </label>
//           <select
//             name="familyValues"
//             value={data.familyValues}
//             onChange={handleChange}
//             className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
//           >
//             <option value="">Select Family Values</option>
//             {options.familyValues.map((v) => (
//               <option key={v.id} value={v.family_values}>
//                 {v.family_values}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Family Type */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">
//             Family Type
//           </label>
//           <select
//             name="familyType"
//             value={data.familyType}
//             onChange={handleChange}
//             className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
//           >
//             <option value="">Select Family Type</option>
//             {options.familyTypes.map((t) => (
//               <option key={t.id} value={t.family_typ}>
//                 {t.family_typ}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Family Status */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">
//             Family Status
//           </label>
//           <select
//             name="familyStatus"
//             value={data.familyStatus}
//             onChange={handleChange}
//             className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
//           >
//             <option value="">Select Family Status</option>
//             {options.familyStatus.map((s) => (
//               <option key={s.id} value={s.family_status}>
//                 {s.family_status}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Mother Tongue */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">
//             Mother Tongue
//           </label>
//           <select
//             name="motherTongue"
//             value={data.motherTongue}
//             onChange={handleChange}
//             className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
//           >
//             <option value="">Select Mother Tongue</option>
//             {options.motherTongues.map((m) => (
//               <option key={m.id} value={m.mother_tounge}>
//                 {m.mother_tounge}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* No. of Brothers */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">
//             No. of Brothers
//           </label>
//           <select
//             name="noOfBrothers"
//             value={data.noOfBrothers}
//             onChange={handleChange}
//             className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
//           >
//             <option value="">Select Number</option>
//             {options.brothers.map((b) => (
//               <option key={b.id} value={b.number}>
//                 {b.number}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* No. of Brothers Married */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">
//             No. of Brothers Married
//           </label>
//           <select
//             name="noOfBrothersMarried"
//             value={data.noOfBrothersMarried}
//             onChange={handleChange}
//             className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
//           >
//             <option value="">Select Number</option>
//             {options.brothersMarried.map((b) => (
//               <option key={b.id} value={b.number_married}>
//                 {b.number_married}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* No. of Sisters */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">
//             No. of Sisters
//           </label>
//           <select
//             name="noOfSisters"
//             value={data.noOfSisters}
//             onChange={handleChange}
//             className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
//           >
//             <option value="">Select Number</option>
//             {options.sisters.map((s) => (
//               <option key={s.id} value={s.number}>
//                 {s.number}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* No. of Sisters Married */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">
//             No. of Sisters Married
//           </label>
//           <select
//             name="noOfSistersMarried"
//             value={data.noOfSistersMarried}
//             onChange={handleChange}
//             className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
//           >
//             <option value="">Select Number</option>
//             {options.sistersMarried.map((s) => (
//               <option key={s.id} value={s.number_married}>
//                 {s.number_married}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block font-medium text-gray-700 mb-1">
//             No. of Brothers Unmarried
//           </label>
//           <input
//             type="number"
//             name="noOfBrothersUnmarried"
//             value={data.noOfBrothersMarried}
//             onChange={handleChange}
//             className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
//             placeholder="Enter Value"
//           />
//         </div>

//         {/* No. of Sisters Unmarried */}
//         <div>
//           <label className="block font-medium text-gray-700 mb-1">
//             No. of Sisters Unmarried
//           </label>
//           <input
//             type="number"
//             name="noOfSistersUnmarried"
//             value={data.noOfSistersMarried}
//             onChange={handleChange}
//             className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
//             placeholder="Enter Value"
//           />
//         </div>
//         <div>
//           {/* Father Name */}
//           <div className="mb-4">
//             <label className="block font-medium text-gray-700 mb-1">
//               Father Name
//             </label>
//             <input
//               type="text"
//               name="fatherName"
//               value={data.fatherName}
//               onChange={handleChange}
//               className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
//               placeholder="Enter Father's Name"
//             />
//           </div>

//           {/* Father Occupation */}
//           <div className="mb-4">
//             <label className="block font-medium text-gray-700 mb-1">
//               Father Occupation
//             </label>
//             <input
//               type="text"
//               name="fatherOccupation"
//               value={data.fatherOccupation}
//               onChange={handleChange}
//               className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
//               placeholder="Enter Father's Occupation"
//             />
//           </div>

//           {/* Mother Name */}
//           <div className="mb-4">
//             <label className="block font-medium text-gray-700 mb-1">
//               Mother Name
//             </label>
//             <input
//               type="text"
//               name="motherName"
//               value={data.motherName}
//               onChange={handleChange}
//               className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
//               placeholder="Enter Mother's Name"
//             />
//           </div>

//           {/* Mother Occupation */}
//           <div className="mb-4">
//             <label className="block font-medium text-gray-700 mb-1">
//               Mother Occupation
//             </label>
//             <input
//               type="text"
//               name="motherOccupation"
//               value={data.motherOccupation}
//               onChange={handleChange}
//               className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
//               placeholder="Enter Mother's Occupation"
//             />
//           </div>
//         </div>
//       </div>
//       {/* No. of Brothers Unmarried */}

//       {/* Family Wealth */}
//       <div className="mt-6">
//         <label className="block font-medium text-gray-700 mb-1">
//           Family Wealth / Assets
//         </label>
//         <select
//           name="familyWealth"
//           value={data.familyWealth}
//           onChange={handleChange}
//           className="w-full border border-[#e4cbb4] rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-[#b91c1c]"
//         >
//           <option value="">Select Family Wealth</option>
//           {options.familyWealth.map((w, i) => (
//             <option key={i} value={w.wealth}>
//               {w.wealth}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Family Description */}
//       <div className="mt-6">
//         <label className="block font-medium text-gray-700 mb-1">
//           Describe your family background
//         </label>
//         <textarea
//           name="familyDescription"
//           rows={3}
//           onChange={handleChange}
//           value={data.familyDescription}
//           className="w-full border border-[#e4cbb4] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#b91c1c]"
//         />
//       </div>

//       {/* Family Medical History (Yes/No Dropdown) */}
//       <div className="mt-6">
//         <label className="block font-medium text-gray-700 mb-1">
//           Any Family Medical History?
//         </label>
//         <select
//           name="familyMedicalHistory"
//           value={data.familyMedicalHistory}
//           onChange={handleChange}
//           className="w-full border border-[#e4cbb4] rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-[#b91c1c]"
//         >
//           <option value="">Select Option</option>
//           <option value="Yes">Yes</option>
//           <option value="No">No</option>
//         </select>
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-between mt-8">
//         <button
//           onClick={prevStep}
//           className="px-6 py-3 rounded-xl bg-[#bca36b] text-[#4b1b00] font-semibold hover:bg-[#d4b76d] transition"
//         >
//           ⬅ Back
//         </button>

//         <button
//           onClick={handleNext}
//           className="px-6 py-3 rounded-xl bg-[#7b1113] text-white font-semibold hover:bg-[#a61b1d] transition"
//         >
//           Next ➡
//         </button>
//       </div>
//     </div>
//   );
// }

import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE = (process.env.REACT_APP_API_BASE || "") + "/api/";

// Only allow letters and spaces for names
const formatName = (value) => {
  if (!value) return "";
  return value.replace(/[^a-zA-Z\s'.,-]/g, "");
};

export default function Step8({ nextStep, prevStep, formData = {} }) {
  const [options, setOptions] = useState({
    familyValues: [],
    familyTypes: [],
    familyStatus: [],
    motherTongues: [],
    brothers: [],
    brothersMarried: [],
    sisters: [],
    sistersMarried: [],
    familyWealth: [],
  });

  const [errors, setErrors] = useState({});

  const [data, setData] = useState({
    familyValues: formData.familyValues || "",
    familyType: formData.familyType || "",
    familyStatus: formData.familyStatus || "",
    motherTongue: formData.motherTongue || "",
    noOfBrothers: formData.noOfBrothers || "",
    noOfBrothersMarried: formData.noOfBrothersMarried || "",
    noOfSisters: formData.noOfSisters || "",
    noOfSistersMarried: formData.noOfSistersMarried || "",
    fatherName: formData.fatherName || "",
    fatherOccupation: formData.fatherOccupation || "",
    motherName: formData.motherName || "",
    motherOccupation: formData.motherOccupation || "",
    noOfBrothersUnmarried: formData.noOfBrothersUnmarried || "",
    noOfSistersUnmarried: formData.noOfSistersUnmarried || "",
    familyWealth: Array.isArray(formData.familyWealth)
      ? formData.familyWealth
      : formData.familyWealth
      ? formData.familyWealth.split(",")
      : [],

    familyDescription: formData.familyDescription || "",
    familyMedicalHistory: formData.familyMedicalHistory || "",
  });

  // Sync with localStorage-loaded data
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      setData((prev) => ({ ...prev, ...formData }));
    }
  }, [formData]);

  useEffect(() => {
    async function loadDropdowns() {
      try {
        const [
          valuesRes,
          typesRes,
          statusRes,
          tonguesRes,
          broRes,
          broMarriedRes,
          sisRes,
          sisMarriedRes,
          wealthRes,
        ] = await Promise.all([
          axios.get(`${API_BASE}family-values`),
          axios.get(`${API_BASE}family-types`),
          axios.get(`${API_BASE}family-status`),
          axios.get(`${API_BASE}mother-tongues`),
          axios.get(`${API_BASE}no-of-brothers`),
          axios.get(`${API_BASE}no-of-brothers-married`),
          axios.get(`${API_BASE}no-of-sisters`),
          axios.get(`${API_BASE}no-of-sisters-married`),
          axios.get(`${API_BASE}family-wealth`),
        ]);

        setOptions({
          familyValues: valuesRes.data,
          familyTypes: typesRes.data,
          familyStatus: statusRes.data,
          motherTongues: tonguesRes.data,
          brothers: broRes.data,
          brothersMarried: broMarriedRes.data,
          sisters: sisRes.data,
          sistersMarried: sisMarriedRes.data,
          familyWealth: wealthRes.data,
        });
      } catch (err) {
        console.error("Error loading dropdowns:", err);
      }
    }

    loadDropdowns();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "fatherName" || name === "motherName") {
      formattedValue = formatName(value);
    }

    setData({ ...data, [name]: formattedValue });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // MULTI SELECT family wealth
  const handleMultiSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setData({ ...data, familyWealth: selected });
  };

  const handleNext = () => {
    const finalData = {
      ...data,
      familyWealth: Array.isArray(data.familyWealth)
        ? data.familyWealth.join(",")
        : "",
    };

    nextStep(finalData);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-[#e4cbb4] mt-12">
      <h3 className="text-2xl font-bold text-[#7b1113] text-center mb-6 border-b pb-3">
        Step 8: Family Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Family Values */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Family Values
          </label>
          <select
            name="familyValues"
            value={data.familyValues}
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 w-full"
          >
            <option value="">Select Family Values</option>
            {options.familyValues.map((v) => (
              <option key={v.id} value={v.family_values}>
                {v.family_values}
              </option>
            ))}
          </select>
        </div>

        {/* Family Type */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Family Type
          </label>
          <select
            name="familyType"
            value={data.familyType}
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 w-full"
          >
            <option value="">Select Family Type</option>
            {options.familyTypes.map((t) => (
              <option key={t.id} value={t.family_typ}>
                {t.family_typ}
              </option>
            ))}
          </select>
        </div>

        {/* Family Status */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Family Status
          </label>
          <select
            name="familyStatus"
            value={data.familyStatus}
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 w-full"
          >
            <option value="">Select Family Status</option>
            {options.familyStatus.map((s) => (
              <option key={s.id} value={s.family_status}>
                {s.family_status}
              </option>
            ))}
          </select>
        </div>

        {/* Mother Tongue */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Mother Tongue
          </label>
          <select
            name="motherTongue"
            value={data.motherTongue}
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 w-full"
          >
            <option value="">Select Mother Tongue</option>
            {options.motherTongues.map((m) => (
              <option key={m.id} value={m.mother_tounge}>
                {m.mother_tounge}
              </option>
            ))}
          </select>
        </div>

        {/* Brothers */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            No. of Brothers
          </label>
          <select
            name="noOfBrothers"
            value={data.noOfBrothers}
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 w-full"
          >
            <option value="">Select Number</option>
            {options.brothers.map((b) => (
              <option key={b.id} value={b.number}>
                {b.number}
              </option>
            ))}
          </select>
        </div>

        {/* Married Brothers */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            No. of Brothers Married
          </label>
          <select
            name="noOfBrothersMarried"
            value={data.noOfBrothersMarried}
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 w-full"
          >
            <option value="">Select Number</option>
            {options.brothersMarried.map((b) => (
              <option key={b.id} value={b.number_married}>
                {b.number_married}
              </option>
            ))}
          </select>
        </div>

        {/* Sisters */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            No. of Sisters
          </label>
          <select
            name="noOfSisters"
            value={data.noOfSisters}
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 w-full"
          >
            <option value="">Select Number</option>
            {options.sisters.map((s) => (
              <option key={s.id} value={s.number}>
                {s.number}
              </option>
            ))}
          </select>
        </div>

        {/* Married Sisters */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            No. of Sisters Married
          </label>
          <select
            name="noOfSistersMarried"
            value={data.noOfSistersMarried}
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 w-full"
          >
            <option value="">Select Number</option>
            {options.sistersMarried.map((s) => (
              <option key={s.id} value={s.number_married}>
                {s.number_married}
              </option>
            ))}
          </select>
        </div>

        {/* Unmarried Brothers */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            No. of Brothers Unmarried
          </label>
          <input
            type="number"
            name="noOfBrothersUnmarried"
            value={data.noOfBrothersUnmarried}
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 w-full"
          />
        </div>

        {/* Unmarried Sisters */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            No. of Sisters Unmarried
          </label>
          <input
            type="number"
            name="noOfSistersUnmarried"
            value={data.noOfSistersUnmarried}
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 w-full"
          />
        </div>

        {/* Father / Mother side-by-side */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Father name */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Father Name
            </label>
            <input
              type="text"
              name="fatherName"
              value={data.fatherName}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 w-full"
            />
          </div>

          {/* Father occupation */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Father Occupation
            </label>
            <input
              type="text"
              name="fatherOccupation"
              value={data.fatherOccupation}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 w-full"
            />
          </div>

          {/* Mother name */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Mother Name
            </label>
            <input
              type="text"
              name="motherName"
              value={data.motherName}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 w-full"
            />
          </div>

          {/* Mother occupation */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Mother Occupation
            </label>
            <input
              type="text"
              name="motherOccupation"
              value={data.motherOccupation}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 w-full"
            />
          </div>
        </div>
      </div>

      {/* MULTI SELECT FAMILY WEALTH */}
      <div className="mt-6">
        <label className="block font-medium text-gray-700 mb-1">
          Family Wealth / Assets (Multi-select)
        </label>
        <select
          multiple
          name="familyWealth"
          value={data.familyWealth}
          onChange={handleMultiSelect}
          className="border rounded-xl px-4 py-3 w-full h-40"
        >
          {options.familyWealth.map((w) => (
            <option key={w.id} value={w.wealth}>
              {w.wealth}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-600 mt-1">
          Hold CTRL to select multiple
        </p>
      </div>

      {/* Family description */}
      <div className="mt-6">
        <label className="block font-medium text-gray-700 mb-1">
          Describe your family background
        </label>
        <textarea
          name="familyDescription"
          rows={3}
          value={data.familyDescription}
          onChange={handleChange}
          className="border rounded-xl px-4 py-3 w-full"
        />
      </div>

      {/* Family Medical History */}
      <div className="mt-6">
        <label className="block font-medium text-gray-700 mb-1">
          Any Family Medical History?
        </label>
        <select
          name="familyMedicalHistory"
          value={data.familyMedicalHistory}
          onChange={handleChange}
          className="border rounded-xl px-4 py-3 w-full"
        >
          <option value="">Select Option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="px-6 py-3 rounded-xl bg-gray-300 text-gray-800 font-semibold"
        >
          ⬅ Back
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-xl bg-[#7b1113] text-white font-semibold"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}
