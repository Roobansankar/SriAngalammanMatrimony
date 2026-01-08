
// import axios from "axios";
// import { useCallback, useEffect, useState } from "react";

// const AdminFeaturedProfiles = () => {
//   const [profiles, setProfiles] = useState([]);
//   const [newId, setNewId] = useState("");
//   const [editId, setEditId] = useState(null);
//   const [editMatri, setEditMatri] = useState("");

//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const isAdmin = currentUser?.role === 'admin';

//   const API = (process.env.REACT_APP_API_BASE || "") + "/api/admin/featured-profiles";

// const loadProfiles = useCallback(() => {
//   axios
//     .get(API)
//     .then((res) => {
//       setProfiles(res.data.profiles); // ✅ FIX
//     })
//     .catch(console.error);
// }, [API]);

//   useEffect(() => {
//     loadProfiles();
//   }, [loadProfiles]);

//   const addProfile = async () => {
//     await axios.post(API, { matriId: newId });
//     setNewId("");
//     loadProfiles();
//   };

//   const deleteProfile = async (id) => {
//     await axios.delete(`${API}/${id}`);
//     loadProfiles();
//   };

//   const updateProfile = async (id) => {
//     await axios.put(`${API}/${id}`, { matriId: editMatri });
//     setEditId(null);
//     setEditMatri("");
//     loadProfiles();
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Featured Profiles</h2>

//       {/* ADD */}
//       <div className="flex gap-2 mb-6">
//         <input
//           value={newId}
//           onChange={(e) => setNewId(e.target.value)}
//           placeholder="Enter MatriID"
//           className="border p-2"
//         />
//         <button
//           onClick={addProfile}
//           className="bg-pink-600 text-white px-4 rounded"
//         >
//           Add
//         </button>
//       </div>

//       {/* LIST */}
//       <table className="w-full border">
//         <thead>
//           <tr className="bg-gray-100">
//             <th>Photo</th>
//             <th>MatriID</th>
//             <th>Name</th>
//             <th>Age</th>
//             <th>Occupation</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {profiles.map((p) => (
//             <tr key={p.id} className="text-center border-t">
//               <td>
//                 <img
//                   src={p.PhotoURL}
//                   alt=""
//                   className="w-12 h-12 mx-auto rounded-full"
//                 />
//               </td>

//               <td>
//                 {editId !== null && editId === p.id ? (
//                   <input
//                     value={editMatri}
//                     onChange={(e) => setEditMatri(e.target.value)}
//                     className="border p-1"
//                   />
//                 ) : (
//                   p.MatriID
//                 )}
//               </td>

//               <td>{p.Name}</td>
//               <td>{p.Age}</td>
//               <td>{p.Occupation}</td>

