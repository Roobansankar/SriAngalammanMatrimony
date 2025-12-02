import React from "react";

export const Success = () => {
  return (
    <div>
      {/* Success Stories */}
      <section className="py-20 bg-[#FFF8E1]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold font-display text-center text-[#C2185B] mb-12">
            <span className="text-black">Success</span> Stories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-gray-600 italic">
                "We found our perfect match on Sriangalamman! The platform is so
                easy to use and the profiles are genuine. Thank you for helping
                us find each other."
              </p>
              <div className="flex items-center mt-6">
                <img
                  alt="Priya & Rohan"
                  className="h-16 w-16 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9BqwEoqYE6WmZ-SseWseQXJh9XvYS9qyNk-CQHFUHMc4mP_pkKesZZOY8rsQqwR27hAHe6ifLKgKNUFk9ggYbL_4ZgK8Yx8UbJjBRBexstyQ7mEp9EZWVZHq9Dosiz43IPR7IEJsewrK6b5B5_qIwAch6PAiZ7DN3zVCL9r_HN6l-0kPAeZ3P0QawbcE32xvkcB1-MQJG77aJXPhgD6EtBxOir6-Seyt4c968nkMUqxpGknFuyK8Y8HPV6x2gfOr_c9fF-gmFL9RX"
                />
                <div className="ml-4">
                  <p className="font-bold text-[#4d4d4d]">Priya & Rohan</p>
                  <p className="text-gray-500">Married since 2023</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-gray-600 italic">
                "Thank you, Sriangalamman, for bringing us together. We couldn't
                have asked for a better partner. Highly recommended for anyone
                serious about finding a life partner."
              </p>
              <div className="flex items-center mt-6">
                <img
                  alt="Meera & Arjun"
                  className="h-16 w-16 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPZ5kPNRyfMJ0ZODMaRlIf9rO8moXyVXIZA_zSRntNZaGf5Wkeo7cg-wKu7a0o3-4KvaPl9R8nt7xtb62vOISeUj8Je3SGQXaw4i9wyx6JBgfVjgOL2OhATd-VCUaBuxkWsDWb76fzKtRO3uPIPQDYRuBAzaE3AjGjuEf2Sxp0tCdh_3hvcWQjyDRIXTuYgK-CCogoYT6-jGesbriggDATEwyBpmJ8qs9TBFiEAoC2laKKofP8HAJu761gVRQBH0iBLeoRbwVuM1-s"
                />
                <div className="ml-4">
                  <p className="font-bold text-[#4d4d4d]">Meera & Arjun</p>
                  <p className="text-gray-500">Married since 2022</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-gray-600 italic">
                "Our families are so happy with our match, and it was all
                possible because of Sriangalamman. The verification process gave
                us a lot of confidence."
              </p>
              <div className="flex items-center mt-6">
                <img
                  alt="Anjali & Vikram"
                  className="h-16 w-16 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBAtgsFBzqyrB5E3UoFgE7B6G5V2zEH_lZmbsDrdsYnvdirK08L1rkkxISXbpC-qAPsc4WTIOly1ckqtbLWEYTY9iJm4a37f1XKievddE8Vos54yOzXN6jUY5hOp7-rl_iSA4hpw6Fj2dkIAgAl1thbkR95X8Aj7-hsjjNYQKVaE2PaAhRUNc6BowcxdQyXiXWD_OMyP2PB3MCFNj_W4gcv-yqzYlF_5S15_BiINS_V0F3sDXCJdUOhgcmDTPQOQXMA8MEgA7vTp9E"
                />
                <div className="ml-4">
                  <p className="font-bold text-[#4d4d4d]">Anjali & Vikram</p>
                  <p className="text-gray-500">Married since 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
