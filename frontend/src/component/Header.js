// // src/component/Header.jsx
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
// import { Menu, X, Search, ChevronDown, User } from "lucide-react";

// export default function Header({ user, setUser }) {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState(null); // <-- unified dropdown control
//   const navigate = useNavigate();
//   const location = useLocation();

//   const aboutRef = useRef(null);
//   const modifyRef = useRef(null);
//   const searchRef = useRef(null);

//   useEffect(() => {
//     setOpenDropdown(null);
//     setMobileOpen(false);
//   }, [location.pathname]);

//   const handleLinkClick = () => {
//     setOpenDropdown(null);
//     setMobileOpen(false);
//   };

//   const getProfileImage = (u) => {
//     const placeholder = "https://via.placeholder.com/40";
//     if (!u) return placeholder;
//     if (u.PhotoURL && u.PhotoURL.trim()) return u.PhotoURL;
//     return placeholder;
//   };
//   const profileImage = getProfileImage(user);

//   const handleLogout = () => {
//     localStorage.removeItem("loggedInEmail");
//     localStorage.removeItem("userData");
//     setUser(null);
//     navigate("/login", { replace: true });
//   };

//   const NOTIF_KEY = "app_notifications_v1";
//   const [unread, setUnread] = useState(0);

//   const refreshUnread = useCallback(() => {
//     try {
//       const raw = localStorage.getItem(NOTIF_KEY);
//       const arr = raw ? JSON.parse(raw) : [];
//       const cnt = Array.isArray(arr)
//         ? arr.filter((n) => n && !n.read).length
//         : 0;
//       setUnread(cnt);
//     } catch {
//       setUnread(0);
//     }
//   }, []);

//   useEffect(() => {
//     refreshUnread();
//     const onStorage = (e) => {
//       if (e.key === NOTIF_KEY) refreshUnread();
//     };
//     const onFocus = () => refreshUnread();
//     window.addEventListener("storage", onStorage);
//     window.addEventListener("focus", onFocus);
//     return () => {
//       window.removeEventListener("storage", onStorage);
//       window.removeEventListener("focus", onFocus);
//     };
//   }, [refreshUnread]);

//   const aboutItems = [
//     { name: "About Us", path: "/about" },
//     { name: "FAQ", path: "/faq" },
//     { name: "Terms & Conditions", path: "/terms" },
//     { name: "Privacy Policy", path: "/privacy" },
//     { name: "Return Policy", path: "/returns" },
//     { name: "Disclaimer", path: "/disclaimer" },
//     { name: "Report Misuse", path: "/report-misuse" },
//   ];

//   const modifyItems = [
//     { name: "My Profile", path: "/profile" },
//     { name: "Basic", path: "/profile/basic" },
//     { name: "Horoscope", path: "/profile/horoscope" },
//     { name: "Contact Details", path: "/profile/contact" },
//     { name: "Educational & Professional", path: "/profile/education" },
//     { name: "Basic & Lifestyle", path: "/profile/lifestyle" },
//     { name: "Family Details", path: "/profile/family" },
//     { name: "Partner Preference", path: "/profile/partner-preference" },
//   ];

//   const searchItems = [
//     { name: "Regular Search", path: "/regular-search" },
//     { name: "Advance Search", path: "/advanced-search" },
//     { name: "ID Search", path: "/id-search" },
//     { name: "Horoscope Search", path: "/horoscope-search" },
//   ];

//   const guestNavItems = [
//     { name: "Search", path: "/search" },
//     { name: "Membership", path: "/membership" },
//     { name: "Success Story", path: "/success-story" },
//     { name: "Contact Us", path: "/contact" },
//   ];

//   const userNavItems = [
    // { name: "My BioData", path: "/bio" },
    // { name: "Modify Profile", hasDropdown: true, icon: User },
    // { name: "Matches", path: "/matches/1" },
//     { name: "Search", hasSearchDropdown: true },
//     { name: "Notification", path: "/notifications" },
//     { name: "Incoming interests", path: "/incoming" },
//   ];

//   const mainNav = user ? userNavItems : guestNavItems;

