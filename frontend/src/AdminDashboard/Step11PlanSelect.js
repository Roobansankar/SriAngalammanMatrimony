import { Crown, Star } from "lucide-react";
import { useState } from "react";

export default function Step11PlanSelect({
  nextStep,
  prevStep,
  formData,
  setFormData,
}) {
  const [plan, setPlan] = useState(formData.plan || "basic");

  const handleContinue = () => {
    // Update formData with selected plan (no payment required for admin)
    const updated = {
      ...formData,
      plan,
      paymentDone: true, // Mark as done since admin bypass payment
    };

    // Update parent state
    setFormData(updated);

    // Move to next step
    nextStep(updated);
  };

  return (
    <div className="max-w-lg mx-auto mt-12 bg-white shadow-lg rounded-2xl p-8 border text-center">
      <h3 className="text-2xl font-semibold mb-2 text-gray-800">
        Step 10: Select Membership Plan
      </h3>
      <p className="text-gray-500 mb-6 text-sm">
        Choose a membership plan for this user
      </p>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Basic Plan */}
        <div
          onClick={() => setPlan("basic")}
          className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
            plan === "basic"
              ? "border-rose-500 bg-rose-50 shadow-md"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="flex justify-center mb-3">
            <Star
              size={32}
              className={plan === "basic" ? "text-rose-500" : "text-gray-400"}
            />
          </div>
          <h4 className="font-bold text-lg mb-2 text-gray-800">Basic Plan</h4>
          <p className="text-gray-600 text-sm">View limited profiles</p>
          <div className="mt-3">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                plan === "basic"
                  ? "bg-rose-100 text-rose-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Standard Access
            </span>
          </div>
        </div>

        {/* Premium Plan */}
        <div
          onClick={() => setPlan("premium")}
          className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
            plan === "premium"
              ? "border-amber-500 bg-amber-50 shadow-md"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="flex justify-center mb-3">
            <Crown
              size={32}
              className={plan === "premium" ? "text-amber-500" : "text-gray-400"}
            />
          </div>
          <h4 className="font-bold text-lg mb-2 text-gray-800">Premium Plan</h4>
          <p className="text-gray-600 text-sm">View all profiles</p>
          <div className="mt-3">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                plan === "premium"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Full Access
            </span>
          </div>
        </div>
      </div>

      {/* Selected Plan Indicator */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Selected Plan:{" "}
          <span className={`font-bold ${plan === "premium" ? "text-amber-600" : "text-rose-600"}`}>
            {plan.charAt(0).toUpperCase() + plan.slice(1)}
          </span>
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => prevStep({ plan })}
          className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
        >
          ← Back
        </button>
        <button
          onClick={handleContinue}
          className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg shadow hover:from-rose-600 hover:to-rose-700 transition font-medium"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
