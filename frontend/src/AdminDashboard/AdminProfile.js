import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AdminProfile() {
  const { matriId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE || ""}/api/admin/profile/${matriId}`)
      .then((res) => setUser(res.data.user))
      .catch((err) => console.error("Profile Load Error:", err));
  }, [matriId]);

  if (!user) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Profile: {user.MatriID}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Photo */}
        <div className="bg-white shadow rounded p-4">
          <img
            src={user.PhotoURL}
            className="w-full h-60 object-cover rounded"
            alt="profile"
          />
        </div>

        {/* Basic Info */}
        <div className="bg-white shadow rounded p-4 col-span-2">
          <h3 className="font-bold text-lg mb-3">Basic Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Name:</strong> {user.Name}
            </div>
            <div>
              <strong>Age:</strong> {user.Age}
            </div>
            <div>
              <strong>Gender:</strong> {user.Gender}
            </div>
            <div>
              <strong>Religion:</strong> {user.Religion}
            </div>
            <div>
              <strong>Caste:</strong> {user.Caste}
            </div>
            <div>
              <strong>Email:</strong> {user.ConfirmEmail}
            </div>
            <div>
              <strong>Mobile:</strong> {user.Mobile}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
