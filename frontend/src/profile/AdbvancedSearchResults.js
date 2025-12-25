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
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

export default function AdvancedSearchResults() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({ total: 0, results: [] });

  const perPage = 10;

  useEffect(() => {
    if (!state?.filters) navigate("/", { replace: true });
  }, [state, navigate]);

  const { page: pageParam } = useParams();
  const page = Number(pageParam) || 1;

  const totalPages = Math.ceil((results?.total || 0) / perPage);

  const goToPage = (num) => {
    if (num >= 1 && num <= totalPages) {
      navigate(`/regularsearch-results/${num}`, {
        state, // ⬅️ SEND BACK THE SAME FILTERS
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!state?.filters) return;

    const fetchResults = async () => {
      setLoading(true);

      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE || ""}/api/advancesearch`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...state.filters, page }),
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

  // Pagination
  const getPagination = () => {
    const pages = [];
    const total = totalPages;
    const current = page;

    if (total <= 7) {
      // show all pages when small
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1); // always show first

    if (current > 3) pages.push("...");

    // middle pages
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) pages.push("...");

    pages.push(total); // always show last

    return pages;
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
          <div className="flex items-center justify-center mt-8 gap-2 mb-10">
            {/* Prev Button */}
            <button
              className="px-4 py-1 border rounded disabled:opacity-40 bg-white dark:bg-slate-800"
              disabled={page === 1}
              onClick={() => goToPage(page - 1)}
            >
              Prev
            </button>

            {/* Page Numbers */}
            {getPagination().map((p, idx) => (
              <button
                key={idx}
                disabled={p === "..."}
                onClick={() => p !== "..." && goToPage(p)}
                className={`px-3 py-1 border rounded 
          ${
            p === page
              ? "bg-pink-600 text-white"
              : p === "..."
              ? "cursor-default bg-gray-100 dark:bg-slate-700"
              : "bg-white dark:bg-slate-800 text-slate-700"
          }`}
              >
                {p}
              </button>
            ))}

            {/* Next Button */}
            <button
              className="px-4 py-1 border rounded disabled:opacity-40 bg-white dark:bg-slate-800"
              disabled={page === totalPages}
              onClick={() => goToPage(page + 1)}
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
          <Link to={`/profile/view/${r.MatriID || r.matid}`}>
            <Action title="View Full Profile">
              <UserRound className="size-5" />
            </Action>
          </Link>

          <Link to={`/profile/view/${r.MatriID || r.matid}`}>
            <Action title="Make Shortlist">
              <Heart className="size-5" />
            </Action>
          </Link>

          <Link to={`/profile/view/${r.MatriID || r.matid}`}>
            <Action title="Send Message">
              <MessageCircle className="size-5" />
            </Action>
          </Link>

          <Link to={`/profile/view/${r.MatriID || r.matid}`}>
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
