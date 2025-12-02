// import React, { useEffect, useState } from "react";
// import { useLocation, Link, useNavigate } from "react-router-dom";
// import {
//   IdCard,
//   UserRound,
//   CalendarRange,
//   GraduationCap,
//   BriefcaseBusiness,
//   MapPin,
//   BadgeIndianRupee,
//   Heart,
//   MessageCircle,
//   UserPlus,
//   Sparkles, // Religion
//   Layers, // Caste
//   GitBranch, // Subcaste (hierarchy icon)
//   UserCog, // Profile created by
// } from "lucide-react";

// export default function LogedSearchResults() {
//   const { state } = useLocation(); // { filters, apiBase }
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [results, setResults] = useState({ total: 0, results: [] });
//   const [page, setPage] = useState(state?.filters?.page || 1);

//   useEffect(() => {
//     if (!state?.filters) navigate("/", { replace: true });
//   }, [state, navigate]);

//   useEffect(() => {
//     if (!state?.filters) return;

//     const fetchResults = async () => {
//       setLoading(true);
//       const f = state.filters;
//       const payload = new FormData();

//       payload.append("gender", f.gender ?? "");
//       payload.append("txtSAge", f.txtSAge ?? "");
//       payload.append("txtEAge", f.txtEAge ?? "");
//       (f.looking || []).forEach((v) => payload.append("looking[]", v));
//       (f.religion || []).forEach((v) => payload.append("religion[]", v));
//       (f.caste || []).forEach((v) => payload.append("caste[]", v));
//       (f.edu || []).forEach((v) => payload.append("edu[]", v));
//       (f.occu || []).forEach((v) => payload.append("occu[]", v));
//       if (f.with_photo) payload.append("with_photo", "1");

//       payload.append("page", page);

//       try {
//         const res = await fetch("http://localhost:5000/api/search", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           // body: JSON.stringify(f),
//           body: JSON.stringify({ ...f, page }),
//         });

//         const data = await res.json();
//         setResults(data);
//       } catch (e) {
//         console.error(e);
//         alert("Search failed — check console and backend availability");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResults();
//   }, [state, page]);

//   return (
//     <div className="min-h-screen  dark:bg-slate-950 font-display bg-[#FFF4E0]">
//       <div className="max-w-6xl mx-auto px-3 md:px-4 py-6 md:py-10">
//         <div className="mb-4 md:mb-6 flex items-center justify-between mt-20 ">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
//               Search Results
//             </h1>
//             <p className="text-slate-600 dark:text-slate-400">
//               {loading
//                 ? "Fetching matches..."
//                 : `We found ${results?.total || 0} results`}
//             </p>
//           </div>
//           <Link
//             to="/"
//             className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
//           >
//             <Heart className="size-4" />
//             New Search
//           </Link>
//         </div>

