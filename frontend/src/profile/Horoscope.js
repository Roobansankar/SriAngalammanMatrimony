// // src/profile/Horoscope.jsx
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Horoscope() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const email = localStorage.getItem("loggedInEmail");
//     if (!email) {
//       navigate("/login");
//       return;
//     }

//     const fetchUser = async () => {
//       try {
//         const res = await axios.get(`${process.env.REACT_APP_API_BASE || ""}/api/auth/user`, {
//           params: { email },
//         });

//         if (res.data?.success && res.data.user) {
//           setUser(res.data.user);
//         } else {
//           localStorage.removeItem("loggedInEmail");
//           navigate("/login");
//         }
//       } catch (err) {
//         setError("Unable to fetch profile");
//         localStorage.removeItem("loggedInEmail");
//         navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [navigate]);

//   if (loading) return <div className="p-6">Loading...</div>;
//   if (error) return <div className="p-6 text-red-600">{error}</div>;
//   if (!user) return <div className="p-6">No user found</div>;

//   // -------------------------------
//   //  PREPARE RASI & NAVAMSA DATA
//   // -------------------------------
//   const rasi = [
//     user.g1,
//     user.g2,
//     user.g3,
//     user.g4,
//     user.g5,
//     user.g6,
//     user.g7,
//     user.g8,
//     user.g9,
//     user.g10,
//     user.g11,
//     user.g12,
//   ];

//   const navamsa = [
//     user.a1,
//     user.a2,
//     user.a3,
//     user.a4,
//     user.a5,
//     user.a6,
//     user.a7,
//     user.a8,
//     user.a9,
//     user.a10,
//     user.a11,
//     user.a12,
//   ];

//   const moonsign = user.Moonsign || "-";
//   const star = user.Star || "-";
//   const gothra = user.Gothram || user.Gothra || "-";
//   const mangalik = user.Manglik || "-";
//   const shani = user.shani || "-";
//   const placeOfShani = user.shaniplace || user.shaniplace || "-";
//   const horoMatch =
//     user.Horosmatch || user.horos_match || user.horos_status || "-";
//   const parigarasevai = user.parigarasevai || "-";
//   const sevai = user.Sevai || user.sevai || "-";
//   const raghu = user.Raghu || user.Raghu || "-";
//   const keethu = user.Keethu || user.Keethu || "-";
//   const placeOfBirth =
//     user.POB || user.PlaceOfBirth || user.placeofbirth || "-";
//   const placeOfCountry = user.POC || user.Country || "-";

//   // Time of birth parsing
//   let tobRaw = user.TOB || user.TimeOfBirth || "";
//   let hour = "-",
//     minute = "-",
//     second = "-",
//     ampm = "-";
//   if (tobRaw) {
//     const r = tobRaw.match(
//       /(\d{1,2}):(\d{2})(?::(\d{2}))?\s*[:-]?\s*([AaPp][Mm])?/
//     );
//     if (r) {
//       hour = r[1].padStart(2, "0");
//       minute = r[2];
//       second = r[3] ? r[3].padStart(2, "0") : "00";
//       ampm = r[4]
//         ? r[4].toUpperCase()
//         : /\bAM\b|\bPM\b/i.test(tobRaw)
//         ? tobRaw.match(/\b(AM|PM)\b/i)[1].toUpperCase()
//         : "-";
//     } else {
//       const parts = tobRaw.split(/\s+/);
//       const timePart = parts[0] || "";
//       const ampmPart = parts[1] || "";
//       const tp = timePart.split(":");
//       if (tp.length >= 2) {
//         hour = tp[0].padStart(2, "0");
//         minute = tp[1];
//         second = tp[2] ? tp[2].padStart(2, "0") : "00";
//         ampm = ampmPart ? ampmPart.toUpperCase() : "-";
//       }
//     }
//   }

//   const dbHour = user.last_seen_hour || user.hour || null;
//   const dbMin = user.last_seen_min || user.minute || null;
//   if (dbHour && hour === "-") hour = String(dbHour).padStart(2, "0");
//   if (dbMin && minute === "-") minute = String(dbMin).padStart(2, "0");

//   return (
//     <div className="min-h-screen p-6 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#a17c5b]">
//       <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-20">
//         <h2 className="text-3xl font-bold text-pink-700 mb-8 text-center">
//           Horoscope Details
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
//           <LabelValue label="Moon Sign" value={moonsign} />
//           <LabelValue label="Star" value={star} />
//           <LabelValue label="Gothra" value={gothra} />
//           <LabelValue label="Mangalik" value={mangalik} />
//           <LabelValue label="Shani" value={shani} />
//           <LabelValue label="Place of Shani" value={placeOfShani} />
//           <LabelValue label="Horoscope Match" value={horoMatch} />
//           <LabelValue label="Parigarasevai" value={parigarasevai} />
//           <LabelValue label="Sevai" value={sevai} />
//           <LabelValue label="Raghu" value={raghu} />
//           <LabelValue label="Keethu" value={keethu} />
//           <LabelValue label="Place of Birth (City)" value={placeOfBirth} />
//           <LabelValue label="Place / Country" value={placeOfCountry} />
//           <LabelValue label="Time of Birth (raw)" value={tobRaw || "-"} />
//           <LabelValue label="Hours" value={hour} />
//           <LabelValue label="Minutes" value={minute} />
//           <LabelValue label="Seconds" value={second} />
//           <LabelValue label="AM / PM" value={ampm} />
//         </div>

