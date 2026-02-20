// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// export default function EditPhoto({ adminMode = false }) {
//   const [email, setEmail] = useState("");
//   const [matriId, setMatriId] = useState("");
//   const [preview, setPreview] = useState(null);
//   const [photo, setPhoto] = useState(null);

//   const navigate = useNavigate();
//   const params = useParams();

//   /* ---------------- FETCH ---------------- */
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // 🟣 ADMIN
//         if (adminMode && params.matriId) {
//           const res = await axios.get(
//             `${process.env.REACT_APP_API_BASE}/api/admin/profile/${params.matriId}`,
//           );

//           if (res.data.success) {
//             const user = res.data.user;

//             setMatriId(user.MatriID);

//             if (user.Photo1 && user.Photo1 !== "nophoto.jpg") {
//               setPreview(
//                 `${process.env.REACT_APP_API_BASE}/gallery/${user.Photo1}`,
//               );
//             }
//           }
//         }

//         // 🟢 USER
//         else {
//           const user = JSON.parse(localStorage.getItem("userData"));
//           if (!user) return;

//           setEmail(user.ConfirmEmail);

//           if (user.Photo1 && user.Photo1 !== "nophoto.jpg") {
//             setPreview(
//               `${process.env.REACT_APP_API_BASE}/gallery/${user.Photo1}`,
//             );
//           }
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchData();
//   }, [adminMode, params.matriId]);

//   /* ---------------- CHANGE ---------------- */
//   const handleChange = (e) => {
//     const file = e.target.files[0];
//     setPhoto(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   /* ---------------- SUBMIT ---------------- */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!photo) {
//       alert("Please select a photo.");
//       return;
//     }

//     const fd = new FormData();

//     if (adminMode) {
//       fd.append("matriId", matriId);
//     } else {
//       fd.append("ConfirmEmail", email);
//     }

//     fd.append("photo1", photo);

//     try {
//       const res = await axios.put(
//         `${process.env.REACT_APP_API_BASE}/api/auth/update/photo1`,
//         fd,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         },
//       );

//       if (res.data.success) {
//         alert("Profile photo updated!");

//         if (adminMode) {
//           navigate(`/admin/profile/${matriId}`);
//         } else {
//           navigate("/profile");
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Upload failed");
//     }
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="min-h-screen bg-[#FFF4E0] font-display flex items-center justify-center p-6">
//       <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-10 border border-gray-200 mt-20">
//         <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
//           Edit Profile Photo
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleChange}
//             className="w-full border p-3 rounded-lg"
//           />

//           {preview && (
//             <img
//               src={preview}
//               className="w-56 h-56 object-cover rounded-xl mx-auto"
//               alt="preview"
//             />
//           )}

//           <button className="w-full py-3 bg-pink-600 text-white rounded-lg">
//             Save Photo
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditPhoto({ adminMode = false }) {
  const [email, setEmail] = useState("");
  const [matriId, setMatriId] = useState("");
  const [preview, setPreview] = useState(null);
  const [photo, setPhoto] = useState(null);

  const navigate = useNavigate();
  const params = useParams();

  // ✅ SAME API BASE FORMAT LIKE EditAbout
  const API_BASE = (process.env.REACT_APP_API_BASE || "").replace(/\/$/, "");

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🟣 ADMIN MODE
        if (adminMode && params.matriId) {
          const res = await axios.get(
            `${API_BASE}/api/admin/profile/${params.matriId}`,
          );

          if (res.data.success) {
            const user = res.data.user;

            setMatriId(user.MatriID);

            if (user.Photo1 && user.Photo1 !== "nophoto.jpg") {
              setPreview(`${API_BASE}/gallery/${user.Photo1}`);
            }
          }
        }

        // 🟢 USER MODE
        else {
          const user = JSON.parse(localStorage.getItem("userData"));
          if (!user) return;

          setEmail(user.ConfirmEmail || user.email);

          if (user.Photo1 && user.Photo1 !== "nophoto.jpg") {
            setPreview(`${API_BASE}/gallery/${user.Photo1}`);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [adminMode, params.matriId, API_BASE]);

  /* ---------------- CHANGE PHOTO ---------------- */
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      alert("Please select a photo.");
      return;
    }

    const fd = new FormData();

    // 🟣 ADMIN
    if (adminMode) {
      fd.append("matriId", matriId);
    }

    // 🟢 USER
    else {
      fd.append("ConfirmEmail", email);
    }

    fd.append("photo1", photo);

    try {
      const res = await axios.put(`${API_BASE}/api/auth/update/photo1`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        alert("Profile photo updated!");

        // 🔁 Redirect
        if (adminMode) {
          navigate(`/admin/profile/${matriId}`);
        } else {
          navigate("/profile");
        }
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Upload failed");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-[#FFF4E0] font-display flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-10 border border-gray-200 mt-20">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Edit Profile Photo
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* FILE INPUT */}
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          {/* PREVIEW */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-56 h-56 object-cover rounded-xl mx-auto border"
            />
          )}

          {/* BUTTON */}
          <button className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white text-lg rounded-lg font-semibold shadow-md transition-all">
            Save Photo
          </button>
        </form>
      </div>
    </div>
  );
}