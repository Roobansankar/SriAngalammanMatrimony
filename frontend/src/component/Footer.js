

// src/component/Footer.js
import { Heart, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "./logo.png";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-[#8F1537] to-[#A61C3C] text-white font-display">
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
                <Link to="/returns" className="hover:underline text-white/90">
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
              <li>
                <Link
                  to="/child-safety"
                  className="hover:underline text-white/90"
                >
                  Child Safety Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-white/90">
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-1 flex-shrink-0" />
                <span>sriangalammanspsk2020@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-1 flex-shrink-0" />
                <span>9443946541, 70104 59106</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>
                  Sri Angalamman Matrimony, 108 Anna Street, Near SPS
                  Documentation Office, Sivagiri, Erode (DT), Tamil Nadu -
                  638109.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider and Bottom Bar */}
        {/* <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/80 text-center">
            © {new Date().getFullYear()} Sri Angalamman Matrimony. All rights
            reserved.
          </p>
        </div> */}

        {/* Divider and Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/80 text-center">
            © {new Date().getFullYear()} Sri Angalamman Matrimony. All rights
            reserved.
          </p>

          <p className="text-sm text-white/70 text-center">
            Developed by{" "}
            <span className="font-semibold text-white">
              Infronex IT Products & Services
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}