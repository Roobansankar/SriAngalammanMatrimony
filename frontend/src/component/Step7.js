

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
    heightText: formData.heightText || formData.height || "", // ✅ Changed from 'height' to 'heightText'
    weight: formData.weight || "",
    bloodGroup: formData.bloodGroup || "",
    complexion: formData.complexion || "",
    bodyType: formData.bodyType || "",
    diet: formData.diet || "",
    smoke: formData.smoke || "",
    drink: formData.drink || "",
    specialCases: formData.specialCases || "",

    /** MULTI SELECT FIELDS **/
    hobbies: Array.isArray(formData.hobbies)
      ? formData.hobbies
      : formData.hobbies
      ? formData.hobbies.split(",")
      : [],

    interests: Array.isArray(formData.interests)
      ? formData.interests
      : formData.interests
      ? formData.interests.split(",")
      : [],

    otherHobbies: formData.otherHobbies || "",
    otherInterests: formData.otherInterests || "",
    achievement: formData.achievement || "",
    medicalHistory: formData.medicalHistory || "",
    passport: formData.passport || "No",
  });

useEffect(() => {
  if (Object.keys(formData).length > 0) {
    setData((prev) => ({
      ...prev,
      ...formData,
      hobbies: Array.isArray(formData.hobbies)
        ? formData.hobbies
        : formData.hobbies
        ? formData.hobbies.split(",")
        : [],
      interests: Array.isArray(formData.interests)
        ? formData.interests
        : formData.interests
        ? formData.interests.split(",")
        : [],
    }));
  }
}, [formData]);


  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  /** MULTI SELECT HANDLER **/
  const handleMultiSelect = (e) => {
    const values = Array.from(e.target.selectedOptions).map((o) => o.value);
    setData({ ...data, [e.target.name]: values });
  };

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

  // Height options
  const heightOptions = (() => {
    const arr = [];
    let num = 1;
    for (let i = 1; i <= 11; i++) {
      arr.push({ value: String(num++), label: `4Ft ${i} inch` });
    }
    for (let ft = 5; ft <= 6; ft++) {
      arr.push({ value: String(num++), label: `${ft}Ft` });
      for (let i = 1; i <= 11; i++) {
        arr.push({ value: String(num++), label: `${ft}Ft ${i} inch` });
      }
    }
    arr.push({ value: String(num++), label: `7Ft` });
    return arr;
  })();

  const weightOptions = Array.from({ length: 111 }, (_, i) => String(i + 40));

  // const handleNext = () => {
  //   nextStep({
  //     ...data,
  //     /** CONVERT ARRAYS TO CSV FOR STEP12 **/
  //     hobbies: data.hobbies.join(","),
  //     interests: data.interests.join(","),
  //   });
  // };


  const handleNext = () => {
    nextStep({
      ...data,
      hobbies: Array.isArray(data.hobbies) ? data.hobbies.join(",") : "",
      interests: Array.isArray(data.interests) ? data.interests.join(",") : "",
    });
  };


  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#fff8f0] to-[#fff0e6] shadow-xl rounded-2xl p-8 border border-[#f3cba5] mt-12">
      <h3 className="text-2xl font-bold text-[#7b1113] text-center mb-6 border-b-2 border-[#f3cba5] pb-3">
        Step 5: Physical Details & Hobbies
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Height */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Height</label>
          <select
            name="heightText"
            value={data.heightText}
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 w-full"
          >
            <option value="">Select Height</option>
            {heightOptions.map((h) => (
              <option key={h.value} value={h.label}>
                {h.label}
              </option>
            ))}
          </select>
        </div>

        {/* Weight */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Weight</label>
          <select
            name="weight"
            value={data.weight}
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 w-full"
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
            className="border rounded-xl px-4 py-3 w-full"
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
            className="border rounded-xl px-4 py-3 w-full"
          >
            <option value="">Select Complexion</option>
            {options.complexions.map((c) => (
              <option key={c.id} value={c.complexion}>
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
            className="border rounded-xl px-4 py-3 w-full"
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
            className="border rounded-xl px-4 py-3 w-full"
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
            className="border rounded-xl px-4 py-3 w-full"
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
            className="border rounded-xl px-4 py-3 w-full"
          >
            <option value="">Select Option</option>
            {options.drinkTypes.map((d) => (
              <option key={d.id} value={d.drink_type || d.Drink_type}>
                {d.drink_type || d.Drink_type}
              </option>
            ))}
          </select>
        </div>

        {/* Special Cases */}
        <div className="col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Special Cases
          </label>
          <select
            name="specialCases"
            value={data.specialCases}
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 w-full"
          >
            <option value="">Select Special Case</option>
            {options.specialCases.map((s) => (
              <option key={s.id} value={s.case_type}>
                {s.case_type}
              </option>
            ))}
          </select>
        </div>

        {/* Hobbies MULTI SELECT */}
        <div className="col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Hobbies (Select Multiple)
          </label>
          <select
            multiple
            name="hobbies"
            value={data.hobbies}
            onChange={handleMultiSelect}
            className="border rounded-xl px-4 py-3 w-full h-40"
          >
            {options.hobbies.map((h) => (
              <option key={h.id} value={h.hobbies}>
                {h.hobbies}
              </option>
            ))}
          </select>
        </div>

        {/* Interests MULTI SELECT */}
        <div className="col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Interests (Select Multiple)
          </label>
          <select
            multiple
            name="interests"
            value={data.interests}
            onChange={handleMultiSelect}
            className="border rounded-xl px-4 py-3 w-full h-40"
          >
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
          placeholder="Achievements"
          rows={2}
          value={data.achievement}
          onChange={handleChange}
          className="col-span-2 border rounded-xl px-4 py-3"
        />

        {/* Medical History */}
        <textarea
          name="medicalHistory"
          placeholder="Medical History"
          rows={2}
          value={data.medicalHistory}
          onChange={handleChange}
          className="col-span-2 border rounded-xl px-4 py-3"
        />

        {/* Passport */}
        <label className="block font-medium text-gray-700 mb-1 col-span-2">
          Do you have a Passport?
        </label>
        <select
          name="passport"
          value={data.passport}
          onChange={handleChange}
          className="col-span-2 border rounded-xl px-4 py-3"
        >
          <option value="No"> No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={prevStep} className="px-6 py-3 rounded-xl bg-gray-300">
          ⬅ Back
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-xl bg-[#7b1113] text-white"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}