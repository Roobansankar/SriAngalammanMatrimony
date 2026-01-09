

// import { useState } from "react";

// export default function HomePopup() {
//   const [open, setOpen] = useState(true);

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 px-4">
//       <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
//         {/* Close Button */}
//         <button
//           onClick={() => setOpen(false)}
//           className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl z-20"
//           aria-label="Close popup"
//         >
//           ✕
//         </button>

//         {/* Image */}
//         <img
//           src="/popup.jpg"
//           alt="Matrimony Blessings"
//           className="w-full h-64 object-cover object-top rounded-t-2xl"
//         />

//         {/* Content */}
//         <div className="text-center px-5 py-4">
//           <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500 bg-clip-text text-transparent">
//             வணக்கம் 🙏
//           </h2>

//           <p className="text-base leading-relaxed bg-gradient-to-r from-purple-700 via-pink-600 to-rose-600 bg-clip-text text-transparent font-semibold">
//             இரு உள்ளங்கள் இணைந்து,
//             <br />
//             இரு இல்லங்கள் ஒன்றாகி,
//             <br />
//             இனிய திருமண பந்தம் விரைவில் அமைய
//             <br />
//             மனமார்ந்த வாழ்த்துக்கள்.
//             <br />
//             <span className="block mt-2 font-bold">வாழ்க வளமுடன் 🌸</span>
//           </p>

//           <div className="mt-4 flex justify-center gap-3">
//             <span className="text-xl animate-pulse">✨</span>
//             <span className="text-xl animate-pulse delay-100">💖</span>
//             <span className="text-xl animate-pulse delay-200">✨</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function HomePopup() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // 🔁 Clear popup flag ONLY if Home page is refreshed
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (location.pathname === "/") {
        sessionStorage.removeItem("home_popup_seen");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [location.pathname]);

  // 👀 Show popup once per session unless refreshed on Home
  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("home_popup_seen");

    if (!hasSeenPopup && location.pathname === "/") {
      setOpen(true);
      sessionStorage.setItem("home_popup_seen", "true");
    }
  }, [location.pathname]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 px-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl z-20"
          aria-label="Close popup"
        >
          ✕
        </button>

        {/* Image */}
        <img
          src="/popup.jpg"
          alt="Matrimony Blessings"
          className="w-full h-64 object-cover object-top rounded-t-2xl"
        />

        {/* Content */}
        <div className="text-center px-5 py-4">
          <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500 bg-clip-text text-transparent">
            வணக்கம் 🙏
          </h2>

          <p className="text-base leading-relaxed bg-gradient-to-r from-purple-700 via-pink-600 to-rose-600 bg-clip-text text-transparent font-semibold">
            இரு உள்ளங்கள் இணைந்து,
            <br />
            இரு இல்லங்கள் ஒன்றாகி,
            <br />
            இனிய திருமண பந்தம் விரைவில் அமைய
            <br />
            மனமார்ந்த வாழ்த்துக்கள்.
            <br />
            <span className="block mt-2 font-bold">வாழ்க வளமுடன் 🌸</span>
          </p>
        </div>
      </div>
    </div>
  );
}


