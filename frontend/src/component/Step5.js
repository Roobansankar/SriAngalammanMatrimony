// import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { formatMobile, formatPincode, isValidMobile, isValidPincode, isValidWhatsApp } from "./validation";

// const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api/";

// export default function Step5({ nextStep, prevStep, formData = {} }) {
//   const [options, setOptions] = useState({
//     countries: [],
//     states: [],
//     districts: [],
//     residencyStatuses: [],
//     callTimes: [],
//   });

//   const [errors, setErrors] = useState({});

//   // Track if this is the initial load to prevent resetting saved values
//   const isInitialLoad = useRef(true);

//   const [data, setData] = useState({
//     country: formData.country || "",
//     state: formData.state || "",
//     district: formData.district || "",
//     city: formData.city || "",
//     pincode: formData.pincode || "",
//     residence: formData.residence || "",
//     address: formData.address || "",
//     altPhone: formData.altPhone || "",
//     mobile: formData.mobile || "",
//     whatsapp: formData.whatsapp || "",
//     convenientTime: formData.convenientTime || "",
//   });

//   // Sync local state when formData prop changes (e.g., after localStorage load)
//   useEffect(() => {
//     if (Object.keys(formData).length > 0) {
//       setData({
//         country: formData.country || "",
//         state: formData.state || "",
//         district: formData.district || "",
//         city: formData.city || "",
//         pincode: formData.pincode || "",
//         residence: formData.residence || "",
//         address: formData.address || "",
//         altPhone: formData.altPhone || "",
//         mobile: formData.mobile || "",
//         whatsapp: formData.whatsapp || "",
//         convenientTime: formData.convenientTime || "",
//       });
//     }
//   }, [formData]);

//   // Fetch countries, residency status, calling times
//   useEffect(() => {
//     let mounted = true;

//     async function fetchInitial() {
//       try {
//         const [cRes, rRes, tRes] = await Promise.all([
//           fetch(`${API_BASE}countries`),
//           fetch(`${API_BASE}residency-status`),
//           fetch(`${API_BASE}calling-time`),
//         ]);

//         // handle non-OK responses gracefully
//         if (!cRes.ok) throw new Error(`countries fetch failed: ${cRes.status}`);
//         if (!rRes.ok)
//           throw new Error(`residency-status fetch failed: ${rRes.status}`);
//         if (!tRes.ok)
//           throw new Error(`calling-time fetch failed: ${tRes.status}`);

//         const [countries, residency, times] = await Promise.all([
//           cRes.json(),
//           rRes.json(),
//           tRes.json(),
//         ]);

//         if (!mounted) return;

//         setOptions((p) => ({
//           ...p,
//           // countries: Array.isArray(countries) ? countries : [],
//           countries: Array.isArray(countries)
//             ? countries.filter((c) => c.country !== "Any")
//             : [],

//           // residencyStatuses: Array.isArray(residency)
//           //   ? residency.map((r) => r.residency_status ?? r)
//           //   : [],
//           residencyStatuses: Array.isArray(residency)
//             ? residency
//                 .map((r) => r.residency_status ?? r)
//                 .filter((r) => r && r !== "Any")
//             : [],

//           callTimes: Array.isArray(times)
//             ? times.map((t) => t.call_time ?? t)
//             : [],
//         }));
//       } catch (err) {
//         console.error("Error fetching initial data for Step5:", err);
//         if (!mounted) return;
//         setOptions((p) => ({
//           ...p,
//           countries: [],
//           residencyStatuses: [],
//           callTimes: [],
//         }));
//       }
//     }

//     fetchInitial();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // Fetch states when country changes
//   useEffect(() => {
//     let mounted = true;

//     async function loadStates() {
//       if (!data.country) {
//         if (mounted) {
//           setOptions((p) => ({ ...p, states: [], districts: [] }));
//           setData((p) => ({ ...p, state: "", district: "" }));
//         }
//         return;
//       }

//       try {
//         const res = await fetch(
//           `${API_BASE}states?country=${encodeURIComponent(data.country)}`
//         );

