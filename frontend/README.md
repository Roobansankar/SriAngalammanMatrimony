# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

 <!--  -->

// src/profile/ProfileView.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ProfileView() {
const { matriid } = useParams();
const navigate = useNavigate();
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";
const FETCH_API = `${API}/api/auth/searchByMatriID`;

useEffect(() => {
if (!matriid) {
setError("No MatriID supplied");
setLoading(false);
return;
}

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(FETCH_API, { params: { matriid } });
        if (res.data?.success && res.data.user) {
          setUser(res.data.user);
        } else {
          setError("Profile not found");
        }
      } catch (err) {
        console.error("fetch profile error", err);
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

}, [matriid]);

const formatDOB = (dob) => {
if (!dob) return { day: "-", month: "-", year: "-" };
try {
const d = new Date(dob);
return {
day: d.getDate(),
month: d.toLocaleString(undefined, { month: "long" }),
year: d.getFullYear(),
};
} catch {
return { day: "-", month: "-", year: "-" };
}
};

const parseTimeOfBirth = (tob) => {
if (!tob) return { hh: "-", mm: "-", ss: "-", ap: "-" };
const cleaned = tob.replace(/\s+/g, "");
const parts = cleaned.split(":");
if (parts.length >= 3) {
const [hh, mm, rest] = parts;
let ss = "00";
let ap = "AM";
if (
rest.includes("AM") ||
rest.includes("PM") ||
rest.toUpperCase().includes("AM") ||
rest.toUpperCase().includes("PM")
) {
ss = rest.replace(/[^0-9]/g, "") || "00";
ap = rest.replace(/[^APMapm]/g, "").toUpperCase() || ap;
} else {
ss = rest;
}
return { hh, mm, ss, ap };
}
return { hh: "-", mm: "-", ss: "-", ap: "-" };
};

const photoSrc = (u) => u?.PhotoURL || `${API}/gallery/nophoto.jpg`;

const InfoRow = ({ label, value }) => (
<div className="flex flex-col">
<span className="text-sm text-gray-500">{label}</span>
<span className="font-medium text-[#333333]">{value ?? "-"}</span>
</div>
);

if (loading) return <div className="p-8">Loading profile...</div>;
if (error)
return (
<div className="p-8">
<div className="text-red-600 mb-4">{error}</div>
<button
className="px-4 py-2 bg-gray-200 rounded"
onClick={() => navigate(-1)} >
Back
</button>
</div>
);
if (!user) return <div className="p-8">No profile data</div>;

const dobParts = formatDOB(user.DOB || user.Regdate);
const tob = parseTimeOfBirth(user.TOB);

const primary = "#ec1380";

