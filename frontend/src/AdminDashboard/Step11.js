
// Fields to skip (internal/system fields)
const SKIP_FIELDS = [
  "password", "otp", "otpVerified", "terms", "photo", "horoscopeFile",
  // Rasi and Navamsam boxes (g1-g12, a1-a12)
  ...Array.from({ length: 12 }, (_, i) => `g${i + 1}`),
  ...Array.from({ length: 12 }, (_, i) => `a${i + 1}`),
];

// Pretty labels for field names
const FIELD_LABELS = {
  fname: "First Name",
  lname: "Last Name",
  email: "Email",
  profileBy: "Profile Created By",
  gender: "Gender",
  dobDay: "Birth Day",
  dobMonth: "Birth Month",
  dobYear: "Birth Year",
  maritalStatus: "Marital Status",
  religion: "Religion",
  caste: "Caste",
  subCaste: "Sub Caste",
  countryCode: "Country Code",
  mobile: "Mobile Number",
  aboutYourself: "About Yourself",
  moonSign: "Moon Sign (Rasi)",
  star: "Star (Nakshatra)",
  gothra: "Gothra",
  manglik: "Manglik",
  shani: "Shani",
  placeOfShani: "Place of Shani",
  horoscopeMatch: "Horoscope Match",
  parigarasevai: "Parigarasevai",
  sevai: "Sevai",
  raghu: "Raghu",
  keethu: "Keethu",
  birthHour: "Birth Hour",
  birthMinute: "Birth Minute",
  birthSecond: "Birth Second",
  ampm: "AM/PM",
  placeOfBirth: "Place of Birth",
  countryOfBirth: "Country of Birth",
  country: "Country",
  state: "State",
  district: "District",
  city: "City",
  pincode: "Pincode",
  residence: "Residence Status",
  address: "Address",
  altPhone: "Alternative Phone",
  whatsapp: "WhatsApp Number",
  convenientTime: "Convenient Time to Call",
  education: "Education",
  occupation: "Occupation",
  educationDetails: "Education Details",
  occupationDetails: "Occupation Details",
  annualIncome: "Monthly Income",
  incomeType: "Income Type",
  otherIncome: "Family Income",
  employedIn: "Employed In",
  workingHours: "Working Hours",
  companyName: "Company Name",
  workingLocation: "Working Location",
  height: "Height",
  weight: "Weight",
  bloodGroup: "Blood Group",
  complexion: "Complexion",
  bodyType: "Body Type",
  diet: "Diet",
  smoke: "Smoking",
  drink: "Drinking",
  specialCases: "Special Cases",
  hobbies: "Hobbies",
  interests: "Interests",
  otherHobbies: "Other Hobbies",
  otherInterests: "Other Interests",
  achievement: "Achievements",
  medicalHistory: "Medical History",
  passport: "Passport",
  familyValues: "Family Values",
  familyType: "Family Type",
  familyStatus: "Family Status",
  motherTongue: "Mother Tongue",
  noOfBrothers: "No. of Brothers",
  noOfBrothersMarried: "Brothers Married",
  noOfSisters: "No. of Sisters",
  noOfSistersMarried: "Sisters Married",
  fatherName: "Father's Name",
  fatherOccupation: "Father's Occupation",
  motherName: "Mother's Name",
  motherOccupation: "Mother's Occupation",
  parentsStay: "Parents Stay",
  familyWealth: "Family Wealth",
  familyDescription: "Family Description",
  familyMedicalHistory: "Family Medical History",
  ageFrom: "Partner Age From",
  ageTo: "Partner Age To",
  heightFrom: "Partner Height From",
  heightTo: "Partner Height To",
  partnerExpectations: "Partner Expectations",
  residencyStatus: "Residency Status",
};

// Helper to format display value
const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : "-";
  if (typeof value === "object") {
    if (value instanceof File) return value.name;
    return "-";
  }
  return String(value);
};

// Get pretty label for a field
const getLabel = (key) => {
  return FIELD_LABELS[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
};

export default function Step11({ nextStep, prevStep, formData }) {
  // Filter to only show user-relevant fields that have values
  const displayData = Object.entries(formData).filter(([key, value]) => {
    // Skip internal/system fields
    if (SKIP_FIELDS.includes(key)) return false;
    // Skip functions and event handlers
    if (typeof value === "function") return false;
    // Skip empty values
    if (value === null || value === undefined || value === "") return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  });

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
        {displayData.length === 0 ? (
          <p className="text-center text-gray-500">No data yet.</p>
        ) : (
          displayData.map(([key, value]) => (
            <div
              key={key}
              className="grid grid-cols-3 sm:grid-cols-4 gap-2 py-2 border-b border-gray-100"
            >
              <span className="font-semibold text-gray-700 col-span-1">
                {getLabel(key)}
              </span>
              <span className="col-span-2 sm:col-span-3 text-gray-600 break-words">
                {formatValue(value)}
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
