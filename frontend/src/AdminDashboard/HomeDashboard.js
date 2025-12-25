import axios from "axios";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Heart,
  TrendingUp,
  UserCheck,
  UserCircle,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function HomeDashboard() {
  const API = process.env.REACT_APP_API_BASE || "";
  // Runtime-resolved API base (useful to detect deployed bundle still pointing to localhost)
  const resolvedApiBase = API || window.location.origin;
  // Use console.log because some browsers filter out console.debug by default
  console.log("Resolved API base:", resolvedApiBase);
  // Expose for quick inspection in console and runtime checks
  window.__RESOLVED_API_BASE__ = resolvedApiBase;
console.debug("Frontend resolved API base:", API || window.location.origin);

  const [stats, setStats] = useState({
    totalCount: 0,
    maleCount: 0,
    femaleCount: 0,
    todayRegistrations: 0,
    weeklyRegistrations: 0,
    monthlyRegistrations: 0,
    activeUsers: 0,
    pendingApprovals: 0,
  });

  const [recentMembers, setRecentMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const username = currentUser?.username || "Admin";

  useEffect(() => {
    fetchStats();
    fetchRecentMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStats = async () => {
    console.log("HomeDashboard: Fetching stats (v2-fix-port5000)...");
    try {
      // Urgent Production Fix: Hardcoded API URL with Port 5000
      const res = await axios.get(`http://80.65.208.64:5000/api/admin/dashboard-stats`);
      if (res.data.success) setStats(res.data.data);
    } catch (err) {
      console.error("Dashboard Error:", err);
    }
  };

  const fetchRecentMembers = async () => {
    console.log("HomeDashboard: Fetching recent members (v2-fix-port5000)...");
    try {
      // Urgent Production Fix: Hardcoded API URL with Port 5000
      const res = await axios.get(`http://80.65.208.64:5000/api/admin/recent-members`);
      if (res.data.success) setRecentMembers(res.data.members || []);
    } catch (err) {
      console.error("Recent members error:", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Members",
      value: stats.totalCount,
      icon: Users,
      trend: "+12%",
      trendUp: true,
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Male Members",
      value: stats.maleCount,
      icon: UserCheck,
      trend: "+8%",
      trendUp: true,
      color: "from-emerald-500 to-emerald-600",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Female Members",
      value: stats.femaleCount,
      icon: UserCheck,
      trend: "+15%",
      trendUp: true,
      color: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "New This Month",
      value: stats.monthlyRegistrations || Math.floor(stats.totalCount * 0.1),
      icon: UserPlus,
      trend: "+5%",
      trendUp: true,
      color: "from-rose-500 to-rose-600",
      bgLight: "bg-rose-50",
      textColor: "text-rose-600",
    },
  ];

  const quickStats = [
    {
      label: "Today's Registrations",
      value: stats.todayRegistrations || 3,
      icon: Calendar,
    },
    {
      label: "Active This Week",
      value: stats.weeklyRegistrations || 28,
      icon: Activity,
    },
    {
      label: "Success Matches",
      value: stats.successMatches || 156,
      icon: Heart,
    },
    {
      label: "Conversion Rate",
      value: "68%",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">
          Welcome back, {username}! 👋
        </h1>
        <p className="mt-1 text-rose-100">
          Here's what's happening with your matrimony platform today.
        </p>
        {/* DEBUG BANNER: visible on page so we can confirm which API base the running bundle uses */}
        <div className="mt-3">
          <span
            className={`inline-block text-xs px-2 py-1 rounded-md font-medium ${
<<<<<<< HEAD
              API_BASE.includes("localhost")
=======
              resolvedApiBase.includes("localhost")
>>>>>>> c0a4b8d (docker test 2)
                ? "bg-red-100 text-red-700"
                : "bg-green-50 text-green-700"
            }`}
          >
<<<<<<< HEAD
            API base: {API_BASE}
=======
            API base: {resolvedApiBase}
>>>>>>> c0a4b8d (docker test 2)
          </span>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-12 h-12 ${card.bgLight} rounded-xl flex items-center justify-center`}
              >
                <card.icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  card.trendUp ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {card.trendUp ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <ArrowDownRight size={14} />
                )}
                {card.trend}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <stat.icon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Members */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Members
            </h2>
            <a
              href="/admin/all-members"
              className="text-sm text-rose-600 hover:text-rose-700 font-medium"
            >
              View All →
            </a>
          </div>
          <div className="p-5">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : recentMembers.length > 0 ? (
              <div className="space-y-4">
                {recentMembers.slice(0, 5).map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition"
                  >
                    {member.PhotoURL && !member.PhotoURL.includes("nophoto") ? (
                      <img
                        src={member.PhotoURL}
                        alt={member.Name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${member.Gender === "Male" ? "from-blue-200 to-blue-300" : "from-pink-200 to-pink-300"} items-center justify-center flex-shrink-0 ${member.PhotoURL && !member.PhotoURL.includes("nophoto") ? "hidden" : "flex"}`}
                    >
                      <UserCircle size={24} className={member.Gender === "Male" ? "text-blue-600" : "text-pink-600"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {member.Name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {member.MatriID} • {member.Gender}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        {member.Regdate
                          ? new Date(member.Regdate).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <span
                        className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                          member.Status === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {member.Status || "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recent members found
              </div>
            )}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Platform Overview
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-600">Male to Female Ratio</span>
              <span className="font-semibold text-blue-600">
                {stats.maleCount && stats.femaleCount
                  ? `${((stats.maleCount / stats.femaleCount) * 100).toFixed(0)}%`
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <span className="text-sm text-gray-600">Profile Completion</span>
              <span className="font-semibold text-emerald-600">78%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-sm text-gray-600">Photo Approval Rate</span>
              <span className="font-semibold text-purple-600">92%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
              <span className="text-sm text-gray-600">Active Users (7d)</span>
              <span className="font-semibold text-rose-600">
                {stats.activeUsers || 45}
              </span>
            </div>

            {/* Mini Chart Placeholder */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-2">Monthly Growth</p>
              <div className="flex items-end gap-1 h-16">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-rose-400 rounded-t"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>Mon</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
