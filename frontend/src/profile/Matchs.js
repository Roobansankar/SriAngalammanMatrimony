import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Matchs() {
  const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";
  const navigate = useNavigate();
  const { page: urlPage } = useParams();

  const [page, setPage] = useState(Number(urlPage) || 1);
  const [loading, setLoading] = useState(true); // 🔥 NEW
  const perPage = 9;

  // eslint-disable-next-line no-unused-vars
  const [profiles, setProfiles] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    setPage(Number(urlPage) || 1);
  }, [urlPage]);

  const logged = (() => {
    try {
      return JSON.parse(localStorage.getItem("userData"));
    } catch {
      return null;
    }
  })();

  /* ---------- helper functions ---------- */
  const cmp = (pref, actual) => {
    if (!pref || pref === "Any") return true;
    return pref.toLowerCase() === (actual || "").toLowerCase();
  };

  const multiMatch = (pref, actual) => {
    if (!pref || pref === "Any") return true;
    const arr = pref.split(",").map((x) => x.trim().toLowerCase());
    const act = (actual || "").toLowerCase();
    return arr.some((v) => act === v || act.includes(v));
  };

  const heightToInches = (h) => {
    if (!h) return 0;
    const m = h.match(/(\d+)\s*Ft\s*(\d*)\s*Inch/i);
    if (!m) return 0;
    return parseInt(m[1]) * 12 + parseInt(m[2] || 0);
  };

  const heightMatch = (minH, maxH, actual) => {
    const act = heightToInches(actual);
    const min = heightToInches(minH);
    const max = heightToInches(maxH);
    return act >= min && act <= max;
  };

  const calculateScore = (viewer, profile) => {
    const rules = [
      { pass: multiMatch(viewer.Looking, profile.Maritalstatus) },
      {
        pass:
          profile.Age >= viewer.PE_FromAge && profile.Age <= viewer.PE_ToAge,
      },
      {
        pass: heightMatch(
          viewer.PE_from_Height,
          viewer.PE_to_Height,
          profile.HeightText
        ),
      },
      { pass: multiMatch(viewer.PE_Complexion, profile.Complexion) },
      { pass: cmp(viewer.PE_Religion, profile.Religion) },
      { pass: cmp(viewer.PE_Caste, profile.Caste) },
      { pass: multiMatch(viewer.PE_Occupation, profile.Occupation) },
      { pass: multiMatch(viewer.PE_Education, profile.Education) },
      { pass: cmp(viewer.PE_Countrylivingin, profile.Country) },
      { pass: cmp(viewer.PE_State, profile.State) },
      { pass: cmp(viewer.PE_Residentstatus, profile.Residencystatus) },
    ];
    return rules.filter((x) => x.pass).length;
  };

  /* ---------- Load Profiles ---------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/api/auth/allProfiles`);
        const list = res.data?.users || [];

        const oppositeGender =
          logged.Gender?.toLowerCase() === "male" ? "female" : "male";

        const filteredList = list
          .filter((p) => p.MatriID !== logged.MatriID)
          .filter((p) => p.Gender?.toLowerCase() === oppositeGender)
          .filter((p) => {
            const minAge = logged.PE_FromAge;
            const maxAge = logged.PE_ToAge;

            if (!minAge && !maxAge) return true;
            if (minAge && !maxAge) return p.Age >= minAge;
            if (!minAge && maxAge) return p.Age <= maxAge;

            return p.Age >= minAge && p.Age <= maxAge;
          })
          .map((p) => ({ ...p, score: calculateScore(logged, p) }))
          .filter((p) => p.score >= 9)
          .sort((a, b) => {
            const isAReal =
              a.PhotoURL && !a.PhotoURL.toLowerCase().includes("nophoto");
            const isBReal =
              b.PhotoURL && !b.PhotoURL.toLowerCase().includes("nophoto");

            if (isAReal === isBReal) return 0;
            return isAReal ? -1 : 1;
          });

        setProfiles(filteredList);
        setFiltered(filteredList);
        setLoading(false); // 🔥 STOP LOADER
      } catch (err) {
        console.error("Error loading profiles", err);
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Pagination ---------- */
  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (page - 1) * perPage;
  const currentPageData = filtered.slice(start, start + perPage);

  const goToPage = (num) => {
    if (num >= 1 && num <= totalPages) {
      navigate(`/matches/${num}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /* ---------- DATE FORMAT ---------- */
  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="p-4 max-w-[1200px] mx-auto font-display pt-24">
      {/* ---------- CSS FOR SKELETON ---------- */}
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

      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-pink-700">
        Best Matches (Score 9 & Above)
      </h2>

      {/* ---------- SKELETON LOADER ---------- */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="border rounded-2xl bg-white shadow-lg p-4 flex gap-4"
            >
              <div className="w-32 h-48 rounded-xl skeleton"></div>

              <div className="flex flex-col gap-3 flex-grow">
                <div className="h-4 w-28 rounded skeleton"></div>
                <div className="h-4 w-36 rounded skeleton"></div>
                <div className="h-4 w-24 rounded skeleton"></div>
                <div className="h-4 w-40 rounded skeleton"></div>
                <div className="h-4 w-32 rounded skeleton mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------- REAL DATA ---------- */}
      {!loading && currentPageData.length === 0 && (
        <div className="text-gray-600">No high-score matches found.</div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {currentPageData.map((p) => (
            <div
              key={p.MatriID}
              onClick={() => navigate(`/profile/view/${p.MatriID}`)}
              className="cursor-pointer border rounded-2xl bg-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all p-4 flex gap-4"
            >
              <img
                src={p.PhotoURL || `${API}/gallery/nophoto.jpg`}
                alt=""
                className="w-32 h-48 object-cover object-top rounded-xl flex-shrink-0"
              />

              <div className="flex flex-col justify-center gap-2">
                <p className="text-sm">
                  <span className="font-semibold">🆔 ID:</span> {p.MatriID}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">👤 Name:</span> {p.Name}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">🎂 Age:</span> {p.Age} Years
                </p>
                <p className="text-sm">
                  <span className="font-semibold">📅 Reg Date:</span>{" "}
                  {formatDate(p.Regdate)}
                </p>

                <p className="text-sm font-semibold text-green-700 mt-1">
                  Compatibility: {p.score} / 11
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && (
        <div className="flex flex-wrap justify-center mt-8 gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-40"
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
                page === i + 1 ? "bg-pink-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 border rounded disabled:opacity-40"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
