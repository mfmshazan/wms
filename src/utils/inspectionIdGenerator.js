let counter = 3;

/**
 * Generates a zero-padded inspection ID string, e.g. "INS-0003".
 * Counter starts at 3 to skip the 2 INITIAL_INSPECTIONS seed records.
 * @returns {string}
 */
export function generateInspectionId() {
  const padded = String(counter).padStart(4, "0");
  counter += 1;
  return `INS-${padded}`;
}

/**
 * Resets the counter — useful for tests.
 * @param {number} [value=3]
 */
export function resetInspectionCounter(value = 3) {
  counter = value;
}
