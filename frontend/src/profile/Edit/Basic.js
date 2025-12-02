// File: BasicEdit.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/";

export default function BasicEdit() {
  const [form, setForm] = useState({
    ConfirmEmail: "",
    Name: "",
    // MatriID: "",
    Profilecreatedby: "",
    Gender: "",
    DOB: "",
    Maritalstatus: "",
    Religion: "",
    Caste: "", // caste name
    CasteID: "", // caste id
    Subcaste: "",
    Mobile: "",
  });

  const [options, setOptions] = useState({
    maritalStatus: [],
    religions: [],
    castes: [],
    subCastes: [],
    profileByOptions: [],
  });

  const navigate = useNavigate();

  // -------------------------------------------------------
  // 1️⃣ LOAD USER SAVED DATA
  // -------------------------------------------------------
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (!data) return;

    const cleanCaste = data.Caste?.split(",")[0]?.trim() || "";

    setForm({
      ConfirmEmail: data.ConfirmEmail || "",
      Name: data.Name || "",
      // MatriID: data.MatriID || "",
      Profilecreatedby: data.Profilecreatedby || "",
      Gender: data.Gender || "",
      DOB: data.DOB ? data.DOB.split("T")[0] : "",
      Maritalstatus: data.Maritalstatus || "",
      Religion: data.Religion || "",
      Caste: cleanCaste, // name
      CasteID: "", // set later from API
      Subcaste: data.Subcaste || data.sub_caste || "",
      Mobile: data.Mobile || "",
    });
  }, []);

  // -------------------------------------------------------
  // 2️⃣ LOAD MAIN DROPDOWN OPTIONS (profileby, religion, marital)
  // -------------------------------------------------------
  useEffect(() => {
    async function fetchOptions() {
      try {
        const [maritalRes, religionRes, profileRes] = await Promise.all([
          fetch(`${API_BASE}maritalstatus`),
          fetch(`${API_BASE}religions`),
          fetch(`${API_BASE}profileby`),
        ]);

        const marital = await maritalRes.json();
        const religion = await religionRes.json();
        const profile = await profileRes.json();

        setOptions((prev) => ({
          ...prev,
          maritalStatus: marital.map((m) => m.status),
          religions: religion.map((r) => r.Religion),
          profileByOptions: profile.map((p) => p.Relation),
        }));
      } catch (err) {
        console.error("Dropdown load error:", err);
      }
    }

    fetchOptions();
  }, []);

  // -------------------------------------------------------
  // 3️⃣ WHEN RELIGION CHANGES → LOAD CASTES + AUTO-SELECT CORRECT ONE
  // -------------------------------------------------------
  useEffect(() => {
    async function loadCastes() {
      if (!form.Religion) return;

      const res = await fetch(
        `${API_BASE}castes?religion=${encodeURIComponent(form.Religion)}`
      );
      const data = await res.json();

      const list = data.map((c) => ({
        id: c.ID,
        name: c.Caste,
      }));

      setOptions((prev) => ({ ...prev, castes: list }));

      // Auto-match user caste name to ID
      const match = list.find(
        (c) => c.name.toLowerCase() === form.Caste.toLowerCase()
      );

      if (match) {
        setForm((prev) => ({
          ...prev,
          Caste: match.name,
          CasteID: match.id,
        }));
      }
    }

    loadCastes();
  }, [form.Religion]);

  // -------------------------------------------------------
  // 4️⃣ WHEN CASTE ID CHANGES → LOAD SUBCASTES + AUTO-SELECT CORRECT ONE
  // -------------------------------------------------------
  useEffect(() => {
    async function loadSubCastes() {
      if (!form.CasteID) return;

      const res = await fetch(
        `${API_BASE}subcastes?caste=${encodeURIComponent(form.CasteID)}`
      );
      const data = await res.json();

      const list = data.map((s) => s.Subcaste).filter(Boolean);

      setOptions((prev) => ({ ...prev, subCastes: list }));

      if (list.includes(form.Subcaste)) {
        setForm((prev) => ({ ...prev, Subcaste: form.Subcaste }));
      } else {
        setForm((prev) => ({ ...prev, Subcaste: "" }));
      }
    }

    loadSubCastes();
  }, [form.CasteID]);

  // -------------------------------------------------------
  // Field Update Function
  // -------------------------------------------------------
  const updateField = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // -------------------------------------------------------
  // Save button submit
  // -------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put("http://localhost:5000/api/auth/update/basic", form);
      alert("Basic details updated!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FFF4E0] font-display flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-10 border border-gray-200 mt-20">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Edit Basic Details
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* NAME */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={form.Name}
              onChange={(e) => updateField("Name", e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Matri ID */}
          {/* <div>
            <label className="text-sm font-semibold text-gray-700">
              Matri ID
            </label>
            <input
              type="text"
              value={form.MatriID}
              onChange={(e) => updateField("MatriID", e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div> */}

          {/* Profile Created By */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Profile Created By
            </label>
            <select
              value={form.Profilecreatedby}
              onChange={(e) => updateField("Profilecreatedby", e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Select</option>
              {options.profileByOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Gender
            </label>
            <select
              value={form.Gender}
              onChange={(e) => updateField("Gender", e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* DOB */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              value={form.DOB}
              onChange={(e) => updateField("DOB", e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* MARITAL STATUS */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Marital Status
            </label>
            <select
              value={form.Maritalstatus}
              onChange={(e) => updateField("Maritalstatus", e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Select Marital Status</option>
              {options.maritalStatus.map((ms) => (
                <option key={ms} value={ms}>
                  {ms}
                </option>
              ))}
            </select>
          </div>

          {/* RELIGION */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Religion
            </label>
            <select
              value={form.Religion}
              onChange={(e) => updateField("Religion", e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Select Religion</option>
              {options.religions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* CASTE */}
          <div>
            <label className="text-sm font-semibold text-gray-700">Caste</label>
            <select
              value={form.CasteID}
              onChange={(e) => {
                const selectedID = e.target.value;

                const selectedObj = options.castes.find(
                  (x) => String(x.id) === String(selectedID)
                );

                updateField("CasteID", selectedID);
                updateField("Caste", selectedObj?.name || "");
              }}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Select Caste</option>
              {options.castes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* SUB CASTE */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Subcaste
            </label>
            <select
              value={form.Subcaste}
              onChange={(e) => updateField("Subcaste", e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Select Subcaste</option>
              {options.subCastes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* MOBILE */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Mobile Number
            </label>
            <input
              type="text"
              value={form.Mobile}
              onChange={(e) => updateField("Mobile", e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* SAVE BUTTON */}
          <div className="md:col-span-2">
            <button className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white text-lg rounded-lg font-semibold shadow-md transition-all">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
