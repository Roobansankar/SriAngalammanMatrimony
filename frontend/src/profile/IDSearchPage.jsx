// IDSearchPage.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function IDSearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Configure your API endpoint here
  const SEARCH_API = "http://localhost:5000/api/auth/searchByMatriID";

  // get logged user info from localStorage
  useEffect(() => {
    const email = localStorage.getItem("loggedInEmail");
    const userJson = localStorage.getItem("userData");
    if (!email || !userJson) {
      navigate("/login");
    }
  }, [navigate]);

  const getLoggedUser = () => {
    try {
      const raw = localStorage.getItem("userData");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const isOppositeGender = (g1, g2) => {
    if (!g1 || !g2) return false;
    const a = g1.toString().trim().toLowerCase();
    const b = g2.toString().trim().toLowerCase();
    // treat common values — extend if needed
    if ((a === "male" && b === "female") || (a === "female" && b === "male"))
      return true;
    return false;
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    setError(null);
    setResult(null);

    const logged = getLoggedUser();
    if (!logged) {
      setError("You must be logged in to search.");
      return;
    }

    if (!query || query.trim().length === 0) {
      setError("Please enter a Matrimony ID (e.g. PSM10089).");
      return;
    }

    setLoading(true);
    try {
      // call backend; change param name if needed by your API
      const res = await axios.get(SEARCH_API, {
        params: { matriid: query.trim() },
      });
      // sample response: { success: true, user: {...} }
      if (!res.data?.success || !res.data.user) {
        setError("No results found");
        setLoading(false);
        return;
      }

      const found = res.data.user;

      // If searching own MatriID -> DO NOT show the profile; treat as no results
      const loggedMatri = (logged.MatriID || logged.matid || "")
        .toString()
        .trim();
      const targetMatri = (found.MatriID || found.matid || "")
        .toString()
        .trim();

      if (
        loggedMatri &&
        loggedMatri.toLowerCase() === targetMatri.toLowerCase()
      ) {
        // show 'no results found' instead of the user's own profile
        setError("No results found");
        setLoading(false);
        return;
      }

      // If not own, only show if genders are opposite
      const loggedGender = logged.Gender || logged.gender;
      const foundGender = found.Gender || found.gender;

      if (isOppositeGender(loggedGender, foundGender)) {
        setResult(found);
      } else {
        setError("No results found");
      }
    } catch (err) {
      console.error("Search error", err);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDOB = (d) => {
    if (!d) return "-";
    try {
      const date = new Date(d);
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const yy = date.getFullYear();
      return `${dd}-${mm}-${yy}`;
    } catch {
      return d;
    }
  };

  // const photoSrc = (u) =>
  //   u?.PhotoURL ||
  //   (process.env.REACT_APP_API_BASE || "http://localhost:5000") + "/gallery/nophoto.jpg";

  const photoSrc = (u) => {
    if (u?.PhotoURL && typeof u.PhotoURL === "string" && u.PhotoURL.trim()) {
      return u.PhotoURL; // ✅ already a base64: data:image/jpeg;base64,....
    }
    return "https://via.placeholder.com/120"; // ✅ fallback
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 p-6 font-display">
      <div className="max-w-3xl mx-auto mt-20">
        <h1 className="text-center text-3xl font-extrabold text-gray-800 mb-6">
          ID Search
        </h1>

        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl shadow p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Matrimony ID (e.g. PSM10089)"
              className="flex-1 border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-2 sm:mt-0 inline-block bg-gradient-to-r from-orange-400 to-rose-500 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-60"
            >
              {loading ? "Searching..." : "Search Profile"}
            </button>
          </div>
          <p className="text-xs mt-3 text-gray-500">
            Tip: If you are searching your own ID, you can view full profile. If
            searching other IDs, results are shown only when genders are
            opposite.
          </p>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded p-4 mb-4">
            {error}
          </div>
        )}

        {/* Result card */}
        {result && (
          <div className="bg-white rounded shadow p-4 flex items-center gap-6">
            {/* Left circular image */}
            <div className="flex-shrink-0">
              <div
                className="rounded-full border-4 border-white shadow-lg overflow-hidden"
                style={{ width: 120, height: 120 }}
              >
                {/* <img
                  src={photoSrc(result)}
                  alt={result.Name || "profile"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      (process.env.REACT_APP_API_BASE ||
                        "http://localhost:5000") + "/gallery/nophoto.jpg";
                  }}
                /> */}
                <img
                  src={photoSrc(result)}
                  alt={result.Name || "profile"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://sriangalammanmatrimony.com/photoprocess.php?image=images/nophoto.jpg&square=200";
                  }}
                />
              </div>
            </div>

            {/* Center info columns */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
              <div className="space-y-2">
                <div className="text-sm text-gray-500">ID</div>
                <div className="font-semibold">
                  {result.MatriID || result.matid}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {result.Religion || "-"}
                </div>
                <div className="text-sm text-gray-400">
                  {result.Education || "-"}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-500">Name</div>
                <div className="font-semibold">{result.Name}</div>
                <div className="text-sm text-gray-400 mt-1">
                  {result.Caste || "-"}
                </div>
                <div className="text-sm text-gray-400">
                  {result.Occupation || "-"}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-500">DOB</div>
                <div className="font-semibold">{formatDOB(result.DOB)}</div>
                <div className="text-sm text-gray-400 mt-1">
                  Subcaste: {result.Subcaste || "-"}
                </div>
                <div className="text-sm text-gray-400">
                  Annual: {result.Annualincome || "-"}
                </div>
              </div>
            </div>

            {/* Right links (like Full Profile / Shortlist / Message / Connect) */}
            <div className="flex flex-col items-end gap-2">
              <Link
                to={`/profile/view/${result.MatriID || result.matid}`}
                className="text-sm text-blue-600 hover:underline"
              >
                FULL PROFILE
              </Link>
              <button
                onClick={() => alert("Shortlist clicked (implement backend)")}
                className="text-sm text-blue-600 hover:underline"
              >
                SHORTLIST
              </button>
              <button
                onClick={() => navigate(`/chat/${result.MatriID || result.matid}`)}
                className="text-sm text-blue-600 hover:underline"
              >
                MESSAGE
              </button>
              <button
                onClick={() => alert("Connect clicked (implement connect)")}
                className="text-sm text-blue-600 hover:underline"
              >
                CONNECT
              </button>
            </div>
          </div>
        )}

        {/* No result area when not found (and no error) */}
        {!result && !error && (
          <div className="text-center text-gray-500 mt-6">
            Search for a Matrimony ID to view summary here.
          </div>
        )}
      </div>
    </div>
  );
}
