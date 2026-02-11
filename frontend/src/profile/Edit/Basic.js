

// File: BasicEdit.jsx

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../../config/api";

const API_BASE = API + "/";

export default function BasicEdit({ adminMode = false }) {
  const navigate = useNavigate();
  const params = useParams();

  const [form, setForm] = useState({
    ConfirmEmail: "",
    Name: "",
    Profilecreatedby: "",
    Gender: "",
    DOB: "",
    Maritalstatus: "",
    Religion: "",
    Caste: "",
    CasteID: "",
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

  // -------------------------------------------------------
  // 1️⃣ LOAD USER SAVED DATA
  // -------------------------------------------------------
  // useEffect(() => {
  //   const data = JSON.parse(localStorage.getItem("userData"));
  //   if (!data) return;

  //   const cleanCaste = data.Caste?.split(",")[0]?.trim() || "";

  //   setForm({
  //     ConfirmEmail: data.ConfirmEmail || "",
  //     Name: data.Name || "",
  //     Profilecreatedby: data.Profilecreatedby || "",
  //     Gender: data.Gender || "",
  //     DOB: data.DOB ? data.DOB.split("T")[0] : "",
  //     Maritalstatus: data.Maritalstatus || "",
  //     Religion: data.Religion || "",
  //     Caste: cleanCaste,
  //     CasteID: "",
  //     Subcaste: data.Subcaste || data.sub_caste || "",
  //     Mobile: data.Mobile || "",
  //   });
  // }, []);
useEffect(() => {
  const loadData = async () => {
    try {
      let data;

      /* 🟣 ADMIN MODE */
      if (adminMode && params.matriId) {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE}/api/admin/profile/${params.matriId}`,
        );

        if (res.data.success) {
          data = res.data.user;
        }
      } else {

      /* 🟢 USER MODE */
        data = JSON.parse(localStorage.getItem("userData"));
      }

      if (!data) return;

      const cleanCaste = data.Caste?.split(",")[0]?.trim() || "";

      setForm({
        ConfirmEmail: data.ConfirmEmail || "",
        MatriID: data.MatriID || "",
        Name: data.Name || "",
        Profilecreatedby: data.Profilecreatedby || "",
        Gender: data.Gender || "",
        DOB: data.DOB ? data.DOB.split("T")[0] : "",
        Maritalstatus: data.Maritalstatus || "",
        Religion: data.Religion || "",
        Caste: cleanCaste,
        CasteID: "",
        Subcaste: data.Subcaste || data.sub_caste || "",
        Mobile: data.Mobile || "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  loadData();
}, [adminMode, params.matriId]);

  // -------------------------------------------------------
  // 2️⃣ LOAD STATIC DROPDOWNS
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
  // 3️⃣ LOAD CASTES WHEN RELIGION CHANGES
  // -------------------------------------------------------
  useEffect(() => {
    async function loadCastes() {
      if (!form.Religion) {
        setOptions((p) => ({ ...p, castes: [], subCastes: [] }));
        return;
      }

      const res = await fetch(
        `${API_BASE}castes?religion=${encodeURIComponent(form.Religion)}`,
      );
      const data = await res.json();

      const list = data.map((c) => ({
        id: c.ID,
        name: c.Caste,
      }));

      setOptions((prev) => ({ ...prev, castes: list }));

      const match = list.find(
        (c) => c.name.toLowerCase() === form.Caste.toLowerCase(),
      );

      if (match) {
        setForm((prev) => ({
          ...prev,
          CasteID: match.id,
          Caste: match.name,
        }));
      }
    }

    loadCastes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.Religion]);

  // -------------------------------------------------------
  // 4️⃣ LOAD SUBCASTES WHEN CASTE ID CHANGES (DEDUPED)
  // -------------------------------------------------------
  useEffect(() => {
    async function loadSubCastes() {
      if (!form.CasteID) {
        setOptions((prev) => ({ ...prev, subCastes: [] }));
        return;
      }

      const res = await fetch(
        `${API_BASE}subcastes?caste=${encodeURIComponent(form.CasteID)}`,
      );
      const data = await res.json();

      const uniqueSubCastes = [
        ...new Set(data.map((s) => s.Subcaste?.trim()).filter(Boolean)),
      ];

      setOptions((prev) => ({
        ...prev,
        subCastes: uniqueSubCastes,
      }));
    }

    loadSubCastes();
  }, [form.CasteID]);

  // -------------------------------------------------------
  // FIELD UPDATE
  // -------------------------------------------------------
  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // -------------------------------------------------------
  // SAVE
  // -------------------------------------------------------
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     await axios.put(
  //       `${process.env.REACT_APP_API_BASE || ""}/api/auth/update/basic`,
  //       form,
  //     );
  //     alert("Basic details updated!");
  //     navigate("/profile");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Update failed");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE}/api/auth/update/basic`,
        form,
      );

      alert("Basic details updated!");

      // Redirect properly
      if (adminMode) {
        navigate(`/admin/profile/${form.MatriID}`);
      } else {
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FFF4E0] flex items-center justify-center p-6 font-display">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-10 mt-20">
        <h1 className="text-3xl font-bold text-center mb-8">
          Edit Basic Details
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* NAME */}
          <div>
            <label className="font-semibold">Full Name</label>
            <input
              value={form.Name}
              onChange={(e) => updateField("Name", e.target.value)}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          {/* PROFILE BY */}
          <div>
            <label className="font-semibold">Profile Created By</label>
            <select
              value={form.Profilecreatedby}
              onChange={(e) => updateField("Profilecreatedby", e.target.value)}
              className="w-full border p-3 rounded-lg"
            >
              <option value="">Select</option>
              {options.profileByOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* GENDER */}
          <div>
            <label className="font-semibold">Gender</label>
            <select
              value={form.Gender}
              onChange={(e) => updateField("Gender", e.target.value)}
              className="w-full border p-3 rounded-lg"
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          {/* DOB */}
          <div>
            <label className="font-semibold">Date of Birth</label>
            <input
              type="date"
              value={form.DOB}
              onChange={(e) => updateField("DOB", e.target.value)}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          {/* MARITAL */}
          <div>
            <label className="font-semibold">Marital Status</label>
            <select
              value={form.Maritalstatus}
              onChange={(e) => updateField("Maritalstatus", e.target.value)}
              className="w-full border p-3 rounded-lg"
            >
              <option value="">Select</option>
              {options.maritalStatus.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* RELIGION */}
          <div>
            <label className="font-semibold">Religion</label>
            <select
              value={form.Religion}
              onChange={(e) => updateField("Religion", e.target.value)}
              className="w-full border p-3 rounded-lg"
            >
              <option value="">Select</option>
              {options.religions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* CASTE */}
          <div>
            <label className="font-semibold">Caste</label>
            <select
              value={form.CasteID}
              onChange={(e) => {
                const id = e.target.value;
                const obj = options.castes.find(
                  (x) => String(x.id) === String(id),
                );

                setForm((prev) => ({
                  ...prev,
                  CasteID: id,
                  Caste: obj?.name || "",
                  Subcaste: "",
                }));
              }}
              className="w-full border p-3 rounded-lg"
            >
              <option value="">Select</option>
              {options.castes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* SUBCASTE */}
          <div>
            <label className="font-semibold">Subcaste</label>
            <select
              value={form.Subcaste}
              disabled={!form.CasteID}
              onChange={(e) => updateField("Subcaste", e.target.value)}
              className={`w-full border p-3 rounded-lg ${
                !form.CasteID && "bg-gray-100 text-gray-400"
              }`}
            >
              <option value="">Select</option>
              {options.subCastes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* MOBILE */}
          <div>
            <label className="font-semibold">Mobile</label>
            <input
              value={form.Mobile}
              onChange={(e) => updateField("Mobile", e.target.value)}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div className="md:col-span-2">
            <button className="w-full py-3 bg-pink-600 text-white rounded-lg text-lg font-semibold">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
