import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../config/api";

const API_BASE = API + "/";

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

// Helper function to generate number arrays
const generateNumbers = (start, end) =>
  Array.from({ length: end - start + 1 }, (_, i) => i + start);

export default function EditHoroscope() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ConfirmEmail: "",
    moonSignId: "",
    Moonsign: "",
    Star: "",
    Gothram: "",
    Manglik: "",
    Horosmatch: "",
    parigarasevai: "",
    Sevai: "",
    Raghu: "",
    Keethu: "",
    POB: "",
    POC: "",
    birthHour: "",
    birthMinute: "",
    birthSecond: "",
    ampm: "AM",
    Kuladeivam: "",
    ThesaiPlanet: "",
    ThesaiYears: "",
    ThesaiMonths: "",
    ThesaiDays: "",
    Kootam: "",
    horoscope: null,
    Sutham: "",
  });

  const [rasi, setRasi] = useState({});
  const [navamsa, setNavamsa] = useState({});
  const [options, setOptions] = useState({
    moonSigns: [],
    nakshatras: [],
    gothras: [],
    mangliks: [],
    horoscopeMatches: [],
  });
  const [preview, setPreview] = useState(null);
  const [customGothra, setCustomGothra] = useState("");
  const [customSutham, setCustomSutham] = useState("");


  // LOAD DROPDOWN OPTIONS
  useEffect(() => {
    async function loadOptions() {
      try {
        const [moon, goth, mang, match] = await Promise.all([
          fetch(API_BASE + "moon-sign").then((r) => r.json()),
          fetch(API_BASE + "gothra").then((r) => r.json()),
          fetch(API_BASE + "manglik").then((r) => r.json()),
          fetch(API_BASE + "horoscope-match").then((r) => r.json()),
        ]);

        setOptions({
          moonSigns: moon,
          nakshatras: [],
          gothras: goth.map((x) => x.Gothra),
          mangliks: mang.map((x) => x.type),
          horoscopeMatches: match.map((x) => x.type),
        });
      } catch (err) {
        console.error("Dropdown error:", err);
      }
    }

    loadOptions();
  }, []);

  // FETCH NAKSHATRA WHEN MOON SIGN CHANGES
  useEffect(() => {
    if (!form.moonSignId) {
      setOptions((prev) => ({ ...prev, nakshatras: [] }));
      return;
    }

    async function fetchNakshatra() {
      try {
        const res = await fetch(`${API_BASE}nakshatra/${form.moonSignId}`);
        const result = await res.json();

        setOptions((prev) => ({
          ...prev,
          nakshatras: result.map((n) => n.nakshatra_paatham),
        }));
      } catch (err) {
        console.error("Failed to fetch nakshatra:", err);
      }
    }

    fetchNakshatra();
  }, [form.moonSignId]);

  // LOAD SAVED USER DATA
