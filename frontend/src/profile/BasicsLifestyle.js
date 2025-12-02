// src/profile/BasicsLifestyle.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BasicsLifestyle() {
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

  // Field mappings & sensible fallbacks
  const height = user.Height ?? user.Heightcm ?? "-";
  const weight = user.Weight ?? "-";
  const bloodGroup = user.BloodGroup || user.bloodgroup || "-";
  const complexion = user.Complexion || user.complexion || "-";
  const bodyType = user.Bodytype || user.bodytype || "-";
  const diet = user.Diet || "-";
  const smoke = user.Smoke;
  const drink = user.Drink;
  const specialCases =
    user.spe_cases || user.spe_reason || user.SpecialCases || "-";
  const hobbies = user.Hobbies || "-";
  const otherHobbies = user.OtherHobbies || user.other_hobbies || "-";
  const interests = user.Interests || "-";
  const otherInterests = user.OtherInterests || user.other_interests || "-";
  const achievement = user.achievement || user.AnyAchievement || "-";
  const medicalHistory = user.medicalhistory || user.MedicalHistory || "-";
  const passport =
    typeof user.passport !== "undefined" ? String(user.passport) : "-";
  const cardType = user.cardtype || user.CardType || "-";

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-display">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-20">
        <h2 className="text-2xl font-bold mb-4">Basics & Lifestyle</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <LabelValue label="Height" value={height} />
          <LabelValue label="Weight" value={weight} />
          <LabelValue label="Blood Group" value={bloodGroup} />
          <LabelValue label="Complexion" value={complexion} />
          <LabelValue label="Body Type" value={bodyType} />
          <LabelValue label="Diet" value={diet} />
          <LabelValue label="Smoke" value={smoke} />
          <LabelValue label="Drink" value={drink} />
          <LabelValue label="Special Cases" value={specialCases} />
          <LabelValue label="Hobbies" value={hobbies} />
          <LabelValue label="Other Hobbies" value={otherHobbies} />
          <LabelValue label="Interests" value={interests} />
          <LabelValue label="Other Interests" value={otherInterests} />
          <LabelValue label="Any Achievement" value={achievement} />
          <LabelValue label="Medical History" value={medicalHistory} />
          <LabelValue label="Passport" value={passport} />
          <LabelValue label="Card Type" value={cardType} />
        </div>

        <div className="mt-6 text-sm text-gray-600">
          Tip: If some values appear missing, tell me the exact MySQL column
          names and I’ll map them explicitly (I used common fallbacks like{" "}
          <code>spe_cases</code>, <code>OtherHobbies</code>,{" "}
          <code>occu_details</code>, etc. where applicable).
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
