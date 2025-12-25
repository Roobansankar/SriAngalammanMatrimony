// // src/App.js
// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useLocation,
// } from "react-router-dom";
// import Header from "./component/Header";
// import Footer from "./component/Footer";
// import Home from "./component/Home";
// import ProfilePage from "./component/ProfilePage";
// import LoginPage from "./component/LoginPage";
// import MultiStepForm from "./component/MultiStepForm";
// import About from "./component/About";
// import FaqPage from "./component/Faq";
// import Membership from "./component/Membership";
// import Privacy from "./component/privacy";
// import Terms from "./component/Terms";
// import Returns from "./component/Returns";
// import Disclaimer from "./component/Disclaimer";
// import ContactUs from "./component/Contactus";
// import SearchResults from "./component/SearchResults";
// import RegularSearch from "./component/Search";
// import SuccessStories from "./component/SuccessStories";
// import Report from "./component/Report";
// import Basic from "./profile/Basic";
// import Horoscope from "./profile/Horoscope";
// import ContactDetails from "./profile/ContactDetails";
// import EducationProfessional from "./profile/EducationProfessional";
// import BasicsLifestyle from "./profile/BasicsLifestyle";
// import FamilyDetails from "./profile/FamilyDetails";
// import PartnerPreference from "./profile/PartnerPreference";

// import PrivateRoute from "./component/PrivateRoute";
// import IDSearchPage from "./profile/IDSearchPage";
// import LoggedRegularSearch from "./profile/RegularSearch";
// import LogedSearchResults from "./profile/RegularSearchResults";
// import AdvancedSearch from "./profile/AdvancedSearch";
// import AdvancedSearchResults from "./profile/AdbvancedSearchResults";
// import HoroscopeSearch from "./profile/HoroscopeSearch";
// import HoroscopeSearchResults from "./profile/HoroscopeSearchResults";
// import ProfileView from "./profile/ProfileView";
// import { connectSocket } from "./socket";
// import InterestsPanel from "./profile/InterestsPanel";
// import InterestsPage from "./profile/InterestsPage";
// import NotificationsPage from "./profile/NotificationsPage";
// import BiodataDisplay from "./profile/BiodataDisplay";
// import BasicEdit from "./profile/Edit/Basic";
// import EditAbout from "./profile/Edit/EditAbout";
// import EditHoroscope from "./profile/Edit/EditHoroscope";
// import EditContact from "./profile/Edit/EditContact";
// import EditEducation from "./profile/Edit/EditEducation";
// import EditLifestyle from "./profile/Edit/EditLifestyle";
// import EditFamily from "./profile/Edit/EditFamily";
// import EditPartnerPreference from "./profile/Edit/EditPartnerPreference";
// import EditPhoto from "./profile/Edit/EditPhoto";
// import Matchs from "./profile/Matchs";
// import AdminLoginPage from "./AdminDashboard/LoginPage";
// import AdminPrivateRoute from "./AdminDashboard/AdminPrivateRoute";
// import DashboardLayout from "./AdminDashboard/Dashboard";

// export default function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("userData");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   useEffect(() => {
//     connectSocket();
//   }, []);

//   // 👇 Create a ScrollToTop component
//   function ScrollToTop() {
//     const { pathname } = useLocation();

//     useEffect(() => {
//       window.scrollTo(0, 0);
//     }, [pathname]);

//     return null;
//   }

//   return (
//     <Router>
//       <ScrollToTop />

//       <Header user={user} setUser={setUser} />

//       <main className="flex-1">
//         <Routes>
//           <Route path="/admin/login" element={<AdminLoginPage />} />

//           <Route
//             path="/admin/dashboard"
//             element={
//               <AdminPrivateRoute>
//                 <DashboardLayout />
//               </AdminPrivateRoute>
//             }
//           />

//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/faq" element={<FaqPage />} />
//           <Route path="/membership" element={<Membership />} />
//           <Route path="/privacy" element={<Privacy />} />
//           <Route path="/terms" element={<Terms />} />
//           <Route path="/returns" element={<Returns />} />
//           <Route path="/disclaimer" element={<Disclaimer />} />
//           <Route path="/report-misuse" element={<Report />} />
//           <Route path="/contact" element={<ContactUs />} />
//           <Route path="/search" element={<RegularSearch />} />
//           <Route path="/results" element={<SearchResults />} />
//           <Route path="/success-story" element={<SuccessStories />} />
//           <Route path="/login" element={<LoginPage setUser={setUser} />} />
//           <Route path="/register/*" element={<MultiStepForm />} />

