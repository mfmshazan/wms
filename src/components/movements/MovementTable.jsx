import { useState, useMemo } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

/**
 * Format an ISO timestamp → "12 Jun 2025, 14:30"
 */
function formatTimestamp(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * MovementTable — filterable, sortable log of all stock movements.
 * Props:
 *   movements - full array from useMovements
 *   products  - full array from useProducts (used for low-stock context if needed)
 *   onDelete(movement) - called when user clicks delete
 */
export function MovementTable({ movements, onDelete, canDelete = true }) {
  const [typeFilter, setTypeFilter] = useState("All");
  const [skuSearch, setSkuSearch] = useState("");
  const [dateRange, setDateRange] = useState("All");

  function getDateBoundary(range) {
    const now = new Date();
    if (range === "Today") {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      return start;
    }
    if (range === "This week") {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      return start;
    }
    if (range === "This month") {
      return new Date(now.getFullYear(), now.getMonth(), 1);
    }
    return null; // "All"
  }

  const filtered = useMemo(() => {
    const boundary = getDateBoundary(dateRange);
    const q = skuSearch.toLowerCase().trim();

    return movements
      .filter((m) => {
        const matchType = typeFilter === "All" || m.type === typeFilter;
        const matchSku = !q || m.sku.toLowerCase().includes(q) || m.productName.toLowerCase().includes(q);
        const matchDate = !boundary || new Date(m.timestamp) >= boundary;
        return matchType && matchSku && matchDate;
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movements, typeFilter, skuSearch, dateRange]);

  const dateRangeOptions = ["All", "Today", "This week", "This month"];
  const typeOptions = ["All", "Inbound", "Outbound"];

  return (
    <div className="flex flex-col gap-4">
      {/* ── Filter bar ── */}
      <div className="bg-wms-surface border border-wms-border rounded-xl px-5 py-3 flex flex-wrap gap-3 items-center">
        {/* Type filter pills */}
        <div className="flex gap-1.5">
          {typeOptions.map((t) => (
            <button
              key={t}
              id={`type-filter-${t.toLowerCase()}`}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors border ${
                typeFilter === t
                  ? t === "Inbound"
                    ? "bg-green-900/50 border-green-700 text-wms-green"
                    : t === "Outbound"
                    ? "bg-orange-900/40 border-orange-700 text-wms-orange"
                    : "bg-wms-border/40 border-wms-border text-wms-text"
                  : "bg-transparent border-wms-border text-wms-muted hover:bg-white/5"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* SKU search */}
        <div className="flex-1 min-w-[180px] max-w-xs">
          <Input
            id="movement-sku-search"
            value={skuSearch}
            onChange={(e) => setSkuSearch(e.target.value)}
            placeholder="Search SKU or product…"
          />
        </div>

        {/* Date range pills */}
        <div className="flex gap-1.5 ml-auto">
          {dateRangeOptions.map((r) => (
            <button
              key={r}
              id={`date-filter-${r.toLowerCase().replace(/\s/g, "-")}`}
              onClick={() => setDateRange(r)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors border ${
                dateRange === r
                  ? "bg-blue-900/40 border-blue-700 text-wms-blue"
                  : "bg-transparent border-wms-border text-wms-muted hover:bg-white/5"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-wms-surface border border-wms-border rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-mono text-wms-muted text-sm">
              No movements recorded yet
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
                    "Movement ID",
                    "Type",
                    "SKU",
                    "Product",
                    "Qty",
                    "Reason",
                    "Reference",
                    "Performed By",
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
                {filtered.map((m, idx) => (
                  <tr
                    key={m.id}
                    className={`border-b border-wms-border/50 transition-colors hover:bg-white/[0.02] ${
                      idx === filtered.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    {/* Movement ID */}
                    <td className="px-4 py-3 font-mono text-xs text-wms-purple whitespace-nowrap">
                      {m.movementId}
                    </td>

                    {/* Type badge */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant={m.type === "Inbound" ? "active" : "low"}>
                        {m.type === "Inbound" ? "↓ " : "↑ "}
                        {m.type}
                      </Badge>
                    </td>

                    {/* SKU */}
                    <td className="px-4 py-3 font-mono text-xs text-wms-green whitespace-nowrap">
                      {m.sku}
                    </td>

                    {/* Product name */}
                    <td className="px-4 py-3 text-wms-text whitespace-nowrap max-w-[160px] truncate">
                      {m.productName}
                    </td>

                    {/* Qty */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`font-mono text-sm font-bold ${
                          m.type === "Inbound"
                            ? "text-wms-green"
                            : "text-wms-orange"
                        }`}
                      >
                        {m.type === "Inbound" ? "+" : "−"}
                        {m.qty}
                      </span>
                      <span className="text-xs text-wms-muted ml-1">
                        {m.unit}
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="px-4 py-3 text-wms-muted text-xs whitespace-nowrap">
                      {m.reason}
                    </td>

                    {/* Reference */}
                    <td className="px-4 py-3 font-mono text-xs text-wms-muted whitespace-nowrap">
                      {m.reference || "—"}
                    </td>

                    {/* Performed by */}
                    <td className="px-4 py-3 text-wms-muted text-xs whitespace-nowrap">
                      {m.performedBy}
                    </td>

                    {/* Date/time */}
                    <td className="px-4 py-3 font-mono text-xs text-wms-muted whitespace-nowrap">
                      {formatTimestamp(m.timestamp)}
                    </td>

                    {/* Delete */}
                    <td className="px-4 py-3">
                      {canDelete && (
                      <Button
                        variant="ghost"
                        onClick={() => onDelete(m)}
                        id={`delete-movement-${m.id}`}
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
                      )}
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
          Showing {filtered.length} of {movements.length} movement
          {movements.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
