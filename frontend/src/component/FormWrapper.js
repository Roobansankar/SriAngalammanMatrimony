// FormWrapper.js
import React from "react";

export default function FormWrapper({ title, children }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-2">
          {title}
        </h2>
        <div className="h-1 bg-indigo-100 mb-6 rounded">
          <div className="h-1 bg-indigo-500 w-1/3 rounded"></div>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
