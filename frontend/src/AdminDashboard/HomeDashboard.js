import axios from "axios";
import {
    Activity,
    Briefcase,
    Calendar,
    Crown,
    RefreshCw,
    Stethoscope,
    TrendingUp,
    UserCheck,
    UserCircle,
    UserPlus,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_BASE || "";

export default function HomeDashboard() {
  const [stats, setStats] = useState({
    totalCount: 0,
    maleCount: 0,
    femaleCount: 0,
    todayRegistrations: 0,
    weeklyRegistrations: 0,
    monthlyRegistrations: 0,
    activeUsers: 0,
    pendingApprovals: 0,
    premiumCount: 0,
    doctorsCount: 0,
    remarriageCount: 0,
    profileCompletionRate: 0,
    photoApprovalRate: 0,
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
    try {
      const res = await axios.get(`${API}/api/admin/dashboard-stats`);
      if (res.data.success) setStats(res.data.data);
    } catch (err) {
      console.error("Dashboard Error:", err);
    }
  };

  const fetchRecentMembers = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/recent-members`);
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
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Male Members",
      value: stats.maleCount,
      icon: UserCheck,
      color: "from-emerald-500 to-emerald-600",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Female Members",
      value: stats.femaleCount,
      icon: UserCheck,
      color: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "New This Month",
      value: stats.monthlyRegistrations,
      icon: UserPlus,
      color: "from-rose-500 to-rose-600",
      bgLight: "bg-rose-50",
      textColor: "text-rose-600",
    },
  ];

  // Category-wise stat cards
  const categoryCards = [
    {
      title: "Doctors",
      value: stats.doctorsCount,
      icon: Stethoscope,
      description: "Medical professionals",
      bgLight: "bg-teal-50",
      textColor: "text-teal-600",
      borderColor: "border-teal-200",
    },
    {
      title: "Premium Members",
      value: stats.premiumCount,
      icon: Crown,
      description: "Paid subscribers",
      bgLight: "bg-amber-50",
      textColor: "text-amber-600",
      borderColor: "border-amber-200",
    },
    {
      title: "Remarriage",
      value: stats.remarriageCount,
      icon: RefreshCw,
      description: "Divorced/Widow(er)",
      bgLight: "bg-indigo-50",
      textColor: "text-indigo-600",
      borderColor: "border-indigo-200",
    },
  ];

  const quickStats = [
    {
      label: "Today's Registrations",
      value: stats.todayRegistrations,
      icon: Calendar,
    },
    {
      label: "Active This Week",
      value: stats.weeklyRegistrations,
      icon: Activity,
    },
    {
      label: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: Briefcase,
    },
    {
      label: "Active Users (7d)",
      value: stats.activeUsers,
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
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category Cards - Doctors, Premium, Remarriage */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {categoryCards.map((card, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl p-5 shadow-sm border ${card.borderColor} hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 ${card.bgLight} rounded-xl flex items-center justify-center`}
              >
                <card.icon className={`w-7 h-7 ${card.textColor}`} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
                <p className="text-sm font-medium text-gray-700">{card.title}</p>
                <p className="text-xs text-gray-500">{card.description}</p>
              </div>
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
                  ? `${stats.maleCount} : ${stats.femaleCount}`
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <span className="text-sm text-gray-600">Profile Completion</span>
              <span className="font-semibold text-emerald-600">
                {stats.profileCompletionRate}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-sm text-gray-600">Photo Approval Rate</span>
              <span className="font-semibold text-purple-600">
                {stats.photoApprovalRate}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
              <span className="text-sm text-gray-600">Active Users (7d)</span>
              <span className="font-semibold text-rose-600">
                {stats.activeUsers}
              </span>
            </div>

            {/* Category Summary */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-3 font-medium">Category Breakdown</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Doctors</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${stats.totalCount > 0 ? Math.min((stats.doctorsCount / stats.totalCount) * 100, 100) : 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{stats.doctorsCount}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Premium</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${stats.totalCount > 0 ? Math.min((stats.premiumCount / stats.totalCount) * 100, 100) : 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{stats.premiumCount}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Remarriage</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${stats.totalCount > 0 ? Math.min((stats.remarriageCount / stats.totalCount) * 100, 100) : 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{stats.remarriageCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
