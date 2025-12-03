// src/profile/ProfileView.jsx
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connectSocket, getSocket } from "../socket";

export default function ProfileView() {
  const { matriid } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";
  const FETCH_API = `${API}/api/auth/searchByMatriID`;

  // interest
  const [interest, setInterest] = useState(null);
  const logged = (() => {
    try {
      return JSON.parse(localStorage.getItem("userData"));
    } catch {
      return null;
    }
  })();

  const loggedId =
    (logged?.MatriID || logged?.matid || "").toString().trim() || null;
  const viewedId =
    (user?.MatriID || user?.matid || "").toString().trim() || null;

  useEffect(() => {
    connectSocket();
    const socket = getSocket();
    const handleInterestResponse = (payload) => {
      try {
        if (payload?.interest) setInterest(payload.interest);
      } catch (e) {
        console.error("handleInterestResponse error", e);
      }
    };
    socket?.on("interest_response", handleInterestResponse);
    socket?.on("interest_update", handleInterestResponse);
    return () => {
      socket?.off("interest_response", handleInterestResponse);
      socket?.off("interest_update", handleInterestResponse);
    };
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!loggedId || !viewedId) return;
      try {
        const res = await axios.get(`${API}/api/auth/interest/status`, {
          params: { from: loggedId, to: viewedId },
        });
        if (res.data?.success) setInterest(res.data.interest);
      } catch (e) {
        console.error("fetch interest status error", e);
      }
    };
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const isOwner = !!loggedId && loggedId === viewedId;
  const contactVisible =
    isOwner || (interest && interest.status === "accepted");

  const sendInterest = async () => {
    if (!loggedId) return alert("Log in to send interest");
    if (!viewedId) return alert("Invalid profile");
    try {
      const res = await axios.post(`${API}/api/auth/interest/send`, {
        fromMatriID: loggedId,
        toMatriID: viewedId,
      });
      if (res.data?.success) {
        setInterest(res.data.interest);
        alert("Interest sent.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send interest");
    }
  };

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
        if (res.data?.success && res.data.user) setUser(res.data.user);
        else setError("Profile not found");
      } catch (err) {
        console.error("fetch profile error", err);
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [matriid]); // eslint-disable-line

  const formatDOB = (dob) => {
    if (!dob) return { day: "-", month: "-", year: "-" };
    try {
      const d = new Date(dob);
      const day = d.getDate();
      const month = d.toLocaleString(undefined, { month: "long" });
      const year = d.getFullYear();
      return { day, month, year };
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

  const timeOfBirth = (tob) =>
    [tob.hh, tob.mm, tob.ss].filter(Boolean).join(":") +
    (tob.ap ? ` ${tob.ap}` : "");

  const photoSrc = (u) => u?.PhotoURL || `${API}/gallery/nophoto.jpg`;

  const InfoRow = ({ label, value }) => (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="font-medium text-[#333333] dark:text-gray-200">
        {value ?? "-"}
      </span>
    </div>
  );

  if (loading) return <div className="p-8">Loading...</div>;
  if (error)
    return (
      <div className="p-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    );
  if (!user) return <div className="p-8">No profile data</div>;

  const dobParts = formatDOB(user.DOB || user.Regdate);
  const tob = parseTimeOfBirth(user.TOB);
  const primary = "#ec1380";

  /* ------------------ COMPATIBILITY HELPERS ------------------ */

  // Compare strings (case-insensitive)
  const cmp = (pref, actual) => {
    if (!pref || pref === "Any") return true;
    return (
      pref.toString().trim().toLowerCase() ===
      (actual || "").toString().trim().toLowerCase()
    );
  };

  // Multi-value comparison (Education, Occupation, Complexion)
  const multiMatch = (pref, actual) => {
    if (!pref || pref === "Any") return true;
    const prefArr = pref.split(",").map((v) => v.trim().toLowerCase());
    const actualStr = (actual || "").trim().toLowerCase();
    return prefArr.some((p) => actualStr === p || actualStr.includes(p));
  };

  // Convert "5Ft 7 Inch" → total inches
  const heightToInches = (h) => {
    if (!h) return 0;
    const match = h.match(/(\d+)\s*Ft\s*(\d*)\s*Inch/i);
    if (!match) return 0;

    const ft = parseInt(match[1] || 0);
    const inch = parseInt(match[2] || 0);

    return ft * 12 + inch;
  };

  // Height range match
  const heightMatch = (minH, maxH, actual) => {
    if (!actual) return false;

    const actualIn = heightToInches(actual);
    const minIn = heightToInches(minH);
    const maxIn = heightToInches(maxH);

    if (!minH && !maxH) return true;

    return actualIn >= minIn && actualIn <= maxIn;
  };

  /* ------------------ COMPATIBILITY RULES ------------------ */

  const viewer = logged || {}; // logged-in user
  const profile = user || {}; // viewed user

  const compatibility = [
    {
      label: "Looking For",
      icon: "👤",
      yourValue: viewer.Looking,
      partnerValue: profile.Maritalstatus,
      pass: multiMatch(viewer.Looking, profile.Maritalstatus),
    },
    {
      label: "Age",
      icon: "📅",
      yourValue: `${viewer.PE_FromAge} To ${viewer.PE_ToAge}`,
      partnerValue: profile.Age,
      pass: profile.Age >= viewer.PE_FromAge && profile.Age <= viewer.PE_ToAge,
    },
    {
      label: "Height",
      icon: "📏",
      yourValue: `${viewer.PE_from_Height} To ${viewer.PE_to_Height}`,
      partnerValue: profile.HeightText || profile.Height,
      pass: heightMatch(
        viewer.PE_from_Height,
        viewer.PE_to_Height,
        profile.HeightText || profile.Height
      ),
    },
    {
      label: "Complexion",
      icon: "🧑‍🦰",
      yourValue: viewer.PE_Complexion,
      partnerValue: profile.Complexion,
      pass: multiMatch(viewer.PE_Complexion, profile.Complexion),
    },
    {
      label: "Religion",
      icon: "✴️",
      yourValue: viewer.PE_Religion,
      partnerValue: profile.Religion,
      pass: cmp(viewer.PE_Religion, profile.Religion),
    },
    {
      label: "Caste",
      icon: "✔️",
      yourValue: viewer.PE_Caste,
      partnerValue: profile.Caste,
      pass: cmp(viewer.PE_Caste, profile.Caste),
    },
    {
      label: "Occupation",
      icon: "💼",
      yourValue: viewer.PE_Occupation,
      partnerValue: profile.Occupation,
      pass: multiMatch(viewer.PE_Occupation, profile.Occupation),
    },
    {
      label: "Education",
      icon: "🎓",
      yourValue: viewer.PE_Education,
      partnerValue: profile.Education,
      pass: multiMatch(viewer.PE_Education, profile.Education),
    },
    {
      label: "Country Living In",
      icon: "🚩",
      yourValue: viewer.PE_Countrylivingin,
      partnerValue: profile.Country,
      pass: cmp(viewer.PE_Countrylivingin, profile.Country),
    },
    {
      label: "State",
      icon: "🎯",
      yourValue: viewer.PE_State,
      partnerValue: profile.State,
      pass: cmp(viewer.PE_State, profile.State),
    },
    {
      label: "Resident Status",
      icon: "🏠",
      yourValue: viewer.PE_Residentstatus,
      partnerValue: profile.Residencystatus,
      pass: cmp(viewer.PE_Residentstatus, profile.Residencystatus),
    },
  ];

  const total = compatibility.length;
  const score = compatibility.filter((c) => c.pass).length;

  return (
    // <div className="min-h-screen bg-[#FFF4E0] dark:bg-[#221019] text-[#333333] dark:text-gray-200 p-6 font-display">
    <div
      className="min-h-screen bg-cover bg-center bg-fixed p-6 font-display"
      style={{
        backgroundImage: `url("https://tse2.mm.bing.net/th/id/OIP.VwEQnyoegmMr4uepYrfG6AHaEK?pid=Api&P=0&h=180")`,
      }}
    >
      <div className="max-w-[1140px] mx-auto">
        {/* Top card (same as ProfilePage) */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm overflow-hidden mt-20">
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
            ></div>

            {/* Avatar overlap */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div
                  className="bg-no-repeat bg-cover rounded-full border-4 border-card-light dark:border-card-dark"
                  style={{
                    width: 128,
                    height: 128,
                    backgroundImage: `url(${
                      photoSrc(user) && photoSrc(user) !== ""
                        ? photoSrc(user)
                        : "https://sriangalammanmatrimony.com/photoprocess.php?image=images/nophoto.jpg&square=200"
                    })`,
                    backgroundPosition: "top center", // ⭐ FIX: Show the face
                  }}
                />

                {isOwner ? (
                  <button
                    onClick={() => navigate("/profile/edit#photo")}
                    className="absolute bottom-1 right-1 flex items-center justify-center size-8 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors p-2"
                    aria-label="Change photo"
                  >
                    <span className="material-symbols-outlined text-base">
                      photo_camera
                    </span>
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {/* Header content: name, id, actions */}
          <div className="pt-20 px-8 pb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-text-light-primary dark:text-text-dark-primary text-2xl font-bold leading-tight tracking-[-0.015em]">
                    {user.Name || "-"}
                  </p>
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

              <div className="flex w-full md:w-auto gap-3">
                <button
                  onClick={() => navigate(`/profile/preview/${user._id || ""}`)}
                  className="flex min-w-[84px] max-w-[480px] items-center justify-center rounded-lg h-10 px-4 bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary text-sm font-bold flex-1"
                >
                  <span className="truncate">Preview Profile</span>
                </button>

                {isOwner ? (
                  <button
                    onClick={() => navigate("/profile/edit")}
                    className="flex min-w-[84px] max-w-[480px] items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold flex-1 gap-2"
                    style={{ backgroundColor: primary }}
                  >
                    <span className="material-symbols-outlined text-base">
                      edit
                    </span>
                    <span className="truncate">Edit Profile</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={sendInterest}
                      disabled={
                        interest?.status === "pending" ||
                        interest?.status === "accepted"
                      }
                      className="flex min-w-[84px] max-w-[480px] items-center justify-center rounded-lg h-10 px-4 text-white text-sm font-bold flex-1"
                      style={{
                        backgroundColor: primary,
                        opacity:
                          interest?.status === "pending" ||
                          interest?.status === "accepted"
                            ? 0.8
                            : 1,
                      }}
                    >
                      {interest?.status === "accepted"
                        ? "Interest Accepted"
                        : interest?.status === "pending"
                        ? "Interest Sent"
                        : "Send Interest"}
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/chat/${user.MatriID || user.matid}`)
                      }
                      className="flex min-w-[84px] max-w-[480px] items-center justify-center rounded-lg h-10 px-4 text-white text-sm font-bold flex-1 gap-2"
                      style={{ backgroundColor: "#22c55e" }}
                    >
                      <span className="material-symbols-outlined text-base">
                        chat
                      </span>
                      <span className="truncate">Message</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About Me */}
        <section className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 mt-10">
          <h2 className="text-xl font-bold mb-2" style={{ color: "#181114" }}>
            About Me
          </h2>
          <p className="text-base leading-relaxed text-[#333333] dark:text-gray-300">
            {user.aboutus || "-"}
          </p>
        </section>

        {/* Basic Details */}
        <section className="mb-6 relative">
          <div className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Basic Details</h2>
              {isOwner && (
                <button
                  onClick={() => navigate("/profile/edit#basic")}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                  Edit
                </button>
              )}
            </div>

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
                value={
                  contactVisible ? (
                    user.Mobile || user.Phone
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <span className="blur-sm select-none pointer-events-none">
                        +91-xxxx-xxx-xxx
                      </span>
                      <button
                        onClick={sendInterest}
                        disabled={interest?.status === "pending"}
                        className="ml-2 px-3 py-1 rounded text-white text-sm"
                        style={{ backgroundColor: primary }}
                      >
                        {interest?.status === "pending"
                          ? "Interest Sent"
                          : "Send Interest"}
                      </button>
                    </span>
                  )
                }
              />
            </div>
          </div>
        </section>

        {/* Horoscope Details */}
        <section className="mb-6 relative">
          <div className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Horoscope Details</h2>
              {isOwner && (
                <button
                  onClick={() => navigate("/profile/edit#horoscope")}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                  Edit
                </button>
              )}
            </div>

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
              <InfoRow
                label="Country/Place"
                value={user.POC || user.Country || user.country}
              />
              <InfoRow label="Time of Birth" value={timeOfBirth(tob) || "-"} />

              {/* Horoscope Image */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Horoscope Image
                </span>
                <div className="mt-2">
                  {user.horoscope ? (
                    <img
                      src={
                        user.horoscope.startsWith("http")
                          ? user.horoscope
                          : `${API}/gallery/${user.horoscope}`
                      }
                      alt="horoscope"
                      className="w-full max-w-[300px] object-contain rounded border border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <div className="text-gray-400 dark:text-gray-500">
                      No horoscope uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Details */}
        {/* <section className="mb-6 relative">
          <div className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Contact Details</h2>
              {isOwner && (
                <button
                  onClick={() => navigate("/profile/edit#contact")}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                  Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
              <InfoRow label="Country" value={user.Country} />
              <InfoRow label="State" value={user.State} />
              <InfoRow label="District" value={user.Dist} />
              <InfoRow label="City" value={user.City} />
              <InfoRow label="Pincode" value={user.Pincode} />
              <InfoRow label="Residency Status" value={user.Residencystatus} />
              <InfoRow label="Address" value={user.Address} />
              <InfoRow
                label="Alternate Phone"
                value={
                  contactVisible ? (
                    user.Phone
                  ) : (
                    <span className="blur-sm select-none pointer-events-none">
                      +91-xxxx-xxx-xxx
                    </span>
                  )
                }
              />
              <InfoRow
                label="Mobile"
                value={
                  contactVisible ? (
                    user.Mobile
                  ) : (
                    <span className="blur-sm select-none pointer-events-none">
                      +91-xxxx-xxx-xxx
                    </span>
                  )
                }
              />
              <InfoRow
                label="WhatsApp"
                value={
                  contactVisible ? (
                    user.Mobile2 || user.whatsapp
                  ) : (
                    <span className="blur-sm select-none pointer-events-none">
                      +91-xxxx-xxx-xxx
                    </span>
                  )
                }
              />
              <InfoRow
                label="Convenient Time to Call"
                value={user.calling_time}
              />
            </div>
          </div>
        </section> */}

        {/* Education & Professional */}
        <section className="mb-6 relative">
          <div className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Education & Professional</h2>
              {isOwner && (
                <button
                  onClick={() => navigate("/profile/edit#education")}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                  Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
              <div>
                <div className="text-sm text-gray-500">
                  Education Qualification
                </div>
                <div className="font-medium">{user.Education || "-"}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Education Details</div>
                <div className="font-medium">
                  {user.EducationDetails || "-"}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Occupation</div>
                <div className="font-medium">{user.Occupation || "-"}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Occupation Details</div>
                <div className="font-medium">
                  {user.occu_details || user.OccupationDetails || "-"}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Annual Income</div>
                <div className="font-medium">
                  {user.Annualincome
                    ? `${user.income_in || "Rs"} ${user.Annualincome}`
                    : "-"}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Any Other Income</div>
                <div className="font-medium">{user.anyotherincome || "-"}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Employed In</div>
                <div className="font-medium">{user.Employedin || "-"}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Working Hours</div>
                <div className="font-medium">{user.working_hours || "-"}</div>
              </div>

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
          <div className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Basic & Lifestyle</h2>
              {isOwner && (
                <button
                  onClick={() => navigate("/profile/edit#lifestyle")}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                  Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
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
          <div className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Family Details</h2>
              {isOwner && (
                <button
                  onClick={() => navigate("/profile/edit#family")}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                  Edit
                </button>
              )}
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

        {/* ------------------ COMPATIBILITY SECTION ------------------ */}
        <section className="mb-12">
          <div className="bg-white dark:bg-[#221019] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {/* PHOTOS + SCORE */}
            <div className="flex items-center justify-between px-4 py-6">
              {/* Logged-in User */}
              <div className="flex flex-col items-center">
                <img
                  src={viewer?.PhotoURL || `${API}/gallery/nophoto.jpg`}
                  className="w-20 h-20 rounded-full border"
                  alt="You"
                />
                <span className="mt-2 font-semibold">{viewer?.Name}</span>
              </div>

              {/* SCORE IN CENTER */}
              <div className="text-center">
                <div className="text-4xl font-extrabold text-pink-600">
                  {score} / {total}
                </div>
                <div className="text-sm text-gray-500">Compatibility Score</div>
              </div>

              {/* Partner */}
              <div className="flex flex-col items-center">
                <img
                  src={profile?.PhotoURL || `${API}/gallery/nophoto.jpg`}
                  className="w-20 h-20 rounded-full border"
                  alt="Partner"
                />
                <span className="mt-2 font-semibold">{profile?.Name}</span>
              </div>
            </div>

            {/* BOTH SIDES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* LEFT COLUMN – YOUR PREFERENCE */}
              <div>
                <h3 className="font-semibold mb-2 text-pink-700">
                  Your Preference
                </h3>
                {compatibility.map((row, i) => (
                  <div key={i} className="flex items-center gap-2 py-1">
                    <span className="text-yellow-600 text-xl">{row.icon}</span>
                    <span className="text-gray-600 w-40">{row.label}:</span>
                    <span className="font-medium">{row.yourValue || "-"}</span>
                    <span
                      className={`ml-auto text-xl ${
                        row.pass ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {row.pass ? "✔️" : "❌"}
                    </span>
                  </div>
                ))}
              </div>

              {/* RIGHT COLUMN – PARTNER VALUES */}
              <div>
                <h3 className="font-semibold mb-2 text-pink-700">
                  Partner Details
                </h3>
                {compatibility.map((row, i) => (
                  <div key={i} className="flex items-center gap-2 py-1">
                    <span className="text-yellow-600 text-xl">{row.icon}</span>
                    <span className="text-gray-600 w-40">{row.label}:</span>
                    <span className="font-medium">
                      {row.partnerValue || "-"}
                    </span>
                    <span
                      className={`ml-auto text-xl ${
                        row.pass ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {row.pass ? "✔️" : "❌"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
