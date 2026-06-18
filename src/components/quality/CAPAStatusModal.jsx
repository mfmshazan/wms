import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { CAPA_STATUSES } from "../../data/constants";

export function CAPAStatusModal({ capa, ncrId, onSave, onClose }) {
  const [status, setStatus] = useState(capa.status);
  const [assignedTo, setAssignedTo] = useState(capa.assignedTo);
  const [targetDate, setTargetDate] = useState(capa.targetDate);
  const [verificationNotes, setVerificationNotes] = useState(capa.verificationNotes || "");
  const [effectiveness, setEffectiveness] = useState(capa.effectiveness || "Pending");
  const [errors, setErrors] = useState({});

  if (!capa) return null;

  const isCompletedOrVerified = status === "Completed" || status === "Verified";
  const isVerified = status === "Verified";

  function validate() {
    const errs = {};
    if (isVerified && !verificationNotes.trim()) {
      errs.verificationNotes = "Verification notes are required when verifying a CAPA.";
    }
    return errs;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const updates = {
      status,
      assignedTo: assignedTo.trim(),
      targetDate,
    };

    if (isCompletedOrVerified && !capa.completedAt) {
      updates.completedAt = new Date().toISOString();
    } else if (!isCompletedOrVerified) {
      updates.completedAt = null;
    }

    if (isVerified || status === "Completed") {
      updates.verificationNotes = verificationNotes.trim();
    }

    if (isVerified) {
      updates.effectiveness = effectiveness;
    }

    onSave(ncrId, capa.capaId, updates);
  }

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <Modal title={`Update CAPA: ${capa.capaId}`} onClose={onClose}>
      <div className="flex flex-col gap-4">
        
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={CAPA_STATUSES}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Assigned To"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-wms-muted">
              Target Date
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="bg-wms-bg border border-wms-border text-wms-text rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700"
            />
          </div>
        </div>

        {isCompletedOrVerified && (
          <div className="flex flex-col gap-4 mt-2 pt-4 border-t border-wms-border/50">
            {capa.completedAt && (
              <div>
                <p className="text-xs uppercase tracking-widest text-wms-muted">Completed At</p>
                <p className="text-sm font-mono text-wms-text mt-1">
                  {new Date(capa.completedAt).toLocaleString("en-GB", {
                    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false
                  })}
                </p>
              </div>
            )}
            
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-wms-muted">
                Verification Notes {isVerified && "*"}
              </label>
              <textarea
                value={verificationNotes}
                onChange={(e) => {
                  setVerificationNotes(e.target.value);
                  setErrors((prev) => ({ ...prev, verificationNotes: undefined }));
                }}
                placeholder="How was this action verified?"
                rows={2}
                className="bg-wms-bg border border-wms-border rounded-lg px-3 py-2 text-sm text-wms-text w-full placeholder:text-wms-muted/60 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 resize-none transition-colors"
              />
              {errors.verificationNotes && <p className="text-xs text-wms-red">{errors.verificationNotes}</p>}
            </div>

            {isVerified && (
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-wms-muted">
                  Effectiveness
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEffectiveness("Effective")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                      effectiveness === "Effective"
                        ? "bg-green-900/40 border-green-800 text-wms-green ring-2 ring-green-800 ring-offset-1 ring-offset-wms-bg"
                        : "bg-transparent border-wms-border text-wms-muted hover:bg-white/5"
                    }`}
                  >
                    Effective
                  </button>
                  <button
                    onClick={() => setEffectiveness("Ineffective")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                      effectiveness === "Ineffective"
                        ? "bg-red-900/40 border-red-800 text-wms-red ring-2 ring-red-800 ring-offset-1 ring-offset-wms-bg"
                        : "bg-transparent border-wms-border text-wms-muted hover:bg-white/5"
                    }`}
                  >
                    Ineffective
                  </button>
                  <button
                    onClick={() => setEffectiveness("Pending")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                      effectiveness === "Pending"
                        ? "bg-wms-border/40 border-wms-border text-wms-text ring-2 ring-wms-border ring-offset-1 ring-offset-wms-bg"
                        : "bg-transparent border-wms-border text-wms-muted hover:bg-white/5"
                    }`}
                  >
                    Pending
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-wms-border">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Updates
          </Button>
        </div>
      </div>
    </Modal>
  );
}
