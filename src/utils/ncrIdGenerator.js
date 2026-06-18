let counter = 4;

/**
 * Generates a zero-padded NCR ID string, e.g. "NCR-0004".
 * Counter starts at 4 to skip the 3 INITIAL_NCRS seed records.
 * @returns {string}
 */
export function generateNCRId() {
  const padded = String(counter).padStart(4, "0");
  counter += 1;
  return `NCR-${padded}`;
}

/**
 * Resets the counter — useful for tests.
 * @param {number} [value=4]
 */
export function resetNCRCounter(value = 4) {
  counter = value;
}
