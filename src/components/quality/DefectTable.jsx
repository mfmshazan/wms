import { useState, useMemo } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

/**
 * Format an ISO timestamp → "12 Jun 2025, 14:30"
 */
function formatTimestamp(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function severityVariant(severity) {
  if (severity === "Critical") return "low"; // red
  if (severity === "Major") return "warning"; // orange
  if (severity === "Minor") return "active"; // yellow-ish? we'll use active for minor or custom
  return "inactive";
}

function severityCustomClass(severity) {
  if (severity === "Critical") return "bg-red-900/40 text-wms-red border border-red-800";
  if (severity === "Major") return "bg-orange-900/40 text-wms-orange border border-orange-800";
  if (severity === "Minor") return "bg-yellow-900/40 text-yellow-400 border border-yellow-600";
  return "bg-wms-surface border-wms-border text-wms-text";
}

function statusVariant(status) {
  if (status === "Open") return "low"; // red
  if (status === "Under Review") return "warning"; // orange
  if (status === "Resolved") return "active"; // green
  return "inactive"; // Closed - gray
}

/**
 * DefectTable — filterable table of all defect records.
 * Props:
 *   defects - full array from useDefects
 *   onView(defect) - open detail modal
 *   onEdit(defect) - open status modal
 *   onDelete(defect) - delete the record
 *   onConvertToNCR(defect) - trigger NCR flow
 */
export function DefectTable({ defects, onView, onEdit, onDelete, onConvertToNCR }) {
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [skuSearch, setSkuSearch] = useState("");

  const severityOptions = ["All", "Critical", "Major", "Minor"];
  const statusOptions = ["All", "Open", "Under Review", "Resolved", "Closed"];

  const filtered = useMemo(() => {
    const q = skuSearch.toLowerCase().trim();
    return defects
      .filter((def) => {
        const matchSeverity = severityFilter === "All" || def.severity === severityFilter;
        const matchStatus = statusFilter === "All" || def.status === statusFilter;
        const matchSku =
          !q ||
          def.sku.toLowerCase().includes(q) ||
          def.productName.toLowerCase().includes(q);
        return matchSeverity && matchStatus && matchSku;
      })
      .sort((a, b) => {
        // Sort by severity (Critical = 0, Major = 1, Minor = 2)
        const sevA = a.severity === "Critical" ? 0 : a.severity === "Major" ? 1 : 2;
        const sevB = b.severity === "Critical" ? 0 : b.severity === "Major" ? 1 : 2;
        if (sevA !== sevB) return sevA - sevB;
        // Then by timestamp descending
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
  }, [defects, severityFilter, statusFilter, skuSearch]);

  return (
    <div className="flex flex-col gap-4">
      {/* ── Filter bar ── */}
      <div className="bg-wms-surface border border-wms-border rounded-xl px-5 py-3 flex flex-wrap gap-3 items-center">
        {/* Severity filter pills */}
        <div className="flex gap-1.5 flex-wrap">
          {severityOptions.map((s) => (
            <button
              key={s}
              id={`def-sev-filter-${s.toLowerCase()}`}
              onClick={() => setSeverityFilter(s)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors border ${
                severityFilter === s
                  ? s === "Critical"
                    ? "bg-red-900/40 border-red-800 text-wms-red"
                    : s === "Major"
                    ? "bg-orange-900/40 border-orange-800 text-wms-orange"
                    : s === "Minor"
                    ? "bg-yellow-900/40 border-yellow-600 text-yellow-400"
                    : "bg-blue-900/40 border-blue-700 text-wms-blue"
                  : "bg-transparent border-wms-border text-wms-muted hover:bg-white/5"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Status filter pills */}
        <div className="flex gap-1.5 flex-wrap">
          {statusOptions.map((st) => (
            <button
              key={st}
              id={`def-status-filter-${st.toLowerCase().replace(/\\s/g, "-")}`}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors border ${
                statusFilter === st
                  ? "bg-wms-border/40 border-wms-border text-wms-text"
                  : "bg-transparent border-wms-border text-wms-muted hover:bg-white/5"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* SKU search */}
        <div className="flex-1 min-w-[180px] max-w-xs ml-auto">
          <Input
            id="def-sku-search"
            value={skuSearch}
            onChange={(e) => setSkuSearch(e.target.value)}
            placeholder="Search SKU or product…"
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-wms-surface border border-wms-border rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-mono text-wms-muted text-sm">
              No defects found
            </p>
            <p className="text-xs text-wms-muted/60 mt-1 uppercase tracking-widest">
              Try adjusting the filters
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-wms-border">
                  {[
                    "Defect ID",
                    "Severity",
                    "SKU",
                    "Product",
                    "Type",
                    "Qty",
                    "Status",
                    "Linked Insp.",
                    "Reported By",
                    "Date",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-wms-muted font-normal whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((def, idx) => (
                  <tr
                    key={def.id}
                    className={`border-b border-wms-border/50 transition-colors hover:bg-white/[0.02] ${
                      idx === filtered.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    {/* Defect ID */}
                    <td className="px-4 py-3 font-mono text-xs text-wms-purple whitespace-nowrap">
                      {def.defectId}
                    </td>

                    {/* Severity */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${severityCustomClass(def.severity)}`}>
                        {def.severity}
                      </span>
                    </td>

                    {/* SKU */}
                    <td className="px-4 py-3 font-mono text-xs text-wms-green whitespace-nowrap">
                      {def.sku}
                    </td>

                    {/* Product */}
                    <td className="px-4 py-3 text-wms-text whitespace-nowrap max-w-[140px] truncate">
                      {def.productName}
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3 text-wms-text text-xs whitespace-nowrap">
                      {def.type}
                    </td>

                    {/* Qty */}
                    <td className="px-4 py-3 font-mono text-xs text-wms-text whitespace-nowrap">
                      {def.quantity}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant={statusVariant(def.status)}>
                        {def.status}
                      </Badge>
                    </td>

                    {/* Linked Inspection */}
                    <td className="px-4 py-3 font-mono text-xs text-wms-muted whitespace-nowrap">
                      {def.inspectionId || "—"}
                    </td>

                    {/* Reported By */}
                    <td className="px-4 py-3 text-wms-muted text-xs whitespace-nowrap">
                      {def.reportedBy}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 font-mono text-xs text-wms-muted whitespace-nowrap">
                      {formatTimestamp(def.timestamp)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {def.status !== "Closed" && def.status !== "Resolved" && (
                          <button
                            onClick={() => onConvertToNCR(def)}
                            className="px-2 py-1 rounded text-xs text-wms-purple hover:bg-purple-900/20 transition-colors whitespace-nowrap"
                          >
                            Convert to NCR
                          </button>
                        )}
                        <Button
                          variant="ghost"
                          onClick={() => onView(def)}
                          id={`view-defect-${def.id}`}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="w-3.5 h-3.5 text-wms-blue"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => onDelete(def)}
                          id={`delete-defect-${def.id}`}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="w-3.5 h-3.5 text-wms-red"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Row count */}
      {filtered.length > 0 && (
        <p className="text-xs text-wms-muted font-mono text-right">
          Showing {filtered.length} of {defects.length} defect
          {defects.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