return (
<div className="min-h-screen bg-[#f8f6f7] text-[#333333] p-6 font-display">
<div className="max-w-[960px] mx-auto">
<div className="flex flex-col items-center gap-4 p-6">
<div
className="rounded-full border-4 border-white shadow-lg bg-center bg-cover"
style={{
              width: 128,
              height: 128,
              backgroundImage: `url(${photoSrc(user)})`,
            }}
aria-hidden
/>
<div className="text-center">
<h1 className="text-2xl font-bold text-[#181114]">{user.Name}</h1>
<div className="text-gray-500">
{user.MatriID || user.matid} &nbsp;•&nbsp; {user.Age || "-"},{" "}
{user.Gender || "-"} &nbsp;•&nbsp;{" "}
{user.City || user.workinglocation || "-"}
</div>
</div>

          {/* No edit button here - readonly view */}
        </div>

        {/* About Me */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold mb-2" style={{ color: "#181114" }}>
            About
          </h2>
          <p className="text-base leading-relaxed text-[#333333]">
            {user.Profile || user.Profile_new || user.aboutus || "-"}
          </p>
        </section>

        {/* The rest of the sections mirror your ProfilePage layout */}
        {/* Basic Details */}
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3">Basic Details</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <InfoRow label="Name" value={user.Name} />
              <InfoRow label="Matri ID" value={user.MatriID || user.matid} />
              <InfoRow label="Email" value={user.ConfirmEmail || user.email} />
              <InfoRow
                label="Profile Created By"
                value={user.Profilecreatedby}
              />
              <InfoRow label="Gender" value={user.Gender} />
              <InfoRow label="Date of Birth (Day)" value={dobParts.day} />
              <InfoRow label="Month" value={dobParts.month} />
              <InfoRow label="Year" value={dobParts.year} />
              <InfoRow
                label="Marital Status"
                value={user.Maritalstatus || user.maritalstatus}
              />
              <InfoRow label="Religion" value={user.Religion} />
              <InfoRow label="Caste" value={user.Caste} />
              <InfoRow
                label="Subcaste"
                value={user.Subcaste || user.sub_caste || "-"}
              />
              <InfoRow
                label="Mobile Number"
                value={user.Mobile || user.Phone}
              />
            </div>
          </div>
        </section>

        {/* Horoscope Details */}
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3">Horoscope Details</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow
                label="Moon Sign"
                value={user.Moonsign || user.moonsign}
              />
              <InfoRow label="Star" value={user.Star || user.star} />
              <InfoRow label="Gothra" value={user.Gothram} />
              <InfoRow label="Mangalik" value={user.Manglik} />
              <InfoRow label="Shani" value={user.shani || user.Shani || "-"} />
              <InfoRow
                label="Place of Shani"
                value={user.shaniplace || user.place || "-"}
              />
              <InfoRow label="Horoscope Match" value={user.Horosmatch} />
              <InfoRow
                label="Parigarasevai"
                value={user.parigarasevai || "-"}
              />
              <InfoRow label="Sevai" value={user.Sevai || "-"} />
              <InfoRow label="Raghu" value={user.Raghu || "-"} />
              <InfoRow label="Keethu" value={user.Keethu || "-"} />
              <InfoRow
                label="Place of Birth"
                value={user.POB || user.PlaceOfBirth || user.place_of_birth}
              />
              <InfoRow
                label="Country/Place"
                value={user.POC || user.Country || user.country}
              />

              <div className="col-span-1 sm:col-span-2">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Hour</span>
                    <div className="font-medium">{tob.hh}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Minute</span>
                    <div className="font-medium">{tob.mm}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Second / AM-PM
                    </span>
                    <div className="font-medium">
                      {tob.ss} {tob.ap}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <span className="text-sm text-gray-500">Horoscope Image</span>
                <div className="mt-2">
                  {user.horoscope ? (
                    <img
                      src={
                        user.horoscope.startsWith("http")
                          ? user.horoscope
                          : `${API}/gallery/${user.horoscope}`
                      }
                      alt="horoscope"
                      className="w-full max-w-[300px] object-contain rounded"
                    />
                  ) : (
                    <div className="text-gray-400">No horoscope uploaded</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact, Education, Lifestyle, Family, PartnerPref - similar to ProfilePage */}
        {/* Contact Details */}
        {/* <section className="mb-6">
          <h2 className="text-xl font-bold mb-3">Contact Details</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow label="Country" value={user.Country} />
              <InfoRow label="State" value={user.State} />
              <InfoRow label="District" value={user.Dist} />
              <InfoRow label="City" value={user.City} />
              <InfoRow label="Pincode" value={user.Pincode} />
              <InfoRow label="Residency Status" value={user.Residencystatus} />
              <InfoRow label="Address" value={user.Address} />
              <InfoRow label="Alternate Phone" value={user.Phone} />
              <InfoRow label="Mobile" value={user.Mobile} />
              <InfoRow label="WhatsApp" value={user.Mobile2 || user.whatsapp} />
              <InfoRow
                label="Convenient Time to Call"
                value={user.calling_time}
              />
            </div>
          </div>
        </section> */}

        {/* Education & Professional */}
        {/* <section className="mb-6">
          <h2 className="text-xl font-bold mb-3">Education & Professional</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="flex items-start gap-4">
              <span
                className="material-symbols-outlined text-primary mt-1"
                style={{ color: primary }}
              >
                school
              </span>
              <div>
                <div className="text-sm text-gray-500">
                  Education Qualification
                </div>
                <div className="font-medium">{user.Education}</div>
                <div className="text-sm text-gray-500">Education Details</div>
                <div className="font-medium">{user.EducationDetails}</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span
                className="material-symbols-outlined"
                style={{ color: primary }}
              >
                work
              </span>
              <div>
                <div className="text-sm text-gray-500">Occupation</div>
                <div className="font-medium">{user.Occupation}</div>
                <div className="text-sm text-gray-500">Occupation Details</div>
                <div className="font-medium">
                  {user.occu_details || user.OccupationDetails}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span
                className="material-symbols-outlined"
                style={{ color: primary }}
              >
                payments
              </span>
              <div>
                <div className="text-sm text-gray-500">Annual Income</div>
                <div className="font-medium">
                  {user.Annualincome
                    ? `${user.income_in || "Rs"} ${user.Annualincome}`
                    : "-"}
                </div>
                <div className="text-sm text-gray-500">Any Other Income</div>
                <div className="font-medium">{user.anyotherincome || "-"}</div>
                <div className="text-sm text-gray-500">Employed In</div>
                <div className="font-medium">{user.Employedin}</div>
                <div className="text-sm text-gray-500">Working Hours</div>
                <div className="font-medium">{user.working_hours}</div>
                <div className="text-sm text-gray-500">
                  Working Location / City
                </div>
                <div className="font-medium">{user.workinglocation}</div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Basic & Lifestyle */}
        {/* <section className="mb-6">
          <h2 className="text-xl font-bold mb-3">Basic & Lifestyle</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow
                label="Height"
                value={user.Height ? `${user.Height}` : "-"}
              />
              <InfoRow label="Weight" value={user.Weight} />
              <InfoRow label="Blood Group" value={user.BloodGroup} />
              <InfoRow label="Complexion" value={user.Complexion} />
              <InfoRow label="Body Type" value={user.Bodytype} />
              <InfoRow label="Diet" value={user.Diet} />
              <InfoRow label="Smoke" value={user.Smoke} />
              <InfoRow label="Drink" value={user.Drink} />
              <InfoRow label="Special Cases" value={user.spe_cases} />
              <InfoRow label="Hobbies" value={user.Hobbies} />
              <InfoRow label="Interests" value={user.Interests} />
              <InfoRow label="Passport" value={user.passport} />
            </div>
          </div>
        </section> */}

        {/* Family */}
        {/* <section className="mb-6">
          <h2 className="text-xl font-bold mb-3">Family Details</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow label="Family Values" value={user.Familyvalues} />
              <InfoRow label="Family Type" value={user.FamilyType} />
              <InfoRow label="Family Status" value={user.FamilyStatus} />
              <InfoRow label="Number of Brothers" value={user.noofbrothers} />
              <InfoRow label="Number of Sisters" value={user.noofsisters} />
              <InfoRow
                label="Brothers Married"
                value={user.noyubrothers || user.nbm}
              />
              <InfoRow
                label="Sisters Married"
                value={user.noyusisters || user.nsm}
              />
              <InfoRow label="Father Name" value={user.Fathername} />
              <InfoRow
                label="Father Occupation"
                value={user.Fathersoccupation}
              />
              <InfoRow label="Mother Name" value={user.Mothersname} />
              <InfoRow
                label="Mother Occupation"
                value={user.Mothersoccupation}
              />
              <InfoRow label="Family Wealth" value={user.family_wealth} />
              <InfoRow
                label="Mother Tongue"
                value={user.mother_tounge || user.Language}
              />
              <div className="col-span-1 sm:col-span-2">
                <span className="text-sm text-gray-500">About Family</span>
                <div className="font-medium">
                  {user.FamilyDetails || user.FamilyDetails_new || "-"}
                </div>
              </div>
              <InfoRow
                label="Family Medical History"
                value={user.familymedicalhistory}
              />
            </div>
          </div>
        </section> */}

        {/* Partner Preference */}
        {/* <section className="mb-12">
          <h2 className="text-xl font-bold mb-3">Partner Preference</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow label="Looking For" value={user.Looking} />
              <InfoRow label="Age From" value={user.PE_FromAge} />
              <InfoRow label="Age To" value={user.PE_ToAge} />
              <InfoRow label="Height From" value={user.PE_from_Height} />
              <InfoRow label="Height To" value={user.PE_to_Height} />
              <InfoRow label="Complexion" value={user.PE_Complexion} />
              <InfoRow label="Mother Tongue" value={user.PE_MotherTongue} />
              <InfoRow label="Religion" value={user.PE_Religion} />
              <InfoRow label="Caste" value={user.PE_Caste} />
              <InfoRow label="Education" value={user.PE_Education} />
              <InfoRow label="Occupation" value={user.PE_Occupation} />
              <InfoRow label="Resident Status" value={user.PE_Residentstatus} />
              <InfoRow
                label="Country Living In"
                value={user.PE_Countrylivingin}
              />
              <div className="col-span-1 sm:col-span-2">
                <span className="text-sm text-gray-500">
                  Partner Expectations
                </span>
                <div className="font-medium">
                  {user.PartnerExpectations ||
                    user.PartnerExpectations_new ||
                    "-"}
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </div>
    </div>

);
}

---

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProfilePage({ setUser: setAppUser }) {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
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

        if (res.data?.success) {
          setUser(res.data.user);
          if (typeof setAppUser === "function") setAppUser(res.data.user);
          localStorage.setItem("userData", JSON.stringify(res.data.user));
        } else {
          localStorage.removeItem("loggedInEmail");
          navigate("/login");
        }
      } catch (err) {
        console.error("fetch user error", err);
        localStorage.removeItem("loggedInEmail");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

}, [navigate, setAppUser]);

if (loading) return <div className="p-8">Loading...</div>;
if (!user) return <div className="p-8">No user found</div>;

const primary = "#ec1380"; // inline primary color as requested

const formatDOB = (dob) => {
if (!dob) return { day: "-", month: "-", year: "-" };
try {
const d = new Date(dob);
const day = d.getDate();
const month = d.toLocaleString(undefined, { month: "long" });
const year = d.getFullYear();
return { day, month, year };
} catch (e) {
return { day: "-", month: "-", year: "-" };
}
};

const dobParts = formatDOB(user.DOB || user.Regdate);

const parseTimeOfBirth = (tob) => {
if (!tob) return { hh: "-", mm: "-", ss: "-", ap: "-" };
// Example formats in your data: "8:00:00:AM" or "08:15:00" or "8:00:00:AM"
const cleaned = tob.replace(/\s+/g, "");
const parts = cleaned.split(":");
if (parts.length >= 3) {
const [hh, mm, rest] = parts;
let ss = "00";
let ap = "AM";
if (rest.includes("AM") || rest.includes("PM")) {
ss = rest.replace(/[^0-9]/g, "");
ap = rest.replace(/[^APMapm]/g, "").toUpperCase() || ap;
} else {
ss = rest;
}
return { hh, mm, ss, ap };
}
return { hh: "-", mm: "-", ss: "-", ap: "-" };
};

const tob = parseTimeOfBirth(user.TOB);

const InfoRow = ({ label, value }) => (
<div className="flex flex-col">
<span className="text-sm text-gray-500">{label}</span>
<span className="font-medium text-[#333333]">{value ?? "-"}</span>
</div>
);

return (
<div className="min-h-screen bg-[#f8f6f7] dark:bg-[#221019] text-[#333333] dark:text-gray-200 p-6 font-display">
<div className="max-w-[960px] mx-auto">
{/_ Header / top card _/}
<div className="flex flex-col items-center gap-4 p-6">
<div
className="rounded-full border-4 border-white dark:border-gray-700 shadow-lg bg-center bg-cover"
style={{
              width: 128,
              height: 128,
              backgroundImage: `url(${
                user.PhotoURL ||
                (process.env.REACT_APP_API_BASE || "http://localhost:5000") +
                  "/gallery/nophoto.jpg"
              })`,
            }}
aria-hidden
/>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#181114]">{user.Name}</h1>
            <div className="text-gray-500">
              {user.MatriID || user.matid} &nbsp;•&nbsp; {user.Age || "-"},{" "}
              {user.Gender || "-"} &nbsp;•&nbsp;{" "}
              {user.City || user.workinglocation || "-"}
            </div>
          </div>

          <button
            className="flex items-center gap-2 rounded-xl h-10 px-4 text-white font-bold"
            style={{ backgroundColor: primary }}
            onClick={() => {
              // navigate to edit page - change route if your app has a different edit path
              navigate("/profile/edit");
            }}
          >
            <span className="material-symbols-outlined">edit</span>
            <span>Edit Profile</span>
          </button>
        </div>

        {/* About Me */}
        <section className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold mb-2" style={{ color: "#181114" }}>
            About Me
          </h2>
          <p className="text-base leading-relaxed text-[#333333] dark:text-gray-300">
            {user.Profile || user.Profile_new || user.aboutus || "-"}
          </p>
        </section>

        {/* Basic Details (two-column grid) */}
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3">Basic Details</h2>
          <div className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <InfoRow label="Name" value={user.Name} />
              <InfoRow label="Matri ID" value={user.MatriID || user.matid} />
              <InfoRow label="Email" value={user.ConfirmEmail || user.email} />
              <InfoRow
                label="Profile Created By"
                value={user.Profilecreatedby}
              />
              <InfoRow label="Gender" value={user.Gender} />
              <InfoRow label="Date of Birth (Day)" value={dobParts.day} />
              <InfoRow label="Month" value={dobParts.month} />
              <InfoRow label="Year" value={dobParts.year} />
              <InfoRow
                label="Marital Status"
                value={user.Maritalstatus || user.maritalstatus}
              />
              <InfoRow label="Religion" value={user.Religion} />
              <InfoRow label="Caste" value={user.Caste} />
              <InfoRow
                label="Subcaste"
                value={user.Subcaste || user.sub_caste || "-"}
              />
              <InfoRow
                label="Mobile Number"
                value={user.Mobile || user.Phone}
              />
            </div>
          </div>
        </section>

        {/* Horoscope Details */}
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3">Horoscope Details</h2>
          <div className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow
                label="Moon Sign"
                value={user.Moonsign || user.moonsign}
              />
              <InfoRow label="Star" value={user.Star || user.star} />
              <InfoRow label="Gothra" value={user.Gothram} />
              <InfoRow label="Mangalik" value={user.Manglik} />
              <InfoRow label="Shani" value={user.shani || user.Shani || "-"} />
              <InfoRow
                label="Place of Shani"
                value={user.shaniplace || user.place || "-"}
              />
              <InfoRow label="Horoscope Match" value={user.Horosmatch} />
              <InfoRow
                label="Parigarasevai"
                value={user.parigarasevai || "-"}
              />
              <InfoRow label="Sevai" value={user.Sevai || "-"} />
              <InfoRow label="Raghu" value={user.Raghu || "-"} />
              <InfoRow label="Keethu" value={user.Keethu || "-"} />
              <InfoRow
                label="Place of Birth"
                value={user.POB || user.PlaceOfBirth || user.place_of_birth}
              />
              <InfoRow
                label="Country/Place"
                value={user.POC || user.Country || user.country}
              />

              <div className="col-span-1 sm:col-span-2">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Hour</span>
                    <div className="font-medium">{tob.hh}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Minute</span>
                    <div className="font-medium">{tob.mm}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Second / AM-PM
                    </span>
                    <div className="font-medium">
                      {tob.ss} {tob.ap}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <span className="text-sm text-gray-500">Horoscope Image</span>
                <div className="mt-2">
                  {user.horoscope ? (
                    <img
                      src={
                        user.horoscope.startsWith("http")
                          ? user.horoscope
                          : `${
                              process.env.REACT_APP_API_BASE ||
                              "http://localhost:5000"
                            }/gallery/${user.horoscope}`
                      }
                      alt="horoscope"
                      className="w-full max-w-[300px] object-contain rounded"
                    />
                  ) : (
                    <div className="text-gray-400">No horoscope uploaded</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Details */}
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3">Contact Details</h2>
          <div className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow label="Country" value={user.Country} />
              <InfoRow label="State" value={user.State} />
              <InfoRow label="District" value={user.Dist} />
              <InfoRow label="City" value={user.City} />
              <InfoRow label="Pincode" value={user.Pincode} />
              <InfoRow label="Residency Status" value={user.Residencystatus} />
              <InfoRow label="Address" value={user.Address} />
              <InfoRow label="Alternate Phone" value={user.Phone} />
              <InfoRow label="Mobile" value={user.Mobile} />
              <InfoRow label="WhatsApp" value={user.Mobile2 || user.whatsapp} />
              <InfoRow
                label="Convenient Time to Call"
                value={user.calling_time}
              />
            </div>
          </div>
        </section>

        {/* Education & Professional */}
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3">Education & Professional</h2>
          <div className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <div className="flex items-start gap-4">
              <span
                className="material-symbols-outlined text-primary mt-1"
                style={{ color: primary }}
              >
                school
              </span>
              <div>
                <div className="text-sm text-gray-500">
                  Education Qualification
                </div>
                <div className="font-medium">{user.Education}</div>
                <div className="text-sm text-gray-500">Education Details</div>
                <div className="font-medium">{user.EducationDetails}</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span
                className="material-symbols-outlined"
                style={{ color: primary }}
              >
                work
              </span>
              <div>
                <div className="text-sm text-gray-500">Occupation</div>
                <div className="font-medium">{user.Occupation}</div>
                <div className="text-sm text-gray-500">Occupation Details</div>
                <div className="font-medium">
                  {user.occu_details || user.OccupationDetails}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span
                className="material-symbols-outlined"
                style={{ color: primary }}
              >
                payments
              </span>
              <div>
                <div className="text-sm text-gray-500">Annual Income</div>
                <div className="font-medium">
                  {user.Annualincome
                    ? `${user.income_in || "Rs"} ${user.Annualincome}`
                    : "-"}
                </div>
                <div className="text-sm text-gray-500">Any Other Income</div>
                <div className="font-medium">{user.anyotherincome || "-"}</div>
                <div className="text-sm text-gray-500">Employed In</div>
                <div className="font-medium">{user.Employedin}</div>
                <div className="text-sm text-gray-500">Working Hours</div>
                <div className="font-medium">{user.working_hours}</div>
                <div className="text-sm text-gray-500">
                  Working Location / City
                </div>
                <div className="font-medium">{user.workinglocation}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Basic & Lifestyle */}
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3">Basic & Lifestyle</h2>
          <div className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow
                label="Height"
                value={user.Height ? `${user.Height}` : "-"}
              />
              <InfoRow label="Weight" value={user.Weight} />
              <InfoRow label="Blood Group" value={user.BloodGroup} />
              <InfoRow label="Complexion" value={user.Complexion} />
              <InfoRow label="Body Type" value={user.Bodytype} />
              <InfoRow label="Diet" value={user.Diet} />
              <InfoRow label="Smoke" value={user.Smoke} />
              <InfoRow label="Drink" value={user.Drink} />
              <InfoRow label="Special Cases" value={user.spe_cases} />
              <InfoRow label="Hobbies" value={user.Hobbies} />
              <InfoRow label="Interests" value={user.Interests} />
              <InfoRow label="Passport" value={user.passport} />
            </div>
          </div>
        </section>

        {/* Family Details */}
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3">Family Details</h2>
          <div className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow label="Family Values" value={user.Familyvalues} />
              <InfoRow label="Family Type" value={user.FamilyType} />
              <InfoRow label="Family Status" value={user.FamilyStatus} />
              <InfoRow label="Number of Brothers" value={user.noofbrothers} />
              <InfoRow label="Number of Sisters" value={user.noofsisters} />
              <InfoRow
                label="Brothers Married"
                value={user.noyubrothers || user.nbm}
              />
              <InfoRow
                label="Sisters Married"
                value={user.noyusisters || user.nsm}
              />
              <InfoRow label="Father Name" value={user.Fathername} />
              <InfoRow
                label="Father Occupation"
                value={user.Fathersoccupation}
              />
              <InfoRow label="Mother Name" value={user.Mothersname} />
              <InfoRow
                label="Mother Occupation"
                value={user.Mothersoccupation}
              />
              <InfoRow label="Family Wealth" value={user.family_wealth} />
              <InfoRow
                label="Mother Tongue"
                value={user.mother_tounge || user.Language}
              />
              <div className="col-span-1 sm:col-span-2">
                <span className="text-sm text-gray-500">About Family</span>
                <div className="font-medium">
                  {user.FamilyDetails || user.FamilyDetails_new || "-"}
                </div>
              </div>
              <InfoRow
                label="Family Medical History"
                value={user.familymedicalhistory}
              />
            </div>
          </div>
        </section>

        {/* Partner Preference */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-3">Partner Preference</h2>
          <div className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow label="Looking For" value={user.Looking} />
              <InfoRow label="Age From" value={user.PE_FromAge} />
              <InfoRow label="Age To" value={user.PE_ToAge} />
              <InfoRow label="Height From" value={user.PE_from_Height} />
              <InfoRow label="Height To" value={user.PE_to_Height} />
              <InfoRow label="Complexion" value={user.PE_Complexion} />
              <InfoRow label="Mother Tongue" value={user.PE_MotherTongue} />
              <InfoRow label="Religion" value={user.PE_Religion} />
              <InfoRow label="Caste" value={user.PE_Caste} />
              <InfoRow label="Education" value={user.PE_Education} />
              <InfoRow label="Occupation" value={user.PE_Occupation} />
              <InfoRow label="Resident Status" value={user.PE_Residentstatus} />
              <InfoRow
                label="Country Living In"
                value={user.PE_Countrylivingin}
              />
              <div className="col-span-1 sm:col-span-2">
                <span className="text-sm text-gray-500">
                  Partner Expectations
                </span>
                <div className="font-medium">
                  {user.PartnerExpectations ||
                    user.PartnerExpectations_new ||
                    "-"}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

);
}
