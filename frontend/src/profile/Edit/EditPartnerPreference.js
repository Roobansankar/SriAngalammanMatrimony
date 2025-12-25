

// File: client/src/components/EditPartnerPreference.jsx

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = (process.env.REACT_APP_API_BASE || "http://localhost:5000") + "/api/";

export default function EditPartnerPreference() {
  const [options, setOptions] = useState({
    religions: [],
    castes: [],          // { id, name }
    subcastes: [],       // ["sub1","sub2"]
    complexions: [],
    motherTongues: [],
    residencyStatus: [],
    educations: [],
    occupations: [],
    countries: [],
    states: [],
  });

  const [form, setForm] = useState({
    ConfirmEmail: "",
    Looking: "",
    PE_FromAge: "",
    PE_ToAge: "",
    PE_from_Height: "",
    PE_to_Height: "",
    PE_Complexion: "",
    PE_MotherTongue: "",
    PE_Religion: "",
    PE_Caste: "",
    PE_subcaste: "",
    PE_Education: "",
    PE_Occupation: "",
    PE_Residentstatus: "",
    PE_Countrylivingin: "",
    PE_Country: "",
    PE_State: "",
    PE_City: "",
    PartnerExpectations: "",
  });

  const navigate = useNavigate();

  const ageOptions = Array.from({ length: 48 }, (_, i) => 18 + i);

  const heightOptions = [];
  for (let ft = 4; ft <= 7; ft++) {
    for (let inch = 0; inch < 12; inch++) {
      if (ft === 7 && inch > 0) break;
      heightOptions.push(`${ft}ft${inch > 0 ? " " + inch + "in" : ""}`);
    }
  }


  const normalizeHeight = (value) => {
    if (!value) return "";

    return value
      .replace(/Ft/g, "ft")
      .replace(/ inch/g, "in")
      .replace(/ {2,}/g, " ")
      .trim();
  };


  // Load existing values
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (!data) return;

    setForm({
      ConfirmEmail: data.ConfirmEmail || "",
      Looking: data.Looking || "",
      PE_FromAge: data.PE_FromAge || "",
      PE_ToAge: data.PE_ToAge || "",
      PE_from_Height: normalizeHeight(data.PE_from_Height),
      PE_to_Height: normalizeHeight(data.PE_to_Height),
      PE_Complexion: data.PE_Complexion || "",
      PE_MotherTongue: data.PE_MotherTongue || "",
      PE_Religion: data.PE_Religion || "",
      PE_Caste: data.PE_Caste || "",
      PE_subcaste: data.PE_subcaste || "",
      PE_Education: data.PE_Education || "",
      PE_Occupation: data.PE_Occupation || "",
      PE_Residentstatus: data.PE_Residentstatus || "",
      PE_Countrylivingin: data.PE_Countrylivingin || "",
      PE_Country: data.PE_Country || "",
      PE_State: data.PE_State || "",
      PE_City: data.PE_City || "",
      PartnerExpectations:
        data.PartnerExpectations || data.PartnerExpectations_new || "",
    });
  }, []);

  // Load default dropdowns
  useEffect(() => {
    async function loadInitial() {
      try {
        const [
          religions,
          complexions,
          motherTongues,
          residency,
          educations,
          occupations,
          countries,
        ] = await Promise.all([
          axios.get(`${API_BASE}religions`),
          axios.get(`${API_BASE}complexions`),
          axios.get(`${API_BASE}mother-tongues`),
          axios.get(`${API_BASE}residency-status`),
          axios.get(`${API_BASE}educations`),
          axios.get(`${API_BASE}occupations`),
          axios.get(`${API_BASE}countries`),
        ]);

        setOptions((p) => ({
          ...p,
          religions: religions.data,
          complexions: complexions.data,
          motherTongues: motherTongues.data,
          residencyStatus: residency.data,
          educations: educations.data,
          occupations: occupations.data,
          countries: countries.data,
        }));
      } catch (err) {
        console.error("Load partner dropdowns failed", err);
      }
    }

    loadInitial();
  }, []);

  // RELIGION → CASTE  (same logic as Step1.jsx)
  useEffect(() => {
    if (!form.PE_Religion) {
      setOptions((p) => ({ ...p, castes: [], subcastes: [] }));
      return;
    }

    axios
      .get(`${API_BASE}castes?religion=${encodeURIComponent(form.PE_Religion)}`)
      .then((res) => {
        const casteList = Array.isArray(res.data)
          ? res.data.map((c) => ({ id: c.ID, name: c.Caste }))
          : [];

        setOptions((p) => ({ ...p, castes: casteList, subcastes: [] }));

        // Reset caste if not valid
        if (!casteList.some((c) => c.name === form.PE_Caste)) {
          setForm((f) => ({ ...f, PE_Caste: "", PE_subcaste: "" }));
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.PE_Religion]);

  // CASTE → SUBCASTE (same logic as Step1.jsx)
  useEffect(() => {
    if (!form.PE_Caste) {
      setOptions((p) => ({ ...p, subcastes: [] }));
      return;
    }

    axios
      .get(`${API_BASE}subcastes?caste=${encodeURIComponent(form.PE_Caste)}`)
      .then((res) => {
        const subList = Array.isArray(res.data)
          ? res.data.map((s) => s.Subcaste).filter(Boolean)
          : [];

        setOptions((p) => ({ ...p, subcastes: subList }));

        if (!subList.includes(form.PE_subcaste)) {
          setForm((f) => ({ ...f, PE_subcaste: "" }));
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.PE_Caste]);

  // COUNTRY → STATE
  useEffect(() => {
    if (!form.PE_Country) return;

    axios
      .get(`${API_BASE}states?country=${form.PE_Country}`)
      .then((res) => setOptions((p) => ({ ...p, states: res.data })));
  }, [form.PE_Country]);

  const updateField = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_BASE}auth/update/partner`, form);

      if (res.data.success) {
        alert("Partner preferences updated successfully!");
        navigate("/profile");
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FFF4E0]  font-display">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-10 border mt-20">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Edit Partner Preferences
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* LOOKING (Multiple Selection Checkboxes) */}
          <div className="md:col-span-2">
            <label className="font-semibold block mb-2">Looking For</label>

            <div className="flex flex-wrap gap-6">
              {["Unmarried", "Divorced", "Widowed", "Widower"].map((status) => (
                <label key={status} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={status}
                    checked={form.Looking.includes(status)}
                    onChange={(e) => {
                      const value = e.target.value;
                      let updated;

                      if (e.target.checked) {
                        updated = [...form.Looking.split(","), value];
                      } else {
                        updated = form.Looking.split(",").filter(
                          (v) => v !== value
                        );
                      }

                      updateField("Looking", updated.filter(Boolean).join(","));
                    }}
                    className="w-4 h-4 accent-pink-600"
                  />
                  {status}
                </label>
              ))}
            </div>
          </div>

          {/* AGE FROM */}
          <div>
            <label className="font-semibold">Age From</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.PE_FromAge}
              onChange={(e) => updateField("PE_FromAge", e.target.value)}
            >
              <option value="">Select</option>
              {ageOptions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* AGE TO */}
          <div>
            <label className="font-semibold">Age To</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.PE_ToAge}
              onChange={(e) => updateField("PE_ToAge", e.target.value)}
            >
              <option value="">Select</option>
              {ageOptions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* HEIGHT FROM */}
          <div>
            <label className="font-semibold">Height From</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.PE_from_Height}
              onChange={(e) => updateField("PE_from_Height", e.target.value)}
            >
              <option value="">Select</option>
              {heightOptions.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          {/* HEIGHT TO */}
          <div>
            <label className="font-semibold">Height To</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.PE_to_Height}
              onChange={(e) => updateField("PE_to_Height", e.target.value)}
            >
              <option value="">Select</option>
              {heightOptions.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          {/* RELIGION */}
          <div>
            <label className="font-semibold">Religion</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.PE_Religion}
              onChange={(e) => updateField("PE_Religion", e.target.value)}
            >
              <option value="">Select</option>
              {options.religions.map((r) => (
                <option key={r.ID} value={r.Religion}>
                  {r.Religion}
                </option>
              ))}
            </select>
          </div>

          {/* CASTE */}
          <div>
            <label className="font-semibold">Caste</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.PE_Caste}
              onChange={(e) => updateField("PE_Caste", e.target.value)}
            >
              <option value="">Select</option>
              {options.castes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* COMPLEXION */}
          <div>
            <label className="font-semibold">Complexion</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.PE_Complexion}
              onChange={(e) => updateField("PE_Complexion", e.target.value)}
            >
              <option value="">Select</option>
              {options.complexions.map((c) => (
                <option key={c.ID} value={c.complexion}>
                  {c.complexion}
                </option>
              ))}
            </select>
          </div>

          {/* RESIDENCY */}
          <div>
            <label className="font-semibold">Residency Status</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.PE_Residentstatus}
              onChange={(e) => updateField("PE_Residentstatus", e.target.value)}
            >
              <option value="">Select</option>
              {options.residencyStatus.map((rs) => (
                <option key={rs.id} value={rs.residency_status}>
                  {rs.residency_status}
                </option>
              ))}
            </select>
          </div>

          {/* COUNTRY */}
          <div>
            <label className="font-semibold">Country</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.PE_Country}
              onChange={(e) => updateField("PE_Country", e.target.value)}
            >
              <option value="">Select</option>
              {options.countries.map((c) => (
                <option key={c.id} value={c.country}>
                  {c.country}
                </option>
              ))}
            </select>
          </div>

          {/* STATE */}
          <div>
            <label className="font-semibold">State</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.PE_State}
              onChange={(e) => updateField("PE_State", e.target.value)}
            >
              <option value="">Select</option>
              {options.states.map((s) => (
                <option key={s.id} value={s.state}>
                  {s.state}
                </option>
              ))}
            </select>
          </div>

          {/* CITY */}
          <div>
            <label className="font-semibold">Preferred City</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg"
              value={form.PE_City}
              onChange={(e) => updateField("PE_City", e.target.value)}
            />
          </div>

          {/* EDUCATION */}
          <div>
            <label className="font-semibold">Education</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.PE_Education}
              onChange={(e) => updateField("PE_Education", e.target.value)}
            >
              <option value="">Select</option>
              {options.educations.map((e) => (
                <option key={e.id} value={e.edu}>
                  {e.edu}
                </option>
              ))}
            </select>
          </div>

          {/* OCCUPATION */}
          <div>
            <label className="font-semibold">Occupation</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.PE_Occupation}
              onChange={(e) => updateField("PE_Occupation", e.target.value)}
            >
              <option value="">Select</option>
              {options.occupations.map((o) => (
                <option key={o.id} value={o.occu}>
                  {o.occu}
                </option>
              ))}
            </select>
          </div>

          {/* SUBCASTE */}
          <div>
            <label className="font-semibold">Subcaste</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.PE_subcaste}
              onChange={(e) => updateField("PE_subcaste", e.target.value)}
            >
              <option value="">Select</option>
              {options.subcastes.map((s, idx) => (
                <option key={idx} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* EXPECTATIONS */}
          <div className="md:col-span-2">
            <label className="font-semibold">Partner Expectations</label>
            <textarea
              rows="4"
              className="w-full border p-3 rounded-lg"
              value={form.PartnerExpectations}
              onChange={(e) =>
                updateField("PartnerExpectations", e.target.value)
              }
            />
          </div>

          {/* BUTTON */}
          <div className="md:col-span-2">
            <button className="w-full py-3 bg-pink-600 text-white text-lg rounded-lg hover:bg-pink-700">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

