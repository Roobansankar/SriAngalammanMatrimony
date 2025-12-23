import React, { useState, useEffect, useMemo, useRef } from "react";
import { HelpCircle } from "lucide-react";

const FAQ_DATA = [
  {
    id: 1,
    q: "How can I register on sriangalammanmatrimony.com?",
    a: "Registering is simple. You can use the Quick Registration form or the full 3-page registration form available on the site.",
  },
  {
    id: 3,
    q: "Can I upload my photograph?",
    a: "Yes — you can upload your photographs on your My Profile page.",
  },
  {
    id: 4,
    q: "How do I upload my Horoscope?",
    a: "You can upload it during registration or later by clicking 'Manage Horoscope' after login.",
  },
  {
    id: 5,
    q: "Can I edit all my details?",
    a: "Yes. You can update your profile anytime by clicking 'Modify My Profile'.",
  },
  {
    id: 6,
    q: "I see a tab called MY MATCHES, what’s the use of it?",
    a: "My Matches shows dynamically updated profiles that match your partner preferences.",
  },
  {
    id: 7,
    q: "Can I shortlist/bookmark a Profile?",
    a: "Yes — log in to use the shortlist feature and mark interested profiles.",
  },
  {
    id: 8,
    q: "How do I change my password?",
    a: "Login and click 'Change Password'. Enter your old and new passwords to update.",
  },
  {
    id: 9,
    q: "What are the benefits of a membership?",
    a: "Verified profiles, customer care, photo uploads, contact display, and messaging features are included.",
  },
  {
    id: 10,
    q: "Is my personal information safe?",
    a: "Yes. We strictly protect your privacy. For details, check our Privacy Policy page.",
  },
];

function SmoothAccordionPanel({ id, open, children }) {
  const ref = useRef(null);
  const [maxH, setMaxH] = useState("0px");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      const height = `${el.scrollHeight}px`;
      setMaxH(height);
      const t = setTimeout(() => setMaxH("none"), 300);
      return () => clearTimeout(t);
    } else {
      const height = `${el.scrollHeight}px`;
      setMaxH(height);
      requestAnimationFrame(() => requestAnimationFrame(() => setMaxH("0px")));
    }
  }, [open]);

  return (
    <div
      id={`panel-${id}`}
      role="region"
      aria-hidden={!open}
      ref={ref}
      style={{
        maxHeight: maxH,
        transition:
          "max-height 300ms ease, opacity 250ms ease, transform 300ms ease",
        overflow: "hidden",
      }}
      className="text-xs sm:text-sm md:text-[13px] lg:text-sm text-white text-justify"
    >
      <div
        className={`py-2 ${
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function FaqPage() {
  const [openId, setOpenId] = useState(1);
  const faqs = useMemo(() => FAQ_DATA, []);
  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <main className="relative min-h-screen text-white font-display py-12 overflow-hidden">
      {/* 🌄 Brightened Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/1200x/bd/52/ed/bd52ed02bc293dc760bc5bf26599ae2b.jpg')",
          backgroundPosition: "center 25%",
          filter: "blur(2px) brightness(0.55)",
          transform: "scale(1.08)",
          zIndex: 0,
        }}
      ></div>

      {/* 🖤 Overlay for readability */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />

      {/* Foreground Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 mb-8">
        {/* Header */}
        <header className="mb-10 flex flex-col items-center text-center">
          <div className="bg-[#C2185B] p-3 rounded-xl shadow-xl mb-3">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-[1.9rem] font-bold text-white drop-shadow-lg">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm md:text-[13px] text-white/90 mt-1 max-w-md">
            Answers about registration, membership, and support.
          </p>
        </header>

        {/* FAQ List */}
        <section className="space-y-4">
          {faqs.map((item) => {
            const open = openId === item.id;
            return (
              <article
                key={item.id}
                className={`group rounded-2xl p-4 sm:p-5 border transition-all duration-300 ${
                  open
                    ? "bg-[#FFFFFF]/20 border-[#FFB6C1] shadow-md"
                    : "bg-[#FFFFFF]/10 border-[#ffffff50] hover:bg-[#FFFFFF]/20"
                }`}
              >
                <h3>
                  <button
                    onClick={() => toggle(item.id)}
                    aria-expanded={open}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") && toggle(item.id)
                    }
                    tabIndex={0}
                    className="w-full flex justify-between items-center text-left text-white"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          open ? "text-pink-400" : "text-white/70"
                        }`}
                      />
                      <span className="text-sm sm:text-base md:text-[15px] lg:text-[14px] font-medium">
                        {item.q}
                      </span>
                    </span>
                    <svg
                      className={`w-3 h-3 sm:w-4 sm:h-4 transform transition-transform ${
                        open ? "rotate-180 text-pink-400" : "text-white/70"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </h3>

                <SmoothAccordionPanel id={item.id} open={open}>
                  {item.a}
                </SmoothAccordionPanel>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}




