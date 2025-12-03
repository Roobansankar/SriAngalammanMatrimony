// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const API_BASE = "http://localhost:5000/api/";

// export default function Step10({ nextStep, prevStep }) {
//   const [options, setOptions] = useState({
//     religions: [],
//     castes: [],
//     countries: [],
//     states: [],
//     complexions: [],
//     residencyStatus: [],
//     educations: [],
//     occupations: [],
//   });

//   const [data, setData] = useState({
//     maritalStatus: [],
//     ageFrom: "",
//     ageTo: "",
//     heightFrom: "",
//     heightTo: "",
//     religion: "",
//     caste: "",
//     complexion: "",
//     residencyStatus: "",
//     country: "",
//     state: "",
//     city: "",
//     education: "",
//     occupation: "",
//     partnerExpectations: "",
//   });

//   // Generate age dropdown (18–65)
//   const ageOptions = Array.from({ length: 48 }, (_, i) => 18 + i);

//   // Height dropdown list
//   const heightOptions = [];
//   for (let ft = 4; ft <= 7; ft++) {
//     for (let inch = 0; inch < 12; inch++) {
//       if (ft === 7 && inch > 0) break;
//       heightOptions.push(`${ft}ft${inch > 0 ? " " + inch + "in" : ""}`);
//     }
//   }

//   useEffect(() => {
//     // Initial data load
//     async function loadInitial() {
//       try {
//         const [relRes, compRes, resiRes, eduRes, occuRes, countryRes] =
//           await Promise.all([
//             axios.get(`${API_BASE}religions`),
//             axios.get(`${API_BASE}complexions`),
//             axios.get(`${API_BASE}residency-status`),
//             axios.get(`${API_BASE}educations`),
//             axios.get(`${API_BASE}occupations`),
//             axios.get(`${API_BASE}countries`),
//           ]);

//         setOptions((prev) => ({
//           ...prev,
//           religions: relRes.data,
//           complexions: compRes.data,
//           residencyStatus: resiRes.data,
//           educations: eduRes.data,
//           occupations: occuRes.data,
//           countries: countryRes.data,
//         }));
//       } catch (err) {
//         console.error("Error loading initial dropdowns:", err);
//       }
//     }

//     loadInitial();
//   }, []);

//   // Religion → caste
//   useEffect(() => {
//     if (!data.religion) return;
//     axios
//       .get(`${API_BASE}castes?religion=${data.religion}`)
//       .then((res) => setOptions((prev) => ({ ...prev, castes: res.data })))
//       .catch((err) => console.error("Error fetching castes:", err));
//   }, [data.religion]);

//   // Country → state
//   useEffect(() => {
//     if (!data.country) return;
//     axios
//       .get(`${API_BASE}states?country=${data.country}`)
//       .then((res) => setOptions((prev) => ({ ...prev, states: res.data })))
//       .catch((err) => console.error("Error fetching states:", err));
//   }, [data.country]);

//   const handleChange = (e) =>
//     setData({ ...data, [e.target.name]: e.target.value });

//   const handleCheckbox = (e) => {
//     const value = e.target.value;
//     setData({
//       ...data,
//       maritalStatus: e.target.checked
//         ? [...data.maritalStatus, value]
//         : data.maritalStatus.filter((v) => v !== value),
//     });
//   };

//   const handleNext = () => nextStep(data);

//   return (
//     <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-12 text-gray-800">
//       <h3 className="text-2xl font-bold text-center text-blue-700 mb-6">
//         Step 10: Partner Preferences
//       </h3>

//       {/* Marital Status */}
//       <div className="mb-6">
//         <h4 className="text-lg font-semibold text-gray-700 mb-2">
//           Preferred Marital Status
//         </h4>
//         <div className="flex flex-wrap gap-4">
//           {["Unmarried", "Divorced", "Widower", "Widowed"].map((status) => (
//             <label key={status} className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 value={status}
//                 onChange={handleCheckbox}
//                 className="accent-blue-600 w-4 h-4"
//               />
//               <span>{status}</span>
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Age & Height */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <select
//           name="ageFrom"
//           value={data.ageFrom}
//           onChange={handleChange}
//           className="input-box"
//         >
//           <option value="">Age From</option>
//           {ageOptions.map((age) => (
//             <option key={age} value={age}>
//               {age}
//             </option>
//           ))}
//         </select>

