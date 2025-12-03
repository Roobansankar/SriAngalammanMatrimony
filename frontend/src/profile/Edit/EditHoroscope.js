

// // File: EditHoroscope.jsx

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const API_BASE = "http://localhost:5000/api/";

// export default function EditHoroscope() {
//   const [form, setForm] = useState({
//     ConfirmEmail: "",
//     Moonsign: "",
//     Star: "",
//     Gothram: "",
//     Manglik: "",
//     shani: "",
//     shaniplace: "",
//     Horosmatch: "",
//     parigarasevai: "",
//     Sevai: "",
//     Raghu: "",
//     Keethu: "",
//     POB: "",
//     POC: "",
//     TOB: "",
//     horoscope: null,
//   });

//   const [options, setOptions] = useState({
//     moonSigns: [],
//     nakshatras: [],
//     gothras: [],
//     mangliks: [],
//     shanis: [],
//     horoscopeMatches: [],
//   });

//   const [imagePreview, setImagePreview] = useState(null);
//   const navigate = useNavigate();

//   // -----------------------------------------
//   // 1️⃣ Load dropdown options from backend
//   // -----------------------------------------
//   useEffect(() => {
//     async function fetchOptions() {
//       try {
//         const [moonRes, nakshRes, gothraRes, manglikRes, shaniRes, matchRes] =
//           await Promise.all([
//             fetch(`${API_BASE}moon-sign`),
//             fetch(`${API_BASE}nakshatra`),
//             fetch(`${API_BASE}gothra`),
//             fetch(`${API_BASE}manglik`),
//             fetch(`${API_BASE}shani`),
//             fetch(`${API_BASE}horoscope-match`),
//           ]);

//         const [
//           moonData,
//           nakshData,
//           gothraData,
//           manglikData,
//           shaniData,
//           matchData,
//         ] = await Promise.all([
//           moonRes.json(),
//           nakshRes.json(),
//           gothraRes.json(),
//           manglikRes.json(),
//           shaniRes.json(),
//           matchRes.json(),
//         ]);

//         setOptions({
//           moonSigns: moonData.map((m) => m.Moon_Sign),
//           nakshatras: nakshData.map((n) => n.Nakshatra),
//           gothras: gothraData.map((g) => g.Gothra),
//           mangliks: manglikData.map((m) => m.type),
//           shanis: shaniData.map((s) => s.type),
//           horoscopeMatches: matchData.map((h) => h.type),
//         });
//       } catch (err) {
//         console.error("Dropdown fetch error:", err);
//       }
//     }

//     fetchOptions();
//   }, []);

//   // -----------------------------------------
//   // 2️⃣ Load user saved data
//   // -----------------------------------------
//   useEffect(() => {
//     const data = JSON.parse(localStorage.getItem("userData"));
//     if (!data) return;

//     setForm({
//       ConfirmEmail: data.ConfirmEmail || "",
//       Moonsign: data.Moonsign || "",
//       Star: data.Star || "",
//       Gothram: data.Gothram || "",
//       Manglik: data.Manglik || "",
//       shani: data.shani || data.Shani || "",
//       shaniplace: data.shaniplace || data.place || "",
//       Horosmatch: data.Horosmatch || "",
//       parigarasevai: data.parigarasevai || "",
//       Sevai: data.Sevai || "",
//       Raghu: data.Raghu || "",
//       Keethu: data.Keethu || "",
//       POB: data.POB || data.PlaceOfBirth || "",
//       POC: data.POC || data.Country || "",
//       TOB: data.TOB || "",
//       horoscope: null,
//     });
//   }, []);

//   const updateField = (key, value) => {
//     setForm({ ...form, [key]: value });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     updateField("horoscope", file);
//     setImagePreview(URL.createObjectURL(file));
//   };

//   // -----------------------------------------
//   // 3️⃣ Submit update
//   // -----------------------------------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const fd = new FormData();
//       for (const key in form) {
//         fd.append(key, form[key]);
//       }

//       await axios.put("http://localhost:5000/api/auth/update/horoscope", fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("Horoscope details updated successfully!");
//       navigate("/profile");
//     } catch (err) {
//       console.error(err);
//       alert("Update failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6 bg-[#FFF4E0] font-display">
//       <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-10 border border-gray-200 mt-20">
//         <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
//           Edit Horoscope Details
//         </h1>