//         {/* RASI + NAVAMSA */}
//         <div className="flex flex-wrap justify-center gap-12">
//           <SouthChart title="இராசி" data={rasi} />
//           <SouthChart title="நவாம்சம்" data={navamsa} />
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ----------------------------------------------------------
//     EXACT SOUTH-INDIAN HOROSCOPE LAYOUT (LIKE YOUR IMAGE)
// ----------------------------------------------------------- */

// function SouthChart({ title, data }) {
//   return (
//     <div className="inline-block">
//       <h3 className="text-center font-bold text-xl mb-3">{title}</h3>

//       <div className="grid grid-cols-4 grid-rows-4 w-[300px] h-[300px] border border-black">
//         {/* ROW 1 */}
//         <Cell value={data[0]} /> {/* House 1 */}
//         <Cell value={data[1]} /> {/* House 2 */}
//         <Cell value={data[2]} /> {/* House 3 */}
//         <Cell value={data[3]} /> {/* House 4 */}
//         {/* ROW 2 */}
//         <Cell value={data[11]} /> {/* House 12 */}
//         <div className="col-span-2 row-span-2 border border-black flex items-center justify-center font-bold text-lg">
//           {title}
//         </div>
//         <Cell value={data[4]} /> {/* House 5 */}
//         {/* ROW 3 */}
//         <Cell value={data[10]} /> {/* House 11 */}
//         {/* center (merged) */}
//         <Cell value={data[5]} /> {/* House 6 */}
//         {/* ROW 4 */}
//         <Cell value={data[9]} /> {/* House 10 */}
//         <Cell value={data[8]} /> {/* House 9 */}
//         <Cell value={data[7]} /> {/* House 8 */}
//         <Cell value={data[6]} /> {/* House 7 */}
//       </div>
//     </div>
//   );
// }

// function Cell({ value }) {
//   if (!value) return <div className="border border-black p-1 text-[12px]" />;

//   let items = [];

//   try {
//     // Try JSON first
//     const parsed = JSON.parse(value);
//     if (Array.isArray(parsed)) items = parsed;
//   } catch (e) {
//     // fallback → split by comma
//     items = value.split(",").map((v) => v.trim());
//   }

//   return (
//     <div className="border border-black p-1 text-[11px] leading-tight">
//       {items.map((item, i) => (
//         <div key={i}>{item}</div>
//       ))}
//     </div>
//   );
// }

// function LabelValue({ label, value }) {
//   return (
//     <div className="border p-3 rounded">
//       <div className="text-xs text-gray-500">{label}</div>
//       <div className="text-sm font-medium break-words">{value ?? "-"}</div>
//     </div>
//   );
// }

