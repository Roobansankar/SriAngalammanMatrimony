// Step12.jsx
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Step12({ prevStep, formData }) {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const f = formData || {};
      const fd = new FormData();
      const add = (key, val) => {
        if (val === undefined || val === null || val === "") return;
        fd.append(key, val);
      };

      /* ------------------------------------------------
         🧍 Step 1: Basic Information
      ------------------------------------------------ */
      add("matriId", f.matriId);
      add("fname", f.fname);
      add("lname", f.lname);
      add("email", f.email);
      add("password", f.password);
      add("profileBy", f.profileBy);
      add("gender", f.gender);
      add("dobDay", f.dobDay);
      add("dobMonth", f.dobMonth);
      add("dobYear", f.dobYear);
      add("maritalStatus", f.maritalStatus);
      add("religion", f.religion);
      add("caste", f.caste);
      add("subCaste", f.subCaste);
      add("countryCode", f.countryCode);
      add("mobile", f.mobile);
      add("aboutus", f.aboutYourself);

      for (let i = 1; i <= 12; i++) {
        add(`g${i}`, f[`g${i}`] ? f[`g${i}`].join(",") : "");
        add(`a${i}`, f[`a${i}`] ? f[`a${i}`].join(",") : "");
      }

      /* ------------------------------------------------
         🧭 Step 4: Horoscope Details
      ------------------------------------------------ */
      add("moonSign", f.moonSign);
      add("star", f.star);
      add("gothra", f.gothra);
      add("manglik", f.manglik);
      add("shani", f.shani);
      add("placeOfShani", f.placeOfShani);
      add("horoscopeMatch", f.horoscopeMatch);
      add("parigarasevai", f.parigarasevai);
      add("sevai", f.sevai);
      add("raghu", f.raghu);
      add("keethu", f.keethu);
      add("birthHour", f.birthHour);
      add("birthMinute", f.birthMinute);
      add("birthSecond", f.birthSecond);
      add("ampm", f.ampm);
      add("placeOfBirth", f.placeOfBirth);
      add("countryOfBirth", f.countryOfBirth);

      /* ------------------------------------------------
         🏠 Step 5: Contact Details (✅ corrected)
      ------------------------------------------------ */
      add("country", f.country);
      add("state", f.state);
      add("district", f.district);
      add("city", f.city);
      add("pincode", f.pincode);
      add("residence", f.residence);
      add("address", f.address);
      add("altPhone", f.altPhone);
      add("mobile", f.mobile);
      add("whatsapp", f.whatsapp);
      add("convenientTime", f.convenientTime);

      /* ------------------------------------------------
         🎓 Step 6: Education & Occupation
      ------------------------------------------------ */
      add("education", f.education);
      add("occupation", f.occupation);
      add("educationDetails", f.educationDetails);
      add("occupationDetails", f.occupationDetails);
      add("annualIncome", f.annualIncome);
      add("incomeType", f.incomeType);
      add("otherIncome", f.otherIncome);
      add("employedIn", f.employedIn);
      add("workingHours", f.workingHours);
      add("companyName", f.companyName); 
      add("workingLocation", f.workingLocation);

      /* ------------------------------------------------
         💪 Step 7: Physical Details & Hobbies
      ------------------------------------------------ */
      add("heightText", f.heightText);
      add("weight", f.weight);
      add("bloodGroup", f.bloodGroup);
      add("complexion", f.complexion);
      add("bodyType", f.bodyType);
      add("diet", f.diet);
      add("smoke", f.smoke);
      add("drink", f.drink);
      add("specialCases", f.specialCases);
      add("hobbies", f.hobbies);
      add("interests", f.interests);
      add("otherHobbies", f.otherHobbies);
      add("otherInterests", f.otherInterests);
      add("achievement", f.achievement);
      add("medicalHistory", f.medicalHistory);
      add("passport", f.passport);

      /* ------------------------------------------------
         👨‍👩‍👧 Step 8: Family Details
      ------------------------------------------------ */
      add("familyValues", f.familyValues);
      add("familyType", f.familyType);
      add("familyStatus", f.familyStatus);
      add("motherTongue", f.motherTongue);
      add("noOfBrothers", f.noOfBrothers);
      add("noOfBrothersMarried", f.noOfBrothersMarried);
      add("noOfSisters", f.noOfSisters);
      add("noOfSistersMarried", f.noOfSistersMarried);
      add("fatherName", f.fatherName);
      add("fatherOccupation", f.fatherOccupation);
      add("motherName", f.motherName);
      add("motherOccupation", f.motherOccupation);
      add("parentsStay", f.parentsStay);
      add("familyWealth", f.familyWealth);
      add("familyDescription", f.familyDescription);
      add("familyMedicalHistory", f.familyMedicalHistory);

      /* ------------------------------------------------
         📸 Step 9: Photo Upload
      ------------------------------------------------ */
      if (f.photo && typeof f.photo === "object") fd.append("photo", f.photo);

      /* ------------------------------------------------
         ❤️ Step 10: Partner Preferences (✅ corrected)
      ------------------------------------------------ */

      if (Array.isArray(f.maritalStatus))
        add("partner_maritalStatus", f.maritalStatus.join(","));
      add("partner_ageFrom", f.ageFrom);
      add("partner_ageTo", f.ageTo);
      add("partner_heightFrom", f.heightFrom);
      add("partner_heightTo", f.heightTo);
      add("partner_religion", f.religion);
      add("partner_caste", f.caste);
      add("partner_complexion", f.complexion);
      add("partner_residencyStatus", f.residencyStatus);
      add("partner_country", f.country);
      add("partner_state", f.state);
      add("partner_city", f.city);
      add("partner_education", f.education);
      add("partner_occupation", f.occupation);
      add("partnerExpectations", f.partnerExpectations);

      /* ------------------------------------------------
         💳 Step 11: Payment Plan
      ------------------------------------------------ */
      add("plan", f.plan ? f.plan : "basic");
      add("paymentDone", f.paymentDone ? "1" : "0");

      /* ------------------------------------------------
         🗂️ File Upload (optional horoscope file)
      ------------------------------------------------ */
      if (f.horoscopeFile && typeof f.horoscopeFile === "object")
        fd.append("horoscopeFile", f.horoscopeFile);

      console.log("✅ Final submit payload:", Object.fromEntries(fd.entries()));

      /* ------------------------------------------------
         🚀 Submit to backend
      ------------------------------------------------ */
      const res = await axios.post(
        "http://localhost:5000/api/register/complete",
        fd
      );

      localStorage.removeItem("multiStepRegistration_form_v1");
      alert(`🎉 Registration Complete! Matri ID: ${res.data.matriId || "—"}`);
      navigate("/login");
    } catch (err) {
      console.error("❌ Submit Error:", err?.response?.data || err);
      alert(
        "❌ Error submitting form!\n" +
          (err?.response?.data?.sql || err?.message || "")
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-rose-50 to-rose-100">
      <div className="max-w-lg w-full mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200 text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
          Step 13: Submit Registration
        </h3>
        <p className="text-gray-600 mb-8">
          Please verify all your entered information before submission.
        </p>

        <div className="flex justify-center gap-6">
          <button
            onClick={() => prevStep()}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
          >
            ← Back
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-gradient-to-r from-pink-600 to-yellow-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            ✅ Submit Form
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          ⚠️ Once submitted, please wait for confirmation. Do not refresh the
          page.
        </p>
      </div>
    </div>
  );
}