//         {loading ? (
//           <div className="space-y-3">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <div
//                 key={i}
//                 className="h-40 rounded-md bg-slate-100 dark:bg-slate-800 animate-pulse"
//               />
//             ))}
//           </div>
//         ) : (
//           <>
//             {results?.results?.length ? (
//               <div className="space-y-3">
//                 {results.results.map((r, idx) => (
//                   <ProfileRow key={idx} r={r} />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-slate-700 dark:text-slate-300">
//                 No results found.
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {results?.total > 10 && (
//         <div className="flex justify-center mt-8 gap-4">
//           <button
//             onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//             disabled={page === 1}
//             className={`px-4 py-2 rounded-md mb-10 border ${
//               page === 1
//                 ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
//                 : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 hover:bg-amber-100"
//             }`}
//           >
//             Previous
//           </button>

//           <span className="px-4 py-2 rounded-md border mb-10 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">
//             Page {page} of {Math.ceil(results.total / 10)}
//           </span>

//           <button
//             onClick={() =>
//               setPage((prev) =>
//                 Math.min(prev + 1, Math.ceil(results.total / 10))
//               )
//             }
//             disabled={page === Math.ceil(results.total / 10)}
//             className={`px-4 py-2 rounded-md mb-10 border ${
//               page === Math.ceil(results.total / 10)
//                 ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
//                 : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 hover:bg-amber-100"
//             }`}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// function ProfileRow({ r }) {
//   const fallbackImg =
//     "https://sriangalammanmatrimony.com/photoprocess.php?image=images/nophoto.jpg&square=200";

//   return (
//     <div className="rounded-md ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900 overflow-hidden font-display">
//       <div className="h-1 w-full bg-rose-600" />

//       {/* Mobile-first: stack; desktop: 3 columns */}
//       <div className="grid grid-cols-1 md:grid-cols-[128px_1fr_72px] items-center gap-4 px-3 md:px-4 py-4">
//         {/* Avatar */}
//         <div className="flex items-center justify-center">
//           <img
//             src={r.PhotoURL || fallbackImg}
//             alt={r.Name || "Profile photo"}
//             loading="lazy"
//             width={128}
//             height={128}
//             className="size-28 md:size-32 aspect-square rounded-full object-cover object-top ring-2 ring-amber-400 bg-slate-100"
//             onError={(e) => {
//               e.currentTarget.onerror = null;
//               e.currentTarget.src = fallbackImg;
//             }}
//           />
//         </div>

//         {/* Details */}
//         <div className="min-w-0">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
//             <ul className="list-none m-0 p-0 space-y-2 text-[15px] md:text-[16px] leading-6 md:leading-7 text-slate-800 dark:text-slate-200">
//               <Li icon={IdCard}>{r.MatriID || "—"}</Li>
//               <Li icon={UserRound}>{r.Name || "—"}</Li>
//               <Li icon={CalendarRange}>{r.DOB || "—"}</Li>
//               <Li icon={UserRound}>{r.Age ? `${r.Age} years` : "—"}</Li>
//             </ul>

//             <ul className="list-none m-0 p-0 space-y-2 text-[15px] md:text-[16px] leading-6 md:leading-7 text-slate-800 dark:text-slate-200">
//               <Li icon={Sparkles}>
//                 <Strong>Religion:</Strong> {r.Religion || "—"}
//               </Li>
//               <Li icon={Layers}>
//                 <Strong>Caste:</Strong> {r.Caste || "—"}
//               </Li>
//               <Li icon={GitBranch}>
//                 <Strong>Subcaste:</Strong> {r.Subcaste || "—"}
//               </Li>
//               <Li icon={UserCog}>
//                 <Strong>Profile Created By:</Strong> {r.Profilecreatedby || "—"}
//               </Li>
//             </ul>

//             <ul className="list-none m-0 p-0 space-y-2 text-[15px] md:text-[16px] leading-6 md:leading-7 text-slate-800 dark:text-slate-200">
//               <Li icon={GraduationCap}>{r.Education || "—"}</Li>
//               <Li icon={BriefcaseBusiness}>{r.Occupation || "—"}</Li>
//               <Li icon={BadgeIndianRupee}>
//                 {r.Annualincome ? `${r.Annualincome} Annual` : "Annual"}
//               </Li>
//               <Li icon={MapPin}>
//                 <Strong>Working city:</Strong>{" "}
//                 {r.Workingcity || r.workinglocation || r.City || "—"}
//               </Li>
//             </ul>
//           </div>
//         </div>

//         {/* Desktop actions (hidden on mobile) */}
//         <div className="hidden md:flex flex-col items-center justify-center gap-3">
//           <Link
//             to={`/profile/view/${r.MatriID || r.matid}`}
//             title="View Full Profile"
//             className="inline-flex items-center font-display justify-center size-9 rounded-full ring-1 ring-rose-200/70 text-rose-500 hover:bg-rose-50 hover:ring-rose-300 transition"
//           >
//             <UserRound className="size-5" />
//           </Link>

//           <button
//             title="Make Shortlist"
//             onClick={() => alert("Shortlist clicked (implement backend)")}
//             className="inline-flex items-center font-display justify-center size-9 rounded-full ring-1 ring-rose-200/70 text-rose-500 hover:bg-rose-50 hover:ring-rose-300 transition"
//           >
//             <Heart className="size-5" />
//           </button>

//           <button
//             title="Send Message"
//             onClick={() => alert("Message clicked (implement chat)")}
//             className="inline-flex items-center font-display justify-center size-9 rounded-full ring-1 ring-rose-200/70 text-rose-500 hover:bg-rose-50 hover:ring-rose-300 transition"
//           >
//             <MessageCircle className="size-5" />
//           </button>

//           <button
//             title="Connect Members"
//             onClick={() => alert("Connect clicked (implement connect)")}
//             className="inline-flex items-center font-display justify-center size-9 rounded-full ring-1 ring-rose-200/70 text-rose-500 hover:bg-rose-50 hover:ring-rose-300 transition"
//           >
//             <UserPlus className="size-5" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Li({ icon: Icon, children }) {
//   return (
//     <li className="flex items-center gap-2 font-display">
//       <Icon className="size-4 md:size-5 text-amber-600 shrink-0" />
//       <span className="text-slate-800 dark:text-slate-200">{children}</span>
//     </li>
//   );
// }

// function Strong({ children }) {
//   return <span className="font-semibold font-display">{children}</span>;
// }

// function Action({ title, href, onClick, children }) {
//   const Comp = href ? "a" : "button";
//   return (
//     <Comp
//       {...(href ? { href } : { type: "button", onClick })}
//       title={title}
//       className="inline-flex items-center font-display justify-center size-9 rounded-full ring-1 ring-rose-200/70 text-rose-500 hover:bg-rose-50 hover:ring-rose-300 transition"
//     >
//       {children}
//     </Comp>
//   );
// }

import {
    BadgeIndianRupee,
    BriefcaseBusiness,
    CalendarRange,
    GitBranch,
    GraduationCap,
    Heart,
    IdCard,
    Layers,
    MapPin,
    MessageCircle,
    Sparkles,
    UserCog,
    UserPlus,
    UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function LogedSearchResults() {
  const { state } = useLocation(); // { filters, apiBase }
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ total: 0, results: [] });
  const [page, setPage] = useState(state?.filters?.page || 1);

  useEffect(() => {
    if (!state?.filters) navigate("/", { replace: true });
  }, [state, navigate]);

  useEffect(() => {
    if (!state?.filters) return;

    const fetchResults = async () => {
      setLoading(true);
      const f = state.filters;

      try {
        const res = await fetch("http://localhost:5000/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...f, page }),
        });

        const data = await res.json();
        setResults(data);
      } catch (e) {
        console.error(e);
        alert("Search failed — check console and backend availability");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [state, page]);

  // ⭐ Smooth Scroll To Top Every Time Page Changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  return (
    <div className="min-h-screen dark:bg-slate-950 font-display bg-[#FFF4E0]">
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-6 md:py-10">
        <div className="mb-4 md:mb-6 flex items-center justify-between mt-20 ">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Search Results
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {loading
                ? "Fetching matches..."
                : `We found ${results?.total || 0} results`}
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Heart className="size-4" />
            New Search
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-md bg-slate-100 dark:bg-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {results?.results?.length ? (
              <div className="space-y-3">
                {results.results.map((r, idx) => (
                  <ProfileRow key={idx} r={r} />
                ))}
              </div>
            ) : (
              <div className="text-slate-700 dark:text-slate-300">
                No results found.
              </div>
            )}
          </>
        )}
      </div>

      {results?.total > 10 && (
        <div className="flex justify-center mt-8 gap-4">
          {/* Previous Button */}
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-md mb-10 border ${
              page === 1
                ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 hover:bg-amber-100"
            }`}
          >
            Previous
          </button>

          {/* Page Info */}
          <span className="px-4 py-2 rounded-md border mb-10 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Page {page} of {Math.ceil(results.total / 10)}
          </span>

          {/* Next Button */}
          <button
            onClick={() =>
              setPage((prev) =>
                Math.min(prev + 1, Math.ceil(results.total / 10))
              )
            }
            disabled={page === Math.ceil(results.total / 10)}
            className={`px-4 py-2 rounded-md mb-10 border ${
              page === Math.ceil(results.total / 10)
                ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 hover:bg-amber-100"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function ProfileRow({ r }) {
  const navigate = useNavigate();
  const fallbackImg =
    "https://sriangalammanmatrimony.com/photoprocess.php?image=images/nophoto.jpg&square=200";

  return (
    <div className="rounded-md ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900 overflow-hidden font-display">
      <div className="h-1 w-full bg-rose-600" />

      <div className="grid grid-cols-1 md:grid-cols-[128px_1fr_72px] items-center gap-4 px-3 md:px-4 py-4">
        <div className="flex items-center justify-center">
          <img
            src={r.PhotoURL || fallbackImg}
            alt={r.Name || "Profile photo"}
            loading="lazy"
            width={128}
            height={128}
            className="size-28 md:size-32 aspect-square rounded-full object-cover object-top ring-2 ring-amber-400 bg-slate-100"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackImg;
            }}
          />
        </div>

        <div className="min-w-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <ul className="space-y-2 text-[15px] md:text-[16px] text-slate-800 dark:text-slate-200">
              <Li icon={IdCard}>{r.MatriID || "—"}</Li>
              <Li icon={UserRound}>{r.Name || "—"}</Li>
              <Li icon={CalendarRange}>{r.DOB || "—"}</Li>
              <Li icon={UserRound}>{r.Age ? `${r.Age} years` : "—"}</Li>
            </ul>

            <ul className="space-y-2 text-[15px] md:text-[16px] text-slate-800 dark:text-slate-200">
              <Li icon={Sparkles}>
                <Strong>Religion:</Strong> {r.Religion || "—"}
              </Li>
              <Li icon={Layers}>
                <Strong>Caste:</Strong> {r.Caste || "—"}
              </Li>
              <Li icon={GitBranch}>
                <Strong>Subcaste:</Strong> {r.Subcaste || "—"}
              </Li>
              <Li icon={UserCog}>
                <Strong>Profile Created By:</Strong> {r.Profilecreatedby || "—"}
              </Li>
            </ul>

            <ul className="space-y-2 text-[15px] md:text-[16px] text-slate-800 dark:text-slate-200">
              <Li icon={GraduationCap}>{r.Education || "—"}</Li>
              <Li icon={BriefcaseBusiness}>{r.Occupation || "—"}</Li>
              <Li icon={BadgeIndianRupee}>
                {r.Annualincome ? `${r.Annualincome} Annual` : "Annual"}
              </Li>
              <Li icon={MapPin}>
                <Strong>Working city:</Strong>{" "}
                {r.Workingcity || r.workinglocation || r.City || "—"}
              </Li>
            </ul>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center gap-3">
          <Link
            to={`/profile/view/${r.MatriID || r.matid}`}
            title="View Full Profile"
            className="inline-flex items-center justify-center size-9 rounded-full ring-1 ring-rose-200/70 text-rose-500 hover:bg-rose-50 hover:ring-rose-300 transition"
          >
            <UserRound className="size-5" />
          </Link>

          <button
            title="Make Shortlist"
            onClick={() => alert("Shortlist clicked (implement backend)")}
            className="inline-flex items-center justify-center size-9 rounded-full ring-1 ring-rose-200/70 text-rose-500 hover:bg-rose-50 hover:ring-rose-300 transition"
          >
            <Heart className="size-5" />
          </button>

          <button
            title="Send Message"
            onClick={() => navigate(`/chat/${r.MatriID || r.matid}`)}
            className="inline-flex items-center justify-center size-9 rounded-full ring-1 ring-rose-200/70 text-rose-500 hover:bg-rose-50 hover:ring-rose-300 transition"
          >
            <MessageCircle className="size-5" />
          </button>

          <button
            title="Connect Members"
            onClick={() => alert("Connect clicked (implement connect)")}
            className="inline-flex items-center justify-center size-9 rounded-full ring-1 ring-rose-200/70 text-rose-500 hover:bg-rose-50 hover:ring-rose-300 transition"
          >
            <UserPlus className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Li({ icon: Icon, children }) {
  return (
    <li className="flex items-center gap-2">
      <Icon className="size-4 md:size-5 text-amber-600 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function Strong({ children }) {
  return <span className="font-semibold">{children}</span>;
}
