// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

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
//     horoscope: null, // file upload
//   });

//   const [imagePreview, setImagePreview] = useState(null);
//   const navigate = useNavigate();

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

 

// return (
//   <div className="min-h-screen  flex items-center justify-center p-6 bg-[#FFF4E0] font-display">
//     <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-10 border border-gray-200 mt-20">
//       <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
//         Edit Horoscope Details
//       </h1>

//       <form
//         onSubmit={handleSubmit}
//         className="grid grid-cols-1 md:grid-cols-2 gap-6"
//       >
//         {/* LEFT / RIGHT TWO COLUMN INPUTS */}
//         {[
//           { key: "Moonsign", label: "Moon Sign" },
//           { key: "Star", label: "Star" },
//           { key: "Gothram", label: "Gothram" },
//           { key: "Manglik", label: "Manglik" },
//           { key: "shani", label: "Shani" },
//           { key: "shaniplace", label: "Place of Shani" },
//           { key: "Horosmatch", label: "Horoscope Match" },
//           { key: "parigarasevai", label: "Parigara Sevai" },
//           { key: "Sevai", label: "Sevai" },
//           { key: "Raghu", label: "Raghu" },
//           { key: "Keethu", label: "Keethu" },
//           { key: "POB", label: "Place of Birth" },
//           { key: "POC", label: "Country / Place" },
//         ].map((item) => (
//           <div key={item.key}>
//             <label className="text-sm font-semibold text-gray-700">
//               {item.label}
//             </label>
//             <input
//               type="text"
//               className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-pink-500"
//               value={form[item.key]}
//               onChange={(e) => updateField(item.key, e.target.value)}
//             />
//           </div>
//         ))}

//         {/* TIME OF BIRTH — FULL WIDTH */}
//         <div className="md:col-span-2">
//           <label className="text-sm font-semibold text-gray-700">
//             Time of Birth
//           </label>
//           <input
//             type="text"
//             placeholder="07:30:00 AM"
//             className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-pink-500"
//             value={form.TOB}
//             onChange={(e) => updateField("TOB", e.target.value)}
//           />
//         </div>

//         {/* FILE UPLOAD — FULL WIDTH */}
//         <div className="md:col-span-2">
//           <label className="text-sm font-semibold text-gray-700">
//             Upload Horoscope Image
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             className="w-full border border-gray-300 p-3 rounded-lg mt-1 bg-gray-50"
//           />

//           {imagePreview && (
//             <div className="mt-3">
//               <img
//                 src={imagePreview}
//                 alt="Preview"
//                 className="w-48 rounded-lg border shadow-sm"
//               />
//             </div>
//           )}
//         </div>

//         {/* SAVE BUTTON */}
//         <div className="md:col-span-2">
//           <button className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white text-lg rounded-lg font-semibold shadow-md transition-all">
//             Save Changes
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// );

// }


// File: EditHoroscope.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/";

