let counter = 4;

/**
 * Generates a zero-padded defect ID string, e.g. "DEF-0004".
 * Counter starts at 4 to skip the 3 INITIAL_DEFECTS seed records.
 * @returns {string}
 */
export function generateDefectId() {
  const padded = String(counter).padStart(4, "0");
  counter += 1;
  return `DEF-${padded}`;
}

/**
 * Resets the counter — useful for tests.
 * @param {number} [value=4]
 */
export function resetDefectCounter(value = 4) {
  counter = value;
}
