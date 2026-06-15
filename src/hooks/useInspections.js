import { useState } from "react";
import { INITIAL_INSPECTIONS } from "../data/constants";
import { generateInspectionId } from "../utils/inspectionIdGenerator";

/**
 * Compute overall result from criteria array.
 * - "Fail"    if ANY criterion is "Fail"
 * - "Pending" if ANY criterion is "Pending" and none are "Fail"
 * - "Pass"    only if ALL criteria are "Pass"
 * @param {Array<{result: string}>} criteria
 * @returns {"Pass" | "Fail" | "Pending"}
 */
export function computeOverallResult(criteria) {
  if (criteria.some((c) => c.result === "Fail")) return "Fail";
  if (criteria.some((c) => c.result === "Pending")) return "Pending";
  return "Pass";
}

/**
 * Central hook for all inspection CRUD operations.
 * Inspection records are append-only — never edited, only viewed or deleted.
 */
export function useInspections() {
  const [inspections, setInspections] = useState(INITIAL_INSPECTIONS);

  /**
   * Add a new inspection record.
   * Generates inspectionId, timestamp, and computes overallResult automatically.
   * @param {object} data - Partial inspection (all fields except id, inspectionId, timestamp, overallResult)
   */
  function addInspection(data) {
    const overallResult = computeOverallResult(data.criteria);
    const newInspection = {
      ...data,
      id: Date.now(),
      inspectionId: generateInspectionId(),
      overallResult,
      timestamp: new Date().toISOString(),
    };
    setInspections((prev) => [newInspection, ...prev]);
  }

  /**
   * Replace an existing inspection record by id.
   * Recomputes overallResult from the new criteria.
   * @param {number} id
   * @param {object} data
   */
  function updateInspection(id, data) {
    const overallResult = computeOverallResult(data.criteria);
    setInspections((prev) =>
      prev.map((ins) =>
        ins.id === id
          ? { ...ins, ...data, id, overallResult }
          : ins
      )
    );
  }

  /** Remove an inspection record by id. */
  function deleteInspection(id) {
    setInspections((prev) => prev.filter((ins) => ins.id !== id));
  }

  /** Return a single inspection by id, or undefined. */
  function getInspectionById(id) {
    return inspections.find((ins) => ins.id === id);
  }

  /** Return all inspections for a given SKU. */
  function getInspectionsByProduct(sku) {
    return inspections.filter((ins) => ins.sku === sku);
  }

  return {
    inspections,
    addInspection,
    updateInspection,
    deleteInspection,
    getInspectionById,
    getInspectionsByProduct,
  };
}