//         if (!res.ok) {
//           console.error(
//             "Failed to fetch states:",
//             res.status,
//             await res.text()
//           );
//           if (mounted) {
//             setOptions((p) => ({ ...p, states: [], districts: [] }));
//             setData((p) => ({ ...p, state: "", district: "" }));
//           }
//           return;
//         }

//         const st = await res.json();
//         if (mounted) {
//           setOptions((p) => ({
//             ...p,
//             states: Array.isArray(st)
//               ? st.filter((s) => s.state !== "Any")
//               : [],
//             districts: [],
//           }));

//           // Only reset state/district if this is a user-initiated country change (not initial load)
//           if (!isInitialLoad.current) {
//             setData((p) => ({ ...p, state: "", district: "" }));
//           }
//         }
//       } catch (err) {
//         console.error("Error loading states:", err);
//         if (mounted) {
//           setOptions((p) => ({ ...p, states: [], districts: [] }));
//           if (!isInitialLoad.current) {
//             setData((p) => ({ ...p, state: "", district: "" }));
//           }
//         }
//       }
//     }

//     loadStates();
//     return () => {
//       mounted = false;
//     };
//   }, [data.country]);

//   // Fetch districts when state changes
//   useEffect(() => {
//     let mounted = true;

//     async function loadDistricts() {
//       if (!data.state) {
//         if (mounted) {
//           setOptions((p) => ({ ...p, districts: [] }));
//           if (!isInitialLoad.current) {
//             setData((p) => ({ ...p, district: "" }));
//           }
//         }
//         return;
//       }

//       try {
//         const res = await fetch(
//           `${API_BASE}districts?state=${encodeURIComponent(data.state)}`
//         );

//         if (!res.ok) {
//           console.error(
//             "Failed to fetch districts:",
//             res.status,
//             await res.text()
//           );
//           if (mounted) {
//             setOptions((p) => ({ ...p, districts: [] }));
//             if (!isInitialLoad.current) {
//               setData((p) => ({ ...p, district: "" }));
//             }
//           }
//           return;
//         }

//         const dist = await res.json();
//         if (mounted) {
//           setOptions((p) => ({
//             ...p,
//             districts: Array.isArray(dist)
//               ? dist.filter((d) => d.dist !== "Any")
//               : [],
//           }));
//           // Only reset district if this is a user-initiated state change
//           if (!isInitialLoad.current) {
//             setData((p) => ({ ...p, district: "" }));
//           }
//           // Mark initial load as complete after districts are loaded
//           isInitialLoad.current = false;
//         }
//       } catch (err) {
//         console.error("Error loading districts:", err);
//         if (mounted) {
//           setOptions((p) => ({ ...p, districts: [] }));
//           if (!isInitialLoad.current) {
//             setData((p) => ({ ...p, district: "" }));
//           }
//         }
//       }
//     }

//     loadDistricts();
//     return () => {
//       mounted = false;
//     };
//   }, [data.state]);

//   // Handle input change (works for inputs and selects)
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Format specific fields
//     let formattedValue = value;
//     if (name === "pincode") {
//       formattedValue = formatPincode(value);
//     } else if (name === "mobile" || name === "altPhone" || name === "whatsapp") {
//       formattedValue = formatMobile(value);
//     } else if (name === "city") {
//       // Only allow letters and spaces for city
//       formattedValue = value.replace(/[^a-zA-Z\s]/g, "");
//     }

//     setData((p) => ({ ...p, [name]: formattedValue }));

//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (data.pincode && !isValidPincode(data.pincode)) {
//       newErrors.pincode = "Pincode must be 6 digits";
//     }

//     if (data.mobile && !isValidMobile(data.mobile)) {
//       newErrors.mobile = "Mobile must be 10 digits";
//     }

//     if (data.altPhone && !isValidMobile(data.altPhone)) {
//       newErrors.altPhone = "Phone must be 10 digits";
//     }

