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

// export default function SearchResults() {
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
//     <div className="min-h-screen bg-gradient-to-b from-[#fee2e2] via-[#fca5a5] to-[#ef4444] dark:bg-slate-950 font-display ">
//       <div className="max-w-6xl mx-auto px-3 md:px-4 py-6 md:py-10">
//         <div className="mb-4 md:mb-6 flex items-center justify-between mt-14">
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
//       {/* Pagination */}

//       {results?.total > 10 && (
//         <div className="flex justify-center mt-8 gap-4">
//           <button
//             onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//             disabled={page === 1}
//             className={`px-4 py-2 rounded-md border mb-10 ${
//               page === 1
//                 ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
//                 : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 hover:bg-amber-100"
//             }`}
//           >
//             Previous
//           </button>

//           <span className="px-4 py-2 rounded-md border bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-10">
//             Page {page} of {Math.ceil(results.total / 10)}
//           </span>

//           <button
//             onClick={() =>
//               setPage((prev) =>
//                 Math.min(prev + 1, Math.ceil(results.total / 10))
//               )
//             }
//             disabled={page === Math.ceil(results.total / 10)}
//             className={`px-4 py-2 rounded-md border mb-10 ${
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
//           <Link to="/register/step/1">
//             <Action title="View Full Profile">
//               <UserRound className="size-5" />
//             </Action>
//           </Link>

//           <Action title="Make Shortlist" onClick={() => {}}>
//             <Heart className="size-5" />
//           </Action>
//           <Action title="Send Message" onClick={() => {}}>
//             <MessageCircle className="size-5" />
//           </Action>
//           <Action title="Connect Members" onClick={() => {}}>
//             <UserPlus className="size-5" />
//           </Action>
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

import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  IdCard,
  UserRound,
  CalendarRange,
  GraduationCap,
  BriefcaseBusiness,
  MapPin,
  BadgeIndianRupee,
  Heart,
  MessageCircle,
  UserPlus,
  Sparkles,
  Layers,
  GitBranch,
  UserCog,
} from "lucide-react";

export default function SearchResults() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({ total: 0, results: [] });
  const [page, setPage] = useState(() => {
    const saved = sessionStorage.getItem("searchResultsPage");
    return saved ? Number(saved) : 1;
  });
  const perPage = 10;

  useEffect(() => {
    if (!state?.filters) navigate("/", { replace: true });
  }, [state, navigate]);

  useEffect(() => {
    sessionStorage.setItem("searchResultsPage", page);
  }, [page]);

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

  const totalPages = Math.ceil((results?.total || 0) / perPage);

  const goToPage = (num) => {
    if (num >= 1 && num <= totalPages) {
      setPage(num);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Smart pagination - show only 5 page numbers at a time
  const getPageNumbers = () => {
    const delta = 2; // Show 2 pages before and after current
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fee2e2] via-[#fca5a5] to-[#ef4444] dark:bg-slate-950 font-display">
      {/* Skeleton CSS */}
      <style>{`
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 0px, #e4e4e4 40px, #f0f0f0 80px);
          background-size: 600px;
          animation: shimmer 1.5s infinite linear;
        }
        @keyframes shimmer {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-3 md:px-4 py-6 md:py-10">
        <div className="mb-4 md:mb-6 flex items-center justify-between mt-14">
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
        </div>

        {/* Skeleton Loader */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-md ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
              >
                <div className="h-1 w-full bg-rose-600" />
                <div className="grid grid-cols-1 md:grid-cols-[128px_1fr_72px] items-center gap-4 px-3 md:px-4 py-4">
                  <div className="flex items-center justify-center">
                    <div className="size-28 md:size-32 rounded-full skeleton"></div>
                  </div>
                  <div className="min-w-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                      {[1, 2, 3].map((col) => (
                        <div key={col} className="space-y-2">
                          {[1, 2, 3, 4].map((row) => (
                            <div
                              key={row}
                              className="h-6 rounded skeleton"
                            ></div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="hidden md:flex flex-col items-center justify-center gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="size-9 rounded-full skeleton"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Real Data */}
        {!loading && (
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

        {/* Pagination - Matches Style */}
        {!loading && results?.total > perPage && (
          <div className="flex flex-wrap justify-center mt-8 gap-2 mb-10">
            <button
              className="px-3 py-1 border rounded disabled:opacity-40 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  page === i + 1
                    ? "bg-pink-600 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="px-3 py-1 border rounded disabled:opacity-40 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileRow({ r }) {
  const fallbackImg =
    "https://sriangalammanmatrimony.com/photoprocess.php?image=images/nophoto.jpg&square=200";

  // Format date: day-month-year
  const formatDate = (d) => {
    if (!d) return "—";
    const date = new Date(d);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  return (
    <div className="rounded-md ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900 overflow-hidden font-display">
      <div className="h-1 w-full bg-rose-600" />

      <div className="grid grid-cols-1 md:grid-cols-[128px_1fr_72px] items-center gap-4 px-3 md:px-4 py-4">
        {/* Avatar */}
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

        {/* Details */}
        <div className="min-w-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <ul className="list-none m-0 p-0 space-y-2 text-[15px] md:text-[16px] leading-6 md:leading-7 text-slate-800 dark:text-slate-200">
              <Li icon={IdCard}>{r.MatriID || "—"}</Li>
              <Li icon={UserRound}>{r.Name || "—"}</Li>
              <Li icon={CalendarRange}>{formatDate(r.DOB)}</Li>
              <Li icon={UserRound}>{r.Age ? `${r.Age} years` : "—"}</Li>
            </ul>

            <ul className="list-none m-0 p-0 space-y-2 text-[15px] md:text-[16px] leading-6 md:leading-7 text-slate-800 dark:text-slate-200">
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

            <ul className="list-none m-0 p-0 space-y-2 text-[15px] md:text-[16px] leading-6 md:leading-7 text-slate-800 dark:text-slate-200">
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

        {/* Action Icons - Visible on all screens */}
        <div className="flex md:flex-col flex-row items-center justify-center gap-3">
          <Link to="/Login">
            <Action title="View Full Profile">
              <UserRound className="size-5" />
            </Action>
          </Link>

          <Link to="/Login">
            <Action title="Make Shortlist">
              <Heart className="size-5" />
            </Action>
          </Link>

          <Link to="/Login">
            <Action title="Send Message">
              <MessageCircle className="size-5" />
            </Action>
          </Link>

          <Link to="/Login">
            <Action title="Connect Members">
              <UserPlus className="size-5" />
            </Action>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Li({ icon: Icon, children }) {
  return (
    <li className="flex items-center gap-2 font-display">
      <Icon className="size-4 md:size-5 text-amber-600 shrink-0" />
      <span className="text-slate-800 dark:text-slate-200">{children}</span>
    </li>
  );
}

function Strong({ children }) {
  return <span className="font-semibold font-display">{children}</span>;
}

function Action({ title, children }) {
  return (
    <button
      type="button"
      title={title}
      className="inline-flex items-center font-display justify-center size-9 rounded-full ring-1 ring-rose-200/70 text-rose-500 hover:bg-rose-50 hover:ring-rose-300 transition"
    >
      {children}
    </button>
  );
}
