import { useState, useMemo } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { InspectionDetailModal } from "./InspectionDetailModal";

/**
 * Format an ISO timestamp → "12 Jun 2025, 14:30"
 */
function formatTimestamp(iso) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function resultVariant(result) {
  if (result === "Pass") return "active";
  if (result === "Fail") return "low";
  return "inactive";
}

/**
 * InspectionTable — filterable table of all inspection records.
 * Props:
 *   inspections - full array from useInspections
 *   onView(inspection) - open detail modal
 *   onDelete(inspection) - delete the record
 */
export function InspectionTable({ inspections, onView, onDelete, onLogDefect }) {
  const [typeFilter, setTypeFilter] = useState("All");
  const [resultFilter, setResultFilter] = useState("All");
  const [skuSearch, setSkuSearch] = useState("");

  // Local state for the detail modal (view-only flow lives here)
  const [viewInspection, setViewInspection] = useState(null);

  const typeOptions = ["All", "Incoming", "Outgoing", "In-Process"];
  const resultOptions = ["All", "Pass", "Fail", "Pending"];

  const filtered = useMemo(() => {
    const q = skuSearch.toLowerCase().trim();
    return inspections
      .filter((ins) => {
        const matchType = typeFilter === "All" || ins.type === typeFilter;
        const matchResult =
          resultFilter === "All" || ins.overallResult === resultFilter;
        const matchSku =
          !q ||
          ins.sku.toLowerCase().includes(q) ||
          ins.productName.toLowerCase().includes(q);
        return matchType && matchResult && matchSku;
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [inspections, typeFilter, resultFilter, skuSearch]);

  function handleView(ins) {
    setViewInspection(ins);
    onView(ins);
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* ── Filter bar ── */}
        <div className="bg-wms-surface border border-wms-border rounded-xl px-5 py-3 flex flex-wrap gap-3 items-center">
          {/* Type filter pills */}
          <div className="flex gap-1.5 flex-wrap">
            {typeOptions.map((t) => (
              <button
                key={t}
                id={`ins-type-filter-${t.toLowerCase().replace(/[-\s]/g, "-")}`}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors border ${
                  typeFilter === t
                    ? "bg-blue-900/40 border-blue-700 text-wms-blue"
                    : "bg-transparent border-wms-border text-wms-muted hover:bg-white/5"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Result filter pills */}
          <div className="flex gap-1.5 flex-wrap">
            {resultOptions.map((r) => (
              <button
                key={r}
                id={`ins-result-filter-${r.toLowerCase()}`}
                onClick={() => setResultFilter(r)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors border ${
                  resultFilter === r
                    ? r === "Pass"
                      ? "bg-green-900/40 border-green-700 text-wms-green"
                      : r === "Fail"
                      ? "bg-red-900/40 border-red-800 text-wms-red"
                      : r === "Pending"
                      ? "bg-wms-border/40 border-wms-border text-wms-muted"
                      : "bg-wms-border/40 border-wms-border text-wms-text"
                    : "bg-transparent border-wms-border text-wms-muted hover:bg-white/5"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* SKU search */}
          <div className="flex-1 min-w-[180px] max-w-xs ml-auto">
            <Input
              id="ins-sku-search"
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
                No inspections recorded yet
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
                      "Inspection ID",
                      "Type",
                      "SKU",
                      "Product",
                      "Qty",
                      "Inspector",
                      "Result",
                      "Date / Time",
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
                  {filtered.map((ins, idx) => (
                    <tr
                      key={ins.id}
                      className={`border-b border-wms-border/50 transition-colors hover:bg-white/[0.02] ${
                        idx === filtered.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      {/* Inspection ID */}
                      <td className="px-4 py-3 font-mono text-xs text-wms-purple whitespace-nowrap">
                        {ins.inspectionId}
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant="category">{ins.type}</Badge>
                      </td>

                      {/* SKU */}
                      <td className="px-4 py-3 font-mono text-xs text-wms-green whitespace-nowrap">
                        {ins.sku}
                      </td>

                      {/* Product */}
                      <td className="px-4 py-3 text-wms-text whitespace-nowrap max-w-[160px] truncate">
                        {ins.productName}
                      </td>

                      {/* Quantity */}
                      <td className="px-4 py-3 font-mono text-xs text-wms-text whitespace-nowrap">
                        {ins.quantity}
                      </td>

                      {/* Inspector */}
                      <td className="px-4 py-3 text-wms-muted text-xs whitespace-nowrap">
                        {ins.inspector}
                      </td>

                      {/* Overall result */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant={resultVariant(ins.overallResult)}>
                          {ins.overallResult}
                        </Badge>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 font-mono text-xs text-wms-muted whitespace-nowrap">
                        {formatTimestamp(ins.timestamp)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          {/* View */}
                          <Button
                            variant="ghost"
                            onClick={() => handleView(ins)}
                            id={`view-inspection-${ins.id}`}
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
                          {/* Delete */}
                          <Button
                            variant="ghost"
                            onClick={() => onDelete(ins)}
                            id={`delete-inspection-${ins.id}`}
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
            Showing {filtered.length} of {inspections.length} inspection
            {inspections.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Detail modal — owned locally so view flow works without bubbling up */}
      {viewInspection && (
        <InspectionDetailModal
          inspection={viewInspection}
          onClose={() => setViewInspection(null)}
          onLogDefect={onLogDefect}
        />
      )}
    </>
  );
}
