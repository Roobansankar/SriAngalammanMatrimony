import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../config/api";

const API_BASE = API + "/";

export default function RegularSearch() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    gender: "",
    txtSAge: "22",
    txtEAge: "28",
    looking: ["Unmarried"],
    religion: ["Any"],
    caste: ["Any"],
    edu: ["Any"],
    occu: ["Any"],
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

  /* -----------------------------
     DEFAULT OPPOSITE GENDER
  ------------------------------ */
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const user = JSON.parse(userData);
      if (user.Gender) {
        setForm((p) => ({
          ...p,
          gender: user.Gender.toLowerCase() === "male" ? "Female" : "Male",
        }));
      }
    }
  }, []);

  /* -----------------------------
     LOAD DROPDOWN OPTIONS
  ------------------------------ */
  useEffect(() => {
    async function fetchOptions() {
      try {
        const [rel, edu, occu, mar] = await Promise.all([
          fetch(`${API_BASE}religions`).then((r) => r.json()),
          fetch(`${API_BASE}educations`).then((r) => r.json()),
          fetch(`${API_BASE}occupations`).then((r) => r.json()),
          fetch(`${API_BASE}maritalstatus`).then((r) => r.json()),
        ]);

        setOptions({
          religions: rel?.map((r) => r.Religion) || [],
          educations: edu || [],
          occupations: occu?.map((o) => o.occu) || [],
          maritalstatus: [...new Set(mar?.map((m) => m.status))],
          castes: [],
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchOptions();
  }, []);

  /* -----------------------------
     LOAD CASTES BY RELIGION
  ------------------------------ */
  useEffect(() => {
    async function loadCastes() {
      if (form.religion.includes("Any")) {
        setOptions((p) => ({ ...p, castes: [] }));
        setForm((p) => ({ ...p, caste: ["Any"] }));
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

        const castes = [
          ...new Set(
            results
              .flat()
              .map((c) => c.Caste)
              .filter(Boolean)
          ),
        ];

        setOptions((p) => ({ ...p, castes }));
        setForm((p) => ({
          ...p,
          caste: p.caste.filter((c) => castes.includes(c)),
        }));
      } catch (e) {
        console.error(e);
      }
    }
    loadCastes();
  }, [form.religion]);

  /* -----------------------------
     HANDLE INPUT CHANGE
  ------------------------------ */
  function handleChange(e) {
    const { name, type, value, checked, multiple, selectedOptions } = e.target;

    if (type === "checkbox") {
      setForm((p) => ({ ...p, [name]: checked }));
      return;
    }

    if (multiple) {
      let selected = Array.from(selectedOptions).map((o) => o.value);
      if (selected.includes("Any") && selected.length > 1) {
        selected = selected.filter((v) => v !== "Any");
      }
      if (!selected.length) selected = ["Any"];
      setForm((p) => ({ ...p, [name]: selected }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  }

  /* -----------------------------
     SUBMIT SEARCH
  ------------------------------ */
  function submitSearch(e) {
    e.preventDefault();
    navigate("/results/1", { state: { filters: form, apiBase: API_BASE } });
  }

  const selectClass =
    "w-full min-h-[7rem] appearance-none bg-gray-50 dark:bg-slate-800 border px-3 py-2";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-10 font-display">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 shadow-2xl rounded-lg p-6 md:p-8 mt-20">
        <h1 className="text-3xl font-bold text-center mb-8">Regular Search</h1>

        <form
          onSubmit={submitSearch}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6"
        >
          {/* Gender */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Gender</label>
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

          {/* Age */}
          <div>
            <label className="block text-sm mb-1">From Age</label>
            <select
              name="txtSAge"
              value={form.txtSAge}
              onChange={handleChange}
              className="w-full bg-gray-50 dark:bg-slate-800 border px-3 py-2"
            >
              {Array.from({ length: 48 }, (_, i) => 18 + i).map((age) => (
                <option key={age}>{age}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">To Age</label>
            <select
              name="txtEAge"
              value={form.txtEAge}
              onChange={handleChange}
              className="w-full bg-gray-50 dark:bg-slate-800 border px-3 py-2"
            >
              {Array.from({ length: 48 }, (_, i) => 18 + i).map((age) => (
                <option key={age}>{age}</option>
              ))}
            </select>
          </div>

          {/* Multi Selects */}
          <div>
            <label className="block text-sm mb-1">Marital Status</label>
            <select
              name="looking"
              multiple
              value={form.looking}
              onChange={handleChange}
              className={selectClass}
            >
              {options.maritalstatus.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Religion</label>
            <select
              name="religion"
              multiple
              value={form.religion}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="Any">Any</option>
              {options.religions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Caste</label>
            <select
              name="caste"
              multiple
              value={form.caste}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="Any">Any</option>
              {!form.religion.includes("Any") &&
                options.castes.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Education</label>
            <select
              name="edu"
              multiple
              value={form.edu}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="Any">Any</option>
              {options.educations.map((e) => (
                <option
                  key={e.id}
                  value={e.edu}
                  disabled={e.status === "disabled"}
                >
                  {e.edu}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Occupation</label>
            <select
              name="occu"
              multiple
              value={form.occu}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="Any">Any</option>
              {options.occupations.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Photo */}
          <div className="md:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              name="with_photo"
              checked={form.with_photo}
              onChange={handleChange}
            />
            <label>With Photo only</label>
          </div>

          {/* Submit */}
          <div className="md:col-span-2 text-center">
            <button className="px-10 py-3 bg-amber-600 text-white font-semibold">
              Search Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
