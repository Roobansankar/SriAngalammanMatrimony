import axios from "axios";
import {
    AlertTriangle,
    ChevronDown,
    Edit3,
    Globe,
    MapPin,
    Plus,
    RefreshCw,
    Save,
    Trash2,
    X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";

// Cache keys and configuration
const CACHE_KEYS = {
  COUNTRIES: "location_cache_countries",
  STATES: "location_cache_states",
  CITIES: "location_cache_cities",
  VERSION: "location_cache_version",
};

const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours cache expiry

// Cache utility functions
const getCachedData = (key, filterKey = null, filterValue = null) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    
    // Check if cache is expired
    if (Date.now() - timestamp > CACHE_EXPIRY_MS) {
      localStorage.removeItem(key);
      return null;
    }

    // If filter is applied, filter from cached data
    if (filterKey && filterValue) {
      return data.filter(item => String(item[filterKey]) === String(filterValue));
    }

    return data;
  } catch (err) {
    console.error("Cache read error:", err);
    return null;
  }
};

const setCachedData = (key, data) => {
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheEntry));
  } catch (err) {
    console.error("Cache write error:", err);
    // If localStorage is full, clear old caches
    if (err.name === 'QuotaExceededError') {
      clearLocationCache();
    }
  }
};

const invalidateCache = (key) => {
  try {
    localStorage.removeItem(key);
    // Update version to notify other components
    const currentVersion = parseInt(localStorage.getItem(CACHE_KEYS.VERSION) || "0", 10);
    localStorage.setItem(CACHE_KEYS.VERSION, String(currentVersion + 1));
  } catch (err) {
    console.error("Cache invalidation error:", err);
  }
};

