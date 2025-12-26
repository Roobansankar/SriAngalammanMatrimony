import { FileUp, Stars } from "lucide-react";
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api/";

export default function Step4({ nextStep, prevStep, formData }) {
  const [options, setOptions] = useState({
    moonSigns: [],
    nakshatras: [],
    gothras: [],
    mangliks: [],
    shanis: [],
    horoscopeMatches: [],
  });

  const dropdownList = [
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

  const [data, setData] = useState({
    moonSign: formData.moonSign || "",
    star: formData.star || "",
    gothra: formData.gothra || "",
    manglik: formData.manglik || "",
    shani: formData.shani || "",
    placeOfShani: formData.placeOfShani || "",
    horoscopeMatch: formData.horoscopeMatch || "",
    parigarasevai: formData.parigarasevai || "",
    sevai: formData.sevai || "",
    raghu: formData.raghu || "",
    keethu: formData.keethu || "",
    birthHour: formData.birthHour || "",
    birthMinute: formData.birthMinute || "",
    birthSecond: formData.birthSecond || "",
    ampm: formData.ampm || "AM",
    placeOfBirth: formData.placeOfBirth || "",
    countryOfBirth: formData.countryOfBirth || "",
    kuladeivam: formData.kuladeivam || "",
    thesaiirupu: formData.thesaiirupu || "",
    horoscopeFile: null,
    horoscopeFileName: formData.horoscopeFileName || "",

    // Rasi 12 cards
    ...Object.fromEntries(
      [...Array(12)].map((_, i) => [`g${i + 1}`, formData[`g${i + 1}`] || []])
    ),

    // Navamsam 12 cards
    ...Object.fromEntries(
      [...Array(12)].map((_, i) => [`a${i + 1}`, formData[`a${i + 1}`] || []])
    ),
  });

  // Sync local state when formData prop changes (e.g., after localStorage load)
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      setData((prev) => ({
        ...prev,
        moonSign: formData.moonSign || prev.moonSign,
        star: formData.star || prev.star,
        gothra: formData.gothra || prev.gothra,
        manglik: formData.manglik || prev.manglik,
        shani: formData.shani || prev.shani,
        placeOfShani: formData.placeOfShani || prev.placeOfShani,
        horoscopeMatch: formData.horoscopeMatch || prev.horoscopeMatch,
        parigarasevai: formData.parigarasevai || prev.parigarasevai,
        sevai: formData.sevai || prev.sevai,
        raghu: formData.raghu || prev.raghu,
        keethu: formData.keethu || prev.keethu,
        birthHour: formData.birthHour || prev.birthHour,
        birthMinute: formData.birthMinute || prev.birthMinute,
        birthSecond: formData.birthSecond || prev.birthSecond,
        ampm: formData.ampm || prev.ampm,
        kuladeivam: formData.kuladeivam || prev.kuladeivam,
        thesaiirupu: formData.thesaiirupu || prev.thesaiirupu,
        placeOfBirth: formData.placeOfBirth || prev.placeOfBirth,
        countryOfBirth: formData.countryOfBirth || prev.countryOfBirth,
        ...Object.fromEntries(
          [...Array(12)].map((_, i) => [
            `g${i + 1}`,
            formData[`g${i + 1}`] || prev[`g${i + 1}`] || [],
          ])
        ),
        ...Object.fromEntries(
          [...Array(12)].map((_, i) => [
            `a${i + 1}`,
            formData[`a${i + 1}`] || prev[`a${i + 1}`] || [],
          ])
        ),
      }));
    }
  }, [formData]);

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
        console.error("Failed to fetch options:", err);
      }
    }
    fetchOptions();
  }, []);

  // Helper function to format place names (letters, spaces, commas, dots allowed)
  const formatPlaceName = (value) => value.replace(/[^a-zA-Z\s,.\-']/g, "");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setData({
        ...data,
        horoscopeFile: files[0],
        horoscopeFileName: files[0].name,
        // [name]: files[0],
      });
    } else {
      // Format place name fields
      if (
        name === "placeOfShani" ||
        name === "placeOfBirth" ||
        name === "countryOfBirth"
      ) {
        setData({ ...data, [name]: formatPlaceName(value) });
      } else {
        setData({ ...data, [name]: value });
      }
    }
  };

  const generateNumbers = (s, e) =>
    Array.from({ length: e - s + 1 }, (_, i) => i + s);

  const handleNext = () => {
    nextStep({
      ...data,
      kuladeivam: data.kuladeivam,
      thesaiirupu: data.thesaiirupu,
      ...Object.fromEntries(
        [...Array(12)].map((_, i) => [`g${i + 1}`, data[`g${i + 1}`]])
      ),
      ...Object.fromEntries(
        [...Array(12)].map((_, i) => [`a${i + 1}`, data[`a${i + 1}`]])
      ),
      horoscopeFileName: data.horoscopeFileName,
    });
    
  };

  // Check Laknam in Rasi boxes
  const selectedLaknamRasi =
    [...Array(12)]
      .map((_, i) => ({ key: `g${i + 1}`, box: data[`g${i + 1}`] }))
      .find((b) => b.box.includes("லக்னம்"))?.key || null;

  // Check Laknam in Navamsam boxes
  const selectedLaknamNavamsam =
    [...Array(12)]
      .map((_, i) => ({ key: `a${i + 1}`, box: data[`a${i + 1}`] }))
      .find((b) => b.box.includes("லக்னம்"))?.key || null;

  return (
    <div className="bg-white shadow-lg rounded-2xl w-full max-w-2xl p-6 mx-auto border border-yellow-200 mt-12">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Stars className="w-8 h-8 text-yellow-600" />
        <h3 className="text-2xl font-bold text-yellow-700">
          Step 4: Horoscope (ஜாதகம்) Details
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Moon Sign (Rasi)
          </label>
          <select
            name="moonSign"
            value={data.moonSign}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-yellow-500 outline-none"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Star (Nakshatra)
          </label>
          <select
            name="star"
            value={data.star}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-yellow-500 outline-none"
          >
            <option value="">Select Star</option>
            {options.nakshatras.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Gothra */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gothra
          </label>
          <select
            name="gothra"
            value={data.gothra}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-yellow-500 outline-none"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Manglik
          </label>
          <select
            name="manglik"
            value={data.manglik}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-yellow-500 outline-none"
          >
            <option value="">Select Manglik Type</option>
            {options.mangliks.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Shani */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shani
          </label>
          <select
            name="shani"
            value={data.shani}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-yellow-500 outline-none"
          >
            <option value="">Select Shani Type</option>
            {options.shanis.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Place of Shani */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Place of Shani
          </label>
          <input
            name="placeOfShani"
            value={data.placeOfShani}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-yellow-500 outline-none"
          />
        </div>

        {/* Horoscope Match */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horoscope Match
          </label>
          <select
            name="horoscopeMatch"
            value={data.horoscopeMatch}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-yellow-500 outline-none"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parigarasevai
          </label>
          <select
            name="parigarasevai"
            value={data.parigarasevai}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-yellow-500 outline-none"
          >
            <option value="">Select Parigarasevai</option>
            {generateNumbers(2, 12).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Sevai */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sevai
          </label>
          <select
            name="sevai"
            value={data.sevai}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-yellow-500 outline-none"
          >
            <option value="">Select Sevai</option>
            {generateNumbers(2, 12).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Raghu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Raghu
          </label>
          <select
            name="raghu"
            value={data.raghu}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-yellow-500 outline-none"
          >
            <option value="">Select Raghu</option>
            {generateNumbers(0, 12).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Keethu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Keethu
          </label>
          <select
            name="keethu"
            value={data.keethu}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-yellow-500 outline-none"
          >
            <option value="">Select Keethu</option>
            {generateNumbers(0, 12).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Thesai Irupu */}
        <div className="col-span-2 mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thesai Irupu (திசைஇருப்பு)
          </label>
          <input
            name="thesaiirupu"
            value={data.thesaiirupu}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full"
          />
        </div>

        {/* Birth Time */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Birth Time
          </label>
          <div className="flex items-center gap-2">
            <select
              name="birthHour"
              value={data.birthHour}
              onChange={handleChange}
              className="border p-2 rounded-lg w-1/3 text-center focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="">Hr</option>
              {generateNumbers(1, 12).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>

            <select
              name="birthMinute"
              value={data.birthMinute}
              onChange={handleChange}
              className="border p-2 rounded-lg w-1/3 text-center focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="">Min</option>
              <option value="00">00</option>
              {generateNumbers(1, 60).map((num) => (
                <option key={num} value={String(num).padStart(2, "0")}>
                  {String(num).padStart(2, "0")}
                </option>
              ))}
            </select>

            <select
              name="birthSecond"
              value={data.birthSecond}
              onChange={handleChange}
              className="border p-2 rounded-lg w-1/3 text-center focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="">Sec</option>
              <option value="00">00</option>
              {generateNumbers(1, 60).map((num) => (
                <option key={num} value={String(num).padStart(2, "0")}>
                  {String(num).padStart(2, "0")}
                </option>
              ))}
            </select>

            <select
              name="ampm"
              value={data.ampm}
              onChange={handleChange}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>
        </div>
      </div>
      {/* ---------------- Rasi 12 Cards ---------------- */}
      <h2 className="text-lg font-bold text-yellow-700 mb-2 col-span-2">
        12 Rasi Boxes (ராகு)
      </h2>

      <div className="grid grid-cols-3 gap-3 col-span-2 mb-6">
        {[...Array(12)].map((_, i) => {
          const key = `g${i + 1}`;
          return (
            <div key={key} className="border p-3 rounded-xl bg-gray-50">
              <label className="font-bold text-gray-800 block mb-2">
                Box {i + 1}
              </label>

              {dropdownList.map((p) => (
                <label key={p} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={data[key].includes(p)}
                    disabled={
                      p === "லக்னம்" &&
                      selectedLaknamRasi !== null &&
                      selectedLaknamRasi !== key
                    }
                    onChange={(e) => {
                      let updated = [...data[key]];

                      if (e.target.checked) {
                        // If Laknam clicked, remove Laknam from all other boxes
                        if (p === "லக்னம்") {
                          for (let j = 1; j <= 12; j++) {
                            if (`g${j}` !== key) {
                              data[`g${j}`] = data[`g${j}`].filter(
                                (x) => x !== "லக்னம்"
                              );
                            }
                          }
                        }
                        updated.push(p);
                      } else {
                        updated = updated.filter((x) => x !== p);
                      }

                      setData({ ...data, [key]: updated });
                    }}
                  />

                  <span className="text-sm">{p}</span>
                </label>
              ))}

              <p className="text-xs text-gray-600 mt-2">
                {data[key].join(", ")}
              </p>
            </div>
          );
        })}
      </div>

      {/* ---------------- Navamsam 12 Cards ---------------- */}
      <h2 className="text-lg font-bold text-purple-700 mb-2 col-span-2">
        12 Navamsam Boxes (நவாம்சம்)
      </h2>

      <div className="grid grid-cols-3 gap-3 col-span-2 mb-6">
        {[...Array(12)].map((_, i) => {
          const key = `a${i + 1}`;
          return (
            <div key={key} className="border p-3 rounded-xl bg-gray-50">
              <label className="font-bold text-gray-800 block mb-2">
                Box {i + 1}
              </label>

              {dropdownList.map((p) => (
                <label key={p} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={data[key].includes(p)}
                    disabled={
                      p === "லக்னம்" &&
                      selectedLaknamNavamsam !== null &&
                      selectedLaknamNavamsam !== key
                    }
                    onChange={(e) => {
                      let updated = [...data[key]];

                      if (e.target.checked) {
                        // If Laknam clicked, remove Laknam from all other navamsam boxes
                        if (p === "லக்னம்") {
                          for (let j = 1; j <= 12; j++) {
                            if (`a${j}` !== key) {
                              data[`a${j}`] = data[`a${j}`].filter(
                                (x) => x !== "லக்னம்"
                              );
                            }
                          }
                        }
                        updated.push(p);
                      } else {
                        updated = updated.filter((x) => x !== p);
                      }

                      setData({ ...data, [key]: updated });
                    }}
                  />

                  <span className="text-sm">{p}</span>
                </label>
              ))}

              <p className="text-xs text-gray-600 mt-2">
                {data[key].join(", ")}
              </p>
            </div>
          );
        })}
      </div>

      {/* ---------------- OLD FIELDS BELOW ---------------- */}

      {/* Place of Birth */}
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Place of Birth
        </label>
        <input
          name="placeOfBirth"
          value={data.placeOfBirth}
          onChange={handleChange}
          className="border p-2 rounded-lg w-full"
        />
      </div>

      {/* Country */}
      <div className="col-span-2 mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country of Birth
        </label>
        <input
          name="countryOfBirth"
          value={data.countryOfBirth}
          onChange={handleChange}
          className="border p-2 rounded-lg w-full"
        />
      </div>

      {/* Kuladeivam */}
      <div className="col-span-2 mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kuladeivam
        </label>
        <input
          name="kuladeivam"
          value={data.kuladeivam}
          onChange={handleChange}
          className="border p-2 rounded-lg w-full"
        />
      </div>

      {/* File Upload */}
      <label className="flex items-center justify-center border-2 border-dashed border-yellow-400 rounded-lg py-3 cursor-pointer col-span-2 mt-6">
        <FileUp className="w-5 h-5 text-yellow-600 mr-2" />
        
        <span className="text-gray-700">
          {data.horoscopeFile
            ? data.horoscopeFile.name
            : data.horoscopeFileName
            ? `Uploaded: ${data.horoscopeFileName}`
            : "Upload Horoscope"}
        </span>

        <input
          type="file"
          name="horoscopeFile"
          className="hidden"
          onChange={handleChange}
        />
      </label>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="border px-4 py-2 rounded-lg text-gray-700"
        >
          ← Back
        </button>

        <button
          onClick={handleNext}
          className="bg-yellow-600 text-white px-6 py-2 rounded-lg"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
