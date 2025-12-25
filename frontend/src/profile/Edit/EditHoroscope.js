
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = (process.env.REACT_APP_API_BASE || "http://localhost:5000") + "/api/";

const PLANETS = [
  "லக்",
  "சூரி",
  "சந்",
  "செவ்",
  "புத",
  "குரு",
  "சுக்",
  "சனி",
  "ராகு",
  "கேது",
  "மாந்",
];

// ---------------------------------------------
// FRONTEND SAFE ARRAY PARSER
// ---------------------------------------------
function safeParseArray(value) {
  if (!value || value === "" || value === "null") return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {}

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
    Kuladeivam: "", // ⭐ NEW FIELD
    ThesaiIrupu: "", // ⭐ NEW FIELD
    horoscope: null,
  });

  const [rasi, setRasi] = useState({});
  const [navamsa, setNavamsa] = useState({});
  const [options, setOptions] = useState({});
  const [preview, setPreview] = useState(null);

  // LOAD DROPDOWN OPTIONS
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

  // LOAD SAVED USER DATA
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
      Kuladeivam: user.Kuladeivam || "", // ⭐ NEW FIELD
      ThesaiIrupu: user.ThesaiIrupu || "", // ⭐ NEW FIELD
    }));

    // Rasi
    let r = {};
    for (let i = 1; i <= 12; i++) {
      r[`g${i}`] = safeParseArray(user[`g${i}`]);
    }
    setRasi(r);

    // Navamsa
    let n = {};
    for (let i = 1; i <= 12; i++) {
      n[`a${i}`] = safeParseArray(user[`a${i}`]);
    }
    setNavamsa(n);
  }, []);

  // CHECKBOX TOGGLE
  const toggleBox = (type, key, value) => {
    const state =
      type === "rasi"
        ? { map: rasi, set: setRasi }
        : { map: navamsa, set: setNavamsa };
    let arr = [...state.map[key]];

    if (value === "லக்") {
      Object.keys(state.map).forEach((k) => {
        if (k !== key) {
          state.map[k] = state.map[k].filter((x) => x !== "லக்");
        }
      });
    }

    if (arr.includes(value)) arr = arr.filter((x) => x !== value);
    else arr.push(value);

    state.set({ ...state.map, [key]: arr });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();

    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

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



  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (!user) return;

    // existing code that sets form...

    // ⭐ SET PREVIEW FOR EXISTING HOROSCOPE
    if (user.HoroscopeURL) {
      if (user.horosother && user.horosother.toLowerCase().includes(".pdf")) {
        setPreview("PDF"); // no image preview
      } else {
        setPreview(user.HoroscopeURL);
      }
    }
  }, []);


  return (
    <div className="min-h-screen bg-[#FFF4E0] p-6 flex justify-center">
      <div className="bg-white w-full max-w-5xl p-10 rounded-2xl shadow-xl border mt-20">
        <h1 className="text-3xl font-bold text-center mb-8">Edit Horoscope</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Drop
            label="Moon Sign"
            field="Moonsign"
            options={options.moonSigns || []}
            form={form}
            setForm={setForm}
          />
          <Drop
            label="Star"
            field="Star"
            options={options.nakshatras || []}
            form={form}
            setForm={setForm}
          />
          <Drop
            label="Gothra"
            field="Gothram"
            options={options.gothras || []}
            form={form}
            setForm={setForm}
          />
          <Drop
            label="Manglik"
            field="Manglik"
            options={options.mangliks || []}
            form={form}
            setForm={setForm}
          />
          <Drop
            label="Shani"
            field="shani"
            options={options.shanis || []}
            form={form}
            setForm={setForm}
          />
          <Input
            label="Place of Shani"
            field="shaniplace"
            form={form}
            setForm={setForm}
          />
          <Drop
            label="Horoscope Match"
            field="Horosmatch"
            options={options.horoscopeMatches || []}
            form={form}
            setForm={setForm}
          />
          <Input
            label="Parigarasevai"
            field="parigarasevai"
            form={form}
            setForm={setForm}
          />
          <Input label="Sevai" field="Sevai" form={form} setForm={setForm} />
          <Input label="Raghu" field="Raghu" form={form} setForm={setForm} />
          <Input label="Keethu" field="Keethu" form={form} setForm={setForm} />
          <Input
            label="Place of Birth"
            field="POB"
            form={form}
            setForm={setForm}
          />
          <Input label="Country" field="POC" form={form} setForm={setForm} />
          <Input
            label="Time of Birth"
            field="TOB"
            form={form}
            setForm={setForm}
            placeholder="08:00:00 AM"
          />

          {/* ⭐ NEW FIELDS */}
          <Input
            label="Kuladeivam"
            field="Kuladeivam"
            form={form}
            setForm={setForm}
          />
          <Input
            label="Thesai Irupu"
            field="ThesaiIrupu"
            form={form}
            setForm={setForm}
          />

          {/* Upload */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">Upload Horoscope</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              className="border p-3 w-full rounded mt-1"
              onChange={(e) => {
                const file = e.target.files[0];
                setForm({ ...form, horoscope: file });

                if (!file) return;

                if (file.type.includes("pdf")) {
                  setPreview("PDF");
                } else {
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />

            {preview && (
              <>
                {/* If PDF */}
                {preview === "PDF" && (
                  <p className="text-sm text-red-600 mt-3">
                    Existing Horoscope is a PDF – cannot show image preview
                  </p>
                )}

                {/* If IMAGE */}
                {preview !== "PDF" && typeof preview === "string" && (
                  <img
                    src={preview}
                    alt="Horoscope preview"
                    className="w-40 mt-3 rounded shadow border"
                  />
                )}
                
              </>
            )}


            
          </div>

          {/* Rasi + Navamsa */}
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

          <h2 className="col-span-2 text-xl font-bold mt-6">
            Navamsa (12 Boxes)
          </h2>
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

/* REUSABLE COMPONENTS */

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
