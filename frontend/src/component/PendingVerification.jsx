// src/component/PendingVerification.jsx
import { Link } from "react-router-dom";

/**
 * PendingVerification - Displayed to users whose account is not yet verified.
 * 
 * Shows a friendly message explaining the verification process and provides
 * navigation to their own profile which they can still access.
 */
export default function PendingVerification() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-4 py-10">
      <div className="bg-white shadow-2xl border border-amber-200 rounded-3xl p-10 w-full max-w-xl text-center">
        {/* Clock/Hourglass Icon */}
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-amber-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Verification Pending
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          Thank you for registering with{" "}
          <span className="text-pink-600 font-semibold">
            Sriangalamman Matrimony
          </span>
          ! Your profile is currently under review by our team.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 text-left">
          <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            What can you do now?
          </h3>
          <ul className="text-sm text-amber-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>View and update your profile details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Upload or change your photos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Complete any missing information</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8 text-left">
          <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Features unlocked after verification
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">🔒</span>
              <span>Search and browse other profiles</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">🔒</span>
              <span>View profile matches</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">🔒</span>
              <span>Send interest and connect with others</span>
            </li>
          </ul>
        </div>

        <p className="text-gray-500 text-sm mb-6">
          Verification usually takes 24-48 hours. For any queries, please{" "}
          <Link to="/contact" className="text-pink-600 hover:underline">
            contact us
          </Link>
          .
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/profile"
            className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Go to My Profile
          </Link>
          <Link
            to="/"
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
