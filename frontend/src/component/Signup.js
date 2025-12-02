import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost/matrimony2/api"; // Adjust your API path

export default function Signup() {
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    pass: "",
    created_by: "",
    gender: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    maritial_status: "",
    noofchildren: "",
    childrenstatus: "",
    religion: "",
    caste: "",
    subcaste: "",
    countrycode: "99",
    mobile: "",
    aboutus: "",
  });

  const [errors, setErrors] = useState({});
  const [religions, setReligions] = useState([]);
  const [castes, setCastes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load religions
  useEffect(() => {
    axios.get(`${API_BASE}/religions.php`).then((res) => {
      setReligions(res.data || []);
    });
  }, []);

  // Load castes when religion changes
  useEffect(() => {
    if (form.religion) {
      axios
        .get(`${API_BASE}/fillcaste.php?q=${encodeURIComponent(form.religion)}`)
        .then((res) => setCastes(res.data || []))
        .catch(() => setCastes([]));
    } else {
      setCastes([]);
    }
  }, [form.religion]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Validate form (client-side)
  const validate = async () => {
    let errs = {};

    if (!form.fname) errs.fname = "First name is required";
    else if (!/^[A-Za-z]+$/.test(form.fname))
      errs.fname = "First name must contain only letters";

    if (!form.lname) errs.lname = "Last name is required";
    else if (!/^[A-Za-z]+$/.test(form.lname))
      errs.lname = "Last name must contain only letters";

    if (!form.email) errs.email = "Email is required";
    else {
      try {
        const res = await axios.get(
          `${API_BASE}/check_email.php?q=${encodeURIComponent(form.email)}`
        );
        if (res.data?.exists) errs.email = "Email already exists";
      } catch {}
    }

    if (!form.mobile) errs.mobile = "Mobile is required";
    else if (!/^[7-9][0-9]{9}$/.test(form.mobile))
      errs.mobile = "Invalid mobile number";
    else {
      try {
        const res = await axios.get(
          `${API_BASE}/check_mobile.php?q=${encodeURIComponent(form.mobile)}`
        );
        if (res.data?.exists) errs.mobile = "Mobile already exists";
      } catch {}
    }

    if (!form.pass) errs.pass = "Password is required";
    else if (form.pass.length < 5) errs.pass = "Password is too weak";

    if (!form.gender) errs.gender = "Gender is required";
    if (!form.dobDay || !form.dobMonth || !form.dobYear)
      errs.dob = "Complete date of birth is required";
    if (!form.maritial_status)
      errs.maritial_status = "Marital status is required";
    if (!form.religion) errs.religion = "Religion is required";
    if (!form.caste) errs.caste = "Caste is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      if (await validate()) {
        // Ensure 2-digit month/day
        const dd = String(form.dobDay).padStart(2, "0");
        const mm = String(form.dobMonth).padStart(2, "0");
        const yyyy = String(form.dobYear);

        const postData = {
          ...form,
          dob: `${yyyy}-${mm}-${dd}`,
        };

        const res = await axios.post(
          `${API_BASE}/register_submit.php`,
          postData
        );

        // Handle API-side validation errors
        if (res.data?.status === "error" && res.data?.errors) {
          setErrors(res.data.errors);
          return;
        }

        if (res.data?.status === "success") {
          // ✅ After successful signup, store data and navigate
          localStorage.setItem("matriid", res.data.matriid);
          localStorage.setItem("email", form.email);
          window.location.href = `/verify-otp?matriid=${
            res.data.matriid
          }&email=${encodeURIComponent(form.email)}`;
          return;
        }

        // Fallback generic error
        alert(res.data?.message || "Something went wrong");
        console.log("Response from API:", res.data);
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 font-display">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Free Signup
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* First Name */}
        <div>
          <label className="block mb-1 font-medium">First Name</label>
          <input
            type="text"
            name="fname"
            value={form.fname}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            maxLength="35"
          />
          {errors.fname && (
            <p className="text-red-600 text-sm">{errors.fname}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block mb-1 font-medium">Surname</label>
          <input
            type="text"
            name="lname"
            value={form.lname}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            maxLength="35"
          />
          {errors.lname && (
            <p className="text-red-600 text-sm">{errors.lname}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="pass"
            value={form.pass}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.pass && <p className="text-red-600 text-sm">{errors.pass}</p>}
        </div>

        {/* Created By */}
        <div>
          <label className="block mb-1 font-medium">Profile Created By</label>
          <select
            name="created_by"
            value={form.created_by}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select</option>
            <option value="Self">Self</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Brother">Brother</option>
            <option value="Sister">Sister</option>
            <option value="Friend">Friend</option>
            <option value="Son">Son</option>
            <option value="Daughter">Daughter</option>
            <option value="Others">Others</option>
          </select>
          {errors.created_by && (
            <p className="text-red-600 text-sm">{errors.created_by}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-1 font-medium">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && (
            <p className="text-red-600 text-sm">{errors.gender}</p>
          )}
        </div>

        {/* DOB */}
        <div className="flex gap-2">
          <div>
            <label className="block mb-1 font-medium">Day</label>
            <input
              type="number"
              min="1"
              max="31"
              name="dobDay"
              value={form.dobDay}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Month</label>
            <input
              type="number"
              min="1"
              max="12"
              name="dobMonth"
              value={form.dobMonth}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Year</label>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              name="dobYear"
              value={form.dobYear}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
        {errors.dob && <p className="text-red-600 text-sm">{errors.dob}</p>}

        {/* Marital Status */}
        <div>
          <label className="block mb-1 font-medium">Marital Status</label>
          <select
            name="maritial_status"
            value={form.maritial_status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select</option>
            <option>Unmarried</option>
            <option>Divorced</option>
            <option>Widower</option>
            <option>Widowed</option>
            <option>Awaiting Divorce</option>
            <option>Separated</option>
          </select>
          {errors.maritial_status && (
            <p className="text-red-600 text-sm">{errors.maritial_status}</p>
          )}
        </div>

        {/* No of Children & Status */}
        {form.maritial_status !== "Unmarried" && (
          <>
            <div>
              <label className="block mb-1 font-medium">No. Of Children</label>
              <select
                name="noofchildren"
                value={form.noofchildren}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select</option>
                <option value="None">None</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4 and above">4 and above</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Children Living Status
              </label>
              <select
                name="childrenstatus"
                value={form.childrenstatus}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select</option>
                <option value="Living with me">Living with me</option>
                <option value="Not living with me">Not living with me</option>
              </select>
            </div>
          </>
        )}

        {/* Religion & Caste */}
        <div>
          <label className="block mb-1 font-medium">Religion</label>
          <select
            name="religion"
            value={form.religion}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select</option>
            {religions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {errors.religion && (
            <p className="text-red-600 text-sm">{errors.religion}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Caste</label>
          <select
            name="caste"
            value={form.caste}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            disabled={!form.religion}
          >
            <option value="">Select</option>
            {castes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.caste && (
            <p className="text-red-600 text-sm">{errors.caste}</p>
          )}
        </div>

        {/* Subcaste */}
        <div>
          <label className="block mb-1 font-medium">Subcaste</label>
          <input
            type="text"
            name="subcaste"
            value={form.subcaste}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Country Code */}
        <div>
          <label className="block mb-1 font-medium">Country Code</label>
          <select
            name="countrycode"
            value={form.countrycode}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="99">(+91) India</option>
          </select>
        </div>

        {/* Mobile */}
        <div>
          <label className="block mb-1 font-medium">Mobile Number</label>
          <input
            type="text"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            maxLength="12"
          />
          {errors.mobile && (
            <p className="text-red-600 text-sm">{errors.mobile}</p>
          )}
        </div>

        {/* About Us */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">About Us</label>
          <textarea
            name="aboutus"
            value={form.aboutus}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="md:col-span-2 text-center">
          <button
            type="submit"
            // disabled={loading}
            className={`${
              loading ? "opacity-60 cursor-not-allowed" : ""
            } bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700`}
          >
            {/* {loading ? "Submitting..." : "Register"} */}
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
