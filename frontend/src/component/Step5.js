

import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { API } from "../config/api";
import {
    formatMobile,
    formatPincode,
    isValidMobile,
    isValidPincode,
    isValidWhatsApp,
} from "./validation";

const API_BASE = API + "/";

export default function Step5({ nextStep, prevStep, formData = {} }) {
  const [options, setOptions] = useState({
    countries: [],
    states: [],
    districts: [],
    residencyStatuses: [],
    callTimes: [],
  });

  const [errors, setErrors] = useState({});
  const isInitialLoad = useRef(true);

  const [data, setData] = useState({
    country: formData.country || "",
    state: formData.state || "",
    district: formData.district || "",
    city: formData.city || "",
    pincode: formData.pincode || "",
    residence: formData.residence || "",
    address: formData.address || "",
    altPhone: formData.altPhone || "",
    whatsapp: formData.whatsapp || "",
    convenientTime: formData.convenientTime || "",
  });

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      setData({
        country: formData.country || "",
        state: formData.state || "",
        district: formData.district || "",
        city: formData.city || "",
        pincode: formData.pincode || "",
        residence: formData.residence || "",
        address: formData.address || "",
        altPhone: formData.altPhone || "",
        whatsapp: formData.whatsapp || "",
        convenientTime: formData.convenientTime || "",
      });
    }
  }, [formData]);

  useEffect(() => {
    let mounted = true;

    async function fetchInitial() {
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

        if (!mounted) return;

        setOptions((p) => ({
          ...p,
          countries: Array.isArray(countries)
            ? countries.filter((c) => c.country !== "Any")
            : [],
          residencyStatuses: Array.isArray(residency)
            ? residency
                .map((r) => r.residency_status ?? r)
                .filter((r) => r && r !== "Any")
            : [],
          callTimes: Array.isArray(times)
            ? times.map((t) => t.call_time ?? t)
            : [],
        }));
      } catch {
        if (!mounted) return;
        setOptions((p) => ({
          ...p,
          countries: [],
          residencyStatuses: [],
          callTimes: [],
        }));
      }
    }

    fetchInitial();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadStates() {
      if (!data.country) {
        setOptions((p) => ({ ...p, states: [], districts: [] }));
        setData((p) => ({ ...p, state: "", district: "" }));
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE}states?country=${encodeURIComponent(data.country)}`
        );
        const st = await res.json();

        if (mounted) {
          setOptions((p) => ({
            ...p,
            states: Array.isArray(st)
              ? st.filter((s) => s.state !== "Any")
              : [],
            districts: [],
          }));

          if (!isInitialLoad.current) {
            setData((p) => ({ ...p, state: "", district: "" }));
          }
        }
      } catch {}
    }

    loadStates();
    return () => (mounted = false);
  }, [data.country]);

  useEffect(() => {
    let mounted = true;

    async function loadDistricts() {
      if (!data.state) {
        setOptions((p) => ({ ...p, districts: [] }));
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE}districts?state=${encodeURIComponent(data.state)}`
        );
        const dist = await res.json();

        if (mounted) {
          setOptions((p) => ({
            ...p,
            districts: Array.isArray(dist)
              ? dist.filter((d) => d.dist !== "Any")
              : [],
          }));

          if (!isInitialLoad.current) {
            setData((p) => ({ ...p, district: "" }));
          }
          isInitialLoad.current = false;
        }
      } catch {}
    }

    loadDistricts();
    return () => (mounted = false);
  }, [data.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formatted = value;

    if (name === "pincode") formatted = formatPincode(value);
    if (name === "altPhone" || name === "whatsapp")
      formatted = formatMobile(value);
    // if (name === "city") formatted = value.replace(/[^a-zA-Z\s]/g, "");
    if (name === "city")
      formatted = value.replace(/[^a-zA-Z0-9\s\u0B80-\u0BFF-]/g, "");

    setData((p) => ({ ...p, [name]: formatted }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (data.pincode && !isValidPincode(data.pincode))
      newErrors.pincode = "Pincode must be 6 digits";

    if (data.altPhone && !isValidMobile(data.altPhone))
      newErrors.altPhone = "Phone must be 10 digits";

    if (data.whatsapp && !isValidWhatsApp(data.whatsapp))
      newErrors.whatsapp = "WhatsApp must be 10–15 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) nextStep(data);
  };

//   return (
// <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-rose-100 mt-12">

//       <div className="flex items-center justify-center gap-2 mb-6">
//         <MapPin className="w-7 h-7 text-rose-600" />
//         <h3 className="text-2xl font-bold text-rose-700">
//           Step 2: Contact Details
//         </h3>
//       </div>

//   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//         {/* Country */}
//        {/* Country – FULL WIDTH */}
// <div className="md:col-span-2">
//   <label className="block font-medium text-gray-700 mb-1">
//     Country
//   </label>
//   <select
//     name="country"
//     value={data.country}
//     onChange={handleChange}
//     className="border rounded-xl px-4 py-3 w-full"
//   >
//     <option value="">Select Country</option>
//     {options.countries.map((c) => (
//       <option key={c.id} value={c.country}>
//         {c.country}
//       </option>
//     ))}
//   </select>
// </div>



//         {/* State */}
//         <div>
//           <label className="font-medium">State</label>
//           <select
//             name="state"
//             value={data.state}
//             onChange={handleChange}
//             // className="border p-2 rounded-lg w-full"
//             className="border rounded-xl px-4 py-3 w-full"

//             disabled={!options.states.length}
//           >
//             <option value="">
//               {data.country ? "Select State" : "Select Country First"}
//             </option>
//             {options.states.map((s) => (
//               <option key={s.id} value={s.state}>
//                 {s.state}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* District */}
//         <div>
//           <label className="font-medium">District</label>
//           <select
//             name="district"
//             value={data.district}
//             onChange={handleChange}
//             // className="border p-2 rounded-lg w-full"
//             className="border rounded-xl px-4 py-3 w-full"

//             disabled={!options.districts.length}
//           >
//             <option value="">
//               {data.state ? "Select District" : "Select State First"}
//             </option>
//             {options.districts.map((d) => (
//               <option key={d.id} value={d.dist}>
//                 {d.dist}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* City */}
//         <div>
//           <label className="font-medium">City</label>
//           <input
//             name="city"
//             value={data.city}
//             onChange={handleChange}
//             // className="border p-2 rounded-lg w-full"
//             className="border rounded-xl px-4 py-3 w-full"

//             placeholder="City name"
//           />
//         </div>

//         {/* Pincode */}
//         <div>
//           <label className="font-medium">Pincode</label>
//           <input
//             name="pincode"
//             value={data.pincode}
//             onChange={handleChange}
//             maxLength={6}
//             className={`border rounded-xl px-4 py-3 w-full ${
//               errors.pincode ? "border-red-500" : ""
//             }`}
//             placeholder="6-digit pincode"
//           />
//           {errors.pincode && (
//             <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
//           )}
//         </div>

//         {/* Residence */}
//         <div>
//           <label className="font-medium">Residence Status</label>
//           <select
//             name="residence"
//             value={data.residence}
//             onChange={handleChange}
//             // className="border p-2 rounded-lg w-full"
//             className="border rounded-xl px-4 py-3 w-full"

//           >
//             <option value="">Select Residence Status</option>
//             {options.residencyStatuses.map((r, i) => (
//               <option key={i} value={r}>
//                 {r}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Address */}
//         <div className="col-span-2">
//           <label className="font-medium">Full Address</label>
//           <textarea
//             name="address"
//             rows={2}
//             value={data.address}
//             onChange={handleChange}
//             // className="border p-2 rounded-lg w-full"
//             className="border rounded-xl px-4 py-3 w-full"

//           />
//         </div>

//         {/* Alternative Phone */}
//         <div>
//           <label className="font-medium">Father's Number</label>
//           <input
//             name="altPhone"
//             value={data.altPhone}
//             onChange={handleChange}
//             maxLength={10}
//             className={`border rounded-xl px-4 py-3 w-full ${
//               errors.altPhone ? "border-red-500" : ""
//             }`}
//             placeholder="10-digit number"
//           />
//           {errors.altPhone && (
//             <p className="text-red-500 text-xs mt-1">{errors.altPhone}</p>
//           )}
//         </div>

//         {/* WhatsApp */}
//         <div>
//           <label className="font-medium">Mother's Number</label>
//           <input
//             name="whatsapp"
//             value={data.whatsapp}
//             onChange={handleChange}
//             maxLength={10}
//             className={`border rounded-xl px-4 py-3 w-full ${
//               errors.whatsapp ? "border-red-500" : ""
//             }`}
//             placeholder="10-digit number"
//           />
//           {errors.whatsapp && (
//             <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>
//           )}
//         </div>

//         {/* Convenient Time */}
//         <div>
//           <label className="font-medium">Convenient Time to Call</label>
//           <select
//             name="convenientTime"
//             value={data.convenientTime}
//             onChange={handleChange}
//             className="border rounded-xl px-4 py-3 w-full"
//           >
//             <option value="">Select Time</option>
//             {options.callTimes.map((t, i) => (
//               <option key={i} value={t}>
//                 {t}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//     <div className="flex justify-between mt-8">
//   <button
//     onClick={prevStep}
//     className="px-6 py-3 rounded-xl bg-gray-300 text-gray-800 font-semibold"
//   >
//     ⬅ Back
//   </button>

//   <button
//     onClick={handleNext}
//     className="px-6 py-3 rounded-xl bg-rose-600 text-white font-semibold"
//   >
//     Next ➡
//   </button>
// </div>

//     </div>
//   );

return (
  <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-rose-100 mt-12">
    {/* Header */}
    <div className="flex items-center justify-center gap-2 mb-6 border-b pb-3">
      <MapPin className="w-7 h-7 text-rose-600" />
      <h3 className="text-2xl font-bold text-rose-700">
        Contact Details
      </h3>
    </div>

    {/* FORM GRID */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Country – FULL WIDTH */}
      <div className="md:col-span-2">
        <label className="block font-medium text-gray-700 mb-1">
          Country
        </label>
        <select
          name="country"
          value={data.country}
          onChange={handleChange}
          className="border rounded-xl px-4 py-3 w-full"
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
        <label className="block font-medium text-gray-700 mb-1">
          State
        </label>
        <select
          name="state"
          value={data.state}
          onChange={handleChange}
          disabled={!options.states.length}
          className="border rounded-xl px-4 py-3 w-full"
        >
          <option value="">
            {data.country ? "Select State" : "Select Country First"}
          </option>
          {options.states.map((s) => (
            <option key={s.id} value={s.state}>
              {s.state}
            </option>
          ))}
        </select>
      </div>

      {/* District */}
      <div>
        <label className="block font-medium text-gray-700 mb-1">
          District
        </label>
        <select
          name="district"
          value={data.district}
          onChange={handleChange}
          disabled={!options.districts.length}
          className="border rounded-xl px-4 py-3 w-full"
        >
          <option value="">
            {data.state ? "Select District" : "Select State First"}
          </option>
          {options.districts.map((d) => (
            <option key={d.id} value={d.dist}>
              {d.dist}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label className="block font-medium text-gray-700 mb-1">
          City
        </label>
        <input
          name="city"
          value={data.city}
          onChange={handleChange}
          placeholder="City name"
          className="border rounded-xl px-4 py-3 w-full"
        />
      </div>

      {/* Pincode */}
      <div>
        <label className="block font-medium text-gray-700 mb-1">
          Pincode
        </label>
        <input
          name="pincode"
          value={data.pincode}
          onChange={handleChange}
          maxLength={6}
          placeholder="6-digit pincode"
          className={`border rounded-xl px-4 py-3 w-full ${
            errors.pincode ? "border-red-500" : ""
          }`}
        />
        {errors.pincode && (
          <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
        )}
      </div>

      {/* Residence */}
      <div>
        <label className="block font-medium text-gray-700 mb-1">
          Residence Status
        </label>
        <select
          name="residence"
          value={data.residence}
          onChange={handleChange}
          className="border rounded-xl px-4 py-3 w-full"
        >
          <option value="">Select Residence Status</option>
          {options.residencyStatuses.map((r, i) => (
            <option key={i} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Address – FULL WIDTH */}
      <div className="md:col-span-2">
        <label className="block font-medium text-gray-700 mb-1">
          Full Address
        </label>
        <textarea
          name="address"
          rows={3}
          value={data.address}
          onChange={handleChange}
          maxLength={80}
          className="border rounded-xl px-4 py-3 w-full"
        />
      </div>

      {/* Father Phone */}
      <div>
        <label className="block font-medium text-gray-700 mb-1">
          Father's Number
        </label>
        <input
          name="altPhone"
          value={data.altPhone}
          onChange={handleChange}
          maxLength={10}
          placeholder="10-digit number"
          className={`border rounded-xl px-4 py-3 w-full ${
            errors.altPhone ? "border-red-500" : ""
          }`}
        />
        {errors.altPhone && (
          <p className="text-red-500 text-xs mt-1">{errors.altPhone}</p>
        )}
      </div>

      {/* Mother Phone */}
      <div>
        <label className="block font-medium text-gray-700 mb-1">
          Mother's Number
        </label>
        <input
          name="whatsapp"
          value={data.whatsapp}
          onChange={handleChange}
          maxLength={10}
          placeholder="10-digit number"
          className={`border rounded-xl px-4 py-3 w-full ${
            errors.whatsapp ? "border-red-500" : ""
          }`}
        />
        {errors.whatsapp && (
          <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>
        )}
      </div>

      {/* Convenient Time */}
      <div>
        <label className="block font-medium text-gray-700 mb-1">
          Convenient Time to Call
        </label>
        <select
          name="convenientTime"
          value={data.convenientTime}
          onChange={handleChange}
          className="border rounded-xl px-4 py-3 w-full"
        >
          <option value="">Select Time</option>
          {options.callTimes.map((t, i) => (
            <option key={i} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Buttons */}
    <div className="flex justify-between mt-8">
      <button
        onClick={prevStep}
        className="px-6 py-3 rounded-xl bg-gray-300 text-gray-800 font-semibold"
      >
        ⬅ Back
      </button>

      <button
        onClick={handleNext}
        className="px-6 py-3 rounded-xl bg-rose-600 text-white font-semibold"
      >
        Next ➡
      </button>
    </div>
  </div>
);

}
