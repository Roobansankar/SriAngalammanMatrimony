

// File: EditEducation.jsx

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../config/api";

const API_BASE = API + "/";

export default function EditEducation() {
  const [form, setForm] = useState({
    ConfirmEmail: "",
    Education: "",
    EducationDetails: "",
    Occupation: "",
    occu_details: "",
    Employedin: "",
    Annualincome: "",
    anyotherincome: "",
    income_in: "",
    working_hours: "",
    workinglocation: "",
    workin: "",
  });

  const [educationList, setEducationList] = useState([]);
  const [occupationList, setOccupationList] = useState([]);
  const [employedList, setEmployedList] = useState([]);
  const [workingHoursList, setWorkingHoursList] = useState([]);

  const navigate = useNavigate();

  // -------------------------------------------------------
  // 1️⃣ Load user saved data
  // -------------------------------------------------------
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (!data) return;

    setForm({
      ConfirmEmail: data.ConfirmEmail || "",
      Education: data.Education || "",
      EducationDetails: data.EducationDetails || "",
      Occupation: data.Occupation || "",
      occu_details: data.occu_details || "",
      Employedin: data.Employedin || "",
      Annualincome: data.Annualincome || "",
      anyotherincome: data.anyotherincome || "",
      income_in: data.income_in || "",
      working_hours: data.working_hours || "",
      workinglocation: data.workinglocation || "",
      workin: data.workin || "",
    });
  }, []);

  // -------------------------------------------------------
  // 2️⃣ Load dropdowns from backend (educations / occupations / employed / working hours)
  // -------------------------------------------------------
  useEffect(() => {
    async function fetchDropdowns() {
      try {
        const [
          eduRes,
          occRes,
          empRes,
          hoursRes,
        ] = await Promise.all([
          axios.get(`${API_BASE}educations`),
          axios.get(`${API_BASE}occupations`),
          axios.get(`${API_BASE}employed-in`),
          axios.get(`${API_BASE}working-hours`),
        ]);

        setEducationList(eduRes.data || []);
        setOccupationList(occRes.data || []);
        setEmployedList(empRes.data || []);
        setWorkingHoursList(hoursRes.data || []);
      } catch (err) {
        console.error("Dropdown loading error:", err);
      }
    }

    fetchDropdowns();
  }, []);

  // -------------------------------------------------------
  // Update input
  // -------------------------------------------------------
  const updateField = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // -------------------------------------------------------
  // Submit form
  // -------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${API_BASE}auth/update/education`,
        form
      );

      if (res.data.success) {
        alert("Education & Professional details updated!");
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
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Edit Education & Professional Details
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Education */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Education Qualification
            </label>
            <select
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-pink-500"
              value={form.Education}
              onChange={(e) => updateField("Education", e.target.value)}
            >
              <option value="">Select Education</option>
              {educationList.map((item) => (
                <option key={item.id} value={item.edu}>
                  {item.edu}
                </option>
              ))}
            </select>
          </div>

          {/* Education Details – Full width */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">
              Education Details
            </label>
            <textarea
              rows="3"
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 resize-none focus:ring-2 focus:ring-pink-500"
              value={form.EducationDetails}
              onChange={(e) => updateField("EducationDetails", e.target.value)}
            />
          </div>

          {/* Occupation */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Occupation
            </label>
            <select
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-pink-500"
              value={form.Occupation}
              onChange={(e) => updateField("Occupation", e.target.value)}
            >
              <option value="">Select Occupation</option>
              {occupationList.map((item) => (
                <option key={item.id} value={item.occu}>
                  {item.occu}
                </option>
              ))}
            </select>
          </div>

          {/* Occupation Details – Full width */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">
              Occupation Details
            </label>
            <textarea
              rows="3"
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 resize-none focus:ring-2 focus:ring-pink-500"
              value={form.occu_details}
              onChange={(e) => updateField("occu_details", e.target.value)}
            />
          </div>

          {/* Employed In */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Employed In
            </label>
            <select
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-pink-500"
              value={form.Employedin}
              onChange={(e) => updateField("Employedin", e.target.value)}
            >
              <option value="">Select Employment Type</option>
              {employedList.map((item) => (
                <option key={item.id} value={item.employed}>
                  {item.employed}
                </option>
              ))}
            </select>
          </div>

          {/* Annual Income */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Annual Income
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-pink-500"
              value={form.Annualincome}
              onChange={(e) => updateField("Annualincome", e.target.value)}
            />
          </div>

          {/* Other Income */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Other Income
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-pink-500"
              value={form.anyotherincome}
              onChange={(e) => updateField("anyotherincome", e.target.value)}
            />
          </div>

          {/* Income Type */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Income Type
            </label>
            <select
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-pink-500"
              value={form.income_in}
              onChange={(e) => updateField("income_in", e.target.value)}
            >
              <option value="">Select Income Unit</option>
              <option value="Rs">₹ (Rs)</option>
              <option value="Dollar">$ (Dollar)</option>
              <option value="VRO">VRO</option>
            </select>
          </div>

          {/* Working Hours */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Working Hours
            </label>
            <select
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-pink-500"
              value={form.working_hours}
              onChange={(e) => updateField("working_hours", e.target.value)}
            >
              <option value="">Select Working Hours</option>
              {workingHoursList.map((item, i) => (
                <option key={i} value={item.hours}>
                  {item.hours}
                </option>
              ))}
            </select>
          </div>

          {/* Working Location */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Working Location
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-pink-500"
              value={form.workinglocation}
              onChange={(e) => updateField("workinglocation", e.target.value)}
            />
          </div>

          {/* Work In */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">
              Work In
            </label>
            <input
              type="text"
              placeholder="Company / Field"
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-pink-500"
              value={form.workin}
              onChange={(e) => updateField("workin", e.target.value)}
            />
          </div>

          {/* Save */}
          <div className="md:col-span-2">
            <button className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white text-lg rounded-lg font-semibold shadow-md">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