//           {/* Protected routes wrapped with PrivateRoute */}
//           <Route
//             path="/profile"
//             element={
//               <PrivateRoute>
//                 <ProfilePage setUser={setUser} />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="matches/:page?"
//             element={
//               <PrivateRoute>
//                 <Matchs />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/profile/basic"
//             element={
//               <PrivateRoute>
//                 <Basic />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/edit/photo"
//             element={
//               <PrivateRoute>
//                 <EditPhoto />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/edit/basic"
//             element={
//               <PrivateRoute>
//                 <BasicEdit />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/edit/about"
//             element={
//               <PrivateRoute>
//                 <EditAbout />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/profile/horoscope"
//             element={
//               <PrivateRoute>
//                 <Horoscope />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/edit/horoscope"
//             element={
//               <PrivateRoute>
//                 <EditHoroscope />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/profile/contact"
//             element={
//               <PrivateRoute>
//                 <ContactDetails />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/edit/contact"
//             element={
//               <PrivateRoute>
//                 <EditContact />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/profile/education"
//             element={
//               <PrivateRoute>
//                 <EducationProfessional />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/edit/education"
//             element={
//               <PrivateRoute>
//                 <EditEducation />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/profile/lifestyle"
//             element={
//               <PrivateRoute>
//                 <BasicsLifestyle />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/edit/lifestyle"
//             element={
//               <PrivateRoute>
//                 <EditLifestyle />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/profile/family"
//             element={
//               <PrivateRoute>
//                 <FamilyDetails />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/edit/family"
//             element={
//               <PrivateRoute>
//                 <EditFamily />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/profile/partner-preference"
//             element={
//               <PrivateRoute>
//                 <PartnerPreference />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/edit/partner"
//             element={
//               <PrivateRoute>
//                 <EditPartnerPreference />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/id-search"
//             element={
//               <PrivateRoute>
//                 <IDSearchPage />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/regular-search"
//             element={
//               <PrivateRoute>
//                 <LoggedRegularSearch />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/regularsearch-results"
//             element={
//               <PrivateRoute>
//                 <LogedSearchResults />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/advanced-search"
//             element={
//               <PrivateRoute>
//                 <AdvancedSearch />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/advancedsearch-results"
//             element={
//               <PrivateRoute>
//                 <AdvancedSearchResults />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/horoscope-search"
//             element={
//               <PrivateRoute>
//                 <HoroscopeSearch />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/horoscopesearch-results"
//             element={
//               <PrivateRoute>
//                 <HoroscopeSearchResults />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/profile/view/:matriid"
//             element={
//               <PrivateRoute>
//                 <ProfileView />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/other-activities"
//             element={
//               <PrivateRoute>
//                 <InterestsPanel />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/incoming"
//             element={
//               <PrivateRoute>
//                 <InterestsPage />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/notifications"
//             element={
//               <PrivateRoute>
//                 <NotificationsPage />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/bio"
//             element={
//               <PrivateRoute>
//                 <BiodataDisplay setUser={setUser} />
//               </PrivateRoute>
//             }
//           />
//         </Routes>
//       </main>
//       <Footer />
//     </Router>
//   );
// }

// src/App.js
import { useEffect, useState } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import About from "./component/About";
import ContactUs from "./component/Contactus";
import Disclaimer from "./component/Disclaimer";
import FaqPage from "./component/Faq";
import Footer from "./component/Footer";
import Header from "./component/Header";
import Home from "./component/Home";
import LoginPage from "./component/LoginPage";
import ForgotPassword from "./component/ForgotPassword";
import Membership from "./component/Membership";
import MultiStepForm from "./component/MultiStepForm";
import Privacy from "./component/privacy";
import ProfilePage from "./component/ProfilePage";
import Report from "./component/Report";
import Returns from "./component/Returns";
import RegularSearch from "./component/Search";
import SearchResults from "./component/SearchResults";
import SuccessStories from "./component/SuccessStories";
import Terms from "./component/Terms";
import Basic from "./profile/Basic";
import BasicsLifestyle from "./profile/BasicsLifestyle";
import ContactDetails from "./profile/ContactDetails";
import EducationProfessional from "./profile/EducationProfessional";
import FamilyDetails from "./profile/FamilyDetails";
import Horoscope from "./profile/Horoscope";
import PartnerPreference from "./profile/PartnerPreference";

