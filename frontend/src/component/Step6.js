import axios from "axios";
import { useEffect, useState } from "react";
import { API } from "../config/api";

const API_BASE = API + "/";

// Format number input - only allow digits
const formatNumber = (value) => {
  if (!value) return "";
  return value.replace(/\D/g, "");
};

export default function Step6({ nextStep, prevStep, formData = {} }) {
  const [educationList, setEducationList] = useState([]);
  const [occupationList, setOccupationList] = useState([]);
  const [employedList, setEmployedList] = useState([]);
  const [workingHoursList, setWorkingHoursList] = useState([]);
  const [errors, setErrors] = useState({});

  const [data, setData] = useState({
    education: formData.education || "",
    occupation: formData.occupation || "",
    educationDetails: formData.educationDetails || "",
    occupationDetails: formData.occupationDetails || "",
    annualIncome: formData.annualIncome || "",
    incomeType: formData.incomeType || "",
    otherIncome: formData.otherIncome || "",
    employedIn: formData.employedIn || "",
    workingHours: formData.workingHours || "",
    company_name: formData.company_name || "",
    workingLocation: formData.workingLocation || "",
  });

  // Sync local state when formData prop changes (e.g., after localStorage load)
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      setData({
        education: formData.education || "",
        occupation: formData.occupation || "",
        educationDetails: formData.educationDetails || "",
        occupationDetails: formData.occupationDetails || "",
        annualIncome: formData.annualIncome || "",
        incomeType: formData.incomeType || "",
        otherIncome: formData.otherIncome || "",
        employedIn: formData.employedIn || "",
        workingHours: formData.workingHours || "",
        company_name: formData.company_name || "",
        workingLocation: formData.workingLocation || "",
      });
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format income fields to only allow numbers
    if (name === "annualIncome" || name === "otherIncome") {
      formattedValue = formatNumber(value);
    }

    setData({ ...data, [name]: formattedValue });

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (data.annualIncome && !/^\d+$/.test(data.annualIncome)) {
      newErrors.annualIncome = "Income must be a number";
    }

    if (data.otherIncome && !/^\d+$/.test(data.otherIncome)) {
      newErrors.otherIncome = "Income must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      nextStep(data);
    }
  };

  // Load dropdowns
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
        console.error("Error loading dropdown data:", err);
      }
    }

    fetchDropdowns();
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-100 mt-12">
      {/* Title */}
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center border-b pb-3">
        Step 4: Education & Occupation Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Education Dropdown */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Education
          </label>
          <select
            name="education"
            value={data.education}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Select Education</option>

            {educationList.map((item) => (
              <option
                key={item.id}
                value={item.edu}
                disabled={item.status === "disabled"} // 🔥 Disable based on backend
                className={item.status === "disabled" ? "text-gray-400" : ""}
              >
                {item.edu}
              </option>
            ))}
          </select>
        </div>

        {/* Occupation Dropdown */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Occupation
          </label>
          <select
            name="occupation"
            value={data.occupation}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Select Occupation</option>
            {occupationList.map((item) => (
              <option key={item.id} value={item.occu}>
                {item.occu}
              </option>
            ))}
          </select>
        </div>

        {/* Education Details */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Education Details
          </label>
          <textarea
            name="educationDetails"
            value={data.educationDetails}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            rows={1} // 👈 reduces height like Monthly Income
          />
        </div>

        {/* Occupation Details */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Occupation Details
          </label>
          <textarea
            name="occupationDetails"
            value={data.occupationDetails}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            rows={1} // 👈 same compact height
          />
        </div>

        {/* Annual Income */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Monthly Income
          </label>
          <input
            type="text"
            name="annualIncome"
            value={data.annualIncome}
            onChange={handleChange}
            inputMode="numeric"
            placeholder="Enter amount"
            className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 ${
              errors.annualIncome ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.annualIncome && (
            <p className="text-red-500 text-xs mt-1">{errors.annualIncome}</p>
          )}
        </div>

        {/* Income Type */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Income Type
          </label>
          <select
            name="incomeType"
            value={data.incomeType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Select Income Type</option>
            <option value="Rs">₹ (Rs)</option>
            <option value="Dollar">$ (Dollar)</option>
            <option value="VRO">VRO</option>
          </select>
        </div>

        {/* Other Income */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Family Income
          </label>
          <input
            type="text"
            name="otherIncome"
            value={data.otherIncome}
            onChange={handleChange}
            inputMode="numeric"
            placeholder="Enter amount"
            className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 ${
              errors.otherIncome ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.otherIncome && (
            <p className="text-red-500 text-xs mt-1">{errors.otherIncome}</p>
          )}
        </div>

        {/* Employed In Dropdown */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Employed In
          </label>
          <select
            name="employedIn"
            value={data.employedIn}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Select Employment Type</option>
            {employedList.map((item) => (
              <option key={item.id} value={item.employed}>
                {item.employed}
              </option>
            ))}
          </select>
        </div>

        {/* Working Hours Dropdown */}
        {/* Working Hours + Company Name Side by Side */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Working Hours
          </label>
          <select
            name="workingHours"
            value={data.workingHours}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Select Working Hours</option>
            {workingHoursList.map((item, i) => (
              <option key={i} value={item.hours}>
                {item.hours}
              </option>
            ))}
          </select>
        </div>

        {/* Company Name */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            name="company_name"
            value={data.company_name}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            onChange={handleChange}
          />
        </div>

        {/* Working Location */}
        <div className="col-span-2">
          <label className="block font-medium text-gray-700 mb-1">
            Working Location
          </label>
          <input
            type="text"
            name="workingLocation"
            value={data.workingLocation}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="px-6 py-3 rounded-xl bg-gray-300 text-gray-800 font-medium hover:bg-gray-400 transition"
        >
          ⬅ Back
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-xl bg-pink-600 text-white font-medium hover:bg-pink-700 transition"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}
