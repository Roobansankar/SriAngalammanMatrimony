import { PencilSquareIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProfilePage({ setUser: setAppUser }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showHoroscope, setShowHoroscope] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);




  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        console.log("Res", res.data);

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

  const refreshUser = async () => {
  try {
    const email = localStorage.getItem("loggedInEmail");
    if (!email) return;

    const res = await axios.get("http://localhost:5000/api/auth/user", {
      params: { email },
    });

    if (res.data?.success) {
      setUser(res.data.user);
      if (typeof setAppUser === "function") {
        setAppUser(res.data.user);
      }
    }
  } catch (err) {
    console.error("refreshUser error", err);
  }
};


  // if (loading) return <div className="p-8">Loading...</div>;
  if (loading)
    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed p-6 font-display">
        <div className="max-w-[1140px] mx-auto mt-20 space-y-10 animate-pulse">
          {/* ⭐ Banner skeleton */}
          <div className="w-full h-[220px] bg-gray-200 rounded-xl"></div>

          {/* ⭐ Avatar + Title skeleton */}
          <div className="flex items-center gap-5 -mt-16 px-4">
            <div className="w-32 h-32 bg-gray-200 rounded-full border-4 border-white"></div>

            <div className="flex flex-col gap-3 mt-16">
              <div className="h-6 w-48 bg-gray-200 rounded"></div>
              <div className="h-4 w-64 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* ⭐ Section Card Skeleton Generator */}
          {[
            "About Me",
            "Basic Details",
            "Horoscope Details",
            "Contact Details",
            "Education & Professional",
            "Basic & Lifestyle",
            "Family Details",
            "Partner Preference",
          ].map((title, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              {/* Title skeleton */}
              <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>

              {/* Section rows skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="h-4 w-28 bg-gray-200 rounded"></div>
                    <div className="h-5 w-40 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>

              {/* If Family / Partner has extra long text field */}
              {(title === "Family Details" ||
                title === "Partner Preference") && (
                <div className="mt-6">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-5 w-full bg-gray-200 rounded"></div>
                </div>
              )}
            </div>
          ))}

          {/* ⭐ Special Horoscope Rasi & Navamsa boxes */}
          <div className="flex justify-center gap-12 my-10">
            <div className="w-[300px] h-[300px] bg-gray-200 rounded"></div>
            <div className="w-[300px] h-[300px] bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );

  if (!user) return <div className="p-8">No user found</div>;
  // Prepare Rasi & Navamsa Data
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

  // eslint-disable-next-line no-unused-vars
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

  const timeOfBirth = [tob.hh, tob.mm, tob.ss]
    .filter(Boolean)
    .join(":")
    .concat(tob.ap ? ` ${tob.ap}` : "");

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed p-6 font-display"
      style={{
        backgroundImage: `url("https://static.vecteezy.com/system/resources/thumbnails/002/221/733/original/abstract-flowing-light-ombre-gradient-background-free-video.jpg")`,
      }}
    >
      <div className="max-w-[1140px] mx-auto mt-20">
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm overflow-hidden">
          <div className="relative">
            {/* Banner */}
            <div
              className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end min-h-[220px]"
              style={{
                backgroundImage: `url(${
                  user.banner ||
                  user.bannerUrl ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuCBZ4EFVao53pjOuSJDv5KALO-pbijH2rwxoJdNtEKYBlL3ZejOkXrSBt_D-eA-2sXzOZm2k77yDIi77LnXcWBzv491MC2tSL3H5MzMF89YHqdU1Pc8BRsMeuuKev3VlSXZaD2wMUdYU659o1JqMbgCjc8PBajptkzCTcH-9qHvamovnVGY6KP2XyV4H2mciLgwUI3SAaef9LmApUzaF9NdPg6Zzg6QV0O0cVoMp2FZ0jOvSmA-0Bl825eC8VzI7U39lVLNEzkbT5xE"
                })`,
              }}
              data-alt="Profile banner"
            >
              <button
                className="absolute top-4 right-4 flex items-center justify-center size-8 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors p-2"
                aria-label="Edit banner"
              >
                <span className="material-symbols-outlined text-base">
                  edit
                </span>
              </button>
            </div>

            {/* Avatar (overlap) */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div
                  onClick={() => setPreviewOpen(true)}
                  className="bg-no-repeat bg-cover rounded-full border-4 border-card-light dark:border-card-dark cursor-pointer hover:scale-105 transition-transform"
                  style={{
                    width: 128,
                    height: 128,
                    backgroundImage: `url(${user?.PhotoURL || "/nophoto.jpg"})`,
                    backgroundPosition: "top center",
                  }}
                />

                {/* blob store   base 64 */}
                <Link to="/edit/photo">
                  <button
                    className="absolute bottom-1 right-1 flex items-center justify-center size-8 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors p-2"
                    aria-label="Change photo"
                  >
                    <span className="material-symbols-outlined text-base">
                      photo_camera
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <section className="bg-white rounded-xl p-6 mt-12">
            <h2 className="text-xl font-bold mb-4">My Photos</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {["image1", "image2", "image3", "image4"].map((slot) => (
                <GalleryBox
                  key={slot}
                  slot={slot}
                  image={user?.[slot]}
                  matriId={user.MatriID}
                  refreshUser={refreshUser}
                />
              ))}
            </div>
          </section>

          {/* Header content: name, id, actions */}
          <div className="pt-20 px-8 pb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-text-light-primary dark:text-text-dark-primary text-2xl font-bold leading-tight tracking-[-0.015em]">
                    {user.Name || "-"}
                  </p>
                  {/* optional verified icon */}
                  {user.isVerified && (
                    <span className="material-symbols-outlined text-blue-500 text-xl">
                      verified
                    </span>
                  )}
                </div>
                <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm font-normal leading-normal mt-1">
                  {user.MatriID || user.matid || "-"} &nbsp;|&nbsp;{" "}
                  {user.Religion || "-"} &nbsp;|&nbsp;{" "}
                  {user.Maritalstatus || "-"} &nbsp;|&nbsp; {user.Age || "-"}
                </p>
              </div>

              <div className="flex w-full md:w-auto gap-3"></div>
            </div>
          </div>
        </div>

        {/* About Me */}
        <section className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 mt-10">
          {/* Header with edit on right */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold" style={{ color: "#181114" }}>
              About Me
            </h2>

            <Link to="/edit/about">
              <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                <PencilSquareIcon className="w-5 h-5" />
                Edit
              </button>
            </Link>
          </div>

          <p className="text-base leading-relaxed text-[#333333] dark:text-gray-300">
            {user.aboutus || "-"}
          </p>
        </section>

        {/* Basic Details (two-column grid) */}

        <section className="mb-6 relative">
          {/* Card */}
          <div className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {/* Header inside card */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Basic Details</h2>
              <Link to="/edit/basic">
                <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <PencilSquareIcon className="w-5 h-5" />
                  Edit
                </button>
              </Link>
            </div>

            {/* 3-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
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

        <section className="mb-6 relative">
          {/* Card */}
          <div className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {/* Header inside card */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Horoscope Details</h2>
              <Link to="/edit/horoscope">
                <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <PencilSquareIcon className="w-5 h-5" />
                  Edit
                </button>
              </Link>
            </div>

            {/* 3-column grid layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
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

              <InfoRow label="Kuladeivam" value={user.Kuladeivam || "-"} />
              <InfoRow label="thesaiirupu" value={user.ThesaiIrupu || "-"} />
              <InfoRow
                label="Country/Place"
                value={user.POC || user.Country || user.country}
              />

              {/* Combined Time of Birth */}
              <InfoRow label="Time of Birth" value={timeOfBirth || "-"} />

              {/* RASI + NAVAMSA South Indian Charts */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-wrap justify-center gap-12 my-6">
                <SouthChart title="இராசி" data={rasi} />
                <SouthChart title="நவாம்சம்" data={navamsa} />
              </div>

              {/* Horoscope Image */}
              {/* Horoscope (Image or PDF Viewer) */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Horoscope (Image / PDF)
                </span>

                {user.HoroscopeURL ? (
                  <button
                    onClick={() => setShowHoroscope(true)}
                    className="mt-2 ml-4 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                  >
                    View Horoscope
                  </button>
                ) : (
                  <div className="mt-2 text-gray-400 dark:text-gray-500">
                    No horoscope uploaded
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Details */}
        <section className="mb-6 relative">
          {/* Card */}
          <div className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {/* Header inside card */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Contact Details</h2>

              <Link to="/edit/contact">
                <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <PencilSquareIcon className="w-5 h-5" />
                  Edit
                </button>
              </Link>
            </div>

            {/* 3-column grid layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
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

        <section className="mb-6 relative">
          <div className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Education & Professional</h2>
              <Link to="/edit/education">
                <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <PencilSquareIcon className="w-5 h-5" />
                  Edit
                </button>
              </Link>
            </div>

            {/* 3-column grid layout (no icons) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
              {/* Education Qualification */}
              <div>
                <div className="text-sm text-gray-500">
                  Education Qualification
                </div>
                <div className="font-medium">{user.Education || "-"}</div>
              </div>

              {/* Education Details */}
              <div>
                <div className="text-sm text-gray-500">Education Details</div>
                <div className="font-medium">
                  {user.EducationDetails || "-"}
                </div>
              </div>

              {/* Occupation */}
              <div>
                <div className="text-sm text-gray-500">Occupation</div>
                <div className="font-medium">{user.Occupation || "-"}</div>
              </div>

              {/* Occupation Details */}
              <div>
                <div className="text-sm text-gray-500">Occupation Details</div>
                <div className="font-medium">
                  {user.occu_details || user.OccupationDetails || "-"}
                </div>
              </div>

              {/* Annual Income */}
              <div>
                <div className="text-sm text-gray-500">Annual Income</div>
                <div className="font-medium">
                  {user.Annualincome
                    ? `${user.income_in || "Rs"} ${user.Annualincome}`
                    : "-"}
                </div>
              </div>

              {/* Any Other Income */}
              <div>
                <div className="text-sm text-gray-500">Any Other Income</div>
                <div className="font-medium">{user.anyotherincome || "-"}</div>
              </div>

              {/* Employed In */}
              <div>
                <div className="text-sm text-gray-500">Employed In</div>
                <div className="font-medium">{user.Employedin || "-"}</div>
              </div>

              {/* Working Hours */}
              <div>
                <div className="text-sm text-gray-500">Working Hours</div>
                <div className="font-medium">{user.working_hours || "-"}</div>
              </div>

              {/* Working Location / City */}
              <div>
                <div className="text-sm text-gray-500">
                  Working Location / City
                </div>
                <div className="font-medium">{user.workinglocation || "-"}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Basic & Lifestyle */}

        <section className="mb-6 relative">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Basic & Lifestyle</h2>
              <Link to="/edit/lifestyle">
                <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                  <PencilSquareIcon className="w-5 h-5" />
                  Edit
                </button>
              </Link>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
              {/* 🟢 HeightText here */}
              <InfoRow label="Height" value={user.HeightText || "-"} />

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
          <div className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Family Details</h2>
              <Link to="/edit/family">
                <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <PencilSquareIcon className="w-5 h-5" />
                  Edit
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <InfoRow
                label="Family Medical History"
                value={user.familymedicalhistory}
              />
              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <span className="text-sm text-gray-500">About Family</span>
                <div className="font-medium">
                  {user.FamilyDetails || user.FamilyDetails_new || "-"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Preference */}

        <section className="mb-12">
          <div className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Partner Preference</h2>
              <Link to="/edit/partner">
                <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <PencilSquareIcon className="w-5 h-5" />
                  Edit
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <InfoRow label="Country" value={user.PE_Countrylivingin} />

              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
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

      {previewOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="relative max-w-3xl w-full px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute -top-10 right-2 text-white text-3xl hover:opacity-80"
            >
              ×
            </button>

            {/* Image Container */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              {/* Image */}
              <img
                src={user?.PhotoURL || "/nophoto.jpg"}
                alt="Profile Preview"
                className="w-full max-h-[80vh] object-contain bg-black"
              />

              {/* 🔒 Watermark Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                repeating-linear-gradient(
                  -45deg,
                  rgba(255,255,255,0.25),
                  rgba(255,255,255,0.25) 1px,
                  transparent 1px,
                  transparent 120px
                )
              `,
                  }}
                />

                {/* Watermark Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-3xl md:text-4xl font-bold tracking-widest rotate-[-25deg] opacity-30 select-none">
                    Sri Angalamman Matrimony
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Horoscope Viewer Modal */}
      {showHoroscope && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl p-4 rounded shadow-lg relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-700"
              onClick={() => setShowHoroscope(false)}
            >
              ✕
            </button>

            <h2 className="text-lg font-bold mb-4">Horoscope View</h2>

            {/* Preview Image or PDF */}
            {user.HoroscopeURL &&
            (user.HoroscopeURL.endsWith(".pdf") ||
              user.HoroscopeURL.includes("pdf")) ? (
              <iframe
                src={user.HoroscopeURL}
                className="w-full h-[600px] border rounded"
                title="Horoscope PDF"
              ></iframe>
            ) : (
              <img
                src={user.HoroscopeURL}
                alt="Horoscope"
                className="w-full max-h-[600px] object-contain border rounded"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------
   SOUTH-INDIAN HOROSCOPE BOX (Rasi + Navamsa)
----------------------------------------------------------- */

function SouthChart({ title, data }) {
  return (
    <div className="inline-block my-6">
      {/* <h3 className="text-center font-bold text-xl mb-3">{title}</h3> */}

      <div className="grid grid-cols-4 grid-rows-4 w-[300px] h-[300px] border border-black">
        {/* ROW 1 */}
        <Cell value={data[0]} />
        <Cell value={data[1]} />
        <Cell value={data[2]} />
        <Cell value={data[3]} />

        {/* ROW 2 */}
        <Cell value={data[11]} />
        <div className="col-span-2 row-span-2 border border-black flex items-center justify-center font-bold text-lg">
          {title}
        </div>
        <Cell value={data[4]} />

        {/* ROW 3 */}
        <Cell value={data[10]} />
        <Cell value={data[5]} />

        {/* ROW 4 */}
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
    // Try JSON first
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) items = parsed;
  } catch (e) {
    // fallback → split by comma
    items = value.split(",").map((v) => v.trim());
  }

  return (
    <div className="border border-black p-1 text-[11px] leading-tight">
      {items.map((item, i) => (
        <div key={i}>{item}</div>
      ))}
    </div>
  );
}


function GalleryBox({ slot, image, matriId, refreshUser }) {
  const uploadPhoto = async (file) => {
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append("matriId", matriId);
      formData.append(slot, file);

      // ❌ DO NOT set multipart headers manually
      await axios.post("http://localhost:5000/api/gallery/upload", formData);

      refreshUser();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Image upload failed");
    }
  };

  const deletePhoto = async () => {
    try {
      await axios.post("http://localhost:5000/api/gallery/delete", {
        matriId,
        slot,
      });

      refreshUser();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Image delete failed");
    }
  };

  return (
    <div className="relative border rounded-lg overflow-hidden group bg-white">
      {/* IMAGE / PLACEHOLDER */}
      {image ? (
        <img
          src={`http://localhost:5000/gallery/${image}`}
          alt={slot}
          className="w-full h-40 object-cover"
        />
      ) : (
        <label className="flex flex-col items-center justify-center h-40 bg-gray-100 cursor-pointer text-gray-600 hover:bg-gray-200">
          <span className="text-xl">➕</span>
          <span className="text-sm">Add Photo</span>
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => uploadPhoto(e.target.files[0])}
          />
        </label>
      )}

      {/* ACTION BUTTONS */}
      {image && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
          {/* UPDATE */}
          <label className="bg-black/60 text-white px-2 py-1 rounded cursor-pointer">
            ✏️
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => uploadPhoto(e.target.files[0])}
            />
          </label>

          {/* DELETE */}
          <button
            onClick={deletePhoto}
            className="bg-red-600 text-white px-2 py-1 rounded"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}