import AdminPrivateRoute from "./AdminDashboard/AdminPrivateRoute";
import AdminProfile from "./AdminDashboard/AdminProfile";
import AllMembers from "./AdminDashboard/AllMembers";
import DashboardLayout from "./AdminDashboard/Dashboard";
import FemaleMembers from "./AdminDashboard/FemaleMembers";
import HomeDashboard from "./AdminDashboard/HomeDashboard";
import LocationData from "./AdminDashboard/LocationData";
import AdminLoginPage from "./AdminDashboard/LoginPage";
import MaleMembers from "./AdminDashboard/MaleMembers";
import MasterData from "./AdminDashboard/MasterData";
import MemberBioData from "./AdminDashboard/MemberBioData";
import MemberManagement from "./AdminDashboard/MemberManagement";
import Settings from "./AdminDashboard/Settings";
import ChatPage from "./component/ChatPage";
import PrivateRoute from "./component/PrivateRoute";
import AdvancedSearchResults from "./profile/AdbvancedSearchResults";
import AdvancedSearch from "./profile/AdvancedSearch";
import BiodataDisplay from "./profile/BiodataDisplay";
import BasicEdit from "./profile/Edit/Basic";
import EditAbout from "./profile/Edit/EditAbout";
import EditContact from "./profile/Edit/EditContact";
import EditEducation from "./profile/Edit/EditEducation";
import EditFamily from "./profile/Edit/EditFamily";
import EditHoroscope from "./profile/Edit/EditHoroscope";
import EditLifestyle from "./profile/Edit/EditLifestyle";
import EditPartnerPreference from "./profile/Edit/EditPartnerPreference";
import EditPhoto from "./profile/Edit/EditPhoto";
import HoroscopeSearch from "./profile/HoroscopeSearch";
import HoroscopeSearchResults from "./profile/HoroscopeSearchResults";
import IDSearchPage from "./profile/IDSearchPage";
import InterestsPage from "./profile/InterestsPage";
import InterestsPanel from "./profile/InterestsPanel";
import Matchs from "./profile/Matchs";
import NotificationsPage from "./profile/NotificationsPage";
import ProfileView from "./profile/ProfileView";
import LoggedRegularSearch from "./profile/RegularSearch";
// import LogedSearchResults from "./profile/RegularSearchResults";
import { connectSocket } from "./socket";
import LoggedSearchResults from "./profile/RegularSearchResults";
import AddUsers from "./AdminDashboard/AddUsers";
import AdminFeaturedProfiles from "./AdminDashboard/AdminFeaturedProfiles";
import ManageStaff from "./AdminDashboard/ManageStaff";
import PremiumMembers from "./AdminDashboard/PremiumMembers";
import NewUsers from "./AdminDashboard/NewUsers";
import PlanManagement from "./AdminDashboard/PlanManagement";
// 👇 Scroll to top on each route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// 👇 App layout that lives *inside* Router
function AppContent({ user, setUser }) {
  const location = useLocation();

  // Hide Header/Footer on admin pages
  const hideLayout = location.pathname.startsWith("/admin");

  return (
    
     <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {!hideLayout && <Header user={user} setUser={setUser} />}

      <main className="flex-1">
        <Routes>
          {/* Admin Login (no layout) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Layout Wrapper (shows sidebar + topbar) */}
          <Route
            path="/admin"
            element={
              <AdminPrivateRoute>
                <DashboardLayout />
              </AdminPrivateRoute>
            }
          >
            {/* Admin Pages Inside DashboardLayout */}
            <Route path="homedashboard" element={<HomeDashboard />} />
            <Route path="dashboard" element={<HomeDashboard />} />
            <Route path="new-users" element={<NewUsers />} />
            <Route path="male-members" element={<MaleMembers />} />
            <Route path="female-members" element={<FemaleMembers />} />
            <Route path="all-members" element={<AllMembers />} />
            <Route path="member-biodata" element={<MemberBioData />} />
            <Route path="manage-members" element={<MemberManagement />} />
            <Route path="master-data" element={<MasterData />} />
            <Route path="location-data" element={<LocationData />} />
            <Route path="add-users/*" element={<AddUsers />} />
            <Route path="plan-management" element={<PlanManagement />} />
            <Route
              path="featured-profiles"
              element={<AdminFeaturedProfiles />}
            />
            <Route path="premium-members" element={<PremiumMembers />} />
            <Route path="manage-staff" element={<ManageStaff />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile/:matriId" element={<AdminProfile />} />
          </Route>

          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/report-misuse" element={<Report />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/search" element={<RegularSearch />} />
          <Route
            path="/results/:page?"
            // path="/regularsearch-results/:page?"
            element={<SearchResults />}
          />
          <Route path="/success-story" element={<SuccessStories />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/register/*" element={<MultiStepForm />} />

          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage setUser={setUser} />
              </PrivateRoute>
            }
          />

          <Route
            path="/matches/:page?"
            element={
              <PrivateRoute>
                <Matchs />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile/basic"
            element={
              <PrivateRoute>
                <Basic />
              </PrivateRoute>
            }
          />

          <Route
            path="/edit/photo"
            element={
              <PrivateRoute>
                <EditPhoto />
              </PrivateRoute>
            }
          />

          <Route
            path="/edit/basic"
            element={
              <PrivateRoute>
                <BasicEdit />
              </PrivateRoute>
            }
          />

          <Route
            path="/edit/about"
            element={
              <PrivateRoute>
                <EditAbout />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile/horoscope"
            element={
              <PrivateRoute>
                <Horoscope />
              </PrivateRoute>
            }
          />

          <Route
            path="/edit/horoscope"
            element={
              <PrivateRoute>
                <EditHoroscope />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile/contact"
            element={
              <PrivateRoute>
                <ContactDetails />
              </PrivateRoute>
            }
          />

          <Route
            path="/edit/contact"
            element={
              <PrivateRoute>
                <EditContact />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile/education"
            element={
              <PrivateRoute>
                <EducationProfessional />
              </PrivateRoute>
            }
          />

          <Route
            path="/edit/education"
            element={
              <PrivateRoute>
                <EditEducation />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile/lifestyle"
            element={
              <PrivateRoute>
                <BasicsLifestyle />
              </PrivateRoute>
            }
          />

          <Route
            path="/edit/lifestyle"
            element={
              <PrivateRoute>
                <EditLifestyle />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile/family"
            element={
              <PrivateRoute>
                <FamilyDetails />
              </PrivateRoute>
            }
          />

          <Route
            path="/edit/family"
            element={
              <PrivateRoute>
                <EditFamily />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile/partner-preference"
            element={
              <PrivateRoute>
                <PartnerPreference />
              </PrivateRoute>
            }
          />

          <Route
            path="/edit/partner"
            element={
              <PrivateRoute>
                <EditPartnerPreference />
              </PrivateRoute>
            }
          />

          <Route
            path="/id-search"
            element={
              <PrivateRoute>
                <IDSearchPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/regular-search"
            element={
              <PrivateRoute>
                <LoggedRegularSearch />
              </PrivateRoute>
            }
          />

         

          <Route
            path="/regularsearch-results/:page?"
            element={
              <PrivateRoute>
                <LoggedSearchResults />
              </PrivateRoute>
            }
          />

          <Route
            path="/advanced-search"
            element={
              <PrivateRoute>
                <AdvancedSearch />
              </PrivateRoute>
            }
          />

          <Route
            path="/advancedsearch-results/:page?"
            element={
              <PrivateRoute>
                <AdvancedSearchResults />
              </PrivateRoute>
            }
          />

          <Route
            path="/horoscope-search"
            element={
              <PrivateRoute>
                <HoroscopeSearch />
              </PrivateRoute>
            }
          />

          <Route
            path="/horoscopesearch-results/:page?"
            element={
              <PrivateRoute>
                <HoroscopeSearchResults />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile/view/:matriid"
            element={
              <PrivateRoute>
                <ProfileView />
              </PrivateRoute>
            }
          />

          <Route
            path="/other-activities"
            element={
              <PrivateRoute>
                <InterestsPanel />
              </PrivateRoute>
            }
          />

          <Route
            path="/incoming"
            element={
              <PrivateRoute>
                <InterestsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <NotificationsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/bio"
            element={
              <PrivateRoute>
                <BiodataDisplay setUser={setUser} />
              </PrivateRoute>
            }
          />

          {/* Chat routes */}
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat/:partnerId"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
      </div>

  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    connectSocket();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AppContent user={user} setUser={setUser} />
    </Router>
  );
}
