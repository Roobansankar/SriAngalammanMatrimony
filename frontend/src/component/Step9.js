import React, { useState, useEffect } from "react";

export default function Step9({ nextStep, prevStep, initialPhoto }) {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialPhoto && !preview) {
      setPreview(initialPhoto); // e.g., if coming back from saved data
    }
  }, [initialPhoto]);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    setError("");

    if (!file) {
      setPhoto(null);
      setPreview("");
      return;
    }

    const isImage = file.type.startsWith("image/");
    const isSmallEnough = file.size <= 5 * 1024 * 1024; // 5 MB

    if (!isImage) return setError("Please select a valid image file.");
    if (!isSmallEnough) return setError("Max file size is 5 MB.");

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleNext = () => {
    if (!photo) return setError("Please select a photo before continuing.");
    nextStep({ photo }); // <-- this sends the File object to Step12
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-8 mt-12 text-gray-800">
      <h3 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Step 9: Upload Your Photo
      </h3>

      <div className="flex flex-col items-center space-y-4">
        <label
          htmlFor="photo"
          className="block text-lg font-semibold text-gray-700"
        >
          Select a Profile Photo
        </label>

        <input
          id="photo"
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          className="w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
        />

        {error && (
          <div className="text-red-600 text-sm mt-1 font-medium">{error}</div>
        )}

        {preview && (
          <div className="mt-4 flex flex-col items-center">
            <img
              src={preview}
              alt="Selected Preview"
              className="w-40 h-40 object-cover rounded-xl shadow-md border border-gray-200"
            />
            <p className="text-gray-600 text-sm mt-2">Preview of your photo</p>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="px-5 py-2.5 rounded-lg bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition"
        >
          ← Back
        </button>

        <button
          onClick={handleNext}
          disabled={!photo}
          className={`px-6 py-2.5 rounded-lg font-semibold text-white transition ${
            photo
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
