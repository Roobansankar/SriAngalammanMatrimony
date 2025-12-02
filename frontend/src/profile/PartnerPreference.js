// src/profile/PartnerPreference.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PartnerPreference() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("loggedInEmail");
    if (!email) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/user", {
          params: { email },
        });

        if (res.data?.success && res.data.user) {
          setUser(res.data.user);
          localStorage.setItem("userData", JSON.stringify(res.data.user));
        } else {
          localStorage.removeItem("loggedInEmail");
          navigate("/login");
        }
      } catch (err) {
        console.error("fetch user error", err);
        setError("Unable to fetch profile");
        localStorage.removeItem("loggedInEmail");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!user) return <div className="p-6">No user found</div>;

  // --- Field mappings (using exact MySQL column names where available) ---
  // Marital status preference — table does not have explicit PE_MaritalStatus,
  // try sensible fallbacks: PE_HaveChildren, Looking, or user's Maritalstatus.
  const maritalStatusPref =
    user.PE_MaritalStatus ||
    user.PE_HaveChildren ||
    user.Looking ||
    user.Maritalstatus ||
    "-";

  const ageFrom = user.PE_FromAge || "-";
  const ageTo = user.PE_ToAge || "-";

  const heightFrom = user.PE_from_Height || user.PE_Height2 || "-";
  const heightTo = user.PE_to_Height || "-";

  const religionPref = user.PE_Religion || "-";
  const castePref = user.PE_Caste || user.PE_subcaste || "-";
  const complexionPref = user.PE_Complexion || "-";

  const residencyStatusPref =
    user.PE_Residentstatus || user.PE_ResidentStatus || "-";
  const countryPref =
    user.PE_Countrylivingin || user.PE_Country || user.PE_Countryliving || "-";
  const statePref = user.PE_State || user.PE_State || "-";
  // DB doesn't have PE_City column in provided schema — fallback to PE_State or '-'
  const cityPref = user.PE_City || "-";

  const educationPref = user.PE_Education || "-";
  // occupation preference can be in PE_Occupation or PE_Occupation column (exists)
  const occupationPref =
    user.PE_Occupation || user.PE_Occuption || user.PE_Occupation || "-";

  // partner expectations text (long)
  const partnerExpectations =
    user.PartnerExpectations || user.PartnerExpectations_new || "-";

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-display">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-20">
        <h2 className="text-2xl font-bold mb-4">Partner Preference</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <LabelValue
            label="Marital Status (preferred)"
            value={maritalStatusPref}
          />
          <LabelValue label="Age From" value={ageFrom} />
          <LabelValue label="Age To" value={ageTo} />
          <LabelValue label="Height From" value={heightFrom} />
          <LabelValue label="Height To" value={heightTo} />
          <LabelValue label="Religion" value={religionPref} />
          <LabelValue label="Caste" value={castePref} />
          <LabelValue label="Complexion" value={complexionPref} />
          <LabelValue label="Residency Status" value={residencyStatusPref} />
          <LabelValue label="Country (preferred)" value={countryPref} />
          <LabelValue label="State (preferred)" value={statePref} />
          <LabelValue label="City (preferred)" value={cityPref} />
          <LabelValue label="Education (preferred)" value={educationPref} />
          <LabelValue label="Occupation (preferred)" value={occupationPref} />
          <div className="col-span-1 sm:col-span-2 border p-3 rounded">
            <div className="text-xs text-gray-500">Partner Expectations</div>
            <div className="text-sm font-medium break-words">
              {partnerExpectations}
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <strong>Notes:</strong>
          <ul className="list-disc ml-5 mt-2">
            <li>
              This component maps directly to your MySQL columns where present
              (e.g.
              <code>PE_FromAge</code>, <code>PE_ToAge</code>,{" "}
              <code>PE_Religion</code>, <code>PE_Education</code>,{" "}
              <code>PartnerExpectations</code>).
            </li>
            <li>
              The database schema you provided doesn't include an explicit{" "}
              <code>PE_City</code> column; I left City as a fallback field. If
              your table uses a different column for partner-city (or you want
              to store a list), tell me the exact column name and I'll map it.
            </li>
            <li>
              If you want the numerical height fields converted to a
              human-friendly format (e.g. centimeters → "5'8\" / 173 cm"), I can
              add that conversion.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function LabelValue({ label, value }) {
  return (
    <div className="border p-3 rounded">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium break-words">{value ?? "-"}</div>
    </div>
  );
}
