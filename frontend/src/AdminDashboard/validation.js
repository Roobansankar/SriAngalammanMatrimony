// Validation utility functions for registration form

// Email validation
export const isValidEmail = (email) => {
  if (!email || !email.trim()) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Mobile number validation (10 digits)
export const isValidMobile = (mobile) => {
  if (!mobile) return false;
  const cleaned = mobile.replace(/\D/g, "");
  return cleaned.length === 10;
};

// Pincode validation (6 digits for India)
export const isValidPincode = (pincode) => {
  if (!pincode) return false;
  const cleaned = pincode.toString().replace(/\D/g, "");
  return cleaned.length === 6;
};

// Name validation (only letters, spaces, and common punctuation)
export const isValidName = (name) => {
  if (!name || !name.trim()) return false;
  const nameRegex = /^[a-zA-Z\s'.,-]+$/;
  return nameRegex.test(name.trim()) && name.trim().length >= 2;
};

// Password validation (min 6 chars)
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Age validation (between 18-100)
export const isValidAge = (age) => {
  const num = parseInt(age, 10);
  return !isNaN(num) && num >= 18 && num <= 100;
};

// Height validation (in cm, between 100-250 or as text like 5'6")
export const isValidHeight = (height) => {
  if (!height) return true; // Optional field
  // Accept formats like "5'6"", "5ft 6in", "165", "165 cm"
  const heightRegex = /^(\d{1,3}(\.\d{1,2})?(\s*(cm|ft|'|"|in)?)?|\d{1,2}'\s*\d{1,2}"?)$/i;
  return heightRegex.test(height.toString().trim());
};

// Weight validation (in kg, between 20-300)
export const isValidWeight = (weight) => {
  if (!weight) return true; // Optional field
  const num = parseFloat(weight);
  return !isNaN(num) && num >= 20 && num <= 300;
};

// Year validation
export const isValidYear = (year) => {
  const num = parseInt(year, 10);
  const currentYear = new Date().getFullYear();
  return !isNaN(num) && num >= 1920 && num <= currentYear;
};

// Numeric only validation
export const isNumericOnly = (value) => {
  if (!value) return false;
  return /^\d+$/.test(value.toString());
};

// Text only validation (letters and spaces)
export const isTextOnly = (value) => {
  if (!value) return false;
  return /^[a-zA-Z\s]+$/.test(value.trim());
};

// WhatsApp number validation (can include country code)
export const isValidWhatsApp = (number) => {
  if (!number) return true; // Optional field
  const cleaned = number.replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 15;
};

// Required field validation
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
};

// Sanitize input - remove special characters that could be harmful
export const sanitizeInput = (value) => {
  if (!value) return "";
  return value.toString().replace(/[<>{}]/g, "");
};

// Format mobile number (add dashes/spaces for display)
export const formatMobile = (mobile) => {
  if (!mobile) return "";
  const cleaned = mobile.replace(/\D/g, "").slice(0, 10);
  return cleaned;
};

// Format pincode (6 digits only)
export const formatPincode = (pincode) => {
  if (!pincode) return "";
  return pincode.toString().replace(/\D/g, "").slice(0, 6);
};

// Format name (letters, spaces, and dots only)
export const formatName = (value) => {
  if (!value) return "";
  return value.replace(/[^a-zA-Z\s.]/g, "");
};

// Format numbers only (removes all non-digit characters)
export const formatNumbersOnly = (value) => {
  if (!value) return "";
  return value.toString().replace(/\D/g, "");
};

// Format place name (letters, spaces, commas, dots, hyphens, apostrophes)
export const formatPlaceName = (value) => {
  if (!value) return "";
  return value.replace(/[^a-zA-Z\s,.\-']/g, "");
};

// Validate all Step5 fields
export const validateStep5 = (data) => {
  const errors = {};

  if (data.pincode && !isValidPincode(data.pincode)) {
    errors.pincode = "Pincode must be 6 digits";
  }

  if (data.mobile && !isValidMobile(data.mobile)) {
    errors.mobile = "Mobile number must be 10 digits";
  }

  if (data.altPhone && !isValidMobile(data.altPhone)) {
    errors.altPhone = "Phone number must be 10 digits";
  }

  if (data.whatsapp && !isValidWhatsApp(data.whatsapp)) {
    errors.whatsapp = "WhatsApp number must be 10-15 digits";
  }

  if (data.city && !isTextOnly(data.city)) {
    errors.city = "City should only contain letters";
  }

  return errors;
};

// Validate Step7 fields (Physical Details)
export const validateStep7 = (data) => {
  const errors = {};

  if (data.weight && !isValidWeight(data.weight)) {
    errors.weight = "Weight must be between 20-300 kg";
  }

  return errors;
};

// Validate Step8 fields (Family Details)
export const validateStep8 = (data) => {
  const errors = {};

  if (data.noOfBrothers && !isNumericOnly(data.noOfBrothers)) {
    errors.noOfBrothers = "Must be a number";
  }

  if (data.noOfBrothersMarried && !isNumericOnly(data.noOfBrothersMarried)) {
    errors.noOfBrothersMarried = "Must be a number";
  }

  if (data.noOfSisters && !isNumericOnly(data.noOfSisters)) {
    errors.noOfSisters = "Must be a number";
  }

  if (data.noOfSistersMarried && !isNumericOnly(data.noOfSistersMarried)) {
    errors.noOfSistersMarried = "Must be a number";
  }

  if (data.fatherName && !isValidName(data.fatherName)) {
    errors.fatherName = "Enter a valid name";
  }

  if (data.motherName && !isValidName(data.motherName)) {
    errors.motherName = "Enter a valid name";
  }

  return errors;
};
