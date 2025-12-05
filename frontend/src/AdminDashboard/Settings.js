import {
    Bell,
    Eye,
    EyeOff,
    Globe,
    Lock,
    Mail,
    Save,
    Shield,
    User,
} from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [profileForm, setProfileForm] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "admin@sriangalamman.com",
    phone: currentUser?.phone || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    newRegistrations: true,
    newInterests: true,
    weeklyReport: false,
    emailAlerts: true,
  });

  const [siteSettings, setSiteSettings] = useState({
    siteName: "SriAngalamman Matrimony",
    registrationEnabled: true,
    maintenanceMode: false,
    maxPhotosPerUser: 5,
  });

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "password", name: "Password", icon: Lock },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "site", name: "Site Settings", icon: Globe },
  ];

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your account and site preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <nav className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "bg-rose-50 text-rose-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                  <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {profileForm.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {profileForm.username}
                    </h3>
                    <p className="text-sm text-gray-500">Administrator</p>
                    <button className="mt-2 text-sm text-rose-600 hover:text-rose-700 font-medium">
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        value={profileForm.username}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            username: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="p-2 bg-rose-100 rounded-lg">
                    <Shield size={20} className="text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Change Password
                    </h3>
                    <p className="text-sm text-gray-500">
                      Update your password regularly to keep your account secure
                    </p>
                  </div>
                </div>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="p-2 bg-rose-100 rounded-lg">
                    <Bell size={20} className="text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Notification Preferences
                    </h3>
                    <p className="text-sm text-gray-500">
                      Choose what notifications you want to receive
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: "newRegistrations",
                      label: "New Registrations",
                      desc: "Get notified when new members register",
                    },
                    {
                      key: "newInterests",
                      label: "New Interest Requests",
                      desc: "Notifications for interest requests between members",
                    },
                    {
                      key: "weeklyReport",
                      label: "Weekly Report",
                      desc: "Receive weekly summary of platform activity",
                    },
                    {
                      key: "emailAlerts",
                      label: "Email Alerts",
                      desc: "Receive important alerts via email",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications({
                            ...notifications,
                            [item.key]: !notifications[item.key],
                          })
                        }
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          notifications[item.key] ? "bg-rose-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            notifications[item.key]
                              ? "translate-x-7"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Site Settings Tab */}
            {activeTab === "site" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="p-2 bg-rose-100 rounded-lg">
                    <Globe size={20} className="text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Site Settings</h3>
                    <p className="text-sm text-gray-500">
                      Configure your matrimony platform settings
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={siteSettings.siteName}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          siteName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Photos Per User
                    </label>
                    <input
                      type="number"
                      value={siteSettings.maxPhotosPerUser}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          maxPhotosPerUser: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">
                        Registration Enabled
                      </p>
                      <p className="text-sm text-gray-500">
                        Allow new users to register on the platform
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setSiteSettings({
                          ...siteSettings,
                          registrationEnabled: !siteSettings.registrationEnabled,
                        })
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        siteSettings.registrationEnabled
                          ? "bg-rose-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          siteSettings.registrationEnabled
                            ? "translate-x-7"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div>
                      <p className="font-medium text-gray-800">
                        Maintenance Mode
                      </p>
                      <p className="text-sm text-gray-500">
                        Put the site in maintenance mode (only admins can access)
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setSiteSettings({
                          ...siteSettings,
                          maintenanceMode: !siteSettings.maintenanceMode,
                        })
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        siteSettings.maintenanceMode
                          ? "bg-amber-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          siteSettings.maintenanceMode
                            ? "translate-x-7"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
