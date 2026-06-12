import { useState } from "react";
import { INITIAL_MOVEMENTS } from "../data/constants";
import { generateMovementId } from "../utils/movementIdGenerator";

/**
 * Central hook for all movement CRUD operations.
 * Movement records are append-only — never edited, only deleted.
 */
export function useMovements() {
  const [movements, setMovements] = useState(INITIAL_MOVEMENTS);

  /**
   * Append a new movement record.
   * Generates movementId and timestamp automatically.
   * @param {object} data - Partial movement (all fields except id, movementId, timestamp)
   */
  function addMovement(data) {
    const newMovement = {
      ...data,
      id: Date.now(),
      movementId: generateMovementId(),
      timestamp: new Date().toISOString(),
    };
    setMovements((prev) => [newMovement, ...prev]);
  }

  /** Remove a movement record by id. */
  function deleteMovement(id) {
    setMovements((prev) => prev.filter((m) => m.id !== id));
  }

  /** Return all movements for a given SKU. */
  function getMovementsByProduct(sku) {
    return movements.filter((m) => m.sku === sku);
  }

  /** Return all movements of a given type ("Inbound" | "Outbound"). */
  function getMovementsByType(type) {
    return movements.filter((m) => m.type === type);
  }

  return {
    movements,
    addMovement,
    deleteMovement,
    getMovementsByProduct,
    getMovementsByType,
  };
}