//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 md:grid-cols-2 gap-6"
//         >
//           {/* --- DROPDOWN FIELDS --- */}
//           {/* Moon Sign */}
//           <div>
//             <label className="text-sm font-semibold">Moon Sign</label>
//             <select
//               className="border p-3 rounded-lg w-full"
//               value={form.Moonsign}
//               onChange={(e) => updateField("Moonsign", e.target.value)}
//             >
//               <option value="">Select Moon Sign</option>
//               {options.moonSigns.map((m) => (
//                 <option key={m} value={m}>
//                   {m}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Star */}
//           <div>
//             <label className="text-sm font-semibold">Star / Nakshatra</label>
//             <select
//               className="border p-3 rounded-lg w-full"
//               value={form.Star}
//               onChange={(e) => updateField("Star", e.target.value)}
//             >
//               <option value="">Select Star</option>
//               {options.nakshatras.map((s) => (
//                 <option key={s} value={s}>
//                   {s}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Gothram */}
//           <div>
//             <label className="text-sm font-semibold">Gothra</label>
//             <select
//               className="border p-3 rounded-lg w-full"
//               value={form.Gothram}
//               onChange={(e) => updateField("Gothram", e.target.value)}
//             >
//               <option value="">Select Gothra</option>
//               {options.gothras.map((g) => (
//                 <option key={g} value={g}>
//                   {g}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Manglik */}
//           <div>
//             <label className="text-sm font-semibold">Manglik</label>
//             <select
//               className="border p-3 rounded-lg w-full"
//               value={form.Manglik}
//               onChange={(e) => updateField("Manglik", e.target.value)}
//             >
//               <option value="">Select Manglik</option>
//               {options.mangliks.map((m) => (
//                 <option key={m} value={m}>
//                   {m}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Shani */}
//           <div>
//             <label className="text-sm font-semibold">Shani</label>
//             <select
//               className="border p-3 rounded-lg w-full"
//               value={form.shani}
//               onChange={(e) => updateField("shani", e.target.value)}
//             >
//               <option value="">Select Shani</option>
//               {options.shanis.map((s) => (
//                 <option key={s} value={s}>
//                   {s}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Shani place */}
//           <div>
//             <label className="text-sm font-semibold">Place of Shani</label>
//             <input
//               className="border p-3 rounded-lg w-full"
//               value={form.shaniplace}
//               onChange={(e) => updateField("shaniplace", e.target.value)}
//             />
//           </div>

//           {/* Horoscope Match */}
//           <div>
//             <label className="text-sm font-semibold">Horoscope Match</label>
//             <select
//               className="border p-3 rounded-lg w-full"
//               value={form.Horosmatch}
//               onChange={(e) => updateField("Horosmatch", e.target.value)}
//             >
//               <option value="">Select Horoscope Match</option>
//               {options.horoscopeMatches.map((h) => (
//                 <option key={h} value={h}>
//                   {h}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Parigarasevai */}
//           <div>
//             <label className="text-sm font-semibold">Parigarasevai</label>
//             <input
//               className="border p-3 rounded-lg w-full"
//               value={form.parigarasevai}
//               onChange={(e) => updateField("parigarasevai", e.target.value)}
//             />
//           </div>

//           {/* Sevai */}
//           <div>
//             <label className="text-sm font-semibold">Sevai</label>
//             <input
//               className="border p-3 rounded-lg w-full"
//               value={form.Sevai}
//               onChange={(e) => updateField("Sevai", e.target.value)}
//             />
//           </div>

//           {/* Raghu */}
//           <div>
//             <label className="text-sm font-semibold">Raghu</label>
//             <input
//               className="border p-3 rounded-lg w-full"
//               value={form.Raghu}
//               onChange={(e) => updateField("Raghu", e.target.value)}
//             />
//           </div>

//           {/* Keethu */}
//           <div>
//             <label className="text-sm font-semibold">Keethu</label>
//             <input
//               className="border p-3 rounded-lg w-full"
//               value={form.Keethu}
//               onChange={(e) => updateField("Keethu", e.target.value)}
//             />
//           </div>

//           {/* Place Of Birth */}
//           <div>
//             <label className="text-sm font-semibold">Place of Birth</label>
//             <input
//               className="border p-3 rounded-lg w-full"
//               value={form.POB}
//               onChange={(e) => updateField("POB", e.target.value)}
//             />
//           </div>

//           {/* Country */}
//           <div>
//             <label className="text-sm font-semibold">Country / Place</label>
//             <input
//               className="border p-3 rounded-lg w-full"
//               value={form.POC}
//               onChange={(e) => updateField("POC", e.target.value)}
//             />
//           </div>

//           {/* Time of Birth */}
//           <div className="md:col-span-2">
//             <label className="text-sm font-semibold">Time of Birth</label>
//             <input
//               className="border p-3 rounded-lg w-full"
//               value={form.TOB}
//               onChange={(e) => updateField("TOB", e.target.value)}
//               placeholder="08:00:00 AM"
//             />
//           </div>