//   const { pathname } = useLocation();
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 80);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const isHome = pathname === "/";
//   const transparentMode = isHome && !scrolled;
//   const desktopHeaderStyle = transparentMode
//     ? "md:bg-white/10 md:backdrop-blur-md md:backdrop-brightness-125 md:text-white"
//     : "md:bg-white md:text-gray-800 md:shadow-md";

//   const dropdownBgClass = "bg-white text-gray-700 font-medium shadow-lg";

//   return (
//     <header
//       className={`fixed w-full z-50 transition-all duration-300 font-display bg-white text-gray-800 shadow-md md:shadow-none ${desktopHeaderStyle}`}
//     >
//       <nav className="container mx-auto flex items-center justify-between px-4 py-3">
//         {/* Logo */}
//         <Link
//           to="/"
//           onClick={handleLinkClick}
//           className="flex items-center gap-3"
//         >
//           <img
//             src="https://sriangalammanmatrimony.com/images/logo.png"
//             className={`h-14 ${transparentMode ? "md:drop-shadow-lg" : ""}`}
//             alt="logo"
//           />
//         </Link>

//         {/* Desktop Menu */}
//         <ul
//           className={`hidden md:flex items-center gap-6 font-medium ${
//             transparentMode ? "text-white" : "text-gray-800"
//           }`}
//         >
//           {!user && (
//             <>
//               <NavLink
//                 to="/"
//                 onClick={handleLinkClick}
//                 className="hover:text-pink-500"
//               >
//                 Home
//               </NavLink>

//               {/* About dropdown */}
//               <li className="relative" ref={aboutRef}>
//                 <button
//                   onClick={() =>
//                     setOpenDropdown(openDropdown === "about" ? null : "about")
//                   }
//                   className="flex items-center gap-1 hover:text-pink-500"
//                 >
//                   About Us <ChevronDown size={16} />
//                 </button>

//                 {openDropdown === "about" && (
//                   <div
//                     className={`absolute w-56 rounded mt-2 border border-gray-200 ${dropdownBgClass}`}
//                   >
//                     {aboutItems.map((item, i) => (
//                       <Link
//                         key={item.name}
//                         to={item.path}
//                         onClick={handleLinkClick}
//                         className={`block px-4 py-2 hover:bg-pink-500/20 ${
//                           i !== aboutItems.length - 1
//                             ? "border-b border-gray-200"
//                             : ""
//                         }`}
//                       >
//                         {item.name}
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </li>

//               {guestNavItems.map(({ name, path }) => (
//                 <NavLink
//                   key={name}
//                   to={path}
//                   onClick={handleLinkClick}
//                   className="hover:text-pink-500"
//                 >
//                   {name}
//                 </NavLink>
//               ))}
//             </>
//           )}

//           {user &&
//             mainNav.map(({ name, path, hasDropdown, hasSearchDropdown }) => {
//               if (hasDropdown) {
//                 return (
//                   <li key={name} className="relative" ref={modifyRef}>
//                     <button
//                       onClick={() =>
//                         setOpenDropdown(
//                           openDropdown === "modify" ? null : "modify"
//                         )
//                       }
//                       className="hover:text-pink-500 flex items-center gap-1"
//                     >
//                       <User className="w-5 h-5" /> {name}{" "}
//                       <ChevronDown size={16} />
//                     </button>
//                     {openDropdown === "modify" && (
//                       <div
//                         className={`absolute w-56 rounded mt-2 border border-gray-200 ${dropdownBgClass}`}
//                       >
//                         {modifyItems.map((it, i) => (
//                           <Link
//                             key={it.name}
//                             to={it.path}
//                             onClick={handleLinkClick}
//                             className={`block px-4 py-2 hover:bg-pink-500/20 ${
//                               i !== modifyItems.length - 1
//                                 ? "border-b border-gray-200"
//                                 : ""
//                             }`}
//                           >
//                             {it.name}
//                           </Link>
//                         ))}
//                       </div>
//                     )}
//                   </li>
//                 );
//               }

