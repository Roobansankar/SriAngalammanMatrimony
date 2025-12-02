

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const API_BASE = "http://localhost:5000/api/";

// export default function EditLifestyle() {
//   const [options, setOptions] = useState({
//     bloodGroups: [],
//     complexions: [],
//     bodyTypes: [],
//     diets: [],
//     smokeTypes: [],
//     drinkTypes: [],
//     specialCases: [],
//     hobbies: [],
//     interests: [],
//   });

//   const [form, setForm] = useState({
//     ConfirmEmail: "",
//     Height: "",
//     Weight: "",
//     BloodGroup: "",
//     Complexion: "",
//     Bodytype: "",
//     Diet: "",
//     Smoke: "",
//     Drink: "",
//     spe_cases: "",
//     Hobbies: "",
//     Interests: "",
//     passport: "",
//     medicalhistory: "",
//     familymedicalhistory: "",
//     anyotherincome: "",
//   });

//   const navigate = useNavigate();

//   // -----------------------------------------------
//   // Load user saved data
//   // -----------------------------------------------
//   useEffect(() => {
//     const data = JSON.parse(localStorage.getItem("userData"));
//     if (!data) return;

//     setForm({
//       ConfirmEmail: data.ConfirmEmail || "",
//       Height: data.height || data.Height || "",
//       Weight: data.Weight || "",
//       BloodGroup: data.BloodGroup || "",
//       Complexion: data.Complexion || "",
//       Bodytype: data.Bodytype || "",
//       Diet: data.Diet || "",
//       Smoke: data.Smoke || "",
//       Drink: data.Drink || "",
//       spe_cases: data.spe_cases || "",
//       Hobbies: data.Hobbies || "",
//       Interests: data.Interests || "",
//       passport: data.passport || "",
//       medicalhistory: data.medicalhistory || "",
//       familymedicalhistory: data.familymedicalhistory || "",
//       anyotherincome: data.anyotherincome || "",
//     });
//   }, []);

//   // -----------------------------------------------
//   // Load dropdowns from backend (same as Step7)
//   // -----------------------------------------------
//   useEffect(() => {
//     async function loadDropdowns() {
//       try {
//         const [
//           bloodRes,
//           complexionRes,
//           bodyTypeRes,
//           dietRes,
//           smokeRes,
//           drinkRes,
//           specialRes,
//           hobbiesRes,
//           interestsRes,
//         ] = await Promise.all([
//           axios.get(`${API_BASE}blood-groups`),
//           axios.get(`${API_BASE}complexions`),
//           axios.get(`${API_BASE}body-types`),
//           axios.get(`${API_BASE}diets`),
//           axios.get(`${API_BASE}smoke`),
//           axios.get(`${API_BASE}drink`),
//           axios.get(`${API_BASE}special-cases`),
//           axios.get(`${API_BASE}hobbies`),
//           axios.get(`${API_BASE}interests`),
//         ]);

//         setOptions({
//           bloodGroups: bloodRes.data,
//           complexions: complexionRes.data,
//           bodyTypes: bodyTypeRes.data,
//           diets: dietRes.data,
//           smokeTypes: smokeRes.data,
//           drinkTypes: drinkRes.data,
//           specialCases: specialRes.data,
//           hobbies: hobbiesRes.data,
//           interests: interestsRes.data,
//         });
//       } catch (err) {
//         console.error("Error fetching dropdown data:", err);
//       }
//     }

//     loadDropdowns();
//   }, []);

//   // -----------------------------------------------
//   // Height options like Step7 (1..37 mapping)
//   // -----------------------------------------------
//   const heightOptions = (() => {
//     const arr = [];
//     let counter = 1;

//     for (let inch = 1; inch <= 11; inch++, counter++)
//       arr.push({ value: String(counter), label: `4Ft ${inch} inch` });

//     for (let ft = 5; ft <= 6; ft++) {
//       arr.push({ value: String(counter++), label: `${ft}Ft` });
//       for (let inch = 1; inch <= 11; inch++)
//         arr.push({
//           value: String(counter++),
//           label: `${ft}Ft ${inch} inch`,
//         });
//     }

//     arr.push({ value: String(counter++), label: `7Ft` });

//     return arr;
//   })();

