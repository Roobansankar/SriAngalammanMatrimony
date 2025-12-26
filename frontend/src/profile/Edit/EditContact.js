

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = (process.env.REACT_APP_API_BASE || "http://localhost:5000") + "/api/";

export default function EditContact() {
  const [form, setForm] = useState({
    ConfirmEmail: "",
    Country: "",
    State: "",
    Dist: "",
    City: "",
    Pincode: "",
    Residencystatus: "",
    Address: "",
    Phone: "",
    Mobile: "",
    Mobile2: "",
    calling_time: "",
    POC: "",
  });

  const [options, setOptions] = useState({
    countries: [],
    states: [],
    districts: [],
    residencyStatuses: [],
    callTimes: [],
  });

  const navigate = useNavigate();

  // -------------------------------------------------------
  // 1️⃣ Load user saved data
  // -------------------------------------------------------
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (!data) return;

    setForm({
      ConfirmEmail: data.ConfirmEmail || "",
      Country: data.Country || "",
      State: data.State || "",
      Dist: data.Dist || "",
      City: data.City || "",
      Pincode: data.Pincode || "",
      Residencystatus: data.Residencystatus || "",
      Address: data.Address || "",
      Phone: data.Phone || "",
      Mobile: data.Mobile || "",
      Mobile2: data.Mobile2 || "",
      calling_time: data.calling_time || "",
      POC: data.POC || "",
    });
  }, []);

  // -------------------------------------------------------
  // 2️⃣ Load master dropdowns (countries, residency, calling time)
  // -------------------------------------------------------
  useEffect(() => {
    async function loadMaster() {
      try {
        const [cRes, rRes, tRes] = await Promise.all([
          fetch(`${API_BASE}countries`),
          fetch(`${API_BASE}residency-status`),
          fetch(`${API_BASE}calling-time`),
        ]);

        const [countries, residency, times] = await Promise.all([
          cRes.json(),
          rRes.json(),
          tRes.json(),
        ]);

        setOptions((p) => ({
          ...p,
          countries,
          residencyStatuses: residency.map((r) => r.residency_status),
          callTimes: times.map((t) => t.call_time),
        }));
      } catch (err) {
        console.error("Dropdown load error:", err);
      }
    }
    loadMaster();
  }, []);

  // -------------------------------------------------------
  // 3️⃣ Load states when Country changes — and auto-select saved state
  // -------------------------------------------------------
  useEffect(() => {
    async function loadStates() {
      if (!form.Country) return;

      try {
        const res = await fetch(
          `${API_BASE}states?country=${encodeURIComponent(form.Country)}`
        );
        const list = await res.json();

        setOptions((p) => ({ ...p, states: list }));

        // auto-select saved state after loading
        setForm((p) => ({
          ...p,
          State: p.State, // keep previous saved value
        }));
      } catch (err) {
        console.error("State load error:", err);
      }
    }

    loadStates();
  }, [form.Country]);

  // -------------------------------------------------------
  // 4️⃣ Load districts when State changes — auto-select saved district
  // -------------------------------------------------------
  useEffect(() => {
    async function loadDistricts() {
      if (!form.State) return;

      try {
        const res = await fetch(
          `${API_BASE}districts?state=${encodeURIComponent(form.State)}`
        );
        const list = await res.json();

        setOptions((p) => ({ ...p, districts: list }));

        // auto-select saved district
        setForm((p) => ({
          ...p,
          Dist: p.Dist,
        }));
      } catch (err) {
        console.error("District load error:", err);
      }
    }

    loadDistricts();
  }, [form.State]);

  // -------------------------------------------------------
  // Update field
  // -------------------------------------------------------
  const updateField = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // -------------------------------------------------------
  // Submit
  // -------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${API_BASE}auth/update/contact`,
        form
      );

      if (res.data.success) {
        alert("Contact details updated!");
        navigate("/profile");
      } else {
        alert("Update failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FFF4E0] font-display">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-10 border border-gray-200 mt-20">
        <h1 className="text-3xl font-bold text-center mb-8">
          Edit Contact Details
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Country */}
          <div>
            <label className="font-semibold">Country</label>
            <select
              value={form.Country}
              onChange={(e) => updateField("Country", e.target.value)}
              className="border p-3 w-full rounded-lg"
            >
              <option value="">Select Country</option>
              {options.countries.map((c) => (
                <option key={c.id} value={c.country}>
                  {c.country}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div>
            <label className="font-semibold">State</label>
            <select
              value={form.State}
              onChange={(e) => updateField("State", e.target.value)}
              className="border p-3 w-full rounded-lg"
            >
              <option value="">Select State</option>
              {options.states.map((s) => (
                <option key={s.id} value={s.state}>
                  {s.state}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="font-semibold">District</label>
            <select
              value={form.Dist}
              onChange={(e) => updateField("Dist", e.target.value)}
              className="border p-3 w-full rounded-lg"
            >
              <option value="">Select District</option>
              {options.districts.map((d) => (
                <option key={d.id} value={d.dist}>
                  {d.dist}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="font-semibold">City</label>
            <input
              value={form.City}
              onChange={(e) => updateField("City", e.target.value)}
              className="border p-3 w-full rounded-lg"
            />
          </div>

          {/* Pincode */}
          <div>
            <label className="font-semibold">Pincode</label>
            <input
              type="number"
              value={form.Pincode}
              onChange={(e) => updateField("Pincode", e.target.value)}
              className="border p-3 w-full rounded-lg"
            />
          </div>

          {/* Residency */}
          <div>
            <label className="font-semibold">Residency Status</label>
            <select
              value={form.Residencystatus}
              onChange={(e) => updateField("Residencystatus", e.target.value)}
              className="border p-3 w-full rounded-lg"
            >
              <option value="">Select Residency</option>
              {options.residencyStatuses.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="font-semibold">Address</label>
            <textarea
              rows={3}
              value={form.Address}
              onChange={(e) => updateField("Address", e.target.value)}
              className="border p-3 w-full rounded-lg"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="font-semibold">Alternate Phone</label>
            <input
              value={form.Phone}
              onChange={(e) => updateField("Phone", e.target.value)}
              className="border p-3 w-full rounded-lg"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="font-semibold">Mobile Number</label>
            <input
              value={form.Mobile}
              onChange={(e) => updateField("Mobile", e.target.value)}
              className="border p-3 w-full rounded-lg"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="font-semibold">WhatsApp Number</label>
            <input
              value={form.Mobile2}
              onChange={(e) => updateField("Mobile2", e.target.value)}
              className="border p-3 w-full rounded-lg"
            />
          </div>

          {/* Calling Time */}
          <div>
            <label className="font-semibold">Convenient Time to Call</label>
            <select
              value={form.calling_time}
              onChange={(e) => updateField("calling_time", e.target.value)}
              className="border p-3 w-full rounded-lg"
            >
              <option value="">Select Time</option>
              {options.callTimes.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* POC */}
          <div className="md:col-span-2">
            <label className="font-semibold">Place / POC</label>
            <input
              value={form.POC}
              onChange={(e) => updateField("POC", e.target.value)}
              className="border p-3 w-full rounded-lg"
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
