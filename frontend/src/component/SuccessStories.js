import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function SuccessStories() {
  const [selected, setSelected] = useState(null);

  const stories = [
    {
      id: 1,
      title: "Beautiful Story",
      name: "Mallar K",
      date: "19 July, 2025",
      image:
        "https://www.infomatrimony.com/public/uploads/all/uD1YhZLspEciLQPa4liA4Ky4Wmx0aX6Je0jlYGZu.png",
      description:
        "A beautiful journey that began on our platform and turned into a lifetime of happiness.",
    },
    {
      id: 2,
      title: "Beautiful Life Story",
      name: "Sanju Narayanan",
      date: "19 July, 2025",
      image:
        "https://www.focuzstudios.in/wp-content/uploads/2017/11/the-hindu-tamil-wedding-photographers-focuz-studios4.jpg",
      description:
        "From a simple message to an everlasting bond. Sriangalamman helped us find our soulmate.",
    },
    {
      id: 3,
      title: "Nice Memories",
      name: "Nisha Sivaraj",
      date: "19 July, 2025",
      image:
        "https://www.focuzstudios.in/wp-content/uploads/2017/11/candid-photographers-in-trichy-tiruchirappalli-focuz-studios26.jpg",
      description:
        "It was a perfect match! We’re thankful to Sriangalamman for helping us meet each other.",
    },
    {
      id: 4,
      title: "Perfect Match",
      name: "Shalini & Mano",
      date: "20 March, 2024",
      image:
        "https://www.focuzstudios.in/wp-content/uploads/2017/11/tamil-hindu-wedding-photography-15.jpg",
      description:
        "A beautiful beginning — Sriangalamman made introductions smooth and genuine.",
    },
    {
      id: 5,
      title: "True Bond",
      name: "Rashmi & Karthik",
      date: "15 May, 2023",
      image:
        "https://www.focuzstudios.in/wp-content/uploads/2017/11/tamil-hindu-wedding-photography-17.jpg",
      description:
        "From strangers to soulmates — couldn’t be happier! We found our forever partner here.",
    },
    {
      id: 6,
      title: "New Beginning",
      name: "Leela & Naveen",
      date: "25 Dec, 2020",
      image:
        "https://mysticstudios.in/wp-content/uploads/2017/09/Raam-Dheepitha-18.jpg",
      description:
        "We found trust and love through this platform. The verification process gave us confidence.",
    },
  ];

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <section className="py-20 bg-[#FFF8E1] font-display">
      <div className="container mx-auto px-6 mt-12">
        <h2 className="text-4xl font-display text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-700 via-rose-600 to-red-600 mb-12">
          <span className="text-black">Success</span> Stories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={s.image}
                alt={s.title}
                className="w-full h-64 object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Posted By:{" "}
                  <span className="text-pink-600 font-medium">{s.name}</span> on{" "}
                  {s.date}
                </p>

                <button
                  onClick={() => setSelected(s)}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:opacity-95 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              <X size={20} />
            </button>

            <img
              src={selected.image}
              alt={selected.title}
              className="w-full h-80 object-cover"
            />

            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {selected.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Posted By:{" "}
                <span className="text-pink-600 font-medium">
                  {selected.name}
                </span>{" "}
                on {selected.date}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {selected.description}
              </p>

              <div className="mt-6 text-right">
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* changed className here */}
            <img
              src={selected.image}
              alt={selected.title}
              className="w-full h-64 md:h-96 max-h-[80vh] object-cover object-top"
            />

            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {selected.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Posted By:{" "}
                <span className="text-pink-600 font-medium">
                  {selected.name}
                </span>{" "}
                on {selected.date}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {selected.description}
              </p>

              <div className="mt-6 text-right">
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
