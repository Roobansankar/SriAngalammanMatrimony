// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const API_BASE = `${process.env.REACT_APP_API_BASE || ""}/api/`;

// export default function EditFamily() {
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

//   const [form, setForm] = useState({
//     ConfirmEmail: "",
//     Familyvalues: "",
//     FamilyType: "",
//     FamilyStatus: "",
//     mother_tounge: "",
//     noofbrothers: "",
//     noyubrothers: "",
//     noofsisters: "",
//     noyusisters: "",
//     Fathername: "",
//     Fathersoccupation: "",
//     Mothersname: "",
//     Mothersoccupation: "",
//     family_wealth: "",
//     FamilyDetails: "",
//     familymedicalhistory: "",
//   });

//   const navigate = useNavigate();

//   // Load User Data
//   useEffect(() => {
//     const data = JSON.parse(localStorage.getItem("userData"));
//     if (!data) return;

//     setForm({
//       ConfirmEmail: data.ConfirmEmail || "",
//       Familyvalues: data.Familyvalues || "",
//       FamilyType: data.FamilyType || "",
//       FamilyStatus: data.FamilyStatus || "",
//       mother_tounge: data.mother_tounge || data.Language || "",
//       noofbrothers: data.noofbrothers || "",
//       noyubrothers: data.noyubrothers || data.nbm || "",
//       noofsisters: data.noofsisters || "",
//       noyusisters: data.noyusisters || data.nsm || "",
//       Fathername: data.Fathername || "",
//       Fathersoccupation: data.Fathersoccupation || "",
//       Mothersname: data.Mothersname || "",
//       Mothersoccupation: data.Mothersoccupation || "",
//       family_wealth: data.family_wealth || "",
//       FamilyDetails: data.FamilyDetails || data.FamilyDetails_new || "",
//       familymedicalhistory: data.familymedicalhistory || "",
//     });
//   }, []);

//   // Load dropdown options
//   useEffect(() => {
//     async function loadOptions() {
//       try {
//         const [v, t, s, mt, b, bm, si, sim, w] = await Promise.all([
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
//           familyValues: v.data,
//           familyTypes: t.data,
//           familyStatus: s.data,
//           motherTongues: mt.data,
//           brothers: b.data,
//           brothersMarried: bm.data,
//           sisters: si.data,
//           sistersMarried: sim.data,
//           familyWealth: w.data,
//         });
//       } catch (err) {
//         console.log("Dropdown fetch error:", err);
//       }
//     }

//     loadOptions();
//   }, []);

//   const updateField = (key, value) => {
//     setForm({ ...form, [key]: value });
//   };

//   // Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.put(`${API_BASE}auth/update/family`, form);

//       if (res.data.success) {
//         alert("Family details updated successfully!");
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
//           Edit Family Details
//         </h1>

