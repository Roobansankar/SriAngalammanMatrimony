import React from "react";

export default function Step11({ nextStep, prevStep, formData }) {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-12 text-gray-800">
      <h3 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Step 11 : Review Your Details
      </h3>

      <p className="text-center text-gray-600 mb-6">
        Please review all the information you entered before proceeding to
        payment.
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 overflow-y-auto max-h-[450px]">
        {Object.entries(formData).length === 0 ? (
          <p className="text-center text-gray-500">No data yet.</p>
        ) : (
          Object.entries(formData).map(([key, value]) => (
            <div
              key={key}
              className="grid grid-cols-3 sm:grid-cols-4 gap-2 py-2 border-b border-gray-100"
            >
              <span className="font-semibold text-gray-700 capitalize col-span-1">
                {key.replace(/([A-Z])/g, " $1")}
              </span>
              <span className="col-span-2 sm:col-span-3 text-gray-600 break-words">
                {Array.isArray(value)
                  ? value.join(", ")
                  : value === null
                  ? "-"
                  : value.toString()}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => prevStep()}
          className="px-6 py-2.5 rounded-lg bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition"
        >
          ← Back
        </button>

        {/* Pass the current formData snapshot to nextStep so parent merges it */}
        <button
          onClick={() => nextStep(formData)}
          className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Proceed to Payment →
        </button>
      </div>
    </div>
  );
}
