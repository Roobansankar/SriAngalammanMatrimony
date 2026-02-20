import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export default function EditAbout({ adminMode = false }) {
  const [about, setAbout] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const API_BASE = (process.env.REACT_APP_API_BASE || "").replace(/\/$/, "");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (data) {
      setAbout(data.aboutus || "");
      setEmail(data.ConfirmEmail || data.email || "");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      // 🟣 ADMIN MODE
      if (adminMode) {
        res = await axios.put(
          `${API_BASE}/api/auth/update/about`,
          {
            matriId: params.matriId,
            aboutus: about,
          },
        );
      }

      // 🟢 USER MODE
      else {
        res = await axios.put(
          `${API_BASE}/api/auth/update/about`,
          {
            email,
            aboutus: about,
          },
        );
      }

      if (res.data.success) {
        alert("About updated successfully!");

        // 🔁 Redirect properly
        if (adminMode) {
          navigate(`/admin/profile/${params.matriId}`);
        } else {
          navigate("/profile");
        }
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-6 bg-[#FFF4E0] font-display">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-10 border border-gray-200 mt-10">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Edit About Me
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Write About Yourself
            </label>

            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows="7"
              className="w-full border border-gray-300 p-4 rounded-lg resize-none focus:ring-2 focus:ring-pink-500 focus:outline-none mt-1"
              placeholder="Describe your personality, hobbies, goals, and values..."
            />
          </div>

          <button className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white text-lg rounded-lg font-semibold shadow-md transition-all">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