//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 md:grid-cols-2 gap-6"
//         >
//           {/* FAMILY VALUES */}
//           <div>
//             <label className="font-semibold">Family Values</label>
//             <select
//               className="w-full border p-3 rounded-lg"
//               value={form.Familyvalues}
//               onChange={(e) => updateField("Familyvalues", e.target.value)}
//             >
//               <option value="">Select</option>
//               {options.familyValues.map((v) => (
//                 <option key={v.id} value={v.family_values}>
//                   {v.family_values}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* FAMILY TYPE */}
//           <div>
//             <label className="font-semibold">Family Type</label>
//             <select
//               className="w-full border p-3 rounded-lg"
//               value={form.FamilyType}
//               onChange={(e) => updateField("FamilyType", e.target.value)}
//             >
//               <option value="">Select</option>
//               {options.familyTypes.map((t) => (
//                 <option key={t.id} value={t.family_typ}>
//                   {t.family_typ}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* FAMILY STATUS */}
//           <div>
//             <label className="font-semibold">Family Status</label>
//             <select
//               className="w-full border p-3 rounded-lg"
//               value={form.FamilyStatus}
//               onChange={(e) => updateField("FamilyStatus", e.target.value)}
//             >
//               <option value="">Select</option>
//               {options.familyStatus.map((s) => (
//                 <option key={s.id} value={s.family_status}>
//                   {s.family_status}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* MOTHER TONGUE */}
//           <div>
//             <label className="font-semibold">Mother Tongue</label>
//             <select
//               className="w-full border p-3 rounded-lg"
//               value={form.mother_tounge}
//               onChange={(e) => updateField("mother_tounge", e.target.value)}
//             >
//               <option value="">Select</option>
//               {options.motherTongues.map((m) => (
//                 <option key={m.id} value={m.mother_tounge}>
//                   {m.mother_tounge}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* NO OF BROTHERS */}
//           <div>
//             <label className="font-semibold">No. of Brothers</label>
//             <select
//               className="w-full border p-3 rounded-lg"
//               value={form.noofbrothers}
//               onChange={(e) => updateField("noofbrothers", e.target.value)}
//             >
//               <option value="">Select</option>
//               {options.brothers.map((b) => (
//                 <option key={b.id} value={b.number}>
//                   {b.number}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* BROTHERS MARRIED */}
//           <div>
//             <label className="font-semibold">Brothers Married</label>
//             <select
//               className="w-full border p-3 rounded-lg"
//               value={form.noyubrothers}
//               onChange={(e) => updateField("noyubrothers", e.target.value)}
//             >
//               <option value="">Select</option>
//               {options.brothersMarried.map((b) => (
//                 <option key={b.id} value={b.number_married}>
//                   {b.number_married}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* NO OF SISTERS */}
//           <div>
//             <label className="font-semibold">No. of Sisters</label>
//             <select
//               className="w-full border p-3 rounded-lg"
//               value={form.noofsisters}
//               onChange={(e) => updateField("noofsisters", e.target.value)}
//             >
//               <option value="">Select</option>
//               {options.sisters.map((s) => (
//                 <option key={s.id} value={s.number}>
//                   {s.number}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* SISTERS MARRIED */}
//           <div>
//             <label className="font-semibold">Sisters Married</label>
//             <select
//               className="w-full border p-3 rounded-lg"
//               value={form.noyusisters}
//               onChange={(e) => updateField("noyusisters", e.target.value)}
//             >
//               <option value="">Select</option>
//               {options.sistersMarried.map((s) => (
//                 <option key={s.id} value={s.number_married}>
//                   {s.number_married}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* FATHER NAME */}
//           <div>
//             <label className="font-semibold">Father Name</label>
//             <input
//               type="text"
//               className="w-full border p-3 rounded-lg"
//               value={form.Fathername}
//               onChange={(e) => updateField("Fathername", e.target.value)}
//             />
//           </div>

//           {/* FATHER OCCUPATION */}
//           <div>
//             <label className="font-semibold">Father Occupation</label>
//             <input
//               type="text"
//               className="w-full border p-3 rounded-lg"
//               value={form.Fathersoccupation}
//               onChange={(e) => updateField("Fathersoccupation", e.target.value)}
//             />
//           </div>

//           {/* MOTHER NAME */}
//           <div>
//             <label className="font-semibold">Mother Name</label>
//             <input
//               type="text"
//               className="w-full border p-3 rounded-lg"
//               value={form.Mothersname}
//               onChange={(e) => updateField("Mothersname", e.target.value)}
//             />
//           </div>

//           {/* MOTHER OCCUPATION */}
//           <div>
//             <label className="font-semibold">Mother Occupation</label>
//             <input
//               type="text"
//               className="w-full border p-3 rounded-lg"
//               value={form.Mothersoccupation}
//               onChange={(e) => updateField("Mothersoccupation", e.target.value)}
//             />
//           </div>

//           {/* FAMILY WEALTH */}
//           <div>
//             <label className="font-semibold">Family Wealth</label>
//             <select
//               className="w-full border p-3 rounded-lg"
//               value={form.family_wealth}
//               onChange={(e) => updateField("family_wealth", e.target.value)}
//             >
//               <option value="">Select</option>
//               {options.familyWealth.map((w, i) => (
//                 <option key={i} value={w.wealth}>
//                   {w.wealth}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* MEDICAL HISTORY */}
//           <div className="md:col-span-2">
//             <label className="font-semibold">Family Medical History</label>
//             <textarea
//               rows="2"
//               className="w-full border p-3 rounded-lg"
//               value={form.familymedicalhistory}
//               onChange={(e) =>
//                 updateField("familymedicalhistory", e.target.value)
//               }
//             />
//           </div>

