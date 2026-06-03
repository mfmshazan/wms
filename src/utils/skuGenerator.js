let counter = 4;

/**
 * Generates a zero-padded SKU string, e.g. "SKU-0004"
 * @returns {string}
 */
export function generateSKU() {
  const padded = String(counter).padStart(4, "0");
  counter += 1;
  return `SKU-${padded}`;
}

/**
 * Resets the counter — useful for tests.
 * @param {number} [value=4]
 */
export function resetSKUCounter(value = 4) {
  counter = value;
}