//           {/* File Upload */}
//           <div className="md:col-span-2">
//             <label className="text-sm font-semibold">Upload Horoscope</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="border p-3 rounded-lg w-full mt-1 bg-gray-50"
//             />

//             {imagePreview && (
//               <img
//                 src={imagePreview}
//                 className="w-48 rounded-lg mt-3 border shadow"
//                 alt="Preview"
//               />
//             )}
//           </div>

//           {/* Submit */}
//           <div className="md:col-span-2">
//             <button className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white text-lg rounded-lg font-semibold shadow-md">
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



// File: EditHoroscope.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/";

const PLANETS = [
  "லக்னம்",
  "சூரியன்",
  "சந்திரன்",
  "செவ்வாய்",
  "புதன்",
  "குரு",
  "சுக்கிரன்",
  "சனி",
  "ராகு",
  "கேது",
];

// ---------------------------------------------
// FRONTEND SAFE ARRAY PARSER (FINAL, CORRECT)
// ---------------------------------------------
function safeParseArray(value) {
  if (!value || value === "" || value === "null") return [];

  // Already JSON?
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {}

  // Comma separated fallback
  return value
    .split(",")
    .map((x) => x.trim())
    .filter((x) => x !== "");
}

export default function EditHoroscope() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ConfirmEmail: "",
    Moonsign: "",
    Star: "",
    Gothram: "",
    Manglik: "",
    shani: "",
    shaniplace: "",
    Horosmatch: "",
    parigarasevai: "",
    Sevai: "",
    Raghu: "",
    Keethu: "",
    POB: "",
    POC: "",
    TOB: "",
    horoscope: null,
  });

  const [rasi, setRasi] = useState({});
  const [navamsa, setNavamsa] = useState({});
  const [options, setOptions] = useState({});
  const [preview, setPreview] = useState(null);

  // -----------------------------------------------------
  // LOAD DROPDOWN OPTIONS
  // -----------------------------------------------------
  useEffect(() => {
    async function loadOptions() {
      try {
        const [moon, nak, goth, mang, shani, match] = await Promise.all([
          fetch(API_BASE + "moon-sign").then((r) => r.json()),
          fetch(API_BASE + "nakshatra").then((r) => r.json()),
          fetch(API_BASE + "gothra").then((r) => r.json()),
          fetch(API_BASE + "manglik").then((r) => r.json()),
          fetch(API_BASE + "shani").then((r) => r.json()),
          fetch(API_BASE + "horoscope-match").then((r) => r.json()),
        ]);

        setOptions({
          moonSigns: moon.map((x) => x.Moon_Sign),
          nakshatras: nak.map((x) => x.Nakshatra),
          gothras: goth.map((x) => x.Gothra),
          mangliks: mang.map((x) => x.type),
          shanis: shani.map((x) => x.type),
          horoscopeMatches: match.map((x) => x.type),
        });
      } catch (err) {
        console.error("Dropdown error:", err);
      }
    }

    loadOptions();
  }, []);

  // -----------------------------------------------------
  // LOAD SAVED USER DATA
  // -----------------------------------------------------
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (!user) return;

    setForm((prev) => ({
      ...prev,
      ConfirmEmail: user.ConfirmEmail || "",
      Moonsign: user.Moonsign || "",
      Star: user.Star || "",
      Gothram: user.Gothram || "",
      Manglik: user.Manglik || "",
      shani: user.shani || "",
      shaniplace: user.shaniplace || "",
      Horosmatch: user.Horosmatch || "",
      parigarasevai: user.parigarasevai || "",
      Sevai: user.Sevai || "",
      Raghu: user.Raghu || "",
      Keethu: user.Keethu || "",
      POB: user.POB || "",
      POC: user.POC || "",
      TOB: user.TOB || "",
    }));

    // Load Rasi (g1–g12)
    let r = {};
    for (let i = 1; i <= 12; i++) {
      r[`g${i}`] = safeParseArray(user[`g${i}`]);
    }
    setRasi(r);

    // Load Navamsa (a1–a12)
    let n = {};
    for (let i = 1; i <= 12; i++) {
      n[`a${i}`] = safeParseArray(user[`a${i}`]);
    }
    setNavamsa(n);
  }, []);

  // -----------------------------------------------------
  // CHECKBOX TOGGLE (WITH LAKNAM RULE)
  // -----------------------------------------------------
  const toggleBox = (type, key, value) => {
    const state = type === "rasi" ? { map: rasi, set: setRasi } : { map: navamsa, set: setNavamsa };
    let arr = [...state.map[key]];

    // Laknam only 1 box
    if (value === "லக்னம்") {
      Object.keys(state.map).forEach((k) => {
        if (k !== key) {
          state.map[k] = state.map[k].filter((x) => x !== "லக்னம்");
        }
      });
    }

    if (arr.includes(value)) arr = arr.filter((x) => x !== value);
    else arr.push(value);

    state.set({ ...state.map, [key]: arr });
  };

  // -----------------------------------------------------
  // SUBMIT FORM
  // -----------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();

    // Normal fields
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    // Rasi + Navamsa JSON arrays
    for (let i = 1; i <= 12; i++) {
      fd.append(`g${i}`, JSON.stringify(rasi[`g${i}`] || []));
      fd.append(`a${i}`, JSON.stringify(navamsa[`a${i}`] || []));
    }

    try {
      await axios.put(API_BASE + "auth/update/horoscope", fd);
      alert("Horoscope Updated Successfully");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF4E0] p-6 flex justify-center">
      <div className="bg-white w-full max-w-5xl p-10 rounded-2xl shadow-xl border mt-20">
        <h1 className="text-3xl font-bold text-center mb-8">Edit Horoscope</h1>

        {/* FORM START */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Drop label="Moon Sign" field="Moonsign" options={options.moonSigns || []} form={form} setForm={setForm} />
          <Drop label="Star" field="Star" options={options.nakshatras || []} form={form} setForm={setForm} />
          <Drop label="Gothra" field="Gothram" options={options.gothras || []} form={form} setForm={setForm} />
          <Drop label="Manglik" field="Manglik" options={options.mangliks || []} form={form} setForm={setForm} />
          <Drop label="Shani" field="shani" options={options.shanis || []} form={form} setForm={setForm} />
          <Input label="Place of Shani" field="shaniplace" form={form} setForm={setForm} />
          <Drop label="Horoscope Match" field="Horosmatch" options={options.horoscopeMatches || []} form={form} setForm={setForm} />
          <Input label="Parigarasevai" field="parigarasevai" form={form} setForm={setForm} />
          <Input label="Sevai" field="Sevai" form={form} setForm={setForm} />
          <Input label="Raghu" field="Raghu" form={form} setForm={setForm} />
          <Input label="Keethu" field="Keethu" form={form} setForm={setForm} />
          <Input label="Place of Birth" field="POB" form={form} setForm={setForm} />
          <Input label="Country" field="POC" form={form} setForm={setForm} />
          <Input label="Time of Birth" field="TOB" form={form} setForm={setForm} placeholder="08:00:00 AM" />

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Upload Horoscope</label>
            <input
              type="file"
              className="border p-3 w-full rounded mt-1"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setForm({ ...form, horoscope: file });
                setPreview(URL.createObjectURL(file));
              }}
            />
            {preview && <img src={preview} className="w-40 mt-3 rounded shadow" />}
          </div>

          {/* RASI */}
          <h2 className="col-span-2 text-xl font-bold mt-6">Rasi (12 Boxes)</h2>

          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => {
              const key = `g${i + 1}`;
              return (
                <Box
                  key={key}
                  title={`Rasi Box ${i + 1}`}
                  selected={rasi[key] || []}
                  items={PLANETS}
                  onToggle={(v) => toggleBox("rasi", key, v)}
                />
              );
            })}
          </div>

          {/* NAVAMSA */}
          <h2 className="col-span-2 text-xl font-bold mt-6">Navamsa (12 Boxes)</h2>

          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => {
              const key = `a${i + 1}`;
              return (
                <Box
                  key={key}
                  title={`Navamsa Box ${i + 1}`}
                  selected={navamsa[key] || []}
                  items={PLANETS}
                  onToggle={(v) => toggleBox("navamsa", key, v)}
                />
              );
            })}
          </div>

          {/* SUBMIT */}
          <div className="md:col-span-2 mt-6">
            <button className="w-full bg-pink-600 text-white py-3 rounded-lg text-lg">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* SMALL COMPONENTS */

function Drop({ label, field, options, form, setForm }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        value={form[field] || ""}
        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
        className="border p-3 rounded w-full"
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Input({ label, field, form, setForm, placeholder }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        value={form[field] || ""}
        placeholder={placeholder}
        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
        className="border p-3 rounded w-full"
      />
    </div>
  );
}

function Box({ title, items, selected, onToggle }) {
  return (
    <div className="border rounded-xl p-3 bg-gray-50">
      <h3 className="font-bold mb-2">{title}</h3>
      {items.map((p) => (
        <label key={p} className="flex items-center gap-2 mb-1">
          <input
            type="checkbox"
            checked={selected.includes(p)}
            onChange={() => onToggle(p)}
          />
          <span className="text-sm">{p}</span>
        </label>
      ))}

      <p className="text-xs text-gray-600 mt-2">
        {selected.join(", ") || "Empty"}
      </p>
    </div>
  );
}
