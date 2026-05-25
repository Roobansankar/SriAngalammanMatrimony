import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { API } from "../../config/api";

const API_BASE = API + "/";

export default function EditFamily({ adminMode = false }) {
  const [options, setOptions] = useState({
    familyValues: [],
    familyTypes: [],
    familyStatus: [],
    motherTongues: [],
    brothers: [],
    brothersMarried: [],
    sisters: [],
    sistersMarried: [],
    familyWealth: [],
  });

  const [form, setForm] = useState({
    ConfirmEmail: "",
    Familyvalues: "",
    FamilyType: "",
    FamilyStatus: "",
    mother_tounge: "",
    noofbrothers: "",
    noyubrothers: "",
    nb_unmarried: "", // ✅ ADD
    noofsisters: "",
    noyusisters: "",
    ns_unmarried: "", // ✅ ADD
    Fathername: "",
    Fathersoccupation: "",
    FatherPoorvegam: "", // ✅ ADD
    Mothersname: "",
    Mothersoccupation: "",
    MotherPoorvegam: "", // ✅ ADD
    family_wealth: "",
    FamilyDetails: "",
    familymedicalhistory: "",
  });

  const navigate = useNavigate();
   const params = useParams();


   const MAX_LENGTH = 100;

   const RESTRICTED_WORDS = [
     "phone",
     "mobile",
     "whatsapp",
     "email",
     "contact",
     "number",
   ];

   const [error, setError] = useState("");

   const handleFamilyChange = (value) => {
     // Length check
     if (value.length > MAX_LENGTH) return;

     // Restricted word check
     const lower = value.toLowerCase();

     const found = RESTRICTED_WORDS.find((word) => lower.includes(word));

     if (found) {
       setError(`"${found}" is not allowed`);
     } else {
       setError("");
     }

     updateField("FamilyDetails", value);
   };

  // useEffect(() => {
  //   const data = JSON.parse(localStorage.getItem("userData"));
  //   if (!data) return;

  //   setForm({
  //     ConfirmEmail: data.ConfirmEmail || "",
  //     Familyvalues: data.Familyvalues || "",
  //     FamilyType: data.FamilyType || "",
  //     FamilyStatus: data.FamilyStatus || "",
  //     mother_tounge: data.mother_tounge || data.Language || "",
  //     noofbrothers: data.noofbrothers || "",
  //     noyubrothers: data.noyubrothers || data.nbm || "",
  //     noofsisters: data.noofsisters || "",
  //     noyusisters: data.noyusisters || data.nsm || "",
  //     Fathername: data.Fathername || "",
  //     Fathersoccupation: data.Fathersoccupation || "",
  //     FatherPoorvegam: data.FatherPoorvegam || "", // ✅ ADD
  //     Mothersname: data.Mothersname || "",
  //     Mothersoccupation: data.Mothersoccupation || "",
  //     MotherPoorvegam: data.MotherPoorvegam || "", // ✅ ADD
  //     family_wealth: data.family_wealth || "",
  //     FamilyDetails: data.FamilyDetails || data.FamilyDetails_new || "",
  //     familymedicalhistory: data.familymedicalhistory || "",
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

        Familyvalues: data.Familyvalues || "",
        FamilyType: data.FamilyType || "",
        FamilyStatus: data.FamilyStatus || "",
        mother_tounge: data.mother_tounge || data.Language || "",
        noofbrothers: data.noofbrothers || "",
        noyubrothers: data.noyubrothers || data.nbm || "",
        nb_unmarried: data.nb_unmarried || "", // ✅ ADD
        noofsisters: data.noofsisters || "",
        noyusisters: data.noyusisters || data.nsm || "",
        ns_unmarried: data.ns_unmarried || "", // ✅ ADD
        Fathername: data.Fathername || "",
        Fathersoccupation: data.Fathersoccupation || "",
        FatherPoorvegam: data.FatherPoorvegam || "",
        Mothersname: data.Mothersname || "",
        Mothersoccupation: data.Mothersoccupation || "",
        MotherPoorvegam: data.MotherPoorvegam || "",
        family_wealth: data.family_wealth || "",
        FamilyDetails: data.FamilyDetails || data.FamilyDetails_new || "",
        familymedicalhistory: data.familymedicalhistory || "",
      });
    };

    loadData();
  }, [adminMode, params.matriId]);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [v, t, s, mt, b, bm, si, sim, w, bu, su] = await Promise.all([
          axios.get(`${API_BASE}family-values`),
          axios.get(`${API_BASE}family-types`),
          axios.get(`${API_BASE}family-status`),
          axios.get(`${API_BASE}mother-tongues`),
          axios.get(`${API_BASE}no-of-brothers`),
          axios.get(`${API_BASE}no-of-brothers-married`),
          axios.get(`${API_BASE}no-of-sisters`),
          axios.get(`${API_BASE}no-of-sisters-married`),
          axios.get(`${API_BASE}family-wealth`),
          axios.get(`${API_BASE}no-of-brothers`), // Reuse no-of-brothers for unmarried
          axios.get(`${API_BASE}no-of-sisters`),  // Reuse no-of-sisters for unmarried
        ]);

        setOptions({
          familyValues: v.data,
          familyTypes: t.data,
          familyStatus: s.data,
          motherTongues: mt.data,
          brothers: b.data,
          brothersMarried: bm.data,
          brothersUnmarried: bu.data,
          sisters: si.data,
          sistersMarried: sim.data,
          sistersUnmarried: su.data,
          familyWealth: w.data,
        });
      } catch (err) {
        console.log("Dropdown fetch error:", err);
      }
    }

    loadOptions();
  }, []);

  const updateField = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const res = await axios.put(`${API_BASE}auth/update/family`, form);

  //     if (res.data.success) {
  //       alert("Family details updated successfully!");
  //       navigate("/profile");
  //     } else {
  //       alert("Update failed");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert("Server error");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = adminMode ? { ...form, matriId: form.MatriID } : form;

      const res = await axios.put(`${API_BASE}auth/update/family`, payload);

      if (res.data.success) {
        alert("Family details updated successfully!");

        if (adminMode) {
          navigate(`/admin/profile/${form.MatriID}`);
        } else {
          navigate("/profile");
        }
      } else {
        alert("Update failed");
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
          Edit Family Details
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* FAMILY VALUES */}
          <div>
            <label className="font-semibold">Family Values</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.Familyvalues}
              onChange={(e) => updateField("Familyvalues", e.target.value)}
            >
              <option value="">Select</option>
              {options.familyValues.map((v) => (
                <option key={v.id} value={v.family_values}>
                  {v.family_values}
                </option>
              ))}
            </select>
          </div>

          {/* FAMILY TYPE */}
          <div>
            <label className="font-semibold">Family Type</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.FamilyType}
              onChange={(e) => updateField("FamilyType", e.target.value)}
            >
              <option value="">Select</option>
              {options.familyTypes.map((t) => (
                <option key={t.id} value={t.family_typ}>
                  {t.family_typ}
                </option>
              ))}
            </select>
          </div>

          {/* FAMILY STATUS */}
          <div>
            <label className="font-semibold">Family Status</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.FamilyStatus}
              onChange={(e) => updateField("FamilyStatus", e.target.value)}
            >
              <option value="">Select</option>
              {options.familyStatus.map((s) => (
                <option key={s.id} value={s.family_status}>
                  {s.family_status}
                </option>
              ))}
            </select>
          </div>

          {/* MOTHER TONGUE */}
          <div>
            <label className="font-semibold">Mother Tongue</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.mother_tounge}
              onChange={(e) => updateField("mother_tounge", e.target.value)}
            >
              <option value="">Select</option>
              {options.motherTongues.map((m) => (
                <option key={m.id} value={m.mother_tounge}>
                  {m.mother_tounge}
                </option>
              ))}
            </select>
          </div>

          {/* NO OF BROTHERS */}
          <div>
            <label className="font-semibold">No. of Brothers</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.noofbrothers}
              onChange={(e) => updateField("noofbrothers", e.target.value)}
            >
              <option value="">Select</option>
              {options.brothers.map((b) => (
                <option key={b.id} value={b.number}>
                  {b.number}
                </option>
              ))}
            </select>
          </div>

          {/* BROTHERS MARRIED */}
          <div>
            <label className="font-semibold">Brothers Married</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.noyubrothers}
              onChange={(e) => updateField("noyubrothers", e.target.value)}
            >
              <option value="">Select</option>
              {options.brothersMarried.map((b) => (
                <option key={b.id} value={b.number_married}>
                  {b.number_married}
                </option>
              ))}
            </select>
          </div>

          {/* BROTHERS UNMARRIED */}
          <div>
            <label className="font-semibold">Brothers Unmarried</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.nb_unmarried}
              onChange={(e) => updateField("nb_unmarried", e.target.value)}
            >
              <option value="">Select</option>
              {options.brothersUnmarried?.map((b) => (
                <option key={b.id} value={b.number}>
                  {b.number}
                </option>
              ))}
            </select>
          </div>

          {/* NO OF SISTERS */}
          <div>
            <label className="font-semibold">No. of Sisters</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.noofsisters}
              onChange={(e) => updateField("noofsisters", e.target.value)}
            >
              <option value="">Select</option>
              {options.sisters.map((s) => (
                <option key={s.id} value={s.number}>
                  {s.number}
                </option>
              ))}
            </select>
          </div>

          {/* SISTERS MARRIED */}
          <div>
            <label className="font-semibold">Sisters Married</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.noyusisters}
              onChange={(e) => updateField("noyusisters", e.target.value)}
            >
              <option value="">Select</option>
              {options.sistersMarried.map((s) => (
                <option key={s.id} value={s.number_married}>
                  {s.number_married}
                </option>
              ))}
            </select>
          </div>

          {/* SISTERS UNMARRIED */}
          <div>
            <label className="font-semibold">Sisters Unmarried</label>
            <select
              className="w-full border p-3 rounded-lg"
              value={form.ns_unmarried}
              onChange={(e) => updateField("ns_unmarried", e.target.value)}
            >
              <option value="">Select</option>
              {options.sistersUnmarried?.map((s) => (
                <option key={s.id} value={s.number}>
                  {s.number}
                </option>
              ))}
            </select>
          </div>

          {/* FATHER NAME */}
          <div>
            <label className="font-semibold">Father Name</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg"
              value={form.Fathername}
              onChange={(e) => updateField("Fathername", e.target.value)}
            />
          </div>

          {/* FATHER OCCUPATION */}
          <div>
            <label className="font-semibold">Father Occupation</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg"
              value={form.Fathersoccupation}
              onChange={(e) => updateField("Fathersoccupation", e.target.value)}
              maxLength={25}
            />
          </div>

          <div>
            <label className="font-semibold">Father Poorvegam</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg"
              value={form.FatherPoorvegam}
              onChange={(e) => updateField("FatherPoorvegam", e.target.value)}
            />
          </div>

          {/* MOTHER NAME */}
          <div>
            <label className="font-semibold">Mother Name</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg"
              value={form.Mothersname}
              onChange={(e) => updateField("Mothersname", e.target.value)}
            />
          </div>

          {/* MOTHER OCCUPATION */}
          <div>
            <label className="font-semibold">Mother Occupation</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg"
              value={form.Mothersoccupation}
              onChange={(e) => updateField("Mothersoccupation", e.target.value)}
              maxLength={25}
            />
          </div>

          <div>
            <label className="font-semibold">Mother Poorvegam</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg"
              value={form.MotherPoorvegam}
              onChange={(e) => updateField("MotherPoorvegam", e.target.value)}
            />
          </div>

          {/* FAMILY WEALTH — MULTI SELECT BUT STORED AS STRING */}
          <div>
            <label className="font-semibold">Family Wealth</label>
            <select
              multiple
              className="w-full border p-3 rounded-lg"
              value={form.family_wealth.split(",")} // show selections
              onChange={(e) => {
                const selected = Array.from(
                  e.target.selectedOptions,
                  (opt) => opt.value,
                );
                updateField("family_wealth", selected.join(",")); // stored as string
              }}
            >
              {options.familyWealth.map((w, i) => (
                <option key={i} value={w.wealth}>
                  {w.wealth}
                </option>
              ))}
            </select>
          </div>

          {/* MEDICAL HISTORY */}
          <div className="md:col-span-2">
            <label className="font-semibold">Family Medical History</label>
            <textarea
              rows="2"
              className="w-full border p-3 rounded-lg"
              value={form.familymedicalhistory}
              onChange={(e) =>
                updateField("familymedicalhistory", e.target.value)
              }
            />
          </div>

          {/* ABOUT FAMILY */}
          {/* <div className="md:col-span-2">
            <label className="font-semibold">About Family</label>
            <textarea
              rows="3"
              className="w-full border p-3 rounded-lg"
              value={form.FamilyDetails}
              onChange={(e) => updateField("FamilyDetails", e.target.value)}
            />
          </div> */}

          <div className="md:col-span-2">
            <label className="font-semibold"> Describe your family background and assets</label>

            <textarea
              rows="3"
              className="w-full border p-3 rounded-lg"
              value={form.FamilyDetails}
              onChange={(e) => handleFamilyChange(e.target.value)}
              maxLength={MAX_LENGTH}
            />

            {/* Character count */}
            <div className="text-xs text-gray-500 mt-1">
              {form.FamilyDetails?.length || 0} / {MAX_LENGTH}
            </div>

            {/* Error */}
            {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
          </div>

          {/* SAVE BUTTON */}
          <div className="md:col-span-2">
            <button className="w-full py-3 bg-pink-600 text-white text-lg rounded-lg">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
