let counter = 3;

/**
 * Generates a zero-padded CAPA ID string, e.g. "CAPA-0003".
 * Counter starts at 3 to skip the 2 seed records.
 * @returns {string}
 */
export function generateCAPAId() {
  const padded = String(counter).padStart(4, "0");
  counter += 1;
  return `CAPA-${padded}`;
}

/**
 * Resets the counter — useful for tests.
 * @param {number} [value=3]
 */
export function resetCAPACounter(value = 3) {
  counter = value;
}
