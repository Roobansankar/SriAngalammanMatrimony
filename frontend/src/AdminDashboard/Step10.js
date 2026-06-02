import axios from "axios";
import { useEffect, useState } from "react";
import { API } from "../config/api";

const API_BASE = API + "/";

// Helper → Move "Any" to the top
function putAnyFirst(arr, key = null) {
  if (!Array.isArray(arr)) return [];

  let anyItem = null;
  let others = [];

  arr.forEach((item) => {
    const value = key ? item[key] : item;
    if (value === "Any") anyItem = item;
    else others.push(item);
  });

  return anyItem ? [anyItem, ...others] : others;
}

export default function Step10({ nextStep, prevStep, formData = {} }) {
  const [options, setOptions] = useState({
    religions: [],
    castes: [],
    countries: [],
    states: [],
    residencyStatus: [],
    educations: [],
    occupations: [],
    maritalStatus: [],
  });

  const [data, setData] = useState({
    maritalStatus: Array.isArray(formData.maritalStatus)
      ? formData.maritalStatus
      : formData.maritalStatus
      ? formData.maritalStatus.split(",")
      : [],

    ageFrom: formData.ageFrom || "",
    ageTo: formData.ageTo || "",
    heightFrom: formData.heightFrom || "",
    heightTo: formData.heightTo || "",
    religion: formData.religion || "",
    caste: formData.caste || "",
    complexion: formData.complexion || "",
    residencyStatus: formData.residencyStatus || "",
    partnerEducation: formData.partnerEducation || "Any",
    partnerOccupation: formData.partnerOccupation || "Any",
    partnerCountry: formData.partnerCountry || "",
    partnerState: formData.partnerState || "",
    partnerCity: formData.partnerCity || "",

    partnerExpectations: formData.partnerExpectations || "",
  });

  // Sync when formData changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      setData((prev) => ({
        ...prev,
        maritalStatus: Array.isArray(formData.maritalStatus)
          ? formData.maritalStatus
          : formData.maritalStatus
          ? formData.maritalStatus.split(",")
          : prev.maritalStatus,

        ageFrom: formData.ageFrom || prev.ageFrom,
        ageTo: formData.ageTo || prev.ageTo,
        heightFrom: formData.heightFrom || prev.heightFrom,
        heightTo: formData.heightTo || prev.heightTo,
        religion: formData.religion || prev.religion,
        caste: formData.caste || prev.caste,
        complexion: formData.complexion || prev.complexion,
        residencyStatus: formData.residencyStatus || prev.residencyStatus,
        country: formData.country || prev.country,
        state: formData.state || prev.state,
        city: formData.city || prev.city,
        education: formData.education || prev.education,
        occupation: formData.occupation || prev.occupation,
        partnerExpectations:
          formData.partnerExpectations || prev.partnerExpectations,
      }));
    }
  }, [formData]);

  // Age dropdown
  const ageOptions = Array.from({ length: 48 }, (_, i) => 18 + i);

  // Height dropdown
  const heightOptions = [];
  for (let ft = 4; ft <= 7; ft++) {
    for (let inch = 0; inch < 12; inch++) {
      if (ft === 7 && inch > 0) break;
      heightOptions.push(`${ft}ft${inch > 0 ? " " + inch + "in" : ""}`);
    }
  }

  // Load initial dropdown data
  useEffect(() => {
    async function loadInitial() {
      try {
        const [
          relRes,
          resiRes,
          eduRes,
          occuRes,
          countryRes,
          maritalRes,
        ] = await Promise.all([
          axios.get(`${API_BASE}religions`),
          axios.get(`${API_BASE}residency-status`),
          axios.get(`${API_BASE}educations`),
          axios.get(`${API_BASE}occupations`),
          axios.get(`${API_BASE}countries`),
          axios.get(`${API_BASE}maritalstatus`), // ✅ ADD THIS
        ]);

        setOptions((prev) => ({
          ...prev,
          religions: putAnyFirst(relRes.data, "Religion"),
          residencyStatus: putAnyFirst(resiRes.data, "residency_status"),
          educations: putAnyFirst(eduRes.data, "edu"),
          occupations: uniqueBy(
            [{ id: "any", occu: "Any" }, ...occuRes.data],
            "occu"
          ),

          countries: putAnyFirst(countryRes.data, "country"),
          maritalStatus: maritalRes.data,
        }));
      } catch (err) {
        console.error("Error loading dropdowns:", err);
      }
    }

    loadInitial();
  }, []);

  // helper: returns unique array by key (keeps first occurrence)
  function uniqueBy(arr, key) {
    const seen = new Set();
    return arr.filter((item) => {
      const v = key ? item[key] : item;
      if (seen.has(v)) return false;
      seen.add(v);
      return true;
    });
  }

  // Religion → Caste
  useEffect(() => {
    if (!data.religion) return;

    // If user selects ANY — set single Any (no API call)
    if (data.religion === "Any") {
      setOptions((prev) => ({
        ...prev,
        castes: uniqueBy(
          [{ ID: "any", Caste: "Any" }, ...(prev.castes || [])],
          "Caste"
        ),
      }));
      return;
    }

    axios
      .get(`${API_BASE}castes?religion=${data.religion}`)
      .then((res) => {
        // Prepend Any but ensure uniqueness
        const merged = uniqueBy(
          [{ ID: "any", Caste: "Any" }, ...res.data],
          "Caste"
        );
        setOptions((prev) => ({ ...prev, castes: merged }));
      })
      .catch((err) => console.error("Error fetching castes:", err));
  }, [data.religion]);

  // Country → State
  useEffect(() => {
    if (!data.country) return;

    axios
      .get(`${API_BASE}states?country=${data.country}`)
      .then((res) =>
        setOptions((prev) => ({
          ...prev,
          states: putAnyFirst(res.data, "state"),
        }))
      )
      .catch((err) => console.error("Error fetching states:", err));
  }, [data.country]);

  // General inputs
  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleCheckbox = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;

    setData((prev) => {
      let list = [...prev.maritalStatus];

      if (value === "Any") {
        // If "Any" is checked → reset all to only "Any"
        return { ...prev, maritalStatus: checked ? ["Any"] : [] };
      }

      // If other options selected → remove "Any"
      list = list.filter((v) => v !== "Any");

      if (checked) {
        list.push(value);
      } else {
        list = list.filter((v) => v !== value);
      }

      return { ...prev, maritalStatus: list };
    });
  };

  const handleNext = () =>
    nextStep({
      ...data,
      partnerEducation: data.partnerEducation,
      partnerOccupation: data.partnerOccupation,
      partnerCountry: data.partnerCountry,
      partnerState: data.partnerState,
      partnerCity: data.partnerCity,
    });

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-12 text-gray-800">
      <h3 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Partner Preferences
      </h3>

      {/* Marital Status */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">
          Preferred Marital Status
        </h4>

        <div className="flex flex-wrap gap-4">
          {/* EXTRA OPTION → ANY */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              value="Any"
              checked={data.maritalStatus.includes("Any")}
              onChange={handleCheckbox}
              className="accent-blue-600 w-4 h-4"
            />
            <span>Any</span>
          </label>

          {/* DATABASE OPTIONS */}
          {options.maritalStatus.map((item) => (
            <label key={item.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={item.status}
                checked={data.maritalStatus.includes(item.status)}
                onChange={handleCheckbox}
                className="accent-blue-600 w-4 h-4"
              />
              <span>{item.status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Age & Height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select
          name="ageFrom"
          value={data.ageFrom}
          onChange={handleChange}
          className="input-box"
        >
          <option value="">Age From</option>
          {ageOptions.map((age) => (
            <option key={age} value={age}>
              {age}
            </option>
          ))}
        </select>

        <select
          name="ageTo"
          value={data.ageTo}
          onChange={handleChange}
          className="input-box"
        >
          <option value="">Age To</option>
          {ageOptions.map((age) => (
            <option key={age} value={age}>
              {age}
            </option>
          ))}
        </select>

        <select
          name="heightFrom"
          value={data.heightFrom}
          onChange={handleChange}
          className="input-box"
        >
          <option value="">Height From</option>
          {heightOptions.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        <select
          name="heightTo"
          value={data.heightTo}
          onChange={handleChange}
          className="input-box"
        >
          <option value="">Height To</option>
          {heightOptions.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>

      {/* Religion → Caste */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select
          name="religion"
          value={data.religion}
          onChange={handleChange}
          className="input-box"
        >
          <option value="">Select Religion</option>

          {/* EXTRA OPTION → ANY */}
          <option value="Any">Any</option>

          {options.religions.map((r) => (
            <option key={r.ID} value={r.Religion}>
              {r.Religion}
            </option>
          ))}
        </select>

        <select
          name="caste"
          value={data.caste}
          onChange={handleChange}
          className="input-box"
        >
          <option value="">Select Caste</option>

          {options.castes.map((c) => (
            <option key={c.ID} value={c.Caste}>
              {c.Caste}
            </option>
          ))}
        </select>
      </div>

      {/* Complexion & Residency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          placeholder="Complexion (e.g. Fair, Medium, Dark)"
          name="complexion"
          value={data.complexion}
          onChange={handleChange}
          className="input-box"
        />

        <select
          name="residencyStatus"
          value={data.residencyStatus}
          onChange={handleChange}
          className="input-box"
        >
          <option value="">Residency Status</option>
          {options.residencyStatus.map((r) => (
            <option key={r.id} value={r.residency_status}>
              {r.residency_status}
            </option>
          ))}
        </select>
      </div>

      {/* Country → State → City */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          name="partnerCountry"
          value={data.partnerCountry}
          onChange={handleChange}
          className="input-box"
        >
          <option value="">Select Country</option>
          {options.countries.map((c) => (
            <option key={c.id} value={c.country}>
              {c.country}
            </option>
          ))}
        </select>

        <select
          name="partnerState"
          value={data.partnerState}
          onChange={handleChange}
          className="input-box"
        >
          <option value="">Select State</option>
          {options.states.map((s) => (
            <option key={s.id} value={s.state}>
              {s.state}
            </option>
          ))}
        </select>

        <input
          placeholder="City"
          name="partnerCity"
          value={data.partnerCity}
          onChange={handleChange}
          className="input-box"
        />
      </div>

      <div className="flex flex-col gap-1 mb-6">
        <label className="text-sm font-medium text-gray-700">Education</label>
        <div className="border rounded-lg p-3 max-h-40 overflow-y-auto bg-gray-50">
          <label className="flex items-center gap-2 mb-2 pb-2 border-b font-medium text-sm">
            <input
              type="checkbox"
              checked={data.partnerEducation === "Any" || !data.partnerEducation}
              onChange={(e) => {
                if (e.target.checked)
                  setData({ ...data, partnerEducation: "Any" });
              }}
              className="w-4 h-4 accent-blue-600"
            />
            Any
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {options.educations.map((e) => (
              <label key={e.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={e.edu}
                  checked={data.partnerEducation.split(",").includes(e.edu)}
                  onChange={(e) => {
                    const val = e.target.value;
                    let current =
                      data.partnerEducation === "Any"
                        ? []
                        : data.partnerEducation.split(",").filter(Boolean);
                    if (e.target.checked) {
                      current = [...current, val];
                    } else {
                      current = current.filter((item) => item !== val);
                    }
                    setData({
                      ...data,
                      partnerEducation:
                        current.length > 0 ? current.join(",") : "Any",
                    });
                  }}
                  className="w-4 h-4 accent-blue-600"
                />
                {e.edu}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-6">
        <label className="text-sm font-medium text-gray-700">Occupation</label>
        <div className="border rounded-lg p-3 max-h-40 overflow-y-auto bg-gray-50">
          <label className="flex items-center gap-2 mb-2 pb-2 border-b font-medium text-sm">
            <input
              type="checkbox"
              checked={
                data.partnerOccupation === "Any" || !data.partnerOccupation
              }
              onChange={(e) => {
                if (e.target.checked)
                  setData({ ...data, partnerOccupation: "Any" });
              }}
              className="w-4 h-4 accent-blue-600"
            />
            Any
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {options.occupations.map((o) => (
              <label key={o.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={o.occu}
                  checked={data.partnerOccupation.split(",").includes(o.occu)}
                  onChange={(e) => {
                    const val = e.target.value;
                    let current =
                      data.partnerOccupation === "Any"
                        ? []
                        : data.partnerOccupation.split(",").filter(Boolean);
                    if (e.target.checked) {
                      current = [...current, val];
                    } else {
                      current = current.filter((item) => item !== val);
                    }
                    setData({
                      ...data,
                      partnerOccupation:
                        current.length > 0 ? current.join(",") : "Any",
                    });
                  }}
                  className="w-4 h-4 accent-blue-600"
                />
                {o.occu}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Partner Expectations */}
      <div className="mb-6">
        <textarea
          placeholder="Describe your partner expectations..."
          name="partnerExpectations"
          value={data.partnerExpectations}
          onChange={handleChange}
          maxLength={66}
          className="input-box h-28 resize-none"
        />
        <div className="text-[10px] text-gray-500 mt-1 text-right">
          {data.partnerExpectations?.length || 0} / 66
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="px-6 py-2.5 rounded-lg bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition"
        >
          ← Back
        </button>

        <button
          onClick={() => nextStep(data)}
          className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
