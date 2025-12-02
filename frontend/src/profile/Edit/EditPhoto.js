import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EditPhoto() {
  const [email, setEmail] = useState("");
  const [preview, setPreview] = useState(null);
  const [photo, setPhoto] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (!user) return;

    setEmail(user.ConfirmEmail);

    if (user.Photo1 && user.Photo1 !== "nophoto.jpg") {
      setPreview(`http://localhost:5000/gallery/${user.Photo1}`);
    }
  }, []);

  const handleChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      alert("Please select a photo.");
      return;
    }

    const fd = new FormData();
    fd.append("ConfirmEmail", email);
    fd.append("photo1", photo);

    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/update/photo1",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        alert("Profile photo updated!");
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  // return (
  //   <div className="p-6 max-w-xl mx-auto">
  //     <h1 className="text-2xl font-bold mt-20 mb-4">Edit Profile Photo</h1>

  //     <form onSubmit={handleSubmit} className="space-y-4">
  //       <input
  //         type="file"
  //         accept="image/*"
  //         className="w-full border p-2 rounded"
  //         onChange={handleChange}
  //       />

  //       {preview && (
  //         <img
  //           src={preview}
  //           alt="preview"
  //           className="w-40 mt-3 rounded border"
  //         />
  //       )}

  //       <button className="w-full bg-pink-600 text-white p-2 rounded">
  //         Save Photo
  //       </button>
  //     </form>
  //   </div>
  // );
return (
  <div className="min-h-screen bg-[#FFF4E0] font-display flex items-center justify-center p-6">
    <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-10 border border-gray-200 mt-20">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Edit Profile Photo
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload label */}
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Upload New Profile Photo
          </label>

          <input
            type="file"
            accept="image/*"
            className="w-full border border-gray-300 p-3 rounded-lg mt-1 bg-gray-50 focus:ring-2 focus:ring-pink-500"
            onChange={handleChange}
          />
        </div>

        {/* Image preview */}
        {preview && (
          <div className="flex justify-center">
            <img
              src={preview}
              alt="Preview"
              className="w-48 h-48 object-cover rounded-xl border shadow-md mt-3"
            />
          </div>
        )}

        {/* Save Button */}
        <button className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white text-lg rounded-lg font-semibold shadow-md transition-all">
          Save Photo
        </button>
      </form>
    </div>
  </div>
);

}
