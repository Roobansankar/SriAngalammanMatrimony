// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const API = "http://localhost:5000/api/admin";

// export default function MaleMembers() {
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios
//       .get(`${API}/male-members`)
//       .then((res) => {
//         if (res.data.success) {
//           setMembers(res.data.results);
//         }
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading)
//     return <div className="text-center p-10 text-lg">Loading...</div>;

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-5">Active Male Members</h2>

//       <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-100 text-gray-700">
//             <tr>
//               <th className="p-3 text-left">Profile ID</th>
//               <th className="p-3 text-left">Photo</th>
//               <th className="p-3 text-left">Name / Email</th>
//               <th className="p-3 text-left">Age</th>
//               <th className="p-3 text-left">Mobile</th>
//               <th className="p-3 text-left">Status</th>
//               <th className="p-3 text-left">Last Login</th>
//             </tr>
//           </thead>

//           <tbody>
//             {members.map((m, index) => (
//               <tr key={index} className="border-b hover:bg-gray-50 transition">
//                 {/* Profile ID Clickable */}
//                 <td className="p-3 font-medium text-blue-600">
//                   <Link to={`/admin/profile/${m.MatriID}`}>{m.MatriID}</Link>
//                 </td>

//                 <td className="p-3">
//                   <img
//                     src={m.PhotoURL}
//                     alt="photo"
//                     className="w-12 h-12 rounded object-cover border"
//                   />
//                 </td>

//                 <td className="p-3">
//                   <div className="font-semibold">{m.Name}</div>
//                   <div className="text-gray-500 text-xs">{m.Email}</div>
//                 </td>

//                 <td className="p-3">{m.Age}</td>

//                 <td className="p-3">{m.Mobile}</td>

//                 <td className="p-3">{m.Status}</td>

//                 <td className="p-3">{m.Lastlogin ?? "No Login"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://localhost:5000/api/admin";

export default function MaleMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const perPage = 10;

  const totalPages = Math.ceil(total / perPage);

  const fetchMembers = () => {
    setLoading(true);
    axios
      .get(`${API}/male-members?page=${page}`)
      .then((res) => {
        if (res.data.success) {
          setMembers(res.data.results);
          setTotal(res.data.total);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMembers();
  }, [page]);

  // SLIDING PAGINATION (show only 5 numbers)
  const getPageNumbers = () => {
    const maxButtons = 5;
    let start = Math.max(1, page - 2);
    let end = start + maxButtons - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading)
    return <div className="text-center p-10 text-lg">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-5">Active Male Members</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Profile ID</th>
              <th className="p-3 text-left">Photo</th>
              <th className="p-3 text-left">Name / Email</th>
              <th className="p-3 text-left">Age</th>
              <th className="p-3 text-left">Mobile</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Last Login</th>
            </tr>
          </thead>

          <tbody>
            {members.map((m, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 font-medium text-blue-600">
                  <Link to={`/admin/profile/${m.MatriID}`}>{m.MatriID}</Link>
                </td>

                <td className="p-3">
                  <img
                    src={m.PhotoURL}
                    alt="photo"
                    className="w-12 h-12 rounded object-cover border"
                  />
                </td>

                <td className="p-3">
                  <div className="font-semibold">{m.Name}</div>
                  <div className="text-gray-500 text-xs">{m.Email}</div>
                </td>

                <td className="p-3">{m.Age}</td>
                <td className="p-3">{m.Mobile}</td>
                <td className="p-3">{m.Status}</td>
                <td className="p-3">{m.Lastlogin ?? "No Login"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between mt-4">
        <p>
          Showing {(page - 1) * perPage + 1} to{" "}
          {Math.min(page * perPage, total)} of {total} entries
        </p>

        <div className="flex items-center space-x-2">
          {/* PREVIOUS */}
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ← Previous
          </button>

          {/* Dynamic Sliding Page Numbers */}
          {getPageNumbers().map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-3 py-1 border rounded ${
                page === num ? "bg-blue-600 text-white" : ""
              }`}
            >
              {num}
            </button>
          ))}

          {/* NEXT */}
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
