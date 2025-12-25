// import React, { useState } from "react";
// import axios from "axios";

// const AdminFeaturedProfiles = () => {
//   const [matriId, setMatriId] = useState("");
//   const [msg, setMsg] = useState("");

//   const addFeatured = async () => {
//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/admin/featured-profile",
//         { matriId }
//       );

//       setMsg(res.data.message);
//       setMatriId("");
//     } catch (err) {
//       setMsg(err.response?.data?.error || "Error");
//     }
//   };

//   return (
//     <div className="p-6 max-w-md">
//       <h2 className="text-xl font-bold mb-4">Add Featured Profile</h2>

//       <input
//         type="text"
//         placeholder="Enter Matri ID"
//         value={matriId}
//         onChange={(e) => setMatriId(e.target.value)}
//         className="border p-2 w-full mb-3"
//       />

//       <button
//         onClick={addFeatured}
//         className="bg-pink-600 text-white px-4 py-2 rounded"
//       >
//         Add
//       </button>

//       {msg && <p className="mt-2">{msg}</p>}
//     </div>
//   );
// };

// export default AdminFeaturedProfiles;



import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const AdminFeaturedProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [newId, setNewId] = useState("");
  const [editId, setEditId] = useState(null);
  const [editMatri, setEditMatri] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isAdmin = currentUser?.role === 'admin';

  const API = (process.env.REACT_APP_API_BASE || "") + "/api/admin/featured-profiles";

const loadProfiles = useCallback(() => {
  axios
    .get(API)
    .then((res) => {
      setProfiles(res.data.profiles); // ✅ FIX
    })
    .catch(console.error);
}, [API]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const addProfile = async () => {
    await axios.post(API, { matriId: newId });
    setNewId("");
    loadProfiles();
  };

  const deleteProfile = async (id) => {
    await axios.delete(`${API}/${id}`);
    loadProfiles();
  };

  const updateProfile = async (id) => {
    await axios.put(`${API}/${id}`, { matriId: editMatri });
    setEditId(null);
    setEditMatri("");
    loadProfiles();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Featured Profiles</h2>

      {/* ADD */}
      <div className="flex gap-2 mb-6">
        <input
          value={newId}
          onChange={(e) => setNewId(e.target.value)}
          placeholder="Enter MatriID"
          className="border p-2"
        />
        <button
          onClick={addProfile}
          className="bg-pink-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* LIST */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Photo</th>
            <th>MatriID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Occupation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((p) => (
            <tr key={p.id} className="text-center border-t">
              <td>
                <img
                  src={p.PhotoURL}
                  alt=""
                  className="w-12 h-12 mx-auto rounded-full"
                />
              </td>

              <td>
                {editId !== null && editId === p.id ? (
                  <input
                    value={editMatri}
                    onChange={(e) => setEditMatri(e.target.value)}
                    className="border p-1"
                  />
                ) : (
                  p.MatriID
                )}
              </td>

              <td>{p.Name}</td>
              <td>{p.Age}</td>
              <td>{p.Occupation}</td>

              <td className="space-x-2">
                {editId === p.id ? (
                  <button
                    onClick={() => updateProfile(p.id)}
                    className="text-green-600"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditId(p.id);
                      setEditMatri(p.MatriID);
                    }}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                )}

                {isAdmin && (
                  <button
                    onClick={() => deleteProfile(p.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminFeaturedProfiles;
