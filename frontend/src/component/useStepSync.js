import { useEffect, useRef } from "react";

/**
 * Use inside a step to copy initial values from parent and optionally live-sync changes.
 *
 * - setLocalState should be the setter returned by useState in the step (eg setData)
 * - formData is parent formData
 * - liveSync is a function updateFormData(partial) from parent to persist keystrokes
 * - fieldsList is optional array of keys to copy from formData to local state
 */
export function useStepSync({
  setLocalState,
  formData,
  fieldsList = null,
  liveSync = null,
}) {
  const initialized = useRef(false);

  // Initialize local state from parent formData once (or whenever formData changes)
  useEffect(() => {
    if (!formData) return;
    // Build partial based on fieldsList or take all
    const partial = {};
    if (fieldsList && Array.isArray(fieldsList)) {
      fieldsList.forEach((k) => {
        if (k in formData) partial[k] = formData[k];
      });
    } else {
      // copy everything
      Object.assign(partial, formData);
    }
    if (Object.keys(partial).length) {
      setLocalState((prev) => ({ ...prev, ...partial }));
    }
    initialized.current = true;
  }, [formData, setLocalState, fieldsList]);

  // Optional: we don't implement debounce here; steps can call liveSync themselves on change.
  return { initialized: initialized.current };
}
