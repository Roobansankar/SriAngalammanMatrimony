import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api/";

export default function Step7({ nextStep, prevStep, formData = {} }) {
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

  const [data, setData] = useState({
    height: formData.height || "",
    weight: formData.weight || "",
    bloodGroup: formData.bloodGroup || "",
    complexion: formData.complexion || "",
    bodyType: formData.bodyType || "",
    diet: formData.diet || "",
    smoke: formData.smoke || "",
    drink: formData.drink || "",
    specialCases: formData.specialCases || "",
    hobbies: formData.hobbies || "",
    interests: formData.interests || "",
    otherHobbies: formData.otherHobbies || "",
    otherInterests: formData.otherInterests || "",
    achievement: formData.achievement || "",
    medicalHistory: formData.medicalHistory || "",
    passport: formData.passport || "No",
  });

  // Sync local state when formData prop changes (e.g., after localStorage load)
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      setData((prev) => ({
        ...prev,
        height: formData.height || prev.height,
        weight: formData.weight || prev.weight,
        bloodGroup: formData.bloodGroup || prev.bloodGroup,
        complexion: formData.complexion || prev.complexion,
        bodyType: formData.bodyType || prev.bodyType,
        diet: formData.diet || prev.diet,
        smoke: formData.smoke || prev.smoke,
        drink: formData.drink || prev.drink,
        specialCases: formData.specialCases || prev.specialCases,
        hobbies: formData.hobbies || prev.hobbies,
        interests: formData.interests || prev.interests,
        otherHobbies: formData.otherHobbies || prev.otherHobbies,
        otherInterests: formData.otherInterests || prev.otherInterests,
        achievement: formData.achievement || prev.achievement,
        medicalHistory: formData.medicalHistory || prev.medicalHistory,
        passport: formData.passport || prev.passport,
      }));
    }
  }, [formData]);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleNext = () => nextStep(data);

  useEffect(() => {
    async function loadDropdowns() {
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
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    }

    loadDropdowns();
  }, []);

  // Build height options to match your PHP mapping:
  // value 1 -> "4Ft 1 inch", ... 12 -> "4Ft 11 inch", 13 -> "5Ft", ... up to 37 -> "7Ft"
  const heightOptions = (() => {
    const arr = [];
    let valueCounter = 1;
    // 4ft: start from 4ft 1in
    for (let inInFt = 1; inInFt <= 11; inInFt++, valueCounter++) {
      arr.push({ value: String(valueCounter), label: `4Ft ${inInFt} inch` });
    }
    // feet 5 and 6 with 0..11 inches, then 7ft (value 37)
    for (let ft = 5; ft <= 6; ft++) {
      // first push the exact foot (e.g., "5Ft") (this corresponds to your mapping where 13 => 5Ft)
      arr.push({ value: String(valueCounter++), label: `${ft}Ft` });
      for (let inch = 1; inch <= 11; inch++) {
        arr.push({
          value: String(valueCounter++),
          label: `${ft}Ft ${inch} inch`,
        });
      }
    }
    // 7Ft (no inches)
    arr.push({ value: String(valueCounter++), label: `7Ft` }); // should reach 37
    return arr;
  })();

  // Weight options 40..150
  const weightOptions = Array.from({ length: 150 - 40 + 1 }, (_, i) =>
    String(40 + i)
  );

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#fff8f0] to-[#fff0e6] shadow-xl rounded-2xl p-8 border border-[#f3cba5] mt-12">
      <h3 className="text-2xl font-bold text-[#7b1113] text-center mb-6 border-b-2 border-[#f3cba5] pb-3">
        Step 7: Physical Details & Hobbies
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Height (dropdown) */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Height</label>
          <select
            name="height"
            value={data.height}
            onChange={handleChange}
            className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
          >
            <option value="">Select Height</option>
            {heightOptions.map((h) => (
              <option key={h.value} value={h.value}>
                {h.label}
              </option>
            ))}
          </select>
        </div>

        {/* Weight (dropdown 40..150) */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Weight (kg)
          </label>
          <select
            name="weight"
            value={data.weight}
            onChange={handleChange}
            className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
          >
            <option value="">Select Weight</option>
            {weightOptions.map((w) => (
              <option key={w} value={w}>
                {w} kg
              </option>
            ))}
          </select>
        </div>

        {/* Blood Group */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Blood Group
          </label>
          <select
            name="bloodGroup"
            value={data.bloodGroup}
            onChange={handleChange}
            className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
          >
            <option value="">Select Blood Group</option>
            {options.bloodGroups.map((b) => (
              <option key={b.id} value={b.type}>
                {b.type}
              </option>
            ))}
          </select>
        </div>

        {/* Complexion */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Complexion
          </label>
          <select
            name="complexion"
            value={data.complexion}
            onChange={handleChange}
            className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
          >
            <option value="">Select Complexion</option>
            {options.complexions.map((c) => (
              <option key={c.ID ?? c.id} value={c.complexion}>
                {c.complexion}
              </option>
            ))}
          </select>
        </div>

        {/* Body Type */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Body Type
          </label>
          <select
            name="bodyType"
            value={data.bodyType}
            onChange={handleChange}
            className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
          >
            <option value="">Select Body Type</option>
            {options.bodyTypes.map((b) => (
              <option key={b.id} value={b.body_type}>
                {b.body_type}
              </option>
            ))}
          </select>
        </div>

        {/* Diet */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Diet Type
          </label>
          <select
            name="diet"
            value={data.diet}
            onChange={handleChange}
            className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
          >
            <option value="">Select Diet</option>
            {options.diets.map((d) => (
              <option key={d.id} value={d.diet_type}>
                {d.diet_type}
              </option>
            ))}
          </select>
        </div>

        {/* Smoke */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Do you Smoke?
          </label>
          <select
            name="smoke"
            value={data.smoke}
            onChange={handleChange}
            className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
          >
            <option value="">Select Option</option>
            {options.smokeTypes.map((s) => (
              <option key={s.id} value={s.smoke_type}>
                {s.smoke_type}
              </option>
            ))}
          </select>
        </div>

        {/* Drink */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Do you Drink?
          </label>
          <select
            name="drink"
            value={data.drink}
            onChange={handleChange}
            className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
          >
            <option value="">Select Option</option>
            {options.drinkTypes.map((d) => (
              <option key={d.id} value={d.Drink_type || d.drink_type}>
                {d.Drink_type || d.drink_type}
              </option>
            ))}
          </select>
        </div>

        {/* Special Cases */}
        <div className="col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Special Cases (if any)
          </label>
          <select
            name="specialCases"
            value={data.specialCases}
            onChange={handleChange}
            className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
          >
            <option value="">Select Special Case</option>
            {options.specialCases.map((s) => (
              <option key={s.id} value={s.case_type}>
                {s.case_type}
              </option>
            ))}
          </select>
        </div>

        {/* Hobbies */}
        <div className="col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Hobbies
          </label>
          <select
            name="hobbies"
            value={data.hobbies}
            onChange={handleChange}
            className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
          >
            <option value="">Select Hobby</option>
            {options.hobbies.map((h) => (
              <option key={h.id} value={h.hobbies}>
                {h.hobbies}
              </option>
            ))}
          </select>
        </div>

        {/* Interests */}
        <div className="col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Interests
          </label>
          <select
            name="interests"
            value={data.interests}
            onChange={handleChange}
            className="border border-[#e4cbb4] rounded-xl px-4 py-3 w-full bg-white focus:ring-2 focus:ring-[#b91c1c]"
          >
            <option value="">Select Interest</option>
            {options.interests.map((i) => (
              <option key={i.id} value={i.interest}>
                {i.interest}
              </option>
            ))}
          </select>
        </div>

        {/* Achievements */}
        <textarea
          name="achievement"
          placeholder="Achievements (Awards, Certificates, etc.)"
          rows={2}
          value={data.achievement}
          onChange={handleChange}
          className="col-span-2 border border-[#e4cbb4] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#b91c1c]"
        />

        {/* Medical History */}
        <textarea
          name="medicalHistory"
          placeholder="Medical History (if any)"
          rows={2}
          value={data.medicalHistory}
          onChange={handleChange}
          className="col-span-2 border border-[#e4cbb4] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#b91c1c]"
        />

        {/* Passport */}
        <select
          name="passport"
          value={data.passport}
          onChange={handleChange}
          className="col-span-2 border border-[#e4cbb4] rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-[#b91c1c]"
        >
          <option value="No">Do you have a Passport? - No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="px-6 py-3 rounded-xl bg-[#bca36b] text-[#4b1b00] font-semibold hover:bg-[#d4b76d] transition"
        >
          ⬅ Back
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-xl bg-[#7b1113] text-white font-semibold hover:bg-[#a61b1d] transition"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}