//               if (hasSearchDropdown) {
//                 return (
//                   <li key={name} className="relative" ref={searchRef}>
//                     <button
//                       onClick={() =>
//                         setOpenDropdown(
//                           openDropdown === "search" ? null : "search"
//                         )
//                       }
//                       className="hover:text-pink-500 flex items-center gap-1"
//                     >
//                       <Search className="w-5 h-5" /> {name}{" "}
//                       <ChevronDown size={16} />
//                     </button>
//                     {openDropdown === "search" && (
//                       <div
//                         className={`absolute w-48 rounded mt-2 border border-gray-200 ${dropdownBgClass}`}
//                       >
//                         {searchItems.map((it, i) => (
//                           <Link
//                             key={it.name}
//                             to={it.path}
//                             onClick={handleLinkClick}
//                             className={`block px-4 py-2 hover:bg-pink-500/20 ${
//                               i !== searchItems.length - 1
//                                 ? "border-b border-gray-200"
//                                 : ""
//                             }`}
//                           >
//                             {it.name}
//                           </Link>
//                         ))}
//                       </div>
//                     )}
//                   </li>
//                 );
//               }

//               return (
//                 <NavLink
//                   key={name}
//                   to={path}
//                   onClick={handleLinkClick}
//                   className="hover:text-pink-500 flex items-center gap-2"
//                 >
//                   {name}
//                   {name === "Notification" && unread > 0 && (
//                     <span className="bg-red-600 text-xs px-2 rounded-full ml-1">
//                       {unread > 99 ? "99+" : unread}
//                     </span>
//                   )}
//                 </NavLink>
//               );
//             })}
//         </ul>

//         {/* Profile / Login */}
//         <div className="hidden md:flex items-center gap-4">
//           {user ? (
//             <>
//               <img
//                 src={profileImage}
//                 className="w-10 h-10 rounded-full"
//                 alt="profile"
//               />
//               <button
//                 onClick={handleLogout}
//                 className="bg-pink-600 px-4 py-1 rounded text-white"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link
//                 to="/login"
//                 onClick={handleLinkClick}
//                 className="bg-orange-500 px-4 py-2 rounded text-white"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/register"
//                 onClick={handleLinkClick}
//                 className="bg-orange-500 px-4 py-2 rounded text-white"
//               >
//                 Register
//               </Link>
//             </>
//           )}
//         </div>

//         {/* Mobile Icon */}
//         <button
//           className="md:hidden text-gray-800"
//           onClick={() => setMobileOpen(!mobileOpen)}
//         >
//           {mobileOpen ? <X size={28} /> : <Menu size={28} />}
//         </button>
//       </nav>

//       {/* Mobile Slide Menu */}
//       <div
//         className={`fixed top-0 right-0 h-screen w-3/4 bg-white text-gray-800 transform ${
//           mobileOpen ? "translate-x-0" : "translate-x-full"
//         } transition-transform duration-300 ease-in-out shadow-lg md:hidden z-[9999] flex flex-col`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
//           <div className="flex-1"></div>
//           <button
//             onClick={() => setMobileOpen(false)}
//             className="text-gray-700 ml-auto"
//           >
//             <X size={28} />
//           </button>
//         </div>

//         {/* Scrollable content */}
//         <div className="flex-1 overflow-y-auto px-4 pb-24">
//           {!user && (
//             <>
//               <NavLink
//                 to="/"
//                 onClick={handleLinkClick}
//                 className="py-2 border-b block"
//               >
//                 Home
//               </NavLink>

//               <button
//                 onClick={() =>
//                   setOpenDropdown(openDropdown === "about" ? null : "about")
//                 }
//                 className="py-2 flex justify-between w-full border-b"
//               >
//                 About Us <ChevronDown />
//               </button>
//               {openDropdown === "about" &&
//                 aboutItems.map((item, i) => (
//                   <Link
//                     key={item.name}
//                     to={item.path}
//                     onClick={handleLinkClick}
//                     className={`pl-4 py-2 text-sm block ${
//                       i !== aboutItems.length - 1 ? "border-b" : ""
//                     }`}
//                   >
//                     {item.name}
//                   </Link>
//                 ))}

//               {guestNavItems.map(({ name, path }) => (
//                 <NavLink
//                   key={name}
//                   to={path}
//                   onClick={handleLinkClick}
//                   className="py-2 border-b block"
//                 >
//                   {name}
//                 </NavLink>
//               ))}