//   const weightOptions = Array.from({ length: 111 }, (_, i) => String(40 + i));

//   const updateField = (key, value) => {
//     setForm({ ...form, [key]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.put(
//         "http://localhost:5000/api/auth/update/lifestyle",
//         form
//       );

//       if (res.data.success) {
//         alert("Lifestyle details updated successfully!");
//         navigate("/profile");
//       } else {
//         alert("Update failed");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6 bg-[#FFF4E0] font-display">
//       <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-10 border border-gray-200 mt-20">
//         <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
//           Edit Lifestyle Details
//         </h1>

//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 md:grid-cols-2 gap-6"
//         >
//           {/* HEIGHT */}
//           <div>
//             <label className="text-sm font-semibold text-gray-700">
//               Height
//             </label>
//             <select
//               className="w-full border p-3 rounded-lg"
//               value={form.Height}
//               onChange={(e) => updateField("Height", e.target.value)}
//             >
//               <option value="">Select Height</option>
//               {heightOptions.map((h) => (
//                 <option key={h.value} value={h.value}>
//                   {h.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* WEIGHT */}
//           <div>
//             <label className="text-sm font-semibold text-gray-700">
//               Weight
//             </label>
//             <select
//               className="w-full border p-3 rounded-lg"
//               value={form.Weight}
//               onChange={(e) => updateField("Weight", e.target.value)}
//             >
//               <option value="">Select Weight</option>
//               {weightOptions.map((w) => (
//                 <option key={w} value={w}>
//                   {w} kg
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* BLOOD GROUP */}
//           <div>
//             <label className="text-sm font-semibold text-gray-700">
//               Blood Group
//             </label>
//             <select
//               className="w-full border p-3 rounded-lg"
//               value={form.BloodGroup}
//               onChange={(e) => updateField("BloodGroup", e.target.value)}
//             >
//               <option value="">Select Blood Group</option>
//               {options.bloodGroups.map((b) => (
//                 <option key={b.id} value={b.type}>
//                   {b.type}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* COMPLEXION */}
//           <div>
//             <label className="text-sm font-semibold text-gray-700">
//               Complexion
//             </label>
//             <select
//               className="w-full border p-3 rounded-lg"
//               value={form.Complexion}
//               onChange={(e) => updateField("Complexion", e.target.value)}
//             >
//               <option value="">Select Complexion</option>
//               {options.complexions.map((c) => (
//                 <option key={c.id} value={c.complexion}>
//                   {c.complexion}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* BODY TYPE */}
//           <div>
//             <label className="text-sm font-semibold text-gray-700">
//               Body Type
//             </label>
//             <select
//               className="w-full border p-3 rounded-lg"
//               value={form.Bodytype}
//               onChange={(e) => updateField("Bodytype", e.target.value)}
//             >
//               <option value="">Select Body Type</option>
//               {options.bodyTypes.map((b) => (
//                 <option key={b.id} value={b.body_type}>
//                   {b.body_type}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* DIET */}
//           <div>
//             <label className="text-sm font-semibold text-gray-700">Diet</label>
//             <select
//               className="w-full border p-3 rounded-lg"
//               value={form.Diet}
//               onChange={(e) => updateField("Diet", e.target.value)}
//             >
//               <option value="">Select Diet</option>
//               {options.diets.map((d) => (
//                 <option key={d.id} value={d.diet_type}>
//                   {d.diet_type}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* SMOKE */}
//           <div>
//             <label className="text-sm font-semibold text-gray-700">Smoke</label>
//             <select
//               className="w-full border p-3 rounded-lg"
//               value={form.Smoke}
//               onChange={(e) => updateField("Smoke", e.target.value)}
//             >
//               <option value="">Select</option>
//               {options.smokeTypes.map((s) => (
//                 <option key={s.id} value={s.smoke_type}>
//                   {s.smoke_type}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* DRINK */}
//           <div>
//             <label className="text-sm font-semibold text-gray-700">Drink</label>
//             <select
//               className="w-full border p-3 rounded-lg"
//               value={form.Drink}
//               onChange={(e) => updateField("Drink", e.target.value)}
//             >
//               <option value="">Select</option>
//               {options.drinkTypes.map((d) => (
//                 <option key={d.id} value={d.Drink_type || d.drink_type}>
//                   {d.Drink_type || d.drink_type}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* SPECIAL CASES */}
//           <div className="md:col-span-2">
//             <label className="text-sm font-semibold text-gray-700">
//               Special Cases
//             </label>
//             <select
//               className="w-full border p-3 rounded-lg"
//               value={form.spe_cases}
//               onChange={(e) => updateField("spe_cases", e.target.value)}
//             >
//               <option value="">Select Special Case</option>
//               {options.specialCases.map((s) => (
//                 <option key={s.id} value={s.case_type}>
//                   {s.case_type}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* HOBBIES */}
//           <div className="md:col-span-2">
//             <label className="text-sm font-semibold text-gray-700">
//               Hobbies
//             </label>
//             <select
//               className="w-full border p-3 rounded-lg"
//               value={form.Hobbies}
//               onChange={(e) => updateField("Hobbies", e.target.value)}
//             >
//               <option value="">Select Hobby</option>
//               {options.hobbies.map((h) => (
//                 <option key={h.id} value={h.hobbies}>
//                   {h.hobbies}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* INTERESTS */}
//           <div className="md:col-span-2">
//             <label className="text-sm font-semibold text-gray-700">
//               Interests
//             </label>
//             <select
//               className="w-full border p-3 rounded-lg"
//               value={form.Interests}
//               onChange={(e) => updateField("Interests", e.target.value)}
//             >
//               <option value="">Select Interest</option>
//               {options.interests.map((i) => (
//                 <option key={i.id} value={i.interest}>
//                   {i.interest}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* PASSPORT */}
//           <div>
//             <label className="text-sm font-semibold text-gray-700">
//               Passport
//             </label>
//             <select
//               className="w-full border p-3 rounded-lg"
//               value={form.passport}
//               onChange={(e) => updateField("passport", e.target.value)}
//             >
//               <option value="">Select</option>
//               <option value="Yes">Yes</option>
//               <option value="No">No</option>
//             </select>
//           </div>