//               <td className="space-x-2">
//                 {editId === p.id ? (
//                   <button
//                     onClick={() => updateProfile(p.id)}
//                     className="text-green-600"
//                   >
//                     Save
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => {
//                       setEditId(p.id);
//                       setEditMatri(p.MatriID);
//                     }}
//                     className="text-blue-600"
//                   >
//                     Edit
//                   </button>
//                 )}

//                 {isAdmin && (
//                   <button
//                     onClick={() => deleteProfile(p.id)}
//                     className="text-red-600"
//                   >
//                     Delete
//                   </button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminFeaturedProfiles;




import { useCallback, useEffect, useState } from "react";
import { Trash2, Edit2, Check, X, Plus, User, Briefcase, Calendar } from "lucide-react";

const AdminFeaturedProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [newId, setNewId] = useState("");
  const [editId, setEditId] = useState(null);
  const [editMatri, setEditMatri] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Safely parse currentUser from localStorage
  const getCurrentUser = () => {
    try {
      const user = localStorage.getItem("currentUser");
      return user ? JSON.parse(user) : {};
    } catch (err) {
      console.error("Error parsing currentUser:", err);
      return {};
    }
  };

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  const API = (process.env.REACT_APP_API_BASE || "") + "/api/admin/featured-profiles";

  // Get auth token if stored separately
  const getAuthToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("authToken");
  };

  // Create fetch options with proper authentication
  const getFetchOptions = (method = 'GET', body = null) => {
    const options = {
      method,
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      }
    };

    // Add authorization token if it exists
    const token = getAuthToken();
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    // Add body if provided
    if (body) {
      options.body = JSON.stringify(body);
    }

    return options;
  };

  const loadProfiles = useCallback(() => {
    setLoading(true);
    setError("");
    
    fetch(API, getFetchOptions('GET'))
      .then(res => {
        console.log('Response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('API Response:', data);
        // Handle both {profiles: [...]} and direct array responses
        if (Array.isArray(data)) {
          setProfiles(data);
        } else if (data.profiles && Array.isArray(data.profiles)) {
          setProfiles(data.profiles);
        } else {
          console.warn('Unexpected data format:', data);
          setProfiles([]);
        }
      })
      .catch((err) => {
        setError("Failed to load profiles: " + err.message);
        console.error('Load profiles error:', err);
        setProfiles([]);
      })
      .finally(() => setLoading(false));
  }, [API]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const addProfile = async () => {
    if (!newId.trim()) {
      setError("Please enter a MatriID");
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(API, getFetchOptions('POST', { matriId: newId }));
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add profile');
      }
      
      setNewId("");
      showSuccess("Profile added successfully!");
      loadProfiles();
    } catch (err) {
      setError(err.message || "Failed to add profile");
      setTimeout(() => setError(""), 3000);
      console.error('Add profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async (id) => {
    if (!window.confirm("Are you sure you want to delete this profile?")) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API}/${id}`, getFetchOptions('DELETE'));
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete profile');
      }
      
      showSuccess("Profile deleted successfully!");
      loadProfiles();
    } catch (err) {
      setError(err.message || "Failed to delete profile");
      setTimeout(() => setError(""), 3000);
      console.error('Delete profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (id) => {
    if (!editMatri.trim()) {
      setError("MatriID cannot be empty");
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${API}/${id}`, getFetchOptions('PUT', { matriId: editMatri }));
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      setEditId(null);
      setEditMatri("");
      showSuccess("Profile updated successfully!");
      loadProfiles();
    } catch (err) {
      setError(err.message || "Failed to update profile");
      setTimeout(() => setError(""), 3000);
      console.error('Update profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditMatri("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-3 rounded-xl">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Featured Profiles</h2>
              <p className="text-gray-500 text-sm">Manage highlighted matrimonial profiles</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-center gap-2">
            <X className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button 
              onClick={() => setError("")} 
              className="ml-auto hover:bg-red-100 p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg flex items-center gap-2">
            <Check className="w-5 h-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Add Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-pink-500" />
            Add New Featured Profile
          </h3>
          <div className="flex gap-3">
            <input
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              placeholder="Enter MatriID (e.g., MAT12345)"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              onKeyPress={(e) => e.key === 'Enter' && !loading && addProfile()}
              disabled={loading}
            />
            <button
              onClick={addProfile}
              disabled={loading}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Profile
            </button>
          </div>
        </div>

        {/* Profiles Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading && profiles.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-20">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No featured profiles yet</p>
              <p className="text-gray-400 text-sm">Add your first profile above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-pink-50 to-purple-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Photo</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">MatriID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Occupation</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {profiles.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="relative w-12 h-12">
                          <img
                            src={p.PhotoURL || "https://via.placeholder.com/48"}
                            alt={p.Name || 'Profile'}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-100"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/48";
                            }}
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {editId === p.id ? (
                          <input
                            value={editMatri}
                            onChange={(e) => setEditMatri(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-32"
                            disabled={loading}
                          />
                        ) : (
                          <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-lg text-gray-700">
                            {p.MatriID || 'N/A'}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-800">{p.Name || 'Unknown'}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{p.Age || 'N/A'} yrs</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{p.Occupation || 'Not specified'}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {editId === p.id ? (
                            <>
                              <button
                                onClick={() => updateProfile(p.id)}
                                disabled={loading}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Save"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                disabled={loading}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                                title="Cancel"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditId(p.id);
                                  setEditMatri(p.MatriID || '');
                                }}
                                disabled={loading}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Edit"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              {isAdmin && (
                                <button
                                  onClick={() => deleteProfile(p.id)}
                                  disabled={loading}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Delete"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Total Featured Profiles: <span className="font-semibold text-gray-800">{profiles.length}</span>
            </div>
            <div className="text-xs text-gray-400">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFeaturedProfiles;