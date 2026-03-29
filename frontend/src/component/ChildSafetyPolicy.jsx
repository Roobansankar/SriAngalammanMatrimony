import React from "react";

const ChildSafetyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 mt-12">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
        
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
          Child Safety Standards Policy
        </h1>

        <p className="text-gray-600 mb-4">
          <strong>Sri Angalamman Matrimony</strong> is committed to ensuring a safe
          and secure platform for all users. Our app is strictly intended for
          individuals aged <strong>18 years and above</strong>.
        </p>

        <p className="text-gray-600 mb-4">
          We have a <strong>zero-tolerance policy</strong> against child sexual abuse
          and exploitation (CSAE). Any content or behavior that violates these
          standards will result in immediate action, including account suspension
          and reporting to relevant authorities.
        </p>

        <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
          Safety Measures
        </h2>

        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>User reporting and blocking features</li>
          <li>Profile monitoring and moderation</li>
          <li>Strict age restriction (18+ only)</li>
          <li>Immediate removal of inappropriate content</li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
          Reporting & Action
        </h2>

        <p className="text-gray-600 mb-4">
          Users can report any suspicious activity directly within the app. Our
          team reviews all reports and takes appropriate action promptly.
        </p>

        <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
          Contact
        </h2>

        <p className="text-gray-600">
          For any concerns related to child safety, please contact us at:
        </p>

        <p className="text-blue-600 font-medium mt-2">
          infronex@gmail.com
        </p>

        <p className="text-gray-600 mt-6">
          We comply with all applicable child safety laws and cooperate with law
          enforcement agencies where necessary.
        </p>

      </div>
    </div>
  );
};

export default ChildSafetyPolicy;