//           {/* MEDICAL HISTORY */}
//           <div>
//             <label className="text-sm font-semibold text-gray-700">
//               Medical History
//             </label>
//             <textarea
//               rows="2"
//               className="w-full border p-3 rounded-lg"
//               value={form.medicalhistory}
//               onChange={(e) => updateField("medicalhistory", e.target.value)}
//             />
//           </div>

//           {/* FAMILY MEDICAL HISTORY */}
//           <div className="md:col-span-2">
//             <label className="text-sm font-semibold text-gray-700">
//               Family Medical History
//             </label>
//             <textarea
//               rows="2"
//               className="w-full border p-3 rounded-lg"
//               value={form.familymedicalhistory}
//               onChange={(e) =>
//                 updateField("familymedicalhistory", e.target.value)
//               }
//             />
//           </div>

//           {/* OTHER INCOME */}
//           <div>
//             <label className="text-sm font-semibold text-gray-700">
//               Other Income
//             </label>
//             <input
//               type="text"
//               className="w-full border p-3 rounded-lg"
//               value={form.anyotherincome}
//               onChange={(e) => updateField("anyotherincome", e.target.value)}
//             />
//           </div>

//           <div className="md:col-span-2">
//             <button className="w-full py-3 bg-pink-600 text-white rounded-lg">
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/";