//     if (data.whatsapp && !isValidWhatsApp(data.whatsapp)) {
//       newErrors.whatsapp = "WhatsApp must be 10-15 digits";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNext = () => {
//     if (validateForm()) {
//       nextStep(data);
//     }
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-2xl w-full max-w-2xl p-6 mx-auto border border-rose-100 mt-12">
//       <div className="flex items-center justify-center gap-2 mb-6">
//         <MapPin className="w-7 h-7 text-rose-600" />
//         <h3 className="text-2xl font-bold text-rose-700">
//           Step 5: Contact Details
//         </h3>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {/* Country */}
//         <div>
//           <label className="font-medium">Country</label>
//           <select
//             name="country"
//             value={data.country}
//             onChange={handleChange}
//             className="border p-2 rounded-lg w-full"
//           >
//             <option value="">Country</option>
//             {options.countries.map((c) => (
//               <option key={c.id} value={c.country}>
//                 {c.country}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* State */}
//         <div>
//           <label className="font-medium">State</label>
//           <select
//             name="state"
//             value={data.state}
//             onChange={handleChange}
//             disabled={!options.states.length}
//             className="border p-2 rounded-lg w-full"
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
//             disabled={!options.districts.length}
//             className="border p-2 rounded-lg w-full"
//           >
//             <option value="">
//               {data.state ? "Select District" : "Select State First"}
//             </option>

//             {/* Defensive mapping: ensure districts is an array */}
//             {(Array.isArray(options.districts) ? options.districts : []).map(
//               (d) => (
//                 <option key={d.id} value={d.dist}>
//                   {d.dist}
//                 </option>
//               )
//             )}
//           </select>
//         </div>

//         {/* City */}
//         <div>
//           <label className="font-medium">City</label>
//           <input
//             name="city"
//             value={data.city}
//             onChange={handleChange}
//             placeholder="Enter city name"
//             className="border p-2 rounded-lg w-full"
//           />
//         </div>

//         {/* Pincode */}
//         <div>
//           <label className="font-medium">Pincode</label>
//           <input
//             name="pincode"
//             value={data.pincode}
//             onChange={handleChange}
//             placeholder="6-digit pincode"
//             maxLength={6}
//             inputMode="numeric"
//             className={`border p-2 rounded-lg w-full ${errors.pincode ? "border-red-500" : ""}`}
//           />
//           {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
//         </div>

//         {/* Residence Status */}
//         <div>
//           <label className="font-medium">Residence Status</label>
//           <select
//             name="residence"
//             value={data.residence}
//             onChange={handleChange}
//             className="border p-2 rounded-lg w-full"
//           >
//             <option value="">Select Residence Status</option>
//             {Array.isArray(options.residencyStatuses) &&
//               options.residencyStatuses.map((r, i) => (
//                 <option key={i} value={r}>
//                   {r}
//                 </option>
//               ))}
//           </select>
//         </div>

//         {/* Address */}
//         <div className="col-span-2">
//           <label className="font-medium">Full Address</label>
//           <textarea
//             name="address"
//             rows="2"
//             value={data.address}
//             onChange={handleChange}
//             className="border p-2 rounded-lg w-full"
//           />
//         </div>

//         {/* Phones */}
//         {["altPhone", "mobile", "whatsapp"].map((f, idx) => (
//           <div key={idx}>
//             <label className="font-medium">
//               {f === "altPhone"
//                 ? "Alternative Phone"
//                 : f === "mobile"
//                 ? "Mobile Number"
//                 : "WhatsApp Number"}
//             </label>
//             <input
//               name={f}
//               value={data[f]}
//               onChange={handleChange}
//               maxLength={10}
//               inputMode="numeric"
//               placeholder="10-digit number"
//               className={`border p-2 rounded-lg w-full ${errors[f] ? "border-red-500" : ""}`}
//             />
//             {errors[f] && <p className="text-red-500 text-xs mt-1">{errors[f]}</p>}
//           </div>
//         ))}

//         {/* Convenient Time */}
//         <div>
//           <label className="font-medium">Convenient Time to Call</label>
//           <select
//             name="convenientTime"
//             value={data.convenientTime}
//             onChange={handleChange}
//             className="border p-2 rounded-lg w-full"
//           >
//             <option value="">Select Time</option>
//             {Array.isArray(options.callTimes) &&
//               options.callTimes.map((t, i) => (
//                 <option key={i} value={t}>
//                   {t}
//                 </option>
//               ))}
//           </select>
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-between mt-6">
//         <button
//           onClick={prevStep}
//           className="border px-5 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
//         >
//           <ArrowLeft className="inline w-4 h-4" /> Back
//         </button>

