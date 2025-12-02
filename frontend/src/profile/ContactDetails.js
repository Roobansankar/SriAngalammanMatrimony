// src/profile/ContactDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ContactDetails() {
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

  // Field mappings & fallbacks (best-effort)
  const country = user.Country || user.POC || "-";
  const state = user.State || "-";
  const district = user.Dist || user.District || "-";
  const city = user.City || "-";
  const pincode = user.Pincode || user.pin || "-";
  const residenceIn = user.Residencystatus || user.ResidenceIn || "-";
  const address = user.Address || user.condidaddress || "-";
  const alternatePhone =
    user.Mobile2 || user.Phone || user.AlternatePhone || "-";
  const mobile = user.Mobile || user.MobileNumber || "-";
  const whatsapp = user.Whatsapp || user.WA || user.whatsapp || mobile || "-";
  const convenientTime =
    user.calling_time || user.callingTime || user.working_hours || "-";

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-display">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-20">
        <h2 className="text-2xl font-bold mb-4">Contact Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <LabelValue label="Country" value={country} />
          <LabelValue label="State" value={state} />
          <LabelValue label="District" value={district} />
          <LabelValue label="City" value={city} />
          <LabelValue label="Pincode" value={pincode} />
          <LabelValue label="Residence In" value={residenceIn} />
          <LabelValue label="Address" value={address} />
          <LabelValue label="Alternate Phone" value={alternatePhone} />
          <LabelValue label="Mobile" value={mobile} />
          <LabelValue label="WhatsApp No." value={whatsapp} />
          <LabelValue label="Convenient Time to Call" value={convenientTime} />
        </div>

        {/* Optional: quick action buttons */}
        <div className="mt-6 flex gap-3">
          {mobile !== "-" && (
            <a
              className="px-4 py-2 rounded shadow bg-blue-600 text-white text-sm"
              href={`tel:${mobile}`}
            >
              Call Mobile
            </a>
          )}
          {whatsapp !== "-" && (
            <a
              className="px-4 py-2 rounded shadow bg-green-600 text-white text-sm"
              href={`https://wa.me/${String(whatsapp).replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
            >
              Open WhatsApp
            </a>
          )}
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
