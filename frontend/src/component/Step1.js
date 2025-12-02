import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api/";
const REGISTER_API = `${API_BASE}register`;

export default function Step1({ nextStep, formData = {} }) {
  const [options, setOptions] = useState({
    maritalStatus: [],
    religions: [],
    castes: [],
    subCastes: [],
    profileByOptions: [],
  });
  const [errors, setErrors] = useState({
    email: "",
    mobile: "",
  });

  const [data, setData] = useState({
    fname: formData.fname || "",
    lname: formData.lname || "",
    email: formData.email || "",
    password: formData.password || "",
    profileBy: formData.profileBy || "",
    gender: formData.gender || "",
    dobDay: formData.dobDay || "",
    dobMonth: formData.dobMonth || "",
    dobYear: formData.dobYear || "",
    maritalStatus: formData.maritalStatus || "",
    religion: formData.religion || "",
    caste: formData.caste || "",
    subCaste: formData.subCaste || "",
    countryCode: formData.countryCode || "+91",
    mobile: formData.mobile || "",
    aboutYourself: formData.aboutYourself || "",
    terms: formData.terms || false,
  });

  const [loading, setLoading] = useState(false);

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    let maxYear = currentYear - 18; // default = 18 years

    if (data.gender === "Male") maxYear = currentYear - 21;
    if (data.gender === "Female") maxYear = currentYear - 18;

    const minYear = 1950;

    const years = [];
    for (let y = maxYear; y >= minYear; y--) {
      years.push(y);
    }

    return years;
  };

  // Fetch main dropdown options
  useEffect(() => {
    async function fetchOptions() {
      try {
        const [maritalRes, religionRes, profileRes] = await Promise.all([
          fetch(`${API_BASE}maritalstatus`),
          fetch(`${API_BASE}religions`),
          fetch(`${API_BASE}profileby`),
        ]);

        const maritalData = await maritalRes.json();
        const religionData = await religionRes.json();
        const profileData = await profileRes.json();

        setOptions((prev) => ({
          ...prev,
          maritalStatus: Array.isArray(maritalData)
            ? [...new Set(maritalData.map((m) => m.status).filter(Boolean))]
            : [],

          // ❌ Remove "Any"
          religions: Array.isArray(religionData)
            ? religionData
                .map((r) => r.Religion)
                .filter((r) => r && r !== "Any")
            : [],

          profileByOptions: Array.isArray(profileData)
            ? profileData.map((p) => p.Relation)
            : [],
        }));
      } catch (error) {
        console.error("Failed to load dropdown options:", error);
      }
    }

    fetchOptions();
  }, []);

  // Fetch castes when religion changes
  useEffect(() => {
    async function fetchCastes() {
      if (!data.religion) {
        setOptions((prev) => ({ ...prev, castes: [] }));
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE}castes?religion=${encodeURIComponent(data.religion)}`
        );
        const casteData = await res.json();

        const casteList = Array.isArray(casteData)
          ? casteData
              .filter((c) => c.Caste && c.Caste !== "Any") // ❌ Remove "Any"
              .map((c) => ({ id: c.ID, name: c.Caste }))
          : [];

        setOptions((prev) => ({ ...prev, castes: casteList }));

        // Reset if not valid
        if (!casteList.some((c) => String(c.id) === String(data.caste))) {
          setData((prev) => ({ ...prev, caste: "", subCaste: "" }));
        }
      } catch (error) {
        console.error("Error fetching castes:", error);
        setOptions((prev) => ({ ...prev, castes: [] }));
      }
    }

    fetchCastes();
  }, [data.religion, data.caste]);

  // Fetch subcastes when caste changes
  useEffect(() => {
    async function fetchSubCastes() {
      if (!data.caste) {
        setOptions((prev) => ({ ...prev, subCastes: [] }));
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE}subcastes?caste=${encodeURIComponent(data.caste)}`
        );
        const subData = await res.json();

        const subList = Array.isArray(subData)
          ? subData.map((s) => s.Subcaste).filter((s) => s && s !== "Any") // ❌ Remove "Any"
          : [];

        setOptions((prev) => ({ ...prev, subCastes: subList }));

        if (!subList.includes(data.subCaste)) {
          setData((prev) => ({ ...prev, subCaste: "" }));
        }
      } catch (error) {
        console.error("Error fetching sub castes:", error);
        setOptions((prev) => ({ ...prev, subCastes: [] }));
      }
    }

    fetchSubCastes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.caste]);

  useEffect(() => {
    const checkEmail = async () => {
      if (!data.email) {
        setErrors((e) => ({ ...e, email: "" }));
        return;
      }

      try {
        const res = await axios.get(`${API_BASE}auth/check-email`, {
          params: { email: data.email.trim() },
        });

        if (res.data.exists) {
          setErrors((e) => ({ ...e, email: "Email already exists" }));
        } else {
          setErrors((e) => ({ ...e, email: "" }));
        }
      } catch {
        setErrors((e) => ({ ...e, email: "" }));
      }
    };

    const delay = setTimeout(checkEmail, 500); // debounce typing
    return () => clearTimeout(delay);
  }, [data.email]);

  useEffect(() => {
    const checkMobile = async () => {
      if (!data.mobile) {
        setErrors((e) => ({ ...e, mobile: "" }));
        return;
      }

      try {
        const res = await axios.get(`${API_BASE}auth/check-mobile`, {
          params: { mobile: data.mobile.trim() },
        });

        if (res.data.exists) {
          setErrors((e) => ({ ...e, mobile: "Mobile number already exists" }));
        } else {
          setErrors((e) => ({ ...e, mobile: "" }));
        }
      } catch {
        setErrors((e) => ({ ...e, mobile: "" }));
      }
    };

    const delay = setTimeout(checkMobile, 500);
    return () => clearTimeout(delay);
  }, [data.mobile]);

  // Input change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle Next Step
  const handleNext = async () => {
    if (!data.email) return alert("Please enter your email.");
    if (!data.password) return alert("Please enter a password.");
    if (!data.terms) return alert("Please accept the terms and conditions.");

    try {
      setLoading(true);
      await axios.post(`${REGISTER_API}/send-otp`, { email: data.email });
      alert("OTP sent to your email.");
      nextStep(data);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl w-full max-w-2xl p-6 border border-rose-100 mt-7">
      <h3 className="text-2xl font-bold text-center text-rose-700 mb-4 ">
        Create Your Matrimony Profile
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="fname"
          placeholder="First Name"
          value={data.fname}
          onChange={handleChange}
          className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-rose-400 outline-none"
        />
        <input
          name="lname"
          placeholder="Surname"
          value={data.lname}
          onChange={handleChange}
          className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-rose-400 outline-none"
        />
        <input
          name="email"
          placeholder="Email Address"
          value={data.email}
          onChange={handleChange}
          className="border p-2 rounded-lg w-full md:col-span-2 focus:ring-2 focus:ring-rose-400 outline-none"
        />
        {errors.email && (
          <p className="text-red-600 text-sm md:col-span-2 -mt-3">
            {errors.email}
          </p>
        )}

        <input
          name="password"
          type="password"
          placeholder="Set Password"
          value={data.password}
          onChange={handleChange}
          className="border p-2 rounded-lg w-full md:col-span-2 focus:ring-2 focus:ring-rose-400 outline-none"
        />

        {/* Profile Created By */}
        <select
          name="profileBy"
          value={data.profileBy}
          onChange={handleChange}
          className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-rose-400 outline-none"
        >
          <option value="">Profile Created By</option>
          {options.profileByOptions.map((relation) => (
            <option key={relation} value={relation}>
              {relation}
            </option>
          ))}
        </select>

        <select
          name="gender"
          value={data.gender}
          onChange={handleChange}
          className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-rose-400 outline-none"
        >
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        {/* DOB */}
        <div className="flex gap-2 md:col-span-2">
          <select
            name="dobDay"
            value={data.dobDay}
            onChange={handleChange}
            className="border p-2 rounded-lg w-1/3 focus:ring-2 focus:ring-rose-400 outline-none"
          >
            <option value="">Day</option>
            {[...Array(31)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <select
            name="dobMonth"
            value={data.dobMonth}
            onChange={handleChange}
            className="border p-2 rounded-lg w-1/3 focus:ring-2 focus:ring-rose-400 outline-none"
          >
            <option value="">Month</option>
            {[
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ].map((m, i) => (
              <option key={i + 1} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            name="dobYear"
            value={data.dobYear}
            onChange={handleChange}
            className="border p-2 rounded-lg w-1/3 focus:ring-2 focus:ring-rose-400 outline-none"
          >
            <option value="">Year</option>
            {getYearOptions().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Marital Status */}
        <select
          name="maritalStatus"
          value={data.maritalStatus}
          onChange={handleChange}
          className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-rose-400 outline-none"
        >
          <option value="">Select Marital Status</option>
          {options.maritalStatus.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Religion */}
        <select
          name="religion"
          value={data.religion}
          onChange={handleChange}
          className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-rose-400 outline-none"
        >
          <option value="">Select Religion</option>
          {options.religions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* Caste */}
        <select
          name="caste"
          value={data.caste}
          onChange={handleChange}
          className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-rose-400 outline-none"
        >
          <option value="">
            {data.religion ? "Select Caste" : "Select Religion First"}
          </option>
          {options.castes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* SubCaste */}
        <select
          name="subCaste"
          value={data.subCaste}
          onChange={handleChange}
          className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-rose-400 outline-none"
        >
          <option value="">
            {data.caste ? "Select Sub Caste" : "Select Caste First"}
          </option>
          {options.subCastes.map((s, idx) => (
            <option key={idx} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <input
            name="countryCode"
            value={data.countryCode}
            onChange={handleChange}
            className="border p-2 rounded-lg w-1/3 focus:ring-2 focus:ring-rose-400 outline-none"
          />
          <input
            name="mobile"
            placeholder="Mobile Number"
            value={data.mobile}
            onChange={handleChange}
            className="border p-2 rounded-lg w-2/3 focus:ring-2 focus:ring-rose-400 outline-none"
          />
          {errors.mobile && (
            <p className="text-red-600 text-sm md:col-span-2 -mt-3">
              {errors.mobile}
            </p>
          )}
        </div>

        <textarea
          name="aboutYourself"
          placeholder="Tell us a few lines about yourself..."
          value={data.aboutYourself}
          onChange={handleChange}
          className="border p-2 rounded-lg w-full md:col-span-2 h-24 resize-none focus:ring-2 focus:ring-rose-400 outline-none"
        />
      </div>

      <label className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          name="terms"
          checked={data.terms}
          onChange={handleChange}
          className="accent-rose-600 w-4 h-4"
        />
        <span className="text-sm text-gray-700">
          I agree to the{" "}
          <span className="text-rose-600 font-semibold">
            Terms & Conditions
          </span>
        </span>
      </label>

      <div className="mt-6 text-center">
        <button
          onClick={handleNext}
          disabled={loading || errors.email || errors.mobile}
          className="bg-rose-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-rose-700 transition disabled:opacity-60 flex items-center justify-center mx-auto"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
              Sending OTP...
            </>
          ) : (
            "Next Step →"
          )}
        </button>
      </div>
    </div>
  );
}
