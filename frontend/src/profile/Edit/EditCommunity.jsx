// import axios from "axios";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { API } from "../../config/api";

// const API_BASE = API;

// export default function EditCommunity({ adminMode = false }) {
//   const user = JSON.parse(localStorage.getItem("userData"));
//   const [file, setFile] = useState(null);
//   const navigate = useNavigate();

//   const handleUpload = async (e) => {
//     e.preventDefault();

//     if (!file) return alert("Select image");

//     const formData = new FormData();
//     formData.append("matriId", user.MatriID);
//     formData.append("certificate", file);

//     const res = await axios.post(`${API_BASE}/community/upload`, formData);

//     if (res.data.success) {
//       alert("Uploaded successfully");
//       navigate("/profile");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center mt-22">
//       <form onSubmit={handleUpload} className="bg-white p-6 shadow rounded">
//         <h2 className="text-xl font-bold mb-4">Upload Community Certificate</h2>

//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setFile(e.target.files[0])}
//         />

//         <button className="mt-4 px-4 py-2 bg-pink-600 text-white rounded">
//           Upload
//         </button>
//       </form>
//     </div>
//   );
// }

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { API } from "../../config/api";
import { apiUrl } from "../../config/api";

// const API_BASE = API.replace(/\/$/, "");

export default function EditCommunity({ adminMode = false }) {
  const [file, setFile] = useState(null);
  const [matriId, setMatriId] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  // ✅ Load user data
  useEffect(() => {
    if (adminMode) {
      setMatriId(params.matriId);
    } else {
      const data = JSON.parse(localStorage.getItem("userData"));
      if (data) {
        setMatriId(data.MatriID);
      }
    }
  }, [adminMode, params.matriId]);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return alert("Please select an image");

    try {
      const formData = new FormData();
      formData.append("matriId", matriId);
      formData.append("certificate", file);

      // const res = await axios.post(`${API_BASE}/community/upload`, formData);
      // const res = await axios.post(`${API_BASE}/api/community/upload`, formData);
      const res = await axios.post(apiUrl("/community/upload"), formData);

      if (res.data.success) {
        alert("Community Certificate Updated Successfully!");

        // 🔁 Redirect properly
        if (adminMode) {
          navigate(`/admin/profile/${matriId}`);
        } else {
          navigate("/profile");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FFF4E0] font-display">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-10 border border-gray-200 mt-20">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Edit Community Certificate
        </h1>

        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Upload Certificate Image
            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none mt-2"
            />

            <p className="text-xs text-gray-500 mt-2">
              Only JPG, PNG, WEBP images allowed. PDF not supported.
            </p>
          </div>

          <button className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white text-lg rounded-lg font-semibold shadow-md transition-all">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}