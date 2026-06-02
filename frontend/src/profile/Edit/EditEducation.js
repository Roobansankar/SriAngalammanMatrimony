

// File: EditEducation.jsx

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { API } from "../../config/api";

const API_BASE = API + "/";

export default function EditEducation({ adminMode = false }) {
  const [form, setForm] = useState({
    ConfirmEmail: "",
    Education: "",
    EducationDetails: "",
    Occupation: "",
    occu_details: "",
    Employedin: "",
    Annualincome: "",
    income_in: "",
    working_hours: "",
    workinglocation: "",
    company_name: "",
  });

  const [educationList, setEducationList] = useState([]);
  const [occupationList, setOccupationList] = useState([]);
  const [employedList, setEmployedList] = useState([]);
  const [workingHoursList, setWorkingHoursList] = useState([]);

  const navigate = useNavigate();
  const params = useParams();
  // -------------------------------------------------------
  // 1️⃣ Load user saved data
  // -------------------------------------------------------
  // useEffect(() => {
  //   const data = JSON.parse(localStorage.getItem("userData"));
  //   if (!data) return;

  //   setForm({
  //     ConfirmEmail: data.ConfirmEmail || "",
  //     Education: data.Education || "",
  //     EducationDetails: data.EducationDetails || "",
  //     Occupation: data.Occupation || "",
  //     occu_details: data.occu_details || "",
  //     Employedin: data.Employedin || "",
  //     Annualincome: data.Annualincome || "",
  //     anyotherincome: data.anyotherincome || "",
  //     income_in: data.income_in || "",
  //     working_hours: data.working_hours || "",
  //     workinglocation: data.workinglocation || "",
  //     workin: data.workin || "",
  //   });
  // }, []);

  useEffect(() => {
    const loadData = async () => {
      let data;

      /* 🟣 ADMIN MODE */
      if (adminMode && params.matriId) {
        const res = await axios.get(
          `${API_BASE}admin/profile/${params.matriId}`,
        );

        if (res.data.success) {
          data = res.data.user;
        }
      } else {
        /* 🟢 USER MODE */
        data = JSON.parse(localStorage.getItem("userData"));
      }

      if (!data) return;

      setForm({
        ConfirmEmail: data.ConfirmEmail || "",
        MatriID: data.MatriID || "",
        Education: data.Education || "",
        EducationDetails: data.EducationDetails || "",
        Occupation: data.Occupation || "",
        // occu_details: data.occu_details || "",
        occu_details: data.OccupationDetails || "",
        Employedin: data.Employedin || "",
        Annualincome: data.Annualincome || "",
        income_in: data.income_in || "",
        working_hours: data.working_hours || "",
        workinglocation: data.workinglocation || "",
        company_name: data.company_name || "",
      });
    };

    loadData();
  }, [adminMode, params.matriId]);

  // -------------------------------------------------------
  // 2️⃣ Load dropdowns from backend (educations / occupations / employed / working hours)
  // -------------------------------------------------------
  useEffect(() => {
    async function fetchDropdowns() {
      try {
        const [eduRes, occRes, empRes, hoursRes] = await Promise.all([
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = adminMode ? { ...form, matriId: form.MatriID } : form;

      const res = await axios.put(`${API_BASE}auth/update/education`, payload);

      if (res.data.success) {
        alert("Education & Professional details updated!");

        if (adminMode) {
          navigate(`/admin/profile/${form.MatriID}`);
        } else {
          navigate("/profile");
        }
      } else {
        alert("Update failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  /* --------------------------------
   TEXT RESTRICTION CONFIG
---------------------------------*/
  const MAX_EDU_LENGTH = 28;
  const MAX_OCCU_LENGTH = 24;

  const BLOCK_WORDS = [
    "phone",
    "mobile",
    "contact",
    "call",
    "whatsapp",
    "email",
    "mail",
    "instagram",
    "facebook",
    "fb",
    "number",
    "dm",
    "reach me",
    "http",
    "www",
  ];

  const PHONE_REGEX = /\d{10,}/;
  const EMAIL_REGEX = /\S+@\S+\.\S+/;

  const [eduError, setEduError] = useState("");
  const [occuError, setOccuError] = useState("");

  /* --------------------------------
   EDUCATION DETAILS CHANGE
---------------------------------*/
 const handleEduDetailsChange = (value) => {
   let trimmedValue = value;

   // Hard trim if pasted longer text
   if (value.length > MAX_EDU_LENGTH) {
     trimmedValue = value.slice(0, MAX_EDU_LENGTH);
   }

   const lower = trimmedValue.toLowerCase();
   const found = BLOCK_WORDS.find((w) => lower.includes(w));

   if (found) {
     setEduError(`"${found}" is not allowed`);
   } else if (PHONE_REGEX.test(trimmedValue)) {
     setEduError("Phone numbers not allowed");
   } else if (EMAIL_REGEX.test(trimmedValue)) {
     setEduError("Email IDs not allowed");
   } else {
     setEduError("");
   }

   updateField("EducationDetails", trimmedValue);
 };


  /* --------------------------------
   OCCUPATION DETAILS CHANGE
---------------------------------*/
const handleOccuDetailsChange = (value) => {
  let trimmedValue = value;

  if (value.length > MAX_OCCU_LENGTH) {
    trimmedValue = value.slice(0, MAX_OCCU_LENGTH);
  }

  const lower = trimmedValue.toLowerCase();
  const found = BLOCK_WORDS.find((w) => lower.includes(w));

  if (found) {
    setOccuError(`"${found}" is not allowed`);
  } else if (PHONE_REGEX.test(trimmedValue)) {
    setOccuError("Phone numbers not allowed");
  } else if (EMAIL_REGEX.test(trimmedValue)) {
    setOccuError("Email IDs not allowed");
  } else {
    setOccuError("");
  }

  updateField("occu_details", trimmedValue);
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
            {/* <textarea
              rows="3"
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 resize-none focus:ring-2 focus:ring-pink-500"
              value={form.EducationDetails}
              onChange={(e) => updateField("EducationDetails", e.target.value)}
            /> */}

            <textarea
              rows="3"
              maxLength={MAX_EDU_LENGTH}
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 resize-none focus:ring-2 focus:ring-pink-500"
              value={form.EducationDetails}
              onChange={(e) => handleEduDetailsChange(e.target.value)}
            />

            <div className="text-xs text-gray-500 mt-1">
              {form.EducationDetails?.length || 0} /{MAX_EDU_LENGTH}
            </div>

            {eduError && (
              <div className="text-red-600 text-sm mt-1">{eduError}</div>
            )}
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
            {/* <textarea
              rows="3"
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 resize-none focus:ring-2 focus:ring-pink-500"
              value={form.occu_details}
              onChange={(e) => updateField("occu_details", e.target.value)}
            /> */}
            <textarea
              rows="3"
              maxLength={MAX_OCCU_LENGTH}
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 resize-none focus:ring-2 focus:ring-pink-500"
              value={form.occu_details}
              onChange={(e) => handleOccuDetailsChange(e.target.value)}
            />

            <div className="text-xs text-gray-500 mt-1">
              {form.occu_details?.length || 0} /{MAX_OCCU_LENGTH}
            </div>

            {occuError && (
              <div className="text-red-600 text-sm mt-1">{occuError}</div>
            )}
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
              Monthly Income
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-pink-500"
              value={form.Annualincome}
              onChange={(e) => updateField("Annualincome", e.target.value)}
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
              maxLength={13}
              onChange={(e) => updateField("workinglocation", e.target.value)}
            />
            <div className="text-[10px] text-gray-500 mt-1 text-right">
              {form.workinglocation?.length || 0} / 13
            </div>
          </div>

          {/* Company Name */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              placeholder="Company / Field"
              className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-pink-500"
              value={form.company_name}
              maxLength={36}
              onChange={(e) => updateField("company_name", e.target.value)}
            />
            <div className="text-[10px] text-gray-500 mt-1 text-right">
              {form.company_name?.length || 0} / 36
            </div>
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