// src/profile/Horoscope.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Horoscope() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("loggedInEmail");
    if (!email) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE || ""}/api/auth/user`, {
          params: { email },
        });

        if (res.data?.success && res.data.user) {
          setUser(res.data.user);
        } else {
          localStorage.removeItem("loggedInEmail");
          navigate("/login");
        }
      } catch (err) {
        setError("Unable to fetch profile");
        localStorage.removeItem("loggedInEmail");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // ----------------------------------------------------------
  //  SKELETON LOADING UI
  // ----------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 flex justify-center items-center">
        <div className="w-full max-w-5xl bg-white rounded-2xl p-8 shadow animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-40 mx-auto mb-6"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border rounded p-4">
                <div className="h-3 w-1/2 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-12 mt-10">
            <div className="w-72 h-72 bg-gray-200 rounded-md"></div>
            <div className="w-72 h-72 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!user) return <div className="p-6">No user found</div>;

  // -------------------------------
  //  PREPARE RASI & NAVAMSA DATA
  // -------------------------------
  const rasi = [
    user.g1,
    user.g2,
    user.g3,
    user.g4,
    user.g5,
    user.g6,
    user.g7,
    user.g8,
    user.g9,
    user.g10,
    user.g11,
    user.g12,
  ];

  const navamsa = [
    user.a1,
    user.a2,
    user.a3,
    user.a4,
    user.a5,
    user.a6,
    user.a7,
    user.a8,
    user.a9,
    user.a10,
    user.a11,
    user.a12,
  ];

  const moonsign = user.Moonsign || "-";
  const star = user.Star || "-";
  const gothra = user.Gothram || user.Gothra || "-";
  const mangalik = user.Manglik || "-";
  const shani = user.shani || "-";
  const placeOfShani = user.shaniplace || "-";
  const horoMatch =
    user.Horosmatch || user.horos_match || user.horos_status || "-";
  const parigarasevai = user.parigarasevai || "-";
  const sevai = user.Sevai || user.sevai || "-";
  const raghu = user.Raghu || "-";
  const keethu = user.Keethu || "-";
  const placeOfBirth = user.POB || user.PlaceOfBirth || "-";
  const placeOfCountry = user.POC || user.Country || "-";
  const kuladeivam =  user.Kuladeivam || "-";
  const ThesaiIrupu = user.ThesaiIrupu || "-"

  // Time of Birth Handling
  let tobRaw = user.TOB || user.TimeOfBirth || "";
  let hour = "-",
    minute = "-",
    second = "-",
    ampm = "-";

  if (tobRaw) {
    const r = tobRaw.match(
      /(\d{1,2}):(\d{2})(?::(\d{2}))?\s*[:-]?\s*([AaPp][Mm])?/
    );

    if (r) {
      hour = r[1].padStart(2, "0");
      minute = r[2];
      second = r[3] ? r[3].padStart(2, "0") : "00";
      ampm = r[4] ? r[4].toUpperCase() : "-";
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#a17c5b] font-display">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-10 mt-20 border border-gray-200">
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-700 mb-8 text-center">
          Horoscope Details
        </h2>

        {/* Basic Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          <LabelValue label="Moon Sign" value={moonsign} />
          <LabelValue label="Star" value={star} />
          <LabelValue label="Gothra" value={gothra} />
          <LabelValue label="Mangalik" value={mangalik} />
          <LabelValue label="Shani" value={shani} />
          <LabelValue label="Place of Shani" value={placeOfShani} />
          <LabelValue label="Horoscope Match" value={horoMatch} />
          <LabelValue label="Parigarasevai" value={parigarasevai} />
          <LabelValue label="Sevai" value={sevai} />
          <LabelValue label="Raghu" value={raghu} />
          <LabelValue label="Keethu" value={keethu} />
          <LabelValue label="Place of Birth" value={placeOfBirth} />
          <LabelValue label="Country" value={placeOfCountry} />
          <LabelValue label="Time of Birth" value={tobRaw || "-"} />
          <LabelValue label="Hours" value={hour} />
          <LabelValue label="Minutes" value={minute} />
          <LabelValue label="Seconds" value={second} />
          <LabelValue label="AM / PM" value={ampm} />
            <LabelValue label="kuladeivam" value={kuladeivam} />
             <LabelValue label="Thesai Irupu" value={ThesaiIrupu} />
        </div>

        {/* Rasi & Navamsa Charts */}
        <div className="flex flex-wrap justify-center gap-14">
          <SouthChart title="இராசி" data={rasi} />
          <SouthChart title="நவாம்சம்" data={navamsa} />
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------
   SOUTH CHART + CELL UI
----------------------------------------------------------- */

function SouthChart({ title, data }) {
  return (
    <div className="inline-block">
      <h3 className="text-center font-bold text-xl mb-3 text-gray-700">
        {title}
      </h3>

      <div className="grid grid-cols-4 grid-rows-4 w-[300px] h-[300px] border border-black rounded-md overflow-hidden shadow-md">
        <Cell value={data[0]} />
        <Cell value={data[1]} />
        <Cell value={data[2]} />
        <Cell value={data[3]} />

        <Cell value={data[11]} />

        <div className="col-span-2 row-span-2 border border-black flex items-center justify-center font-bold text-lg text-gray-700 bg-gray-50">
          {title}
        </div>

        <Cell value={data[4]} />
        <Cell value={data[10]} />
        <Cell value={data[5]} />

        <Cell value={data[9]} />
        <Cell value={data[8]} />
        <Cell value={data[7]} />
        <Cell value={data[6]} />
      </div>
    </div>
  );
}

function Cell({ value }) {
  if (!value) return <div className="border border-black p-1 text-[12px]" />;

  let items = [];
  try {
    items = JSON.parse(value);
  } catch {
    items = value.split(",").map((v) => v.trim());
  }

  return (
    <div className="border border-black p-1 text-[11px] leading-tight bg-white">
      {items.map((item, i) => (
        <div key={i}>{item}</div>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------
   LABEL-VALUE UI COMPONENT
----------------------------------------------------------- */
function LabelValue({ label, value }) {
  return (
    <div className="border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition bg-gray-50">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-base font-semibold text-gray-800 mt-1 break-words">
        {value ?? "-"}
      </div>
    </div>
  );
}