//         <select
//           name="ageTo"
//           value={data.ageTo}
//           onChange={handleChange}
//           className="input-box"
//         >
//           <option value="">Age To</option>
//           {ageOptions.map((age) => (
//             <option key={age} value={age}>
//               {age}
//             </option>
//           ))}
//         </select>

//         <select
//           name="heightFrom"
//           value={data.heightFrom}
//           onChange={handleChange}
//           className="input-box"
//         >
//           <option value="">Height From</option>
//           {heightOptions.map((h) => (
//             <option key={h} value={h}>
//               {h}
//             </option>
//           ))}
//         </select>

//         <select
//           name="heightTo"
//           value={data.heightTo}
//           onChange={handleChange}
//           className="input-box"
//         >
//           <option value="">Height To</option>
//           {heightOptions.map((h) => (
//             <option key={h} value={h}>
//               {h}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Religion → Caste */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <select
//           name="religion"
//           value={data.religion}
//           onChange={handleChange}
//           className="input-box"
//         >
//           <option value="">Select Religion</option>
//           {options.religions.map((r) => (
//             <option key={r.ID} value={r.Religion}>
//               {r.Religion}
//             </option>
//           ))}
//         </select>

//         <select
//           name="caste"
//           value={data.caste}
//           onChange={handleChange}
//           className="input-box"
//         >
//           <option value="">Select Caste</option>
//           {options.castes.map((c) => (
//             <option key={c.ID} value={c.Caste}>
//               {c.Caste}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Complexion, Residency */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <select
//           name="complexion"
//           value={data.complexion}
//           onChange={handleChange}
//           className="input-box"
//         >
//           <option value="">Select Complexion</option>
//           {options.complexions.map((c) => (
//             <option key={c.ID} value={c.complexion}>
//               {c.complexion}
//             </option>
//           ))}
//         </select>

//         <select
//           name="residencyStatus"
//           value={data.residencyStatus}
//           onChange={handleChange}
//           className="input-box"
//         >
//           <option value="">Residency Status</option>
//           {options.residencyStatus.map((r) => (
//             <option key={r.id} value={r.residency_status}>
//               {r.residency_status}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Country → State → City */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <select
//           name="country"
//           value={data.country}
//           onChange={handleChange}
//           className="input-box"
//         >
//           <option value="">Select Country</option>
//           {options.countries.map((c) => (
//             <option key={c.id} value={c.country}>
//               {c.country}
//             </option>
//           ))}
//         </select>

//         <select
//           name="state"
//           value={data.state}
//           onChange={handleChange}
//           className="input-box"
//         >
//           <option value="">Select State</option>
//           {options.states.map((s) => (
//             <option key={s.id} value={s.state}>
//               {s.state}
//             </option>
//           ))}
//         </select>

//         <input
//           placeholder="City"
//           name="city"
//           value={data.city}
//           onChange={handleChange}
//           className="input-box"
//         />
//       </div>

//       {/* Education & Occupation */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <select
//           name="education"
//           value={data.education}
//           onChange={handleChange}
//           className="input-box"
//         >
//           <option value="">Select Education</option>
//           {options.educations.map((e) => (
//             <option key={e.id} value={e.edu}>
//               {e.edu}
//             </option>
//           ))}
//         </select>

//         <select
//           name="occupation"
//           value={data.occupation}
//           onChange={handleChange}
//           className="input-box"
//         >
//           <option value="">Select Occupation</option>
//           {options.occupations.map((o) => (
//             <option key={o.id} value={o.occu}>
//               {o.occu}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Partner Expectations */}
//       <div className="mb-6">
//         <textarea
//           placeholder="Describe your partner expectations..."
//           name="partnerExpectations"
//           value={data.partnerExpectations}
//           onChange={handleChange}
//           className="input-box h-28 resize-none"
//         />
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-between mt-8">
//         <button
//           onClick={prevStep}
//           className="px-6 py-2.5 rounded-lg bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition"
//         >
//           ← Back
//         </button>
//         <button
//           onClick={handleNext}
//           className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
//         >
//           Next →
//         </button>
//       </div>
//     </div>
//   );
// }

import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api/";

// Helper → Move "Any" to the top
function putAnyFirst(arr, key = null) {
  if (!Array.isArray(arr)) return [];

  let anyItem = null;
  let others = [];

  arr.forEach((item) => {
    const value = key ? item[key] : item;

    if (value === "Any") anyItem = item;
    else others.push(item);
  });

  return anyItem ? [anyItem, ...others] : others;
}