//               <Link
//                 to="/login"
//                 onClick={handleLinkClick}
//                 className="bg-orange-500 text-white px-6 py-2 rounded text-center mt-6 block"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/register"
//                 onClick={handleLinkClick}
//                 className="bg-orange-500 text-white px-6 py-2 rounded text-center mt-3 block"
//               >
//                 Register
//               </Link>
//             </>
//           )}

//           {user && (
//             <>
//               <button
//                 onClick={() =>
//                   setOpenDropdown(openDropdown === "modify" ? null : "modify")
//                 }
//                 className="py-2 flex justify-between w-full border-b"
//               >
//                 Modify Profile <ChevronDown />
//               </button>
//               {openDropdown === "modify" &&
//                 modifyItems.map((it, i) => (
//                   <Link
//                     key={it.name}
//                     to={it.path}
//                     onClick={handleLinkClick}
//                     className={`pl-4 py-2 text-sm block ${
//                       i !== modifyItems.length - 1 ? "border-b" : ""
//                     }`}
//                   >
//                     {it.name}
//                   </Link>
//                 ))}

//               <button
//                 onClick={() =>
//                   setOpenDropdown(openDropdown === "search" ? null : "search")
//                 }
//                 className="py-2 flex justify-between w-full border-b"
//               >
//                 Search <ChevronDown />
//               </button>
//               {openDropdown === "search" &&
//                 searchItems.map((it, i) => (
//                   <Link
//                     key={it.name}
//                     to={it.path}
//                     onClick={handleLinkClick}
//                     className={`pl-4 py-2 text-sm block ${
//                       i !== searchItems.length - 1 ? "border-b" : ""
//                     }`}
//                   >
//                     {it.name}
//                   </Link>
//                 ))}

//               {userNavItems
//                 .filter((n) => !n.hasDropdown && !n.hasSearchDropdown)
//                 .map(({ name, path }) => (
//                   <NavLink
//                     key={name}
//                     to={path}
//                     onClick={handleLinkClick}
//                     className="py-2 border-b block"
//                   >
//                     {name}
//                   </NavLink>
//                 ))}

//               <button
//                 onClick={handleLogout}
//                 className="bg-pink-600 text-white px-6 py-2 rounded text-center mt-6 w-full"
//               >
//                 Logout
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }


import { Bell, ChevronDown, Heart, Menu, Search, UserCircle, Users, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

export default function Header({ user, setUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const aboutRef = useRef(null);
  const modifyRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLinkClick = () => {
    setOpenDropdown(null);
    setMobileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        aboutRef.current &&
        !aboutRef.current.contains(e.target) &&
        modifyRef.current &&
        !modifyRef.current.contains(e.target) &&
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getProfileImage = (u) => {
    const placeholder = "https://via.placeholder.com/40";
    if (!u) return placeholder;
    if (u.PhotoURL && u.PhotoURL.trim()) return u.PhotoURL;
    return placeholder;
  };
  const profileImage = getProfileImage(user);

  const handleLogout = () => {
    localStorage.removeItem("loggedInEmail");
    localStorage.removeItem("userData");
    setUser(null);
    navigate("/login", { replace: true });
  };

  const NOTIF_KEY = "app_notifications_v1";
  const [unread, setUnread] = useState(0);
  const [incomingCount, setIncomingCount] = useState(0);
  const [chatRequestCount, setChatRequestCount] = useState(0);

  // Use centralized API config (properly normalizes /api prefix)
  const API = require('../config/api').API;

  const loggedId = user?.MatriID || user?.matid || null;

  const refreshUnread = useCallback(() => {
    try {
      const raw = localStorage.getItem(NOTIF_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      const cnt = Array.isArray(arr)
        ? arr.filter((n) => n && !n.read).length
        : 0;
      setUnread(cnt);
    } catch {
      setUnread(0);
    }
  }, []);

  const fetchIncomingCount = useCallback(async () => {
    if (!loggedId) return;
    try {
      const res = await fetch(`${API}/auth/interest/incoming?to=${encodeURIComponent(loggedId)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.incoming)) {
        const pendingCount = data.incoming.filter(i => i.status === 'pending').length;
        setIncomingCount(pendingCount);
      }
    } catch (err) {
      console.error("Failed to fetch incoming interests count:", err);
    }
  }, [loggedId, API]);

  const fetchChatRequestCount = useCallback(async () => {
    if (!loggedId) return;
    try {
      const res = await fetch(`${API}/chat/requests?matriid=${encodeURIComponent(loggedId)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        setChatRequestCount(data.requests.length);
      }
    } catch (err) {
      console.error("Failed to fetch chat requests count:", err);
    }
  }, [loggedId, API]);

  useEffect(() => {
    refreshUnread();
    fetchIncomingCount();
    fetchChatRequestCount();
    const onStorage = (e) => {
      if (e.key === NOTIF_KEY) refreshUnread();
    };
    const onFocus = () => {
      refreshUnread();
      fetchIncomingCount();
      fetchChatRequestCount();
    };
    const onIncomingUpdate = () => {
      fetchIncomingCount();
      fetchChatRequestCount();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    window.addEventListener("incoming_interest_update", onIncomingUpdate);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("incoming_interest_update", onIncomingUpdate);
    };
  }, [refreshUnread, fetchIncomingCount, fetchChatRequestCount]);

  const aboutItems = [
    { name: "About", path: "/about" },
    { name: "FAQ", path: "/faq" },
    { name: "Terms & Conditions", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Return Policy", path: "/returns" },
    { name: "Disclaimer", path: "/disclaimer" },
    { name: "Report Misuse", path: "/report-misuse" },
  ];

  const modifyItems = [
    { name: "My Profile", path: "/profile" },
    { name: "Basic", path: "/profile/basic" },
    { name: "Horoscope", path: "/profile/horoscope" },
    { name: "Contact Details", path: "/profile/contact" },
    { name: "Educational & Professional", path: "/profile/education" },
    { name: "Basic & Lifestyle", path: "/profile/lifestyle" },
    { name: "Family Details", path: "/profile/family" },
    { name: "Partner Preference", path: "/profile/partner-preference" },
  ];

  const searchItems = [
    { name: "Regular Search", path: "/regular-search" },
    { name: "Advance Search", path: "/advanced-search" },
    { name: "ID Search", path: "/id-search" },
    { name: "Horoscope Search", path: "/horoscope-search" },
  ];

  const guestNavItems = [
    { name: "Search", path: "/search" },
    { name: "Membership", path: "/membership" },
    { name: "Success Story", path: "/success-story" },
    { name: "Contact Us", path: "/contact" },
  ];

  const userNavItems = [
    { name: "Matches", path: "/matches/1", icon: Users },
    { name: "Interests", path: "/incoming", icon: Heart },
    { name: "Notification", path: "/notifications", icon: Bell },
    { name: "Search", hasSearchDropdown: true, icon: Search },
  ];

  const mainNav = user ? userNavItems : guestNavItems;
  const { pathname } = useLocation();

  const transparentPages = [
  "/",
  "/faq",
  "/terms",
  "/privacy",
  "/returns",
  "/disclaimer",
  "/report-misuse",
];

  const isTransparentPage = transparentPages.includes(pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const desktopHeaderStyle = isTransparentPage
    ? scrolled
      ? "md:bg-white md:text-gray-800 md:shadow-md"
      : "md:bg-transparent md:text-white md:backdrop-blur-md md:shadow-none"
    : "md:bg-white md:text-gray-800 md:shadow-md";

  // Modern dropdown styling
  const dropdownBgClass = "bg-white text-gray-700 font-medium shadow-xl rounded-xl border border-gray-100";

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 font-display ${desktopHeaderStyle}`}
    >
      <nav className="container mx-auto flex items-center justify-between px-4 py-3 bg-white text-black md:bg-transparent md:text-inherit relative">
        {/* Logo */}
        <Link to="/" onClick={handleLinkClick} className="flex items-center gap-3 flex-shrink-0 z-10">
          <img
            src="https://sriangalammanmatrimony.com/images/logo.png"
            className={`h-14 ${!scrolled && isTransparentPage ? "md:drop-shadow-lg" : ""}`}
            alt="logo"
          />
        </Link>

        {/* Desktop Links - Centered absolutely for logged-in users */}
        <ul
          className={`hidden md:flex items-center gap-6 font-medium ${
            user ? "absolute left-1/2 -translate-x-1/2" : ""
          } ${isTransparentPage && !scrolled ? "text-white" : "text-gray-800"}`}
        >
          {!user ? (
            <>
              <li className="relative" ref={aboutRef}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === "about" ? null : "about")}
                  className="flex items-center gap-1 hover:text-rose-600 transition-colors"
                >
                  About Us <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === "about" ? "rotate-180" : ""}`} />
                </button>

                {openDropdown === "about" && (
                  <div className={`absolute top-full left-0 mt-2 w-56  ${dropdownBgClass} animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden`}>
                    {aboutItems.map((item, i) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={handleLinkClick}
                        className={`block px-4 py-2.5 hover:bg-rose-50 hover:text-rose-600 transition-colors ${i !== aboutItems.length - 1 ? "border-b border-gray-100" : ""}`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </li>

              {guestNavItems.map(({ name, path }) => (
                <NavLink key={name} to={path} onClick={handleLinkClick} className="hover:text-rose-600 px-3 py-2 rounded transition">
                  {name}
                </NavLink>
              ))}
            </>
          ) : (
            <>
              {mainNav.map(({ name, path, hasSearchDropdown, icon: Icon }) => {
                if (hasSearchDropdown) {
                  return (
                    <li key={name} className="relative" ref={searchRef}>
                      <button onClick={() => setOpenDropdown(openDropdown === "search" ? null : "search")} className="flex items-center gap-1.5 hover:text-rose-600 transition-colors">
                        {Icon && <Icon className="w-5 h-5" />} {name} <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === "search" ? "rotate-180" : ""}`} />
                      </button>

                      {openDropdown === "search" && (
                        <div className={`absolute top-full left-0 mt-2 w-52 py-2 ${dropdownBgClass} animate-in fade-in slide-in-from-top-2 duration-200`}>
                          {searchItems.map((it, i) => (
                            <Link key={it.name} to={it.path} onClick={handleLinkClick} className={`block px-4 py-2.5 hover:bg-rose-50 hover:text-rose-600 transition-colors ${i !== searchItems.length - 1 ? "border-b border-gray-100" : ""}`}>
                              {it.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                }

                return (
                  <NavLink key={name} to={path} onClick={handleLinkClick} className="hover:text-rose-600 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5">
                    {Icon && <Icon className="w-5 h-5" />}
                    {name}
                    {name === "Notification" && unread > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unread > 99 ? "99+" : unread}</span>
                    )}
                    {name === "Interests" && (incomingCount + chatRequestCount) > 0 && (
                      <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">{(incomingCount + chatRequestCount) > 99 ? "99+" : (incomingCount + chatRequestCount)}</span>
                    )}
                  </NavLink>
                );
              })}
            </>
          )}
        </ul>

        {/* Desktop Profile/Login */}
        <div className="hidden md:flex items-center gap-4 relative" ref={profileRef}>
          {user ? (
            <>
              {/* Profile image/icon toggles dropdown (no caret) */}
              <button
                onClick={() => setOpenDropdown(openDropdown === "profile" ? null : "profile")}
                className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-rose-400 transition-all focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
                aria-label="Profile menu"
              >
                {user.PhotoURL && user.PhotoURL.trim() ? (
                  <img src={profileImage} className="w-full h-full object-cover" alt="profile" />
                ) : (
                  <UserCircle className="w-10 h-10 text-gray-400" />
                )}
              </button>

              {openDropdown === "profile" && (
                <div className={`absolute right-0 top-full mt-2 w-56 overflow-hidden ${dropdownBgClass} animate-in fade-in slide-in-from-top-2 duration-200`}>
                  {/* My BioData */}
                  <Link
                    to="/bio"
                    onClick={() => { handleLinkClick(); setOpenDropdown(null); }}
                    className="block px-4 py-2.5 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    My BioData
                  </Link>

                  {/* Modify Profile - submenu header */}
                  <div className="px-4  py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide border-t border-gray-100">
                    Modify Profile
                  </div>
                  {modifyItems.map((it) => (
                    <Link
                      key={it.name}
                      to={it.path}
                      onClick={() => { handleLinkClick(); setOpenDropdown(null); }}
                      className="block px-4 py-2 text-sm hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      {it.name}
                    </Link>
                  ))}

                  {/* Divider & Logout */}
                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={() => { setOpenDropdown(null); handleLogout(); }}
                      className="w-full text-left px-4 py-2.5 text-rose-600 font-medium hover:bg-rose-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="bg-rose-600 hover:bg-rose-700 px-5 py-2 rounded-lg text-white font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={handleLinkClick}
                className="border border-rose-600 text-rose-600 hover:bg-rose-50 px-5 py-2 rounded-lg font-medium transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* ✅ Mobile Menu Button */}
        <button
          className="md:hidden text-black"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* ✅ Fullscreen Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-screen w-full bg-white text-black transform ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out shadow-lg md:hidden z-[9999] flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
          <Link to="/" onClick={handleLinkClick} className="flex items-center gap-3">
            <img
              src="https://sriangalammanmatrimony.com/images/logo.png"
              alt="logo"
              className="h-14"
            />
          </Link>
          <button onClick={() => setMobileOpen(false)} className="text-black">
            <X size={28} />
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto px-6 pb-24 mt-2 text-black`}>
          {!user ? (
            <>

              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "about" ? null : "about")
                }
                className="py-2 text-lg flex justify-between w-full border-b font-medium text-black"
              >
                About Us <ChevronDown />
              </button>

              {openDropdown === "about" &&
                aboutItems.map((item, i) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={handleLinkClick}
                    className={`pl-4 py-3 text-black text-base block rounded-xl${
                      i !== aboutItems.length - 1 ? "border-b" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

              {guestNavItems.map(({ name, path }) => (
                <NavLink
                  key={name}
                  to={path}
                  onClick={handleLinkClick}
                  className="py-3 text-lg border-b block font-medium text-black"
                >
                  {name}
                </NavLink>
              ))}

              <Link
                to="/login"
                onClick={handleLinkClick}
                className="bg-pink-700 text-white px-6 py-3 rounded text-center mt-6 block"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={handleLinkClick}
                className="bg-pink-700 text-white px-6 py-3 rounded text-center mt-3 block"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "modify" ? null : "modify")
                }
                className="py-3 text-lg flex justify-between w-full border-b font-medium text-black"
              >
                Modify Profile <ChevronDown />
              </button>
              {openDropdown === "modify" &&
                modifyItems.map((it, i) => (
                  <Link
                    key={it.name}
                    to={it.path}
                    onClick={handleLinkClick}
                    className={`pl-4 py-2 text-black text-base block ${
                      i !== modifyItems.length - 1 ? "border-b" : ""
                    }`}
                  >
                    {it.name}
                  </Link>
                ))}

              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "search" ? null : "search")
                }
                className="py-3 text-lg flex justify-between w-full border-b font-medium text-black"
              >
                Search <ChevronDown />
              </button>
              {openDropdown === "search" &&
                searchItems.map((it, i) => (
                  <Link
                    key={it.name}
                    to={it.path}
                    onClick={handleLinkClick}
                    className={`pl-4 py-2 text-black text-base block ${
                      i !== searchItems.length - 1 ? "border-b" : ""
                    }`}
                  >
                    {it.name}
                  </Link>
                ))}

              {userNavItems
                .filter((n) => !n.hasDropdown && !n.hasSearchDropdown)
                .map(({ name, path }) => (
                  <NavLink
                    key={name}
                    to={path}
                    onClick={handleLinkClick}
                    className="py-3 text-lg border-b font-medium text-black flex items-center justify-between"
                  >
                    <span>{name}</span>
                    {name === "Notification" && unread > 0 && (
                      <span className="bg-red-600 text-white text-xs px-2 rounded-full">
                        {unread > 99 ? "99+" : unread}
                      </span>
                    )}
                    {name === "Incoming interests" && (incomingCount + chatRequestCount) > 0 && (
                      <span className="bg-pink-600 text-white text-xs px-2 rounded-full">
                        {(incomingCount + chatRequestCount) > 99 ? "99+" : (incomingCount + chatRequestCount)}
                      </span>
                    )}
                  </NavLink>
                ))}

              <button
                onClick={handleLogout}
                className="bg-pink-600 text-white px-6 py-3 rounded text-center mt-6 w-full"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}




