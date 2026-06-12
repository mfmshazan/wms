let counter = 4;

/**
 * Generates a zero-padded movement ID string, e.g. "MOV-0004".
 * Counter starts at 4 to skip the 3 INITIAL_MOVEMENTS seed records.
 * @returns {string}
 */
export function generateMovementId() {
  const padded = String(counter).padStart(4, "0");
  counter += 1;
  return `MOV-${padded}`;
}

/**
 * Resets the counter — useful for tests.
 * @param {number} [value=4]
 */
export function resetMovementCounter(value = 4) {
  counter = value;
}
