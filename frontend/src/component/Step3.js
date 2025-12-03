import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

export default function Step3({ nextStep, prevStep, formData }) {
  // After email verification, user should not go back to modify email
  const emailVerified = formData.otpVerified === true;

  const handleNext = () => nextStep({});

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-rose-50 to-rose-100">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6 border border-rose-100 text-center">
        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <CheckCircle className="w-10 h-10 text-green-600 mb-2" />
          <h3 className="text-2xl font-bold text-rose-700 mb-1">
            Email Verified Successfully!
          </h3>
          <p className="text-sm text-gray-600">
            Great! Your email has been verified. Let's continue with your profile details.
          </p>
        </div>

        {/* Summary */}
        <div className="my-6 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl py-4 px-6">
          <p className="text-sm text-gray-700">Registered Email</p>
          <p className="text-lg font-semibold text-rose-700 mt-1">
            {formData.email || "—"}
          </p>
          <p className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
            <CheckCircle className="w-3 h-3" /> Verified
          </p>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Your unique Matri ID will be generated after completing the registration and payment.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          {/* Only show back button if email is not verified (shouldn't happen here, but for safety) */}
          {!emailVerified && (
            <button
              onClick={prevStep}
              type="button"
              className="flex items-center justify-center gap-1 w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            type="button"
            className={`flex items-center justify-center gap-2 bg-rose-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-rose-700 transition ${emailVerified ? 'w-full' : 'w-full sm:w-auto'}`}
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 mt-6">
          Your information is safe and confidential.
        </p>
      </div>
    </div>
  );
}