export default function Step10({ nextStep, prevStep, formData = {} }) {
  const [options, setOptions] = useState({
    religions: [],
    castes: [],
    countries: [],
    states: [],
    complexions: [],
    residencyStatus: [],
    educations: [],
    occupations: [],
  });

  const [data, setData] = useState({
    maritalStatus: Array.isArray(formData.maritalStatus) ? formData.maritalStatus : [],
    ageFrom: formData.ageFrom || "",
    ageTo: formData.ageTo || "",
    heightFrom: formData.heightFrom || "",
    heightTo: formData.heightTo || "",
    religion: formData.religion || "",
    caste: formData.caste || "",
    complexion: formData.complexion || "",
    residencyStatus: formData.residencyStatus || "",
    country: formData.country || "",
    state: formData.state || "",
    city: formData.city || "",
    education: formData.education || "",
    occupation: formData.occupation || "",
    partnerExpectations: formData.partnerExpectations || "",
  });

  // Sync local state when formData prop changes (e.g., after localStorage load)
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      setData((prev) => ({
        ...prev,
        maritalStatus: Array.isArray(formData.maritalStatus) ? formData.maritalStatus : prev.maritalStatus,
        ageFrom: formData.ageFrom || prev.ageFrom,
        ageTo: formData.ageTo || prev.ageTo,
        heightFrom: formData.heightFrom || prev.heightFrom,
        heightTo: formData.heightTo || prev.heightTo,
        religion: formData.religion || prev.religion,
        caste: formData.caste || prev.caste,
        complexion: formData.complexion || prev.complexion,
        residencyStatus: formData.residencyStatus || prev.residencyStatus,
        country: formData.country || prev.country,
        state: formData.state || prev.state,
        city: formData.city || prev.city,
        education: formData.education || prev.education,
        occupation: formData.occupation || prev.occupation,
        partnerExpectations: formData.partnerExpectations || prev.partnerExpectations,
      }));
    }
  }, [formData]);

  // Generate age dropdown (18–65)
  const ageOptions = Array.from({ length: 48 }, (_, i) => 18 + i);

  // Heights
  const heightOptions = [];
  for (let ft = 4; ft <= 7; ft++) {
    for (let inch = 0; inch < 12; inch++) {
      if (ft === 7 && inch > 0) break;
      heightOptions.push(`${ft}ft${inch > 0 ? " " + inch + "in" : ""}`);
    }
  }

  // Load initial data (religion, complexion, residency, education, occupation, country)
  useEffect(() => {
    async function loadInitial() {
      try {
        const [relRes, compRes, resiRes, eduRes, occuRes, countryRes] =
          await Promise.all([
            axios.get(`${API_BASE}religions`),
            axios.get(`${API_BASE}complexions`),
            axios.get(`${API_BASE}residency-status`),
            axios.get(`${API_BASE}educations`),
            axios.get(`${API_BASE}occupations`),
            axios.get(`${API_BASE}countries`),
          ]);

        setOptions((prev) => ({
          ...prev,
          religions: putAnyFirst(relRes.data, "Religion"),
          complexions: putAnyFirst(compRes.data, "complexion"),
          residencyStatus: putAnyFirst(resiRes.data, "residency_status"),
          educations: putAnyFirst(eduRes.data, "edu"),
          occupations: putAnyFirst(occuRes.data, "occu"),
          countries: putAnyFirst(countryRes.data, "country"),
        }));
      } catch (err) {
        console.error("Error loading initial dropdowns:", err);
      }
    }

    loadInitial();
  }, []);

  // Religion → Caste
  useEffect(() => {
    if (!data.religion) return;

    axios
      .get(`${API_BASE}castes?religion=${data.religion}`)
      .then((res) =>
        setOptions((prev) => ({
          ...prev,
          castes: putAnyFirst(res.data, "Caste"),
        }))
      )
      .catch((err) => console.error("Error fetching castes:", err));
  }, [data.religion]);

  // Country → State
  useEffect(() => {
    if (!data.country) return;

    axios
      .get(`${API_BASE}states?country=${data.country}`)
      .then((res) =>
        setOptions((prev) => ({
          ...prev,
          states: putAnyFirst(res.data, "state"),
        }))
      )
      .catch((err) => console.error("Error fetching states:", err));
  }, [data.country]);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleCheckbox = (e) => {
    const value = e.target.value;
    setData({
      ...data,
      maritalStatus: e.target.checked
        ? [...data.maritalStatus, value]
        : data.maritalStatus.filter((v) => v !== value),
    });
  };

  const handleNext = () => nextStep(data);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-12 text-gray-800">
      <h3 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Step 10: Partner Preferences
      </h3>

      {/* Marital Status */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">
          Preferred Marital Status
        </h4>
        <div className="flex flex-wrap gap-4">
          {["Any", "Unmarried", "Divorced", "Widower", "Widowed"].map(
            (status) => (
              <label key={status} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={status}
                  onChange={handleCheckbox}
                  className="accent-blue-600 w-4 h-4"
                />
                <span>{status}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Age & Height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select
          name="ageFrom"
          value={data.ageFrom}
          onChange={handleChange}
          className="input-box"
        >
          <option value="">Age From</option>
          {ageOptions.map((age) => (
            <option key={age} value={age}>
              {age}
            </option>
          ))}
        </select>

        <select
          name="ageTo"
          value={data.ageTo}
          onChange={handleChange}
          className="input-box"
        >
          <option value="">Age To</option>
          {ageOptions.map((age) => (
            <option key={age} value={age}>
              {age}
            </option>
          ))}
        </select>

        <select
          name="heightFrom"
          value={data.heightFrom}
          onChange={handleChange}
          className="input-box"
        >
          <option value="">Height From</option>
          {heightOptions.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        <select
          name="heightTo"
          value={data.heightTo}
          onChange={handleChange}
          className="input-box"
        >
          <option value="">Height To</option>
          {heightOptions.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>

      {/* Religion → Caste */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select
          name="religion"
          value={data.religion}
          onChange={handleChange}
          className="input-box"
        >
          <option value="">Select Religion</option>
          {options.religions.map((r) => (
            <option key={r.ID} value={r.Religion}>
              {r.Religion}
            </option>
          ))}
        </select>

        <select
          name="caste"
          value={data.caste}
          onChange={handleChange}
          className="input-box"
        >
          <option value="">Select Caste</option>
          {options.castes.map((c) => (
            <option key={c.ID} value={c.Caste}>
              {c.Caste}
            </option>
          ))}
        </select>
      </div>

      {/* Complexion & Residency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select
          name="complexion"
          value={data.complexion}
          onChange={handleChange}
          className="input-box"
        >
          <option value="">Select Complexion</option>
          {options.complexions.map((c) => (
            <option key={c.ID} value={c.complexion}>
              {c.complexion}
            </option>
          ))}
        </select>

        <select
          name="residencyStatus"
          value={data.residencyStatus}
          onChange={handleChange}
          className="input-box"
        >
          <option value="">Residency Status</option>
          {options.residencyStatus.map((r) => (
            <option key={r.id} value={r.residency_status}>
              {r.residency_status}
            </option>
          ))}
        </select>
      </div>

      {/* Country → State → City */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          name="country"
          value={data.country}
          onChange={handleChange}
          className="input-box"
        >
          <option value="">Select Country</option>
          {options.countries.map((c) => (
            <option key={c.id} value={c.country}>
              {c.country}
            </option>
          ))}
        </select>

        <select
          name="state"
          value={data.state}
          onChange={handleChange}
          className="input-box"
        >
          <option value="">Select State</option>
          {options.states.map((s) => (
            <option key={s.id} value={s.state}>
              {s.state}
            </option>
          ))}
        </select>

        <input
          placeholder="City"
          name="city"
          value={data.city}
          onChange={handleChange}
          className="input-box"
        />
      </div>

      {/* Education & Occupation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select
          name="education"
          value={data.education}
          onChange={handleChange}
          className="input-box"
        >
          <option value="">Select Education</option>
          {options.educations.map((e) => (
            <option key={e.id} value={e.edu}>
              {e.edu}
            </option>
          ))}
        </select>

        <select
          name="occupation"
          value={data.occupation}
          onChange={handleChange}
          className="input-box"
        >
          <option value="">Select Occupation</option>
          {options.occupations.map((o) => (
            <option key={o.id} value={o.occu}>
              {o.occu}
            </option>
          ))}
        </select>
      </div>

      {/* Partner Expectations */}
      <div className="mb-6">
        <textarea
          placeholder="Describe your partner expectations..."
          name="partnerExpectations"
          value={data.partnerExpectations}
          onChange={handleChange}
          className="input-box h-28 resize-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="px-6 py-2.5 rounded-lg bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
