// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// export default function AdminProfile() {
//   const { matriId } = useParams(); // 👈 get from URL
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchUser();
//   }, [matriId]);

//   const fetchUser = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.REACT_APP_API_BASE}/api/admin/profile/${matriId}`,
//       );

//       if (res.data.success) {
//         setUser(res.data.user);
//       }
//     } catch (err) {
//       console.error("Admin profile fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="p-8">Loading...</div>;
//   if (!user) return <div className="p-8">User not found</div>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">
//         {user.Name} ({user.MatriID})
//       </h1>

//       <div className="grid grid-cols-2 gap-4">
//         <p>
//           <b>Email:</b> {user.Email}
//         </p>
//         <p>
//           <b>Mobile:</b> {user.Mobile}
//         </p>
//         <p>
//           <b>Gender:</b> {user.Gender}
//         </p>
//         <p>
//           <b>Religion:</b> {user.Religion}
//         </p>
//       </div>
//     </div>
//   );
// }


import { useParams } from "react-router-dom";
import ProfilePage from "../component/ProfilePage";


export default function AdminProfile() {
  const { matriId } = useParams();

  return <ProfilePage adminMode={true} adminMatriId={matriId} />  ;
}
