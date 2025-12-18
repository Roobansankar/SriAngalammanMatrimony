import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/";

export default function LoggedRegularSearch() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const viewerPlan = userData.Plan || "basic";


  const [form, setForm] = useState({
    gender: "",
    txtSAge: "22",
    txtEAge: "28",
    looking: ["Unmarried"],
    religion: ["Any"], // ⬅️ default
    caste: ["Any"], // ⬅️ default
    edu: ["Any"], // ⬅️ default
    occu: ["Any"], // ⬅️ default
    with_photo: false,
    page: 1,
  });

  const [options, setOptions] = useState({
    religions: [],
    castes: [],
    educations: [],
    occupations: [],
    maritalstatus: [],
  });

  // Set default opposite gender from logged-in user
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const user = JSON.parse(userData);
      if (user.Gender) {
        const oppositeGender =
          user.Gender.toLowerCase() === "male" ? "Female" : "Male";
        setForm((prev) => ({
          ...prev,
          gender: oppositeGender,
        }));
      }
    }
  }, []);

  // Load religions, educations, occupations, marital status
  useEffect(() => {
    async function fetchOptions() {
      try {
        const [relRes, eduRes, occuRes, marRes] = await Promise.all([
          fetch(`${API_BASE}religions`),
          fetch(`${API_BASE}educations`),
          fetch(`${API_BASE}occupations`),
          fetch(`${API_BASE}maritalstatus`),
        ]);

        const religions = await relRes.json();
        const educations = await eduRes.json();
        const occupations = await occuRes.json();
        const maritalstatus = await marRes.json();

        setOptions({
          religions: Array.isArray(religions)
            ? religions.map((r) => r.Religion)
            : [],
          educations: Array.isArray(educations) ? educations : [],
          occupations: Array.isArray(occupations)
            ? occupations.map((o) => o.occu)
            : [],
          maritalstatus: Array.isArray(maritalstatus)
            ? [...new Set(maritalstatus.map((m) => m.status).filter(Boolean))]
            : [],
          castes: [],
        });
      } catch (err) {
        console.error("Failed to load options:", err);
      }
    }

    fetchOptions();
  }, []);

  // Load castes based on religion (unless religion is Any)
  useEffect(() => {
    async function fetchCastes() {
      if (form.religion.includes("Any")) {
        // Religion = Any → show only Any
        setOptions((prev) => ({ ...prev, castes: [] }));
        setForm((prev) => ({ ...prev, caste: ["Any"] }));
        return;
      }

      if (!form.religion || form.religion.length === 0) {
        setOptions((prev) => ({ ...prev, castes: [] }));
        return;
      }

      try {
        const results = await Promise.all(
          form.religion.map((r) =>
            fetch(`${API_BASE}castes?religion=${encodeURIComponent(r)}`).then(
              (res) => res.json()
            )
          )
        );

        const allCastes = Array.from(
          new Set(
            results
              .flat()
              .map((c) => c.Caste)
              .filter(Boolean)
          )
        );

        setOptions((prev) => ({ ...prev, castes: allCastes }));

        // Remove castes not in loaded list
        setForm((prev) => ({
          ...prev,
          caste: prev.caste.filter((c) => allCastes.includes(c)),
        }));
      } catch (err) {
        console.error("Failed to load castes:", err);
        setOptions((prev) => ({ ...prev, castes: [] }));
      }
    }

    fetchCastes();
  }, [form.religion]);

  // Handle input changes
  function handleChange(e) {
    const { name, type, checked, multiple, selectedOptions, value } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    if (multiple) {
      let selected = Array.from(selectedOptions).map((o) => o.value);

      // ---- AUTO REMOVE "Any" IF OTHER VALUES SELECTED ----
      if (selected.includes("Any") && selected.length > 1) {
        selected = selected.filter((v) => v !== "Any");
      }

      // ---- IF ALL VALUES CLEARED, RESET BACK TO "Any" ----
      if (selected.length === 0) selected = ["Any"];

      setForm((prev) => ({ ...prev, [name]: selected }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Submit search
  function submitSearch(e) {
    e.preventDefault();
    navigate("/regularsearch-results/1", {
      state: { filters: form, viewerPlan, apiBase: API_BASE },
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-10 font-display">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 shadow-2xl rounded-lg p-8 mt-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Regular Search
          </h1>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-2 rounded-full"></div>
        </div>

        <form
          onSubmit={submitSearch}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6"
        >
          {/* Gender */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full bg-gray-50 dark:bg-slate-800 border px-3 py-2"
            >
              <option value="">Looking For</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* From Age */}
          <div>
            <label className="block text-sm mb-1">From Age</label>
            <select
              name="txtSAge"
              value={form.txtSAge}
              onChange={handleChange}
              className="w-full bg-gray-50 dark:bg-slate-800 border px-3 py-2"
            >
              {Array.from({ length: 48 }).map((_, i) => {
                const age = 18 + i;
                return (
                  <option key={age} value={age}>
                    {age}
                  </option>
                );
              })}
            </select>
          </div>

          {/* To Age */}
          <div>
            <label className="block text-sm mb-1">To Age</label>
            <select
              name="txtEAge"
              value={form.txtEAge}
              onChange={handleChange}
              className="w-full bg-gray-50 dark:bg-slate-800 border px-3 py-2"
            >
              {Array.from({ length: 48 }).map((_, i) => {
                const age = 18 + i;
                return (
                  <option key={age} value={age}>
                    {age}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Marital Status */}
          <div>
            <label className="block text-sm mb-1">Marital Status</label>
            <select
              name="looking"
              value={form.looking}
              multiple
              onChange={handleChange}
              className="w-full min-h-[7rem] appearance-none bg-gray-50 dark:bg-slate-800 border px-3 py-2"
            >
              {options.maritalstatus.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Religion */}
          <div>
            <label className="block text-sm mb-1">Religion</label>
            <select
              name="religion"
              value={form.religion}
              multiple
              onChange={handleChange}
              className="w-full min-h-[7rem] appearance-none bg-gray-50 dark:bg-slate-800 border px-3 py-2"
            >
              <option value="Any">Any</option>
              {options.religions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Caste */}
          <div>
            <label className="block text-sm mb-1">Caste</label>
            <select
              name="caste"
              value={form.caste}
              multiple
              onChange={handleChange}
              className="w-full min-h-[7rem] appearance-none bg-gray-50 dark:bg-slate-800 border px-3 py-2"
            >
              <option value="Any">Any</option>
              {!form.religion.includes("Any") &&
                options.castes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </div>

          {/* Education */}

          <div>
            <label className="block text-sm mb-1">Education</label>
            <select
              name="edu"
              value={form.edu}
              multiple
              onChange={handleChange}
              className="w-full min-h-[7rem] appearance-none bg-gray-50 dark:bg-slate-800 border px-3 py-2"
            >
              <option value="Any">Any</option>

              {options.educations.map((e) => (
                <option
                  key={e.id}
                  value={e.edu}
                  disabled={e.status === "disabled"} // ⛔ Disable based on backend status
                >
                  {e.edu}
                </option>
              ))}
            </select>
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-sm mb-1">Occupation</label>
            <select
              name="occu"
              value={form.occu}
              multiple
              onChange={handleChange}
              className="w-full min-h-[7rem] appearance-none bg-gray-50 dark:bg-slate-800 border px-3 py-2"
            >
              <option value="Any">Any</option>
              {options.occupations.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* With Photo */}
          <div className="flex items-center gap-2 col-span-1 md:col-span-2">
            <input
              id="with_photo"
              type="checkbox"
              name="with_photo"
              checked={form.with_photo}
              onChange={handleChange}
              className="h-4 w-4 accent-amber-600"
            />
            <label htmlFor="with_photo">With Photo only</label>
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 text-center mt-4">
            <button
              type="submit"
              className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold uppercase"
            >
              Search Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
