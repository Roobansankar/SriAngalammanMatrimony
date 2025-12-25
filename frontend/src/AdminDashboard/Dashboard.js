// import {
//   Bell,
//   BookOpen,
//   ChevronDown,
//   FileText,
//   Globe,
//   LayoutDashboard,
//   LogOut,
//   Menu,
//   Settings,
//   UserCircle,
//   UserCog,
//   Users,
//   X
// } from "lucide-react";
// import { useState } from "react";
// import { NavLink, Outlet, useNavigate } from "react-router-dom";

// const navLinks = [
//   {
//     name: "Dashboard",
//     path: "/admin/homedashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     name: "Add Users",
//     path: "/admin/add-users",
//     icon: UserCircle,
//   },
//   {
//     name: "All Members",
//     path: "/admin/all-members",
//     icon: Users,
//   },
//   {
//     name: "Manage Members",
//     path: "/admin/manage-members",
//     icon: UserCog,
//   },
//   {
//     name: "Member BioData",
//     path: "/admin/member-biodata",
//     icon: FileText,
//   },
//   {
//     name: "Add Religion/Caste",
//     path: "/admin/master-data",
//     icon: BookOpen,
//   },
//   {
//     name: "Add City/State/Country",
//     path: "/admin/location-data",
//     icon: Globe,
//   },
// ];

// export default function DashboardLayout() {
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [profileDropdown, setProfileDropdown] = useState(false);
//   const [notificationOpen, setNotificationOpen] = useState(false);

//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const username = currentUser?.username || "Admin";

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("currentUser");
//     navigate("/admin/login", { replace: true });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Mobile sidebar overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         {/* Logo */}
//         <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
//           <div className="flex items-center gap-2">
//             <img
//               src="https://sriangalammanmatrimony.com/images/logo.png"
//               alt="SriAngalamman"
//               className="h-10 w-auto object-contain"
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = "/logo192.png";
//               }}
//             />
//           </div>
//           <button
//             onClick={() => setSidebarOpen(false)}
//             className="lg:hidden text-white/70 hover:text-white"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="p-4 space-y-1">
//           <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3 px-3">
//             Main Menu
//           </p>
//           {navLinks.map((item) => (
//             <NavLink
//               key={item.name}
//               to={item.path}
//               onClick={() => setSidebarOpen(false)}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
//                   isActive
//                     ? "bg-rose-500/20 text-rose-400 border-l-2 border-rose-500"
//                     : "text-white/70 hover:bg-white/5 hover:text-white"
//                 }`
//               }
//             >
//               <item.icon size={18} />
//               {item.name}
//             </NavLink>
//           ))}

//           <div className="pt-6">
//             <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3 px-3">
//               Settings
//             </p>
//             <NavLink
//               to="/admin/settings"
//               className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-all"
//             >
//               <Settings size={18} />
//               Settings
//             </NavLink>
//           </div>
//         </nav>

//         {/* Bottom section */}
//         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
//           >
//             <LogOut size={18} />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col min-h-screen">
//         {/* Top Header */}
//         <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
//           {/* Left side */}
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
//             >
//               <Menu size={20} className="text-gray-600" />
//             </button>
//             <div>
//               <h1 className="text-lg font-semibold text-gray-800">
//                 Admin Dashboard
//               </h1>
//               <p className="text-xs text-gray-500 hidden sm:block">
//                 Manage your matrimony platform
//               </p>
//             </div>
//           </div>

//           {/* Right side */}
//           <div className="flex items-center gap-3">
//             {/* Notifications */}
//             <div className="relative">
//               <button 
//                 onClick={() => {
//                   setNotificationOpen(!notificationOpen);
//                   setProfileDropdown(false);
//                 }}
//                 className="relative p-2 rounded-lg hover:bg-gray-100 transition"
//                 title="Notifications"
//               >
//                 <Bell size={20} className="text-gray-600" />
//                 <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
//               </button>