useEffect(() => {
  const user = JSON.parse(localStorage.getItem("userData"));
  if (!user) return;

  // Parse TOB
  let hour = "",
    minute = "",
    second = "",
    ampm = "AM";

  if (user.TOB) {
    const timeMatch = user.TOB.match(/(\d+):(\d+):(\d+)\s*(AM|PM)/i);
    if (timeMatch) {
      hour = String(Number(timeMatch[1])); // ✅ FIX
      minute = timeMatch[2];
      second = timeMatch[3];
      ampm = timeMatch[4].toUpperCase();
    }
  }

  // ✅ Handle Gothra properly
  let gothraValue = user.Gothram || "";
  let gothraSelect = gothraValue;
  let gothraCustom = "";

  if (options.gothras.length && !options.gothras.includes(gothraValue)) {
    gothraSelect = "OTHER";
    gothraCustom = gothraValue;
  }

  setForm((prev) => ({
    ...prev,
    ConfirmEmail: user.ConfirmEmail || "",
    moonSignId: user.moonSignId || "",
    Moonsign: user.Moonsign || "",
    Star: user.Star || "",
    Gothram: gothraSelect,
    Manglik: user.Manglik || "",
    Horosmatch: user.Horosmatch || "",
    parigarasevai: user.parigarasevai || "",
    Sevai: user.Sevai || "",
    Raghu: user.Raghu || "",
    Keethu: user.Keethu || "",
    POB: user.POB || "",
    POC: user.POC || "",
    birthHour: hour,
    birthMinute: minute,
    birthSecond: second,
    ampm,
    Kuladeivam: user.Kuladeivam || "",
    ThesaiPlanet: user.ThesaiPlanet || "",
    ThesaiYears: user.ThesaiYears || "",
    ThesaiMonths: user.ThesaiMonths || "",
    ThesaiDays: user.ThesaiDays || "",
    Kootam: user.Kootam || "",
  }));

  setCustomGothra(gothraCustom);

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

  // Preview
  if (user.HoroscopeURL) {
    setPreview(
      user.horosother?.toLowerCase().includes(".pdf")
        ? "PDF"
        : user.HoroscopeURL
    );
  }

  // ---------- SUTHAM (Yes / No / Others) ----------
  let suthamValue = user.Sutham || "";

  if (!["Yes", "No", "Others"].includes(suthamValue)) {
    suthamValue = ""; // fallback safety
  }

  setForm((prev) => ({
    ...prev,
    Sutham: suthamValue,
  }));
}, [options.gothras]);
useEffect(() => {
  const user = JSON.parse(localStorage.getItem("userData"));
  if (!user || !options.moonSigns.length) return;

  const selectedMoon = options.moonSigns.find(
    (m) => String(m.ID) === String(user.moonSignId)
  );

  setForm((prev) => ({
    ...prev,
    moonSignId: selectedMoon?.ID || "",
    Moonsign: selectedMoon?.Moon_Sign || "",
  }));
}, [options.moonSigns]);


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

    // Convert birth time to TOB format - ensure values exist
    const hour = form.birthHour || "00";
    const minute = form.birthMinute || "00";
    const second = form.birthSecond || "00";
    const TOB = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}:${second.toString().padStart(2, "0")} ${form.ampm}`;

    // Add all form fields
    fd.append("ConfirmEmail", form.ConfirmEmail);
    fd.append("Moonsign", form.Moonsign);
    fd.append("Star", form.Star);
    // fd.append("Gothram", form.Gothram || "");
    const finalGothra = form.Gothram === "OTHER" ? customGothra : form.Gothram;

    fd.append("Gothram", finalGothra || "");

    fd.append("Manglik", form.Manglik || "");
    fd.append("Horosmatch", form.Horosmatch || "");
    fd.append("parigarasevai", form.parigarasevai || "");
    fd.append("Sevai", form.Sevai || "");
    fd.append("Raghu", form.Raghu || "");
    fd.append("Keethu", form.Keethu || "");
    fd.append("POB", form.POB || "");
    fd.append("POC", form.POC || "");
    fd.append("TOB", TOB);
    fd.append("Kuladeivam", form.Kuladeivam || "");
   fd.append("ThesaiPlanet", form.ThesaiPlanet || "");
   fd.append("ThesaiYears", form.ThesaiYears || "");
   fd.append("ThesaiMonths", form.ThesaiMonths || "");
   fd.append("ThesaiDays", form.ThesaiDays || "");
   fd.append("Kootam", form.Kootam || "");
fd.append("Sutham", form.Sutham || "");

    // Add horoscope file if selected
    if (form.horoscope) {
      fd.append("horoscope", form.horoscope);
    }

    // Add rasi and navamsa data
    for (let i = 1; i <= 12; i++) {
      fd.append(`g${i}`, JSON.stringify(rasi[`g${i}`] || []));
      fd.append(`a${i}`, JSON.stringify(navamsa[`a${i}`] || []));
    }

    try {

      await axios.put(API_BASE + "auth/update/horoscope", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });


      // Update localStorage with new values
      const userData = JSON.parse(localStorage.getItem("userData"));
      const updatedUser = {
        ...userData,
        Moonsign: form.Moonsign,
        Star: form.Star,
        moonSignId: form.moonSignId,
        TOB: TOB,
        Gothram: finalGothra,
        Manglik: form.Manglik,
        Horosmatch: form.Horosmatch,
        parigarasevai: form.parigarasevai,
        Sevai: form.Sevai,
        Raghu: form.Raghu,
        Keethu: form.Keethu,
        POB: form.POB,
        POC: form.POC,
        Kuladeivam: form.Kuladeivam,
        ThesaiPlanet: form.ThesaiPlanet,
        ThesaiYears: form.ThesaiYears,
        ThesaiMonths: form.ThesaiMonths,
        ThesaiDays: form.ThesaiDays,
        Kootam: form.Kootam,
        Sutham: form.Sutham
      };

      // Update rasi and navamsa in localStorage
      for (let i = 1; i <= 12; i++) {
        updatedUser[`g${i}`] = JSON.stringify(rasi[`g${i}`] || []);
        updatedUser[`a${i}`] = JSON.stringify(navamsa[`a${i}`] || []);
      }

      localStorage.setItem("userData", JSON.stringify(updatedUser));

      alert("Horoscope Updated Successfully");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };



  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("userData"));
  if (!user || !options.nakshatras.length) return;

  if (options.nakshatras.includes(user.Star)) {
    setForm((prev) => ({
      ...prev,
      Star: user.Star,
    }));
  }
}, [options.nakshatras]);


  

  return (
    <div className="min-h-screen bg-[#FFF4E0] p-6 flex justify-center font-display">
      <div className="bg-white w-full max-w-5xl p-10 rounded-2xl shadow-xl border mt-20">
        <h1 className="text-3xl font-bold text-center mb-8">Edit Horoscope</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-6"
        >
          {/* Moon Sign - Special handling with ID */}
          <div className="w-full flex flex-col">
            <label className="text-sm font-medium mb-1 text-black">
              Moon Sign (Rasi)
            </label>
            <select
              value={form.moonSignId || ""}
              onChange={(e) => {
                const selected = options.moonSigns.find(
                  (m) => m.ID == e.target.value
                );
                setForm({
                  ...form,
                  moonSignId: selected?.ID || "",
                  Moonsign: selected?.Moon_Sign || "",
                  // Star: "",
                });
              }}
              className="border p-3 rounded w-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="">Select Moon Sign</option>
              {options.moonSigns.map((m) => (
                <option key={m.ID} value={m.ID}>
                  {m.Moon_Sign}
                </option>
              ))}
            </select>
          </div>

          {/* Star - Depends on Moon Sign */}
          <div className="w-full flex flex-col">
            <label className="text-sm font-medium mb-1 text-black">
              Star (Nakshatra)
            </label>
            <select
              value={form.Star || ""}
              onChange={(e) => setForm({ ...form, Star: e.target.value })}
              className="border p-3 rounded w-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-pink-400"
              disabled={!form.moonSignId}
            >
              <option value="">
                {form.moonSignId ? "Select Star" : "First select Moon Sign"}
              </option>
              {options.nakshatras.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full flex flex-col">
            <label className="text-sm font-medium mb-1 text-black">
              Gothra
            </label>

            <select
              value={form.Gothram || ""}
              onChange={(e) => {
                setForm({ ...form, Gothram: e.target.value });
                if (e.target.value !== "OTHER") {
                  setCustomGothra("");
                }
              }}
              className="border p-3 rounded w-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="">Select Gothra</option>

              {options.gothras.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}

              <option value="OTHER">Other</option>
            </select>

            {/* Show input only if Other selected */}
            {form.Gothram === "OTHER" && (
              <input
                type="text"
                placeholder="Enter your Gothra"
                value={customGothra}
                onChange={(e) => setCustomGothra(e.target.value)}
                className="border p-3 rounded w-full mt-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            )}
          </div>

          {/* Sutham */}
          <div className="w-full flex flex-col">
            <label className="text-sm font-medium mb-1 text-black">
              Sutham
            </label>

            <select
              value={form.Sutham}
              onChange={(e) => setForm({ ...form, Sutham: e.target.value })}
              className="border p-3 rounded w-full bg-white focus:ring-2 focus:ring-pink-400"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <Drop
            label="Manglik"
            field="Manglik"
            options={options.mangliks || []}
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

          {/* Numeric Dropdowns for Parigarasevai, Sevai, Raghu, Keethu */}
          <Drop
            label="Parigarasevai"
            field="parigarasevai"
            options={generateNumbers(0, 12)}
            form={form}
            setForm={setForm}
          />
          <Drop
            label="Sevai"
            field="Sevai"
            options={generateNumbers(0, 12)}
            form={form}
            setForm={setForm}
          />
          <Drop
            label="Raghu"
            field="Raghu"
            options={generateNumbers(0, 12)}
            form={form}
            setForm={setForm}
          />
          <Drop
            label="Keethu"
            field="Keethu"
            options={generateNumbers(0, 12)}
            form={form}
            setForm={setForm}
          />

          {/* Birth Time - Split into Hour/Minute/Second/AM-PM */}
          {/* <div className="w-full flex flex-col md:col-span-2">
            <label className="text-sm font-medium mb-1 text-black">
              Birth Time
            </label>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="text-xs text-gray-600">Hr</label>
                <select
                  value={form.birthHour}
                  onChange={(e) =>
                    setForm({ ...form, birthHour: e.target.value })
                  }
                  className="border p-3 rounded w-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="">--</option>
                  {generateNumbers(1, 12).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-600">Min</label>
                <select
                  value={form.birthMinute}
                  onChange={(e) =>
                    setForm({ ...form, birthMinute: e.target.value })
                  }
                  className="border p-3 rounded w-full bg-white"
                >
                  <option value="">--</option>
                  {generateNumbers(0, 59).map((num) => (
                    <option key={num} value={String(num).padStart(2, "0")}>
                      {String(num).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-600">Sec</label>
                <select
                  value={form.birthSecond}
                  onChange={(e) =>
                    setForm({ ...form, birthMinute: e.target.value })
                  }
                  className="border p-3 rounded w-full bg-white"
                >
                  <option value="">--</option>
                  {generateNumbers(0, 59).map((num) => (
                    <option key={num} value={String(num).padStart(2, "0")}>
                      {String(num).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-600">AM/PM</label>
                <select
                  value={form.ampm}
                  onChange={(e) => setForm({ ...form, ampm: e.target.value })}
                  className="border p-3 rounded w-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div> */}
          {/* Birth Time */}
          <div className="w-full flex flex-col md:col-span-2">
            <label className="text-sm font-medium mb-2 text-black">
              Birth Time
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Hour */}
              <div>
                <label className="text-xs text-gray-600">Hr</label>
                <select
                  value={form.birthHour}
                  onChange={(e) =>
                    setForm({ ...form, birthHour: e.target.value })
                  }
                  className="border p-3 rounded w-full bg-white"
                >
                  <option value="">--</option>
                  {generateNumbers(1, 12).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Minute */}
              <div>
                <label className="text-xs text-gray-600">Min</label>
                <select
                  value={form.birthMinute}
                  onChange={(e) =>
                    setForm({ ...form, birthMinute: e.target.value })
                  }
                  className="border p-3 rounded w-full bg-white"
                >
                  <option value="">--</option>
                  {generateNumbers(0, 59).map((n) => (
                    <option key={n} value={String(n).padStart(2, "0")}>
                      {String(n).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Second */}
              <div>
                <label className="text-xs text-gray-600">Sec</label>
                <select
                  value={form.birthSecond}
                  onChange={(e) =>
                    setForm({ ...form, birthSecond: e.target.value })
                  }
                  className="border p-3 rounded w-full bg-white"
                >
                  <option value="">--</option>
                  {generateNumbers(0, 59).map((n) => (
                    <option key={n} value={String(n).padStart(2, "0")}>
                      {String(n).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>

              {/* AM / PM */}
              <div>
                <label className="text-xs text-gray-600">AM / PM</label>
                <select
                  value={form.ampm}
                  onChange={(e) => setForm({ ...form, ampm: e.target.value })}
                  className="border p-3 rounded w-full bg-white"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          <Drop
            label="Thesai Planet"
            field="ThesaiPlanet"
            options={PLANETS}
            form={form}
            setForm={setForm}
          />

          <Drop
            label="Thesai Years"
            field="ThesaiYears"
            options={generateNumbers(0, 120)}
            form={form}
            setForm={setForm}
          />

          <Drop
            label="Thesai Months"
            field="ThesaiMonths"
            options={generateNumbers(0, 11)}
            form={form}
            setForm={setForm}
          />

          <Drop
            label="Thesai Days"
            field="ThesaiDays"
            options={generateNumbers(0, 30)}
            form={form}
            setForm={setForm}
          />

          <Input label="Kootam" field="Kootam" form={form} setForm={setForm} />

          <Input
            label="Place of Birth"
            field="POB"
            form={form}
            setForm={setForm}
          />
          <Input
            label="Country of Birth"
            field="POC"
            form={form}
            setForm={setForm}
          />

          {/* Kuladeivam */}
          <Input
            label="Kuladeivam"
            field="Kuladeivam"
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
                {preview === "PDF" && (
                  <p className="text-sm text-red-600 mt-3">
                    Existing Horoscope is a PDF – cannot show image preview
                  </p>
                )}

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
    <div className="w-full flex flex-col">
      <label className="text-sm font-medium mb-1 text-black">{label}</label>

      <select
        value={form[field] || ""}
        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
        className="border p-3 rounded w-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-pink-400"
      >
        <option value="" className="text-gray-500">
          Select
        </option>

        {options.map((o) => (
          <option key={o} value={o} className="text-black">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function Input({ label, field, form, setForm, placeholder }) {
  return (
    <div className="w-full flex flex-col">
      <label className="text-sm font-medium mb-1 text-black">{label}</label>

      <input
        value={form[field] || ""}
        placeholder={placeholder}
        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
        className="border p-3 rounded w-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-pink-400"
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