export default function EditLifestyle() {
  const [options, setOptions] = useState({
    bloodGroups: [],
    complexions: [],
    bodyTypes: [],
    diets: [],
    smokeTypes: [],
    drinkTypes: [],
    specialCases: [],
    hobbies: [],
    interests: [],
  });

  const [form, setForm] = useState({
    ConfirmEmail: "",
    Height: "",
    HeightText: "",
    Weight: "",
    BloodGroup: "",
    Complexion: "",
    Bodytype: "",
    Diet: "",
    Smoke: "",
    Drink: "",
    spe_cases: "",
    Hobbies: "",
    Interests: "",
    passport: "",
    medicalhistory: "",
    familymedicalhistory: "",
    anyotherincome: "",
  });

  const navigate = useNavigate();

  const updateField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  // ================================
  // HEIGHT OPTIONS
  // ================================
  const heightOptions = (() => {
    const arr = [];
    let n = 1;

    for (let i = 1; i <= 11; i++, n++)
      arr.push({ value: String(n), label: `4Ft ${i} inch` });

    for (let ft = 5; ft <= 6; ft++) {
      arr.push({ value: String(n++), label: `${ft}Ft` });
      for (let inch = 1; inch <= 11; inch++)
        arr.push({
          value: String(n++),
          label: `${ft}Ft ${inch} inch`,
        });
    }

    arr.push({ value: String(n++), label: `7Ft` });
    return arr;
  })();

  const weightOptions = Array.from({ length: 111 }, (_, i) => String(40 + i));

  // ================================
  // LOAD USER DATA
  // ================================
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (!data) return;

    let heightCode = "";
    if (data.HeightText) {
      const match = heightOptions.find((h) => h.label === data.HeightText);
      if (match) heightCode = match.value;
    }

    setForm((prev) => ({
      ...prev,
      ConfirmEmail: data.ConfirmEmail || "",
      Height: heightCode,
      HeightText: data.HeightText || "",
      Weight: data.Weight || "",
      BloodGroup: data.BloodGroup || "",
      Complexion: data.Complexion || "",
      Bodytype: data.Bodytype || "",
      Diet: data.Diet || "",
      Smoke: data.Smoke || "",
      Drink: data.Drink || "",
      spe_cases: data.spe_cases || "",
      Hobbies: data.Hobbies || "",
      Interests: data.Interests || "",
      passport: data.passport || "",
      medicalhistory: data.medicalhistory || "",
      familymedicalhistory: data.familymedicalhistory || "",
      anyotherincome: data.anyotherincome || "",
    }));
  }, []);

  // ================================
  // LOAD DROPDOWNS
  // ================================
  useEffect(() => {
    async function load() {
      try {
        const [
          bloodRes,
          complexionRes,
          bodyTypeRes,
          dietRes,
          smokeRes,
          drinkRes,
          specialRes,
          hobbiesRes,
          interestsRes,
        ] = await Promise.all([
          axios.get(`${API_BASE}blood-groups`),
          axios.get(`${API_BASE}complexions`),
          axios.get(`${API_BASE}body-types`),
          axios.get(`${API_BASE}diets`),
          axios.get(`${API_BASE}smoke`),
          axios.get(`${API_BASE}drink`),
          axios.get(`${API_BASE}special-cases`),
          axios.get(`${API_BASE}hobbies`),
          axios.get(`${API_BASE}interests`),
        ]);

        setOptions({
          bloodGroups: bloodRes.data,
          complexions: complexionRes.data,
          bodyTypes: bodyTypeRes.data,
          diets: dietRes.data,
          smokeTypes: smokeRes.data,
          drinkTypes: drinkRes.data,
          specialCases: specialRes.data,
          hobbies: hobbiesRes.data,
          interests: interestsRes.data,
        });
      } catch {}
    }
    load();
  }, []);

  // ================================
  // SUBMIT
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/update/lifestyle",
        form
      );

      if (res.data.success) {
        alert("Lifestyle updated");
        navigate("/profile");
      } else {
        alert("Failed");
      }
    } catch {
      alert("Server error");
    }
  };

  // ================================
  // RENDER
  // ================================
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FFF4E0] font-display">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-10 border border-gray-200 mt-20">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Edit Lifestyle Details
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* HEIGHT */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Height
            </label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.Height}
              onChange={(e) => {
                const val = e.target.value;
                updateField("Height", val);

                const selected = heightOptions.find((h) => h.value === val);
                updateField("HeightText", selected?.label || "");
              }}
            >
              <option value="">Select Height</option>
              {heightOptions.map((h) => (
                <option key={h.value} value={h.value}>
                  {h.label}
                </option>
              ))}
            </select>
          </div>

          {/* WEIGHT */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Weight
            </label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.Weight}
              onChange={(e) => updateField("Weight", e.target.value)}
            >
              <option value="">Select Weight</option>
              {weightOptions.map((w) => (
                <option key={w} value={w}>
                  {w} kg
                </option>
              ))}
            </select>
          </div>

          {/* BLOOD GROUP */}
          <div>
            <label className="text-sm font-semibold">Blood Group</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.BloodGroup}
              onChange={(e) => updateField("BloodGroup", e.target.value)}
            >
              <option value="">Select</option>
              {options.bloodGroups.map((b) => (
                <option key={b.id} value={b.type}>
                  {b.type}
                </option>
              ))}
            </select>
          </div>

          {/* COMPLEXION */}
          <div>
            <label className="text-sm font-semibold">Complexion</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.Complexion}
              onChange={(e) => updateField("Complexion", e.target.value)}
            >
              <option value="">Select</option>
              {options.complexions.map((c) => (
                <option key={c.id} value={c.complexion}>
                  {c.complexion}
                </option>
              ))}
            </select>
          </div>

          {/* BODYTYPE */}
          <div>
            <label className="text-sm font-semibold">Body Type</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.Bodytype}
              onChange={(e) => updateField("Bodytype", e.target.value)}
            >
              <option value="">Select</option>
              {options.bodyTypes.map((b) => (
                <option key={b.id} value={b.body_type}>
                  {b.body_type}
                </option>
              ))}
            </select>
          </div>

          {/* DIET */}
          <div>
            <label className="text-sm font-semibold">Diet</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.Diet}
              onChange={(e) => updateField("Diet", e.target.value)}
            >
              <option value="">Select</option>
              {options.diets.map((d) => (
                <option key={d.id} value={d.diet_type}>
                  {d.diet_type}
                </option>
              ))}
            </select>
          </div>

          {/* SMOKE */}
          <div>
            <label className="text-sm font-semibold">Smoke</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.Smoke}
              onChange={(e) => updateField("Smoke", e.target.value)}
            >
              <option value="">Select</option>
              {options.smokeTypes.map((s) => (
                <option key={s.id} value={s.smoke_type}>
                  {s.smoke_type}
                </option>
              ))}
            </select>
          </div>

          {/* DRINK */}
          <div>
            <label className="text-sm font-semibold">Drink</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.Drink}
              onChange={(e) => updateField("Drink", e.target.value)}
            >
              <option value="">Select</option>
              {options.drinkTypes.map((d) => (
                <option key={d.id} value={d.Drink_type || d.drink_type}>
                  {d.Drink_type || d.drink_type}
                </option>
              ))}
            </select>
          </div>

          {/* SPECIAL CASE */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Special Cases</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.spe_cases}
              onChange={(e) => updateField("spe_cases", e.target.value)}
            >
              <option value="">Select</option>
              {options.specialCases.map((s) => (
                <option key={s.id} value={s.case_type}>
                  {s.case_type}
                </option>
              ))}
            </select>
          </div>

          {/* HOBBIES */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Hobbies</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.Hobbies}
              onChange={(e) => updateField("Hobbies", e.target.value)}
            >
              <option value="">Select</option>
              {options.hobbies.map((h) => (
                <option key={h.id} value={h.hobbies}>
                  {h.hobbies}
                </option>
              ))}
            </select>
          </div>

          {/* INTERESTS */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Interests</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.Interests}
              onChange={(e) => updateField("Interests", e.target.value)}
            >
              <option value="">Select</option>
              {options.interests.map((i) => (
                <option key={i.id} value={i.interest}>
                  {i.interest}
                </option>
              ))}
            </select>
          </div>

          {/* PASSPORT */}
          <div>
            <label className="text-sm font-semibold">Passport</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.passport}
              onChange={(e) => updateField("passport", e.target.value)}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* MEDICAL */}
          <div>
            <label className="text-sm font-semibold">Medical History</label>
            <textarea
              rows="2"
              className="w-full border p-3 rounded-lg"
              value={form.medicalhistory}
              onChange={(e) => updateField("medicalhistory", e.target.value)}
            />
          </div>

          {/* FAMILY MEDICAL */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">
              Family Medical History
            </label>
            <textarea
              rows="2"
              className="w-full border p-3 rounded-lg"
              value={form.familymedicalhistory}
              onChange={(e) =>
                updateField("familymedicalhistory", e.target.value)
              }
            />
          </div>

          {/* OTHER INCOME */}
          <div>
            <label className="text-sm font-semibold">Other Income</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg"
              value={form.anyotherincome}
              onChange={(e) => updateField("anyotherincome", e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <button className="w-full py-3 bg-pink-600 text-white rounded-lg">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
