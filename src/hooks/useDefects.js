import { useState } from "react";
import { INITIAL_DEFECTS } from "../data/constants";
import { generateDefectId } from "../utils/defectIdGenerator";

/**
 * Central hook for all defect CRUD operations.
 */
export function useDefects() {
  const [defects, setDefects] = useState(INITIAL_DEFECTS);

  /**
   * Add a new defect record.
   * Generates defectId and timestamp automatically.
   * @param {object} data - Partial defect
   */
  function addDefect(data) {
    const newDefect = {
      ...data,
      id: Date.now(),
      defectId: generateDefectId(),
      timestamp: new Date().toISOString(),
      resolvedAt: data.status === "Resolved" || data.status === "Closed" ? new Date().toISOString() : null,
    };
    setDefects((prev) => [newDefect, ...prev]);
  }

  /**
   * Replace an existing defect record by id.
   * Typically used for status and disposition updates.
   * @param {number} id
   * @param {object} data
   */
  function updateDefect(id, data) {
    setDefects((prev) =>
      prev.map((def) => (def.id === id ? { ...def, ...data } : def))
    );
  }

  /** Remove a defect record by id. */
  function deleteDefect(id) {
    setDefects((prev) => prev.filter((def) => def.id !== id));
  }

  /** Return a single defect by id, or undefined. */
  function getDefectById(id) {
    return defects.find((def) => def.id === id);
  }

  /** Return all defects for a given SKU. */
  function getDefectsByProduct(sku) {
    return defects.filter((def) => def.sku === sku);
  }

  /** Return all defects for a given severity. */
  function getDefectsBySeverity(severity) {
    return defects.filter((def) => def.severity === severity);
  }

  /** Return all open defects. */
  function getOpenDefects() {
    return defects.filter((def) => def.status === "Open");
  }

  return {
    defects,
    addDefect,
    updateDefect,
    deleteDefect,
    getDefectById,
    getDefectsByProduct,
    getDefectsBySeverity,
    getOpenDefects,
  };
}