const clearLocationCache = () => {
  Object.values(CACHE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

export default function LocationData() {
  const [activeTab, setActiveTab] = useState("country");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usingCache, setUsingCache] = useState(false);

  // Filters
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [selectedState, setSelectedState] = useState("Tamil Nadu");

  // Add/Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ name: "", country: "", state: "", status: 1 });
  const [saving, setSaving] = useState(false);

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isAdmin = currentUser?.role === 'admin';

  // Fetch data with caching
  const fetchCountries = useCallback(async (forceRefresh = false) => {
    try {
      // Check cache first (only if not forcing refresh)
      if (!forceRefresh) {
        const cachedCountries = getCachedData(CACHE_KEYS.COUNTRIES);
        if (cachedCountries) {
          setCountries(cachedCountries);
          setUsingCache(true);
          return cachedCountries;
        }
      }

      // Fetch from API
      const res = await axios.get(`${API}/api/admin/master/countries`);
      if (res.data.success) {
        setCountries(res.data.data);
        setCachedData(CACHE_KEYS.COUNTRIES, res.data.data);
        setUsingCache(false);
        return res.data.data;
      }
    } catch (err) {
      console.error("Error fetching countries:", err);
      // Try to use cached data as fallback
      const cachedCountries = getCachedData(CACHE_KEYS.COUNTRIES);
      if (cachedCountries) {
        setCountries(cachedCountries);
        setUsingCache(true);
      }
    }
    return [];
  }, []);

  const fetchStates = useCallback(async (country = "", forceRefresh = false) => {
    try {
      // Check cache first for all states
      if (!forceRefresh) {
        const cachedStates = getCachedData(CACHE_KEYS.STATES);
        if (cachedStates) {
          // Filter by country if needed
          const filtered = country
            ? cachedStates.filter(s => String(s.cid) === String(country))
            : cachedStates;
          setStates(filtered);
          setUsingCache(true);
          return filtered;
        }
      }

      // Fetch all states from API (to cache them all)
      const res = await axios.get(`${API}/api/admin/master/states`);
      if (res.data.success) {
        const allStates = res.data.data;
        setCachedData(CACHE_KEYS.STATES, allStates);
        
        // Filter by country if needed
        const filtered = country
          ? allStates.filter(s => String(s.cid) === String(country))
          : allStates;
        setStates(filtered);
        setUsingCache(false);
        return filtered;
      }
    } catch (err) {
      console.error("Error fetching states:", err);
      // Try to use cached data as fallback
      const cachedStates = getCachedData(CACHE_KEYS.STATES);
      if (cachedStates) {
        const filtered = country
          ? cachedStates.filter(s => String(s.cid) === String(country))
          : cachedStates;
        setStates(filtered);
        setUsingCache(true);
      }
    }
    return [];
  }, []);

  const fetchCities = useCallback(async (state = "", forceRefresh = false) => {
    try {
      // Check cache first for all cities
      if (!forceRefresh) {
        const cachedCities = getCachedData(CACHE_KEYS.CITIES);
        if (cachedCities) {
          // Filter by state if needed
          const filtered = state
            ? cachedCities.filter(c => String(c.sid2) === String(state))
            : cachedCities;
          setCities(filtered);
          setUsingCache(true);
          return filtered;
        }
      }

      // Fetch all cities from API (to cache them all)
      const res = await axios.get(`${API}/api/admin/master/cities`);
      if (res.data.success) {
        const allCities = res.data.data;
        setCachedData(CACHE_KEYS.CITIES, allCities);
        
        // Filter by state if needed
        const filtered = state
          ? allCities.filter(c => String(c.sid2) === String(state))
          : allCities;
        setCities(filtered);
        setUsingCache(false);
        return filtered;
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
      // Try to use cached data as fallback
      const cachedCities = getCachedData(CACHE_KEYS.CITIES);
      if (cachedCities) {
        const filtered = state
          ? cachedCities.filter(c => String(c.sid2) === String(state))
          : cachedCities;
        setCities(filtered);
        setUsingCache(true);
      }
    }
    return [];
  }, []);

  const loadData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    await fetchCountries(forceRefresh);
    await fetchStates(selectedCountry, forceRefresh);
    await fetchCities(selectedState, forceRefresh);
    setLoading(false);
  }, [fetchCountries, fetchStates, fetchCities, selectedCountry, selectedState]);

  // Force refresh - clears cache and reloads from API
  const forceRefreshData = async () => {
    clearLocationCache();
    await loadData(true);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (activeTab === "state") {
      // Use cached data, filter locally
      const cachedStates = getCachedData(CACHE_KEYS.STATES);
      if (cachedStates) {
        const filtered = selectedCountry
          ? cachedStates.filter(s => String(s.cid) === String(selectedCountry))
          : cachedStates;
        setStates(filtered);
      } else {
        fetchStates(selectedCountry);
      }
    }
  }, [selectedCountry, activeTab, fetchStates]);

  useEffect(() => {
    if (activeTab === "city") {
      // Use cached data, filter locally
      const cachedCities = getCachedData(CACHE_KEYS.CITIES);
      if (cachedCities) {
        const filtered = selectedState
          ? cachedCities.filter(c => String(c.sid2) === String(selectedState))
          : cachedCities;
        setCities(filtered);
      } else {
        fetchCities(selectedState);
      }
    }
  }, [selectedState, activeTab, fetchCities]);

  // Modal handlers
  const openAddModal = () => {
    setModalMode("add");
    setEditItem(null);
    setFormData({ name: "", country: selectedCountry, state: selectedState, status: 1 });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setModalMode("edit");
    setEditItem(item);
    if (activeTab === "country") {
      setFormData({ name: item.country, country: "", state: "", status: 1 });
    } else if (activeTab === "state") {
      setFormData({ name: item.state, country: item.cid, state: "", status: 1 });
    } else {
      setFormData({ name: item.dist, country: "", state: item.sid2, status: item.status });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a name");
      return;
    }

    setSaving(true);
    try {
      let res;
      if (activeTab === "country") {
        if (modalMode === "add") {
          res = await axios.post(`${API}/api/admin/master/countries`, { country: formData.name });
        } else {
          res = await axios.put(`${API}/api/admin/master/countries/${editItem.id}`, { country: formData.name });
        }
        if (res.data.success) {
          // Invalidate cache and refresh from API
          invalidateCache(CACHE_KEYS.COUNTRIES);
          await fetchCountries(true);
        }
      } else if (activeTab === "state") {
        if (!formData.country) {
          alert("Please select a country");
          setSaving(false);
          return;
        }
        if (modalMode === "add") {
          res = await axios.post(`${API}/api/admin/master/states`, {
            country: formData.country,
            state: formData.name,
          });
        } else {
          res = await axios.put(`${API}/api/admin/master/states/${editItem.id}`, {
            country: formData.country,
            state: formData.name,
          });
        }
        if (res.data.success) {
          // Invalidate cache and refresh from API
          invalidateCache(CACHE_KEYS.STATES);
          await fetchStates(selectedCountry, true);
        }
      } else {
        if (!formData.state) {
          alert("Please select a state");
          setSaving(false);
          return;
        }
        if (modalMode === "add") {
          res = await axios.post(`${API}/api/admin/master/cities`, {
            state: formData.state,
            city: formData.name,
            status: formData.status,
          });
        } else {
          res = await axios.put(`${API}/api/admin/master/cities/${editItem.id}`, {
            state: formData.state,
            city: formData.name,
            status: formData.status,
          });
        }
        if (res.data.success) {
          // Invalidate cache and refresh from API
          invalidateCache(CACHE_KEYS.CITIES);
          await fetchCities(selectedState, true);
        }
      }

      if (res.data.success) {
        setShowModal(false);
        alert(res.data.message);
      } else {
        alert(res.data.message || "Error saving data");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert(err.response?.data?.message || "Error saving data");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);

    try {
      let res;
      if (activeTab === "country") {
        res = await axios.delete(`${API}/api/admin/master/countries/${itemToDelete.id}`);
        if (res.data.success) {
          // Invalidate cache and refresh from API
          invalidateCache(CACHE_KEYS.COUNTRIES);
          await fetchCountries(true);
        }
      } else if (activeTab === "state") {
        res = await axios.delete(`${API}/api/admin/master/states/${itemToDelete.id}`);
        if (res.data.success) {
          // Invalidate cache and refresh from API
          invalidateCache(CACHE_KEYS.STATES);
          await fetchStates(selectedCountry, true);
        }
      } else {
        res = await axios.delete(`${API}/api/admin/master/cities/${itemToDelete.id}`);
        if (res.data.success) {
          // Invalidate cache and refresh from API
          invalidateCache(CACHE_KEYS.CITIES);
          await fetchCities(selectedState, true);
        }
      }

      if (res.data.success) {
        setShowDeleteModal(false);
        setItemToDelete(null);
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Error deleting item");
    } finally {
      setDeleting(false);
    }
  };

  const getTabLabel = () => {
    if (activeTab === "country") return "Country";
    if (activeTab === "state") return "State";
    return "City";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Location Management</h1>
          <p className="text-gray-500 text-sm">
            Add and manage Country, State, and City options
            {usingCache && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                Using cached data
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={forceRefreshData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
            title="Force refresh from server"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing..." : "Sync"}
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
          >
            <Plus size={18} />
            Add {getTabLabel()}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("country")}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
            activeTab === "country"
              ? "bg-green-500 text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Globe size={18} />
          Country
          <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
            {countries.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("state")}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
            activeTab === "state"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <MapPin size={18} />
          State
          <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
            {states.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("city")}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
            activeTab === "city"
              ? "bg-orange-500 text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <MapPin size={18} />
          City / District
          <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
            {cities.length}
          </span>
        </button>
      </div>

      {/* Filters */}
      {activeTab === "state" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by Country:</label>
            <div className="relative">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 appearance-none bg-white min-w-[200px]"
              >
                <option value="">All Countries</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.country}>
                    {c.country}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      {activeTab === "city" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Country:</label>
              <div className="relative">
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setSelectedState("");
                    fetchStates(e.target.value);
                  }}
                  className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 appearance-none bg-white min-w-[180px]"
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.country}>
                      {c.country}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">State:</label>
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 appearance-none bg-white min-w-[180px]"
                  disabled={!selectedCountry}
                >
                  <option value="">All States</option>
                  {states.map((s) => (
                    <option key={s.id} value={s.state}>
                      {s.state}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading...
          </div>
        ) : (
          <>
            {/* Country Tab */}
            {activeTab === "country" && (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Country Name</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {countries.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-4 py-8 text-center text-gray-400">
                        No countries found. Click "Add Country" to add one.
                      </td>
                    </tr>
                  ) : (
                    countries.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-500">{item.id}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.country}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Edit3 size={16} />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => confirmDelete(item)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* State Tab */}
            {activeTab === "state" && (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Country</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">State Name</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {states.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-400">
                        No states found. Click "Add State" to add one.
                      </td>
                    </tr>
                  ) : (
                    states.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-500">{item.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.cid || item.country}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.state}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Edit3 size={16} />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => confirmDelete(item)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* City Tab */}
            {activeTab === "city" && (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">State</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">City / District</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cities.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-400">
                        No cities found. Select a state and click "Add City" to add one.
                      </td>
                    </tr>
                  ) : (
                    cities.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-500">{item.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.sid2 || item.state || "-"}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.dist}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 1
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {item.status === 1 ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Edit3 size={16} />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => confirmDelete(item)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-800">
                {modalMode === "add" ? "Add" : "Edit"} {getTabLabel()}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Country selector for State */}
              {activeTab === "state" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.country}>
                        {c.country}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* State selector for City */}
              {activeTab === "city" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      value={formData.country || selectedCountry}
                      onChange={(e) => {
                        setFormData({ ...formData, country: e.target.value, state: "" });
                        fetchStates(e.target.value);
                      }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">Select Country</option>
                      {countries.map((c) => (
                        <option key={c.id} value={c.country}>
                          {c.country}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">Select State</option>
                      {states.map((s) => (
                        <option key={s.id} value={s.state}>
                          {s.state}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {getTabLabel()} Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={`Enter ${getTabLabel().toLowerCase()} name`}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Status for City */}
              {activeTab === "city" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Delete {getTabLabel()}</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {activeTab === "country"
                  ? itemToDelete?.country
                  : activeTab === "state"
                  ? itemToDelete?.state
                  : itemToDelete?.dist}
              </span>
              ? This may affect existing member records.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
