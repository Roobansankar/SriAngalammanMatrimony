import axios from "axios";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:5000/api/";
const REGISTER_API = `${API_BASE}register`;

export default function Step1({ nextStep, formData = {} }) {
  const [optionsLoading, setOptionsLoading] = useState(true);
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
  const [checking, setChecking] = useState({
    email: false,
    mobile: false,
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

  // Sync local state when formData prop changes (e.g., after localStorage load)
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      setData((prev) => ({
        ...prev,
        fname: formData.fname || prev.fname,
        lname: formData.lname || prev.lname,
        email: formData.email || prev.email,
        profileBy: formData.profileBy || prev.profileBy,
        gender: formData.gender || prev.gender,
        dobDay: formData.dobDay || prev.dobDay,
        dobMonth: formData.dobMonth || prev.dobMonth,
        dobYear: formData.dobYear || prev.dobYear,
        maritalStatus: formData.maritalStatus || prev.maritalStatus,
        religion: formData.religion || prev.religion,
        caste: formData.caste || prev.caste,
        subCaste: formData.subCaste || prev.subCaste,
        countryCode: formData.countryCode || prev.countryCode,
        mobile: formData.mobile || prev.mobile,
        aboutYourself: formData.aboutYourself || prev.aboutYourself,
        terms: formData.terms || prev.terms,
      }));
    }
  }, [formData]);

  const [loading, setLoading] = useState(false);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    let maxYear = currentYear - 18;
    if (data.gender === "Male") maxYear = currentYear - 21;
    if (data.gender === "Female") maxYear = currentYear - 18;
    const minYear = 1950;
    const years = [];
    for (let y = maxYear; y >= minYear; y--) {
      years.push(y);
    }
    return years;
  }, [data.gender]);

  useEffect(() => {
    let isMounted = true;
    async function fetchOptions() {
      try {
        setOptionsLoading(true);
        const [maritalRes, religionRes, profileRes] = await Promise.all([
          fetch(`${API_BASE}maritalstatus`),
          fetch(`${API_BASE}religions`),
          fetch(`${API_BASE}profileby`),
        ]);
        if (!isMounted) return;
        const [maritalData, religionData, profileData] = await Promise.all([
          maritalRes.json(),
          religionRes.json(),
          profileRes.json(),
        ]);
        if (!isMounted) return;
        setOptions((prev) => ({
          ...prev,
          maritalStatus: Array.isArray(maritalData)
            ? [...new Set(maritalData.map((m) => m.status).filter(Boolean))]
                .filter((s) => s === "Unmarried" || s === "Remarriage")
            : [],
          religions: Array.isArray(religionData)
            ? religionData.map((r) => r.Religion).filter((r) => r && r !== "Any")
            : [],
          profileByOptions: Array.isArray(profileData)
            ? profileData.map((p) => p.Relation)
            : [],
        }));
      } catch (error) {
        console.error("Failed to load dropdown options:", error);
      } finally {
        if (isMounted) setOptionsLoading(false);
      }
    }
    fetchOptions();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function fetchCastes() {
      if (!data.religion) {
        setOptions((prev) => ({ ...prev, castes: [], subCastes: [] }));
        return;
      }
      try {
        const res = await fetch(`${API_BASE}castes?religion=${encodeURIComponent(data.religion)}`);
        if (!isMounted) return;
        const casteData = await res.json();
        const casteList = Array.isArray(casteData)
          ? casteData.filter((c) => c.Caste && c.Caste !== "Any").map((c) => ({ id: c.ID, name: c.Caste }))
          : [];
        setOptions((prev) => ({ ...prev, castes: casteList, subCastes: [] }));
      } catch (error) {
        console.error("Error fetching castes:", error);
        if (isMounted) setOptions((prev) => ({ ...prev, castes: [], subCastes: [] }));
      }
    }
    fetchCastes();
    return () => { isMounted = false; };
  }, [data.religion]);

  useEffect(() => {
    let isMounted = true;
    async function fetchSubCastes() {
      if (!data.caste) {
        setOptions((prev) => ({ ...prev, subCastes: [] }));
        return;
      }
      try {
        const res = await fetch(`${API_BASE}subcastes?caste=${encodeURIComponent(data.caste)}`);
        if (!isMounted) return;
        const subData = await res.json();
        const subList = Array.isArray(subData)
          ? subData.map((s) => s.Subcaste).filter((s) => s && s !== "Any")
          : [];
        setOptions((prev) => ({ ...prev, subCastes: subList }));
      } catch (error) {
        console.error("Error fetching sub castes:", error);
        if (isMounted) setOptions((prev) => ({ ...prev, subCastes: [] }));
      }
    }
    fetchSubCastes();
    return () => { isMounted = false; };
  }, [data.caste]);

  useEffect(() => {
    if (!data.email || data.email.length < 5) {
      setErrors((e) => ({ ...e, email: "" }));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setErrors((e) => ({ ...e, email: "Please enter a valid email address" }));
      return;
    }
    const controller = new AbortController();
    const delay = setTimeout(async () => {
      try {
        setChecking((c) => ({ ...c, email: true }));
        const res = await axios.get(`${API_BASE}auth/check-email`, {
          params: { email: data.email.trim() },
          signal: controller.signal,
        });
        if (res.data.exists) {
          setErrors((e) => ({ ...e, email: "Email already registered" }));
        } else {
          setErrors((e) => ({ ...e, email: "" }));
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          setErrors((e) => ({ ...e, email: "" }));
        }
      } finally {
        setChecking((c) => ({ ...c, email: false }));
      }
    }, 500);
    return () => {
      clearTimeout(delay);
      controller.abort();
    };
  }, [data.email]);

  useEffect(() => {
    if (!data.mobile || data.mobile.length < 10) {
      setErrors((e) => ({ ...e, mobile: "" }));
      return;
    }
    const controller = new AbortController();
    const delay = setTimeout(async () => {
      try {
        setChecking((c) => ({ ...c, mobile: true }));
        const res = await axios.get(`${API_BASE}auth/check-mobile`, {
          params: { mobile: data.mobile.trim() },
          signal: controller.signal,
        });
        if (res.data.exists) {
          setErrors((e) => ({ ...e, mobile: "Mobile number already registered" }));
        } else {
          setErrors((e) => ({ ...e, mobile: "" }));
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          setErrors((e) => ({ ...e, mobile: "" }));
        }
      } finally {
        setChecking((c) => ({ ...c, mobile: false }));
      }
    }, 500);
    return () => {
      clearTimeout(delay);
      controller.abort();
    };
  }, [data.mobile]);

  // Helper to format name fields (letters, spaces, dots only)
  const formatName = (value) => value.replace(/[^a-zA-Z\s.]/g, "");

  // Helper to format mobile (numbers only, max 10 digits)
  const formatMobile = (value) => value.replace(/\D/g, "").slice(0, 10);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    let formattedValue = value;
    
    // Format name fields
    if (name === "fname" || name === "lname") {
      formattedValue = formatName(value);
    }
    // Format mobile number
    else if (name === "mobile") {
      formattedValue = formatMobile(value);
    }
    
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : formattedValue,
    }));
    if (name === "religion") {
      setData((prev) => ({ ...prev, caste: "", subCaste: "" }));
    } else if (name === "caste") {
      setData((prev) => ({ ...prev, subCaste: "" }));
    }
  }, []);

  const validateForm = useCallback(() => {
    if (!data.fname.trim()) return "Please enter your first name.";
    if (!data.lname.trim()) return "Please enter your surname.";
    if (!data.email.trim()) return "Please enter your email.";
    if (errors.email) return errors.email;
    if (!data.password || data.password.length < 6) return "Password must be at least 6 characters.";
    if (!data.gender) return "Please select your gender.";
    if (!data.dobDay || !data.dobMonth || !data.dobYear) return "Please enter your date of birth.";
    if (!data.maritalStatus) return "Please select your marital status.";
    if (!data.religion) return "Please select your religion.";
    if (!data.mobile || data.mobile.length < 10) return "Please enter a valid mobile number.";
    if (errors.mobile) return errors.mobile;
    if (!data.terms) return "Please accept the terms and conditions.";
    return null;
  }, [data, errors]);

  const handleNext = async () => {
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${REGISTER_API}/send-otp`, { email: data.email.trim() });
      alert("OTP sent to your email.");
      nextStep(data);
    } catch (error) {
      console.error("Error sending OTP:", error);
      const errorMsg = error?.response?.data?.error || "Failed to send OTP. Please try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (optionsLoading) {
    return (
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-2xl p-6 border border-rose-100 mt-7">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="animate-spin w-8 h-8 text-rose-600 mb-4" />
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl w-full max-w-2xl p-1 border border-rose-100">
      <h3 className="text-2xl font-bold text-center text-rose-700 mb-4">
        Create Your Matrimony Profile
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="fname" placeholder="First Name *" value={data.fname} onChange={handleChange} className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-rose-400 outline-none" />
        <input name="lname" placeholder="Surname *" value={data.lname} onChange={handleChange} className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-rose-400 outline-none" />
        <div className="md:col-span-2 relative">
          <input name="email" type="email" placeholder="Email Address *" value={data.email} onChange={handleChange} className={`border p-2 rounded-lg w-full focus:ring-2 focus:ring-rose-400 outline-none ${errors.email ? "border-red-500" : ""}`} />
          {checking.email && <Loader2 className="animate-spin w-4 h-4 text-rose-600 absolute right-3 top-3" />}
        </div>
        {errors.email && <p className="text-red-600 text-sm md:col-span-2 -mt-3">{errors.email}</p>}
        <input name="password" type="password" placeholder="Set Password (min 6 characters) *" value={data.password} onChange={handleChange} className="border p-2 rounded-lg w-full md:col-span-2 focus:ring-2 focus:ring-rose-400 outline-none" />
        <select name="profileBy" value={data.profileBy} onChange={handleChange} className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-rose-400 outline-none">
          <option value="">Profile Created By</option>
          {options.profileByOptions.map((relation) => (<option key={relation} value={relation}>{relation}</option>))}
        </select>
        <select name="gender" value={data.gender} onChange={handleChange} className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-rose-400 outline-none">
          <option value="">Gender *</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <div className="flex gap-2 md:col-span-2">
          <select name="dobDay" value={data.dobDay} onChange={handleChange} className="border p-2 rounded-lg w-1/3 focus:ring-2 focus:ring-rose-400 outline-none">
            <option value="">Day *</option>
            {[...Array(31)].map((_, i) => (<option key={i + 1} value={i + 1}>{i + 1}</option>))}
          </select>
          <select name="dobMonth" value={data.dobMonth} onChange={handleChange} className="border p-2 rounded-lg w-1/3 focus:ring-2 focus:ring-rose-400 outline-none">
            <option value="">Month *</option>
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (<option key={i + 1} value={i + 1}>{m}</option>))}
          </select>
          <select name="dobYear" value={data.dobYear} onChange={handleChange} className="border p-2 rounded-lg w-1/3 focus:ring-2 focus:ring-rose-400 outline-none">
            <option value="">Year *</option>
            {yearOptions.map((year) => (<option key={year} value={year}>{year}</option>))}
          </select>
        </div>
        <select name="maritalStatus" value={data.maritalStatus} onChange={handleChange} className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-rose-400 outline-none">
          <option value="">Select Marital Status *</option>
          {options.maritalStatus.map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
        <select name="religion" value={data.religion} onChange={handleChange} className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-rose-400 outline-none">
          <option value="">Select Religion *</option>
          {options.religions.map((r) => (<option key={r} value={r}>{r}</option>))}
        </select>
        <select name="caste" value={data.caste} onChange={handleChange} disabled={!data.religion} className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-rose-400 outline-none disabled:bg-gray-100">
          <option value="">{data.religion ? "Select Caste" : "Select Religion First"}</option>
          {options.castes.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
        <select name="subCaste" value={data.subCaste} onChange={handleChange} disabled={!data.caste} className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-rose-400 outline-none disabled:bg-gray-100">
          <option value="">{data.caste ? "Select Sub Caste" : "Select Caste First"}</option>
          {options.subCastes.map((s, idx) => (<option key={idx} value={s}>{s}</option>))}
        </select>
        <div className="flex gap-2 md:col-span-2">
          <input name="countryCode" value={data.countryCode} onChange={handleChange} className="border p-2 rounded-lg w-20 focus:ring-2 focus:ring-rose-400 outline-none" readOnly />
          <div className="flex-1 relative">
            <input name="mobile" placeholder="Mobile Number *" value={data.mobile} onChange={handleChange} maxLength={10} inputMode="numeric" className={`border p-2 rounded-lg w-full focus:ring-2 focus:ring-rose-400 outline-none ${errors.mobile ? "border-red-500" : ""}`} />
            {checking.mobile && <Loader2 className="animate-spin w-4 h-4 text-rose-600 absolute right-3 top-3" />}
          </div>
        </div>
        {errors.mobile && <p className="text-red-600 text-sm md:col-span-2 -mt-3">{errors.mobile}</p>}
        <textarea name="aboutYourself" placeholder="Tell us a few lines about yourself..." value={data.aboutYourself} onChange={handleChange} className="border p-2 rounded-lg w-full md:col-span-2 h-24 resize-none focus:ring-2 focus:ring-rose-400 outline-none" />
      </div>
      <label className="flex items-center gap-2 mt-4 cursor-pointer">
        <input type="checkbox" name="terms" checked={data.terms} onChange={handleChange} className="accent-rose-600 w-4 h-4" />
        <span className="text-sm text-gray-700">
          I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-rose-600 font-semibold hover:underline">Terms & Conditions</a>
        </span>
      </label>
      <div className="mt-6 text-center">
        <button onClick={handleNext} disabled={loading || !!errors.email || !!errors.mobile || checking.email || checking.mobile} className="bg-rose-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-rose-700 transition disabled:opacity-60 flex items-center justify-center mx-auto min-w-[150px]">
          {loading ? (<><Loader2 className="animate-spin w-4 h-4 mr-2" />Sending OTP...</>) : "Next Step →"}
        </button>
      </div>
    </div>
  );
}
