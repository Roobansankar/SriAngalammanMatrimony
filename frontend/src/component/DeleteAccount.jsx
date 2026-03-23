import React from "react";

export default function DeleteAccount() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 ">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-2xl p-8 mt-32">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Delete Account – Sri Angalamman Matrimony
        </h1>

        <p className="text-gray-600 mb-6">
          We respect your privacy. If you wish to delete your account and all
          associated data, please follow the instructions below.
        </p>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            How to request account deletion
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>
              Send an email to{" "}
              <span className="font-medium text-blue-600">
                sriangalammanspsk2020@gmail.com
              </span>
            </li>
            <li>Use your registered email ID</li>
            <li>
              Include the subject: <strong>Delete My Account</strong>
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            What data will be deleted
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Your profile information</li>
            <li>Your uploaded photos</li>
            <li>Your personal details</li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Data retention
          </h2>
          <p className="text-gray-600">
            Some data may be retained for legal, security, or fraud prevention
            purposes for a limited time.
          </p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-gray-700">
            📧 Contact us:{" "}
            <a
              href="mailto:sriangalammanspsk2020@gmail.com"
              className="text-blue-600 font-medium"
            >
              sriangalammanspsk2020@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