//               {notificationOpen && (
//                 <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
//                   <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
//                     <p className="text-sm font-semibold text-gray-800">Notifications</p>
//                     <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">3 New</span>
//                   </div>
//                   <div className="max-h-64 overflow-y-auto">
//                     <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50">
//                       <div className="flex items-start gap-3">
//                         <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
//                           <Users size={14} className="text-emerald-600" />
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-800">New member registered</p>
//                           <p className="text-xs text-gray-500 mt-0.5">2 minutes ago</p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50">
//                       <div className="flex items-start gap-3">
//                         <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
//                           <Users size={14} className="text-blue-600" />
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-800">5 new registrations today</p>
//                           <p className="text-xs text-gray-500 mt-0.5">1 hour ago</p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
//                       <div className="flex items-start gap-3">
//                         <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
//                           <Bell size={14} className="text-amber-600" />
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-800">Weekly report ready</p>
//                           <p className="text-xs text-gray-500 mt-0.5">Yesterday</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="px-4 py-2 border-t border-gray-100">
//                     <button 
//                       onClick={() => {
//                         setNotificationOpen(false);
//                         navigate("/admin/homedashboard");
//                       }}
//                       className="w-full text-center text-sm text-rose-600 hover:text-rose-700 font-medium"
//                     >
//                       View All Activity
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Profile Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={() => {
//                   setProfileDropdown(!profileDropdown);
//                   setNotificationOpen(false);
//                 }}
//                 className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition"
//               >
//                 {currentUser?.photo ? (
//                   <img
//                     src={currentUser.photo}
//                     alt={username}
//                     className="w-8 h-8 rounded-full object-cover border-2 border-rose-500"
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.style.display = "none";
//                       e.target.nextSibling.style.display = "flex";
//                     }}
//                   />
//                 ) : null}
//                 <div 
//                   className={`w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full items-center justify-center ${currentUser?.photo ? "hidden" : "flex"}`}
//                 >
//                   <UserCircle size={20} className="text-white" />
//                 </div>
//                 <span className="hidden sm:block text-sm font-medium text-gray-700">
//                   {username}
//                 </span>
//                 <ChevronDown size={16} className="text-gray-500" />
//               </button>

//               {profileDropdown && (
//                 <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
//                   <div className="px-4 py-2 border-b border-gray-100">
//                     <p className="text-sm font-medium text-gray-800">
//                       {username}
//                     </p>
//                     <p className="text-xs text-gray-500">Administrator</p>
//                   </div>
//                   <NavLink
//                     to="/admin/settings"
//                     onClick={() => setProfileDropdown(false)}
//                     className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
//                   >
//                     <Settings size={16} />
//                     Settings
//                   </NavLink>
//                   <button
//                     onClick={handleLogout}
//                     className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
//                   >
//                     <LogOut size={16} />
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 p-4 lg:p-6 bg-gray-50 ">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }





import {
  Bell,
  BookOpen,
  ChevronDown,
  Crown,
  FileText,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  UserCircle,
  UserCheck,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const navLinks = [
  { name: "Dashboard", path: "/admin/homedashboard", icon: LayoutDashboard },
  { name: "New Users", path: "/admin/new-users", icon: UserCheck },
  { name: "Add Users", path: "/admin/add-users", icon: UserCircle },
  { name: "All Members", path: "/admin/all-members", icon: Users },
  { name: "Manage Members", path: "/admin/manage-members", icon: UserCog },
  { name: "Member BioData", path: "/admin/member-biodata", icon: FileText },
  { name: "Featured Profiles", path: "/admin/featured-profiles", icon: Users },
  { name: "Premium Members", path: "/admin/premium-members", icon: Crown, adminOnly: true },
  { name: "Manage Staff", path: "/admin/manage-staff", icon: Shield, adminOnly: true },
  { name: "Add Religion/Caste", path: "/admin/master-data", icon: BookOpen },
  {
    name: "Add City/State/Country",
    path: "/admin/location-data",
    icon: Globe,
  },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const username = currentUser?.username || "Admin";
  const isAdmin = currentUser?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64
        bg-slate-900
        transform transition-transform duration-300
        lg:translate-x-0 lg:static lg:z-auto
        flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo / Sidebar Navbar */}
        <div
          className="h-16 flex items-center justify-between px-4
          bg-slate-900
          border-b border-white/10
          sticky top-0 z-40"
        >
          <img
            src="https://sriangalammanmatrimony.com/images/logo.png"
            alt="SriAngalamman"
            className="h-10"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/logo192.png";
            }}
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <p className="px-3 py-2 mb-3 text-xs font-medium text-white/40 uppercase tracking-wider">
            Main Menu
          </p>

          {navLinks
            .filter((item) => !item.adminOnly || isAdmin)
            .map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-rose-500/20 text-rose-400 border-l-2 border-rose-500"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg
            text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 relative"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </button>

            {/* Profile */}
            <button
              onClick={() => setProfileDropdown(!profileDropdown)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
            >
              <UserCircle size={24} />
              <ChevronDown size={16} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
