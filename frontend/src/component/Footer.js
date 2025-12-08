// import React from "react";
// import { Link } from "react-router-dom";
// import { Facebook, Twitter, Instagram, Play, Mail, Phone } from "lucide-react";

// export default function Footer() {
//   return (
//     <footer
//       className="relative text-white py-14 px-6 text-center font-display"
//       style={{
//         backgroundImage:
//           "url('https://i.pinimg.com/1200x/df/10/fc/df10fc9cb52e731e2d798b394056a426.jpg')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/50"></div>

//       <div className="relative z-10 container mx-auto max-w-5xl">
//         {/* Contact Info */}
//         <h2 className="text-3xl font-semibold mb-4">Get in Contact</h2>
//         <p className="max-w-2xl mx-auto text-gray-200 mb-8">
//           If you have any questions about the services we provide, simply use
//           the form below. We respond to most queries within 24 hours.
//         </p>

//         {/* Email Input */}
//         <div className="flex justify-center flex-wrap gap-3 mb-8">
//           <input
//             type="email"
//             placeholder="Enter your email"
//             className="px-4 py-2 rounded-md w-72 text-gray-800 focus:outline-none"
//           />
//           <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-md transition">
//             Book Appointment
//           </button>
//         </div>

//         {/* Contact Details */}
//         <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-gray-200 mb-8">
//           <p className="flex items-center gap-2">
//             <Phone size={18} /> 9629891299
//           </p>
//           <p className="flex items-center gap-2">
//             <Mail size={18} /> info@sriangalammanmatrimony.com
//           </p>
//         </div>

//         {/* Social Icons */}
//         <div className="flex justify-center gap-6 text-gray-100 mb-10">
//           <Link to="/" className="hover:text-primary transition">
//             <Instagram size={22} />
//           </Link>
//           <Link to="/" className="hover:text-primary transition">
//             <Twitter size={22} />
//           </Link>
//           <Link to="/" className="hover:text-primary transition">
//             <Facebook size={22} />
//           </Link>
//           <Link to="/" className="hover:text-primary transition">
//             <Play size={22} />
//           </Link>
//         </div>

//         {/* Links */}
//         <div className="flex justify-center flex-wrap gap-6 mb-4 text-sm sm:text-base">
//           <Link to="/faq" className="hover:text-primary transition-colors">
//             FAQ
//           </Link>
//           <Link to="/terms" className="hover:text-primary transition-colors">
//             Terms & Conditions
//           </Link>
//           <Link to="/privacy" className="hover:text-primary transition-colors">
//             Privacy Policy
//           </Link>
//           <Link to="/contact" className="hover:text-primary transition-colors">
//             Contact Us
//           </Link>
//         </div>

//         {/* Description */}
//         <p className="max-w-3xl mx-auto text-sm text-gray-200 mb-3">
//           <strong>Sriangalamman Matrimony</strong> - Muthaliyar Matrimony,
//           Matrimony Service in Erode, Coimbatore, Tirupur, Salem, and for all
//           castes.
//         </p>

//         {/* Copyright */}
//         <p className="text-xs text-gray-300">
//           © 2025 Sriangalamman Matrimony. All rights reserved.
//         </p>
//       </div>
//     </footer>
//   );
// }

// import React from "react";
// import { Link } from "react-router-dom";
// import { Facebook, Twitter, Instagram, Play, Mail, Phone } from "lucide-react";

// export default function Footer() {
//   return (
//     <footer className="bg-primary text-white py-14 px-6 text-center font-display">
//       <div className="container mx-auto max-w-5xl space-y-8">
//         {/* Contact Details */}
//         <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-white">
//           <p className="flex items-center gap-2">
//             <Phone size={18} /> 9629891299
//           </p>
//           <p className="flex items-center gap-2">
//             <Mail size={18} /> info@sriangalammanmatrimony.com
//           </p>
//         </div>

//         {/* Social Icons */}
//         <div className="flex justify-center gap-6 text-white">
//           <Link to="/" className="hover:text-yellow-300 transition">
//             <Instagram size={22} />
//           </Link>
//           <Link to="/" className="hover:text-yellow-300 transition">
//             <Twitter size={22} />
//           </Link>
//           <Link to="/" className="hover:text-yellow-300 transition">
//             <Facebook size={22} />
//           </Link>
//           <Link to="/" className="hover:text-yellow-300 transition">
//             <Play size={22} />
//           </Link>
//         </div>

//         {/* Links */}
//         <div className="flex justify-center flex-wrap gap-6 text-sm sm:text-base">
//           <Link to="/faq" className="hover:text-yellow-300 transition-colors">
//             FAQ
//           </Link>
//           <Link to="/terms" className="hover:text-yellow-300 transition-colors">
//             Terms & Conditions
//           </Link>
//           <Link
//             to="/privacy"
//             className="hover:text-yellow-300 transition-colors"
//           >
//             Privacy Policy
//           </Link>
//           <Link
//             to="/contact"
//             className="hover:text-yellow-300 transition-colors"
//           >
//             Contact Us
//           </Link>
//         </div>

//         {/* Description */}
//         <p className="max-w-3xl mx-auto text-sm">
//           <strong>Sriangalamman Matrimony</strong> - Muthaliyar Matrimony,
//           Matrimony Service in Erode, Coimbatore, Tirupur, Salem, and for all
//           castes.
//         </p>

//         {/* Copyright */}
//         <p className="text-xs">
//           © 2025 Sriangalamman Matrimony. All rights reserved.
//         </p>
//       </div>
//     </footer>
//   );
// }
// src/component/Footer.js
import { Heart, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-[#800020] text-white font-display">
  

      {/* Footer Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart size={22} />
              <h3 className="font-bold text-lg">Sri Angalamman Matrimony</h3>
            </div>
            <p className="text-sm text-white/90 max-w-xs leading-relaxed">
              Connecting hearts and building families with tradition and trust.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:underline text-white/90">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:underline text-white/90">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:underline text-white/90">
                  Search Profiles
                </Link>
              </li>
              <li>
                <Link
                  to="/membership"
                  className="hover:underline text-white/90"
                >
                  Membership
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Policies</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="hover:underline text-white/90">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:underline text-white/90">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="hover:underline text-white/90">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/disclaimer"
                  className="hover:underline text-white/90"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-white/90">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <a
                  href="mailto:info@sriangalamman.com"
                  className="hover:underline"
                >
                  info@sriangalamman.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+919876543210" className="hover:underline">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1" />
                <span>Coimbatore, Tamil Nadu, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider and Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-5">
            <span className="text-sm text-white/90 hover:underline cursor-pointer">
              Facebook
            </span>
            <span className="text-sm text-white/90 hover:underline cursor-pointer">
              Instagram
            </span>
            <span className="text-sm text-white/90 hover:underline cursor-pointer">
              Twitter
            </span>
          </div>
          <p className="text-sm text-white/80 text-center">
            © {new Date().getFullYear()} Sri Angalamman Matrimony. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