//           {/* ABOUT FAMILY */}
//           <div className="md:col-span-2">
//             <label className="font-semibold">About Family</label>
//             <textarea
//               rows="3"
//               className="w-full border p-3 rounded-lg"
//               value={form.FamilyDetails}
//               onChange={(e) => updateField("FamilyDetails", e.target.value)}
//             />
//           </div>

//           {/* SAVE BUTTON */}
//           <div className="md:col-span-2">
//             <button className="w-full py-3 bg-pink-600 text-white text-lg rounded-lg">
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE = (process.env.REACT_APP_API_BASE || "") + "/api/";

export default function EditFamily() {
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

  const [form, setForm] = useState({
    ConfirmEmail: "",
    Familyvalues: "",
    FamilyType: "",
    FamilyStatus: "",
    mother_tounge: "",
    noofbrothers: "",
    noyubrothers: "",
    noofsisters: "",
    noyusisters: "",
    Fathername: "",
    Fathersoccupation: "",
    Mothersname: "",
    Mothersoccupation: "",
    family_wealth: "", // 👈 STRING, not array
    FamilyDetails: "",
    familymedicalhistory: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (!data) return;

    setForm({
      ConfirmEmail: data.ConfirmEmail || "",
      Familyvalues: data.Familyvalues || "",
      FamilyType: data.FamilyType || "",
      FamilyStatus: data.FamilyStatus || "",
      mother_tounge: data.mother_tounge || data.Language || "",
      noofbrothers: data.noofbrothers || "",
      noyubrothers: data.noyubrothers || data.nbm || "",
      noofsisters: data.noofsisters || "",
      noyusisters: data.noyusisters || data.nsm || "",
      Fathername: data.Fathername || "",
      Fathersoccupation: data.Fathersoccupation || "",
      Mothersname: data.Mothersname || "",
      Mothersoccupation: data.Mothersoccupation || "",
      family_wealth: data.family_wealth || "", // 👈 stored as string: "A, B"
      FamilyDetails: data.FamilyDetails || data.FamilyDetails_new || "",
      familymedicalhistory: data.familymedicalhistory || "",
    });
  }, []);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [v, t, s, mt, b, bm, si, sim, w] = await Promise.all([
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
          familyValues: v.data,
          familyTypes: t.data,
          familyStatus: s.data,
          motherTongues: mt.data,
          brothers: b.data,
          brothersMarried: bm.data,
          sisters: si.data,
          sistersMarried: sim.data,
          familyWealth: w.data,
        });
      } catch (err) {
        console.log("Dropdown fetch error:", err);
      }
    }

    loadOptions();
  }, []);

  const updateField = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(`${API_BASE}auth/update/family`, form);

      if (res.data.success) {
        alert("Family details updated successfully!");
        navigate("/profile");
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FFF4E0] font-display">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-10 border border-gray-200 mt-20">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Edit Family Details
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* FAMILY VALUES */}
          <div>
            <label className="font-semibold">Family Values</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.Familyvalues}
              onChange={(e) => updateField("Familyvalues", e.target.value)}
            >
              <option value="">Select</option>
              {options.familyValues.map((v) => (
                <option key={v.id} value={v.family_values}>
                  {v.family_values}
                </option>
              ))}
            </select>
          </div>

          {/* FAMILY TYPE */}
          <div>
            <label className="font-semibold">Family Type</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.FamilyType}
              onChange={(e) => updateField("FamilyType", e.target.value)}
            >
              <option value="">Select</option>
              {options.familyTypes.map((t) => (
                <option key={t.id} value={t.family_typ}>
                  {t.family_typ}
                </option>
              ))}
            </select>
          </div>

          {/* FAMILY STATUS */}
          <div>
            <label className="font-semibold">Family Status</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.FamilyStatus}
              onChange={(e) => updateField("FamilyStatus", e.target.value)}
            >
              <option value="">Select</option>
              {options.familyStatus.map((s) => (
                <option key={s.id} value={s.family_status}>
                  {s.family_status}
                </option>
              ))}
            </select>
          </div>

          {/* MOTHER TONGUE */}
          <div>
            <label className="font-semibold">Mother Tongue</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.mother_tounge}
              onChange={(e) => updateField("mother_tounge", e.target.value)}
            >
              <option value="">Select</option>
              {options.motherTongues.map((m) => (
                <option key={m.id} value={m.mother_tounge}>
                  {m.mother_tounge}
                </option>
              ))}
            </select>
          </div>

          {/* NO OF BROTHERS */}
          <div>
            <label className="font-semibold">No. of Brothers</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.noofbrothers}
              onChange={(e) => updateField("noofbrothers", e.target.value)}
            >
              <option value="">Select</option>
              {options.brothers.map((b) => (
                <option key={b.id} value={b.number}>
                  {b.number}
                </option>
              ))}
            </select>
          </div>

          {/* BROTHERS MARRIED */}
          <div>
            <label className="font-semibold">Brothers Married</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.noyubrothers}
              onChange={(e) => updateField("noyubrothers", e.target.value)}
            >
              <option value="">Select</option>
              {options.brothersMarried.map((b) => (
                <option key={b.id} value={b.number_married}>
                  {b.number_married}
                </option>
              ))}
            </select>
          </div>

          {/* NO OF SISTERS */}
          <div>
            <label className="font-semibold">No. of Sisters</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.noofsisters}
              onChange={(e) => updateField("noofsisters", e.target.value)}
            >
              <option value="">Select</option>
              {options.sisters.map((s) => (
                <option key={s.id} value={s.number}>
                  {s.number}
                </option>
              ))}
            </select>
          </div>

          {/* SISTERS MARRIED */}
          <div>
            <label className="font-semibold">Sisters Married</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.noyusisters}
              onChange={(e) => updateField("noyusisters", e.target.value)}
            >
              <option value="">Select</option>
              {options.sistersMarried.map((s) => (
                <option key={s.id} value={s.number_married}>
                  {s.number_married}
                </option>
              ))}
            </select>
          </div>

          {/* FATHER NAME */}
          <div>
            <label className="font-semibold">Father Name</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg"
              value={form.Fathername}
              onChange={(e) => updateField("Fathername", e.target.value)}
            />
          </div>

          {/* FATHER OCCUPATION */}
          <div>
            <label className="font-semibold">Father Occupation</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg"
              value={form.Fathersoccupation}
              onChange={(e) => updateField("Fathersoccupation", e.target.value)}
            />
          </div>

          {/* MOTHER NAME */}
          <div>
            <label className="font-semibold">Mother Name</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg"
              value={form.Mothersname}
              onChange={(e) => updateField("Mothersname", e.target.value)}
            />
          </div>

          {/* MOTHER OCCUPATION */}
          <div>
            <label className="font-semibold">Mother Occupation</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg"
              value={form.Mothersoccupation}
              onChange={(e) => updateField("Mothersoccupation", e.target.value)}
            />
          </div>

          {/* FAMILY WEALTH — MULTI SELECT BUT STORED AS STRING */}
          <div>
            <label className="font-semibold">Family Wealth</label>
            <select
              multiple
              className="w-full border p-3 rounded-lg"
              value={form.family_wealth.split(",")} // show selections
              onChange={(e) => {
                const selected = Array.from(
                  e.target.selectedOptions,
                  (opt) => opt.value
                );
                updateField("family_wealth", selected.join(",")); // stored as string
              }}
            >
              {options.familyWealth.map((w, i) => (
                <option key={i} value={w.wealth}>
                  {w.wealth}
                </option>
              ))}
            </select>
          </div>

          {/* MEDICAL HISTORY */}
          <div className="md:col-span-2">
            <label className="font-semibold">Family Medical History</label>
            <textarea
              rows="2"
              className="w-full border p-3 rounded-lg"
              value={form.familymedicalhistory}
              onChange={(e) =>
                updateField("familymedicalhistory", e.target.value)
              }
            />
          </div>

          {/* ABOUT FAMILY */}
          <div className="md:col-span-2">
            <label className="font-semibold">About Family</label>
            <textarea
              rows="3"
              className="w-full border p-3 rounded-lg"
              value={form.FamilyDetails}
              onChange={(e) => updateField("FamilyDetails", e.target.value)}
            />
          </div>

          {/* SAVE BUTTON */}
          <div className="md:col-span-2">
            <button className="w-full py-3 bg-pink-600 text-white text-lg rounded-lg">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
