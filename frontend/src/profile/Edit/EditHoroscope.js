import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function EditHoroscope({ adminMode = false }) {
  const navigate = useNavigate();
  const params = useParams();
  const [form, setForm] = useState({
    ConfirmEmail: "",
    moonSignId: "",
    Moonsign: "",
    Star: "",
    Lagnam: "",
    Gothram: "",
    Shani: "",
    ShaniPlace: "",
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


  const [options, setOptions] = useState({
    moonSigns: [],
    nakshatras: [],
    gothras: [],
    mangliks: [],
    horoscopeMatches: [],
    shani: [],
    lagnams: [],
  });
  const [preview, setPreview] = useState(null);
  const [customGothra, setCustomGothra] = useState("");
  const [customSutham, setCustomSutham] = useState("");


  useEffect(() => {
    async function loadOptions() {
      try {
        const [moonRes, gothRes, mangRes, matchRes, shaniRes, lagnamRes] =
          await Promise.all([
            fetch(API_BASE + "moon-sign"),
            fetch(API_BASE + "gothra"),
            fetch(API_BASE + "manglik"),
            fetch(API_BASE + "horoscope-match"),
            fetch(API_BASE + "shani"),
            fetch(API_BASE + "lagnam"), // new
          ]);

        const moon = await moonRes.json();
        const goth = await gothRes.json();
        const mang = await mangRes.json();
        const match = await matchRes.json();
        const shani = await shaniRes.json();
        const lagnam = await lagnamRes.json();

        console.log("Lagnams:", lagnam);

        setOptions({
          moonSigns: moon || [],
          nakshatras: [],
          gothras: goth.map((x) => x.Gothra) || [],
          mangliks: mang.map((x) => x.type) || [],
          horoscopeMatches: match.map((x) => x.type) || [],
          shani: shani.map((x) => x.type) || [],
          // lagnams: lagnam.map((x) => x.Lagnam) || [],
          lagnams: lagnam.map((x) => x.name) || [],
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




useEffect(() => {
  const loadData = async () => {
    let user;

    if (adminMode && params.matriId) {
      const res = await axios.get(`${API_BASE}admin/profile/${params.matriId}`);
      user = res.data.user;
    } else {
      user = JSON.parse(localStorage.getItem("userData"));
    }

    if (!user) return;

    /* -------------------------
       PARSE TIME OF BIRTH
    --------------------------*/
    let hour = "",
      minute = "",
      second = "",
      ampm = "AM";

    if (user.TOB) {
      const match = user.TOB.match(/(\d+):(\d+):(\d+)\s*(AM|PM)/i);

      if (match) {
        hour = String(Number(match[1]));
        minute = match[2];
        second = match[3];
        ampm = match[4].toUpperCase();
      }
    }

    /* -------------------------
       SET FORM
    --------------------------*/
    setForm((prev) => ({
      ...prev,
      ConfirmEmail: user.ConfirmEmail || "",
      MatriID: user.MatriID || "",

      Moonsign: user.Moonsign || "",
      Star: user.Star || "",
      Lagnam: user.Lagnam || "",
      Gothram: user.Gothram || "",

      Shani: user.Shani || user.shani || "",
      ShaniPlace: user.shaniplace || "",

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
      ampm: ampm,

      Kuladeivam: user.Kuladeivam || "",
      Kootam: user.Kootam || "",
      Sutham: user.Sutham || "",

      ThesaiPlanet: user.ThesaiPlanet || "",
      ThesaiYears: user.ThesaiYears || "",
      ThesaiMonths: user.ThesaiMonths || "",
      ThesaiDays: user.ThesaiDays || "",
    }));

    /* -------------------------
       LOAD RASI + NAVAMSA
    --------------------------*/
    const rasiData = {};
    const navamsaData = {};

    for (let i = 1; i <= 12; i++) {
      rasiData[`g${i}`] = safeParseArray(user[`g${i}`]);
      navamsaData[`a${i}`] = safeParseArray(user[`a${i}`]);
    }

    setRasi(rasiData);
    setNavamsa(navamsaData);
  };

  loadData();
}, [adminMode, params.matriId]);

 
//  const toggleBox = (type, key, value) => {
//    const state =
//      type === "rasi"
//        ? { map: rasi, set: setRasi }
//        : { map: navamsa, set: setNavamsa };

//    // SAFE ARRAY
//    let arr = [...(state.map[key] || [])];

//    // Only one Lagna allowed
//    if (value === "லக்") {
//      const updated = { ...state.map };

//      Object.keys(updated).forEach((k) => {
//        if (k !== key) {
//          updated[k] = (updated[k] || []).filter((x) => x !== "லக்");
//        }
//      });

//      state.set(updated);
//    }

//    if (arr.includes(value)) {
//      arr = arr.filter((x) => x !== value);
//    } else {
//      arr.push(value);
//    }

//    state.set({
//      ...state.map,
//      [key]: arr,
//    });
//  };

const toggleBox = (type, key, value) => {
  const state =
    type === "rasi"
      ? { map: rasi, set: setRasi }
      : { map: navamsa, set: setNavamsa };

  const updated = { ...state.map };

  // Ensure array exists
  if (!updated[key]) {
    updated[key] = [];
  }

  /* -------------------------
     SINGLE LAGNA RULE
  --------------------------*/
  if (value === "லக்") {
    // Remove Lagna from all boxes
    Object.keys(updated).forEach((k) => {
      updated[k] = (updated[k] || []).filter(
        (planet) => planet !== "லக்"
      );
    });

    // Add Lagna only to current box
    updated[key].push("லக்");

    state.set(updated);
    return;
  }

  /* -------------------------
     NORMAL PLANET TOGGLE
  --------------------------*/
  if (updated[key].includes(value)) {
    updated[key] = updated[key].filter((x) => x !== value);
  } else {
    updated[key].push(value);
  }

  state.set(updated);
};



const emptyBoxes = {};
for (let i = 1; i <= 12; i++) {
  emptyBoxes[`g${i}`] = [];
}

const emptyNavamsa = {};
for (let i = 1; i <= 12; i++) {
  emptyNavamsa[`a${i}`] = [];
}

const [rasi, setRasi] = useState(emptyBoxes);
const [navamsa, setNavamsa] = useState(emptyNavamsa);


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

      if (adminMode) {
        fd.append("matriId", params.matriId);
      } else {
        fd.append("ConfirmEmail", form.ConfirmEmail);
      }

    // Add all form fields
    // fd.append("ConfirmEmail", form.ConfirmEmail);
    fd.append("Moonsign", form.Moonsign);
    fd.append("Star", form.Star);
    fd.append("Lagnam", form.Lagnam || "");

    // fd.append("Gothram", form.Gothram || "");
    const finalGothra = form.Gothram === "OTHER" ? customGothra : form.Gothram;

    fd.append("Gothram", finalGothra || "");
fd.append("Shani", form.Shani || "");
// fd.append("ShaniPlace", form.Shani ? form.ShaniPlace || "" : "");
fd.append("ShaniPlace", form.ShaniPlace || "");


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

 

      await axios.put(API_BASE + "auth/update/horoscope", fd);



      // Update localStorage with new values
      const userData = JSON.parse(localStorage.getItem("userData"));
      const updatedUser = {
        ...userData,
        Moonsign: form.Moonsign,
        Star: form.Star,
        moonSignId: form.moonSignId,
        lagnamId: form.lagnamId,
        Lagnam: form.Lagnam,
        TOB: TOB,
        Gothram: finalGothra,
        shani: form.Shani,
        shaniplace: form.ShaniPlace,

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
        Sutham: form.Sutham,
      };

      // Update rasi and navamsa in localStorage
      for (let i = 1; i <= 12; i++) {
        updatedUser[`g${i}`] = JSON.stringify(rasi[`g${i}`] || []);
        updatedUser[`a${i}`] = JSON.stringify(navamsa[`a${i}`] || []);
      }

      localStorage.setItem("userData", JSON.stringify(updatedUser));

      alert("Horoscope Updated Successfully");
      // navigate("/profile");
      if (adminMode) {
        navigate(`/admin/profile/${params.matriId}`);
      } else {
        navigate("/profile");
      }

    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };






useEffect(() => {
  const user = JSON.parse(localStorage.getItem("userData"));
  if (!user) return;

  setForm((prev) => ({
    ...prev,
    Star: user.Star || "",
  }));
}, [options.nakshatras]);




useEffect(() => {
  const user = JSON.parse(localStorage.getItem("userData"));
  if (!user || !options.moonSigns.length) return;

  const selectedMoon = options.moonSigns.find(
    (m) => m.Moon_Sign === user.Moonsign
  );

  setForm((prev) => ({
    ...prev,
    moonSignId: selectedMoon?.ID || "",
    Moonsign: selectedMoon?.Moon_Sign || "",
  }));
}, [options.moonSigns]);





  

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
                  (m) => m.ID == e.target.value,
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

          {/* Lagnam */}
          <div className="w-full flex flex-col">
            <label className="text-sm font-medium mb-1 text-black">
              Lagnam (Ascendant)
            </label>

            <select
              value={form.Lagnam || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  Lagnam: e.target.value,
                })
              }
              className="border p-3 rounded w-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="">Select Lagnam</option>

              {options.lagnams.map((l) => (
                <option key={l} value={l}>
                  {l}
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

          {/* Shani */}
          <Drop
            label="Shani"
            field="Shani"
            options={options.shani || []}
            form={form}
            setForm={setForm}
          />

          {/* Place of Shani – show only if Shani selected */}
          {form.Shani && (
            <Input
              label="Place of Shani"
              field="ShaniPlace"
              form={form}
              setForm={setForm}
              placeholder="Enter Place of Shani"
            />
          )}

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
              accept="image/*"
              className="border p-3 w-full rounded mt-1"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                // ❌ Block PDF
                if (file.type === "application/pdf") {
                  alert("Please upload only image files (JPG, PNG, JPEG)");
                  e.target.value = ""; // reset input
                  return;
                }

                // ❌ Block non-image files
                if (!file.type.startsWith("image/")) {
                  alert("Invalid file type. Only images are allowed.");
                  e.target.value = "";
                  return;
                }

                // ✅ Accept image
                setForm({ ...form, horoscope: file });
                setPreview(URL.createObjectURL(file));
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
          <h2 className="col-span-2 text-xl font-bold mt-6">
            Rasi (12 Boxes) (clock wise)
          </h2>
          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => {
              const key = `g${i + 1}`;
              return (
                <Box
                  key={key}
                  // title={`Rasi Box ${i + 1}`}
                  title={`Rasi Box ${i + 1}${
                    i + 1 === 1
                      ? " (Left Top)"
                      : i + 1 === 4
                        ? " (Right Top)"
                        : i + 1 === 7
                          ? " (Right Bottom)"
                          : i + 1 === 10
                            ? " (Left Bottom)"
                            : ""
                  }`}
                  selected={rasi[key] || []}
                  items={PLANETS}
                  onToggle={(v) => toggleBox("rasi", key, v)}
                />
              );
            })}
          </div>

          <h2 className="col-span-2 text-xl font-bold mt-6">
            Navamsa (12 Boxes) (clock wise)
          </h2>
          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => {
              const key = `a${i + 1}`;
              return (
                <Box
                  key={key}
                  // title={`Navamsa Box ${i + 1}`}
                  title={`Navamsa Box ${i + 1}${
                    i + 1 === 1
                      ? " (Left Top)"
                      : i + 1 === 4
                        ? " (Right Top)"
                        : i + 1 === 7
                          ? " (Right Bottom)"
                          : i + 1 === 10
                            ? " (Left Bottom)"
                            : ""
                  }`}
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