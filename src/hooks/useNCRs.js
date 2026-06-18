import { useState } from "react";
import { INITIAL_NCRS } from "../data/constants";
import { generateNCRId } from "../utils/ncrIdGenerator";
import { generateCAPAId } from "../utils/capaIdGenerator";

export function useNCRs() {
  const [ncrs, setNcrs] = useState(INITIAL_NCRS);

  // ── NCR Operations ─────────────────────────────────────────────────────────

  function addNCR(data) {
    const newNCR = {
      ...data,
      id: Date.now(),
      ncrId: generateNCRId(),
      timestamp: new Date().toISOString(),
      closedAt: null,
      capas: [],
    };
    setNcrs((prev) => [newNCR, ...prev]);
  }

  function updateNCR(id, data) {
    setNcrs((prev) =>
      prev.map((ncr) => (ncr.id === id ? { ...ncr, ...data } : ncr))
    );
  }

  function deleteNCR(id) {
    setNcrs((prev) => prev.filter((ncr) => ncr.id !== id));
  }

  function getNCRById(id) {
    return ncrs.find((ncr) => ncr.id === id);
  }

  function getNCRsByDefect(defectId) {
    return ncrs.filter((ncr) => ncr.defectId === defectId);
  }

  function getOpenNCRs() {
    return ncrs.filter((ncr) => ncr.status !== "Closed");
  }

  // ── CAPA Operations ────────────────────────────────────────────────────────

  function addCAPA(ncrId, capaData) {
    setNcrs((prev) =>
      prev.map((ncr) => {
        if (ncr.ncrId === ncrId) {
          const newCAPA = {
            ...capaData,
            id: Date.now(),
            capaId: generateCAPAId(),
            completedAt: null,
            verificationNotes: "",
            effectiveness: "Pending",
          };
          return { ...ncr, capas: [...ncr.capas, newCAPA] };
        }
        return ncr;
      })
    );
  }

  function updateCAPA(ncrId, capaId, data) {
    setNcrs((prev) =>
      prev.map((ncr) => {
        if (ncr.ncrId === ncrId) {
          const updatedCapas = ncr.capas.map((capa) =>
            capa.capaId === capaId ? { ...capa, ...data } : capa
          );
          return { ...ncr, capas: updatedCapas };
        }
        return ncr;
      })
    );
  }

  function deleteCAPA(ncrId, capaId) {
    setNcrs((prev) =>
      prev.map((ncr) => {
        if (ncr.ncrId === ncrId) {
          const filteredCapas = ncr.capas.filter(
            (capa) => capa.capaId !== capaId
          );
          return { ...ncr, capas: filteredCapas };
        }
        return ncr;
      })
    );
  }

  return {
    ncrs,
    addNCR,
    updateNCR,
    deleteNCR,
    getNCRById,
    getNCRsByDefect,
    getOpenNCRs,
    addCAPA,
    updateCAPA,
    deleteCAPA,
  };
}
