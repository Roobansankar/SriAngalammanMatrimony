import React, { useEffect } from "react";

const ChildSafetyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 mt-12 md:mt-20">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-[#7b1113] py-8 px-6 text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-white uppercase tracking-wide">
            Child Safety Standards
          </h1>
        </div>

        <div className="p-6 md:p-12 space-y-8">
          <section>
            <p className="text-gray-700 text-lg leading-relaxed">
              Sri Angalamman Matrimony is committed to providing a safe platform for all users. We have zero tolerance for child sexual abuse and exploitation (CSAE), child sexual abuse material (CSAM), grooming, trafficking, or any activity that endangers minors.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-[#7b1113] mb-4 border-b pb-2">
              Our Policies Include:
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Users must be 18 years of age or older.",
                "Any content involving minors in a sexual context is strictly prohibited.",
                "Users can report inappropriate profiles, messages, photos, or behaviour.",
                "Reported content is reviewed and appropriate action is taken, including account suspension or removal.",
                "We cooperate with relevant law enforcement authorities where required by law.",
                "We comply with applicable child safety and online protection regulations.",
              ].map((policy, index) => (
                <li key={index} className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg shadow-sm border-l-4 border-[#7b1113]">
                  <span className="text-[#7b1113] font-bold mt-0.5">•</span>
                  <span className="text-gray-700 font-medium">{policy}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-gray-100 p-6 rounded-xl border-t-2 border-[#7b1113]">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              For child safety concerns, please contact:
            </h2>
            <div className="space-y-3">
              <p className="flex items-center gap-3 text-gray-700">
                <span className="font-bold text-[#7b1113]">Email:</span>
                <a href="mailto:sriangalammanspsk2020@gmail.com" className="text-blue-600 hover:underline font-medium">
                  sriangalammanspsk2020@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-3 text-gray-700">
                <span className="font-bold text-[#7b1113]">Website:</span>
                <a href="https://www.sriangalammanmatrimony.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                  https://www.sriangalammanmatrimony.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ChildSafetyPolicy;