//         <button
//           onClick={handleNext}
//           className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700"
//         >
//           Next <ArrowRight className="inline w-4 h-4" />
//         </button>
//       </div>
//     </div>
//   );
// }

import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  formatMobile,
  formatPincode,
  isValidMobile,
  isValidPincode,
  isValidWhatsApp,
} from "./validation";
const API_BASE = (process.env.REACT_APP_API_BASE || "http://localhost:5000") + "/api/";

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

  return (
    <div className="bg-white shadow-lg rounded-2xl w-full max-w-2xl p-6 mx-auto border border-rose-100 mt-12">
      <div className="flex items-center justify-center gap-2 mb-6">
        <MapPin className="w-7 h-7 text-rose-600" />
        <h3 className="text-2xl font-bold text-rose-700">
          Step 3: Contact Details
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Country */}
        <div>
          <label className="font-medium">Country</label>
          <select
            name="country"
            value={data.country}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full"
          >
            <option value="">Country</option>
            {options.countries.map((c) => (
              <option key={c.id} value={c.country}>
                {c.country}
              </option>
            ))}
          </select>
        </div>

        {/* State */}
        <div>
          <label className="font-medium">State</label>
          <select
            name="state"
            value={data.state}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full"
            disabled={!options.states.length}
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
          <label className="font-medium">District</label>
          <select
            name="district"
            value={data.district}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full"
            disabled={!options.districts.length}
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
          <label className="font-medium">City</label>
          <input
            name="city"
            value={data.city}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full"
            placeholder="City name"
          />
        </div>

        {/* Pincode */}
        <div>
          <label className="font-medium">Pincode</label>
          <input
            name="pincode"
            value={data.pincode}
            onChange={handleChange}
            maxLength={6}
            className={`border p-2 rounded-lg w-full ${
              errors.pincode ? "border-red-500" : ""
            }`}
            placeholder="6-digit pincode"
          />
          {errors.pincode && (
            <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
          )}
        </div>

        {/* Residence */}
        <div>
          <label className="font-medium">Residence Status</label>
          <select
            name="residence"
            value={data.residence}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full"
          >
            <option value="">Select Residence Status</option>
            {options.residencyStatuses.map((r, i) => (
              <option key={i} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Address */}
        <div className="col-span-2">
          <label className="font-medium">Full Address</label>
          <textarea
            name="address"
            rows={2}
            value={data.address}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full"
          />
        </div>

        {/* Alternative Phone */}
        <div>
          <label className="font-medium">Alternative Phone</label>
          <input
            name="altPhone"
            value={data.altPhone}
            onChange={handleChange}
            maxLength={10}
            className={`border p-2 rounded-lg w-full ${
              errors.altPhone ? "border-red-500" : ""
            }`}
            placeholder="10-digit number"
          />
          {errors.altPhone && (
            <p className="text-red-500 text-xs mt-1">{errors.altPhone}</p>
          )}
        </div>

        {/* WhatsApp */}
        <div>
          <label className="font-medium">WhatsApp Number</label>
          <input
            name="whatsapp"
            value={data.whatsapp}
            onChange={handleChange}
            maxLength={10}
            className={`border p-2 rounded-lg w-full ${
              errors.whatsapp ? "border-red-500" : ""
            }`}
            placeholder="10-digit number"
          />
          {errors.whatsapp && (
            <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>
          )}
        </div>

        {/* Convenient Time */}
        <div>
          <label className="font-medium">Convenient Time to Call</label>
          <select
            name="convenientTime"
            value={data.convenientTime}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full"
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

      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          className="border px-5 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          <ArrowLeft className="inline w-4 h-4" /> Back
        </button>

        <button
          onClick={handleNext}
          className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700"
        >
          Next <ArrowRight className="inline w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