export default function EditHoroscope() {
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

  const [options, setOptions] = useState({
    moonSigns: [],
    nakshatras: [],
    gothras: [],
    mangliks: [],
    shanis: [],
    horoscopeMatches: [],
  });

  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  // -----------------------------------------
  // 1️⃣ Load dropdown options from backend
  // -----------------------------------------
  useEffect(() => {
    async function fetchOptions() {
      try {
        const [moonRes, nakshRes, gothraRes, manglikRes, shaniRes, matchRes] =
          await Promise.all([
            fetch(`${API_BASE}moon-sign`),
            fetch(`${API_BASE}nakshatra`),
            fetch(`${API_BASE}gothra`),
            fetch(`${API_BASE}manglik`),
            fetch(`${API_BASE}shani`),
            fetch(`${API_BASE}horoscope-match`),
          ]);

        const [
          moonData,
          nakshData,
          gothraData,
          manglikData,
          shaniData,
          matchData,
        ] = await Promise.all([
          moonRes.json(),
          nakshRes.json(),
          gothraRes.json(),
          manglikRes.json(),
          shaniRes.json(),
          matchRes.json(),
        ]);

        setOptions({
          moonSigns: moonData.map((m) => m.Moon_Sign),
          nakshatras: nakshData.map((n) => n.Nakshatra),
          gothras: gothraData.map((g) => g.Gothra),
          mangliks: manglikData.map((m) => m.type),
          shanis: shaniData.map((s) => s.type),
          horoscopeMatches: matchData.map((h) => h.type),
        });
      } catch (err) {
        console.error("Dropdown fetch error:", err);
      }
    }

    fetchOptions();
  }, []);

  // -----------------------------------------
  // 2️⃣ Load user saved data
  // -----------------------------------------
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (!data) return;

    setForm({
      ConfirmEmail: data.ConfirmEmail || "",
      Moonsign: data.Moonsign || "",
      Star: data.Star || "",
      Gothram: data.Gothram || "",
      Manglik: data.Manglik || "",
      shani: data.shani || data.Shani || "",
      shaniplace: data.shaniplace || data.place || "",
      Horosmatch: data.Horosmatch || "",
      parigarasevai: data.parigarasevai || "",
      Sevai: data.Sevai || "",
      Raghu: data.Raghu || "",
      Keethu: data.Keethu || "",
      POB: data.POB || data.PlaceOfBirth || "",
      POC: data.POC || data.Country || "",
      TOB: data.TOB || "",
      horoscope: null,
    });
  }, []);

  const updateField = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    updateField("horoscope", file);
    setImagePreview(URL.createObjectURL(file));
  };

  // -----------------------------------------
  // 3️⃣ Submit update
  // -----------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      for (const key in form) {
        fd.append(key, form[key]);
      }

      await axios.put("http://localhost:5000/api/auth/update/horoscope", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Horoscope details updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FFF4E0] font-display">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-10 border border-gray-200 mt-20">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Edit Horoscope Details
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* --- DROPDOWN FIELDS --- */}
          {/* Moon Sign */}
          <div>
            <label className="text-sm font-semibold">Moon Sign</label>
            <select
              className="border p-3 rounded-lg w-full"
              value={form.Moonsign}
              onChange={(e) => updateField("Moonsign", e.target.value)}
            >
              <option value="">Select Moon Sign</option>
              {options.moonSigns.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Star */}
          <div>
            <label className="text-sm font-semibold">Star / Nakshatra</label>
            <select
              className="border p-3 rounded-lg w-full"
              value={form.Star}
              onChange={(e) => updateField("Star", e.target.value)}
            >
              <option value="">Select Star</option>
              {options.nakshatras.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Gothram */}
          <div>
            <label className="text-sm font-semibold">Gothra</label>
            <select
              className="border p-3 rounded-lg w-full"
              value={form.Gothram}
              onChange={(e) => updateField("Gothram", e.target.value)}
            >
              <option value="">Select Gothra</option>
              {options.gothras.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Manglik */}
          <div>
            <label className="text-sm font-semibold">Manglik</label>
            <select
              className="border p-3 rounded-lg w-full"
              value={form.Manglik}
              onChange={(e) => updateField("Manglik", e.target.value)}
            >
              <option value="">Select Manglik</option>
              {options.mangliks.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Shani */}
          <div>
            <label className="text-sm font-semibold">Shani</label>
            <select
              className="border p-3 rounded-lg w-full"
              value={form.shani}
              onChange={(e) => updateField("shani", e.target.value)}
            >
              <option value="">Select Shani</option>
              {options.shanis.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Shani place */}
          <div>
            <label className="text-sm font-semibold">Place of Shani</label>
            <input
              className="border p-3 rounded-lg w-full"
              value={form.shaniplace}
              onChange={(e) => updateField("shaniplace", e.target.value)}
            />
          </div>

          {/* Horoscope Match */}
          <div>
            <label className="text-sm font-semibold">Horoscope Match</label>
            <select
              className="border p-3 rounded-lg w-full"
              value={form.Horosmatch}
              onChange={(e) => updateField("Horosmatch", e.target.value)}
            >
              <option value="">Select Horoscope Match</option>
              {options.horoscopeMatches.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          {/* Parigarasevai */}
          <div>
            <label className="text-sm font-semibold">Parigarasevai</label>
            <input
              className="border p-3 rounded-lg w-full"
              value={form.parigarasevai}
              onChange={(e) => updateField("parigarasevai", e.target.value)}
            />
          </div>

          {/* Sevai */}
          <div>
            <label className="text-sm font-semibold">Sevai</label>
            <input
              className="border p-3 rounded-lg w-full"
              value={form.Sevai}
              onChange={(e) => updateField("Sevai", e.target.value)}
            />
          </div>

          {/* Raghu */}
          <div>
            <label className="text-sm font-semibold">Raghu</label>
            <input
              className="border p-3 rounded-lg w-full"
              value={form.Raghu}
              onChange={(e) => updateField("Raghu", e.target.value)}
            />
          </div>

          {/* Keethu */}
          <div>
            <label className="text-sm font-semibold">Keethu</label>
            <input
              className="border p-3 rounded-lg w-full"
              value={form.Keethu}
              onChange={(e) => updateField("Keethu", e.target.value)}
            />
          </div>

          {/* Place Of Birth */}
          <div>
            <label className="text-sm font-semibold">Place of Birth</label>
            <input
              className="border p-3 rounded-lg w-full"
              value={form.POB}
              onChange={(e) => updateField("POB", e.target.value)}
            />
          </div>

          {/* Country */}
          <div>
            <label className="text-sm font-semibold">Country / Place</label>
            <input
              className="border p-3 rounded-lg w-full"
              value={form.POC}
              onChange={(e) => updateField("POC", e.target.value)}
            />
          </div>

          {/* Time of Birth */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Time of Birth</label>
            <input
              className="border p-3 rounded-lg w-full"
              value={form.TOB}
              onChange={(e) => updateField("TOB", e.target.value)}
              placeholder="08:00:00 AM"
            />
          </div>

          {/* File Upload */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Upload Horoscope</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border p-3 rounded-lg w-full mt-1 bg-gray-50"
            />

            {imagePreview && (
              <img
                src={imagePreview}
                className="w-48 rounded-lg mt-3 border shadow"
                alt="Preview"
              />
            )}
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white text-lg rounded-lg font-semibold shadow-md">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
