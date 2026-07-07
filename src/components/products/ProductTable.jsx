import { useState, useMemo } from "react";
import { Badge } from "../ui/Badge";

const COLUMNS = [
  { key: "sku",      label: "SKU" },
  { key: "name",     label: "Product Name" },
  { key: "category", label: "Category" },
  { key: "qty",      label: "Qty" },
  { key: "price",    label: "Price" },
  { key: "status",   label: "Status" },
];

/**
 * ProductTable — sortable, with edit/delete row actions.
 */
export function ProductTable({ products, onEdit, onDelete, canDelete = true }) {
  const [sortKey, setSortKey] = useState("sku");
  const [sortDir, setSortDir] = useState("asc");

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = useMemo(() => {
    return [...products].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [products, sortKey, sortDir]);

  function sortIndicator(key) {
    if (sortKey !== key) return <span className="opacity-20">↕</span>;
    return (
      <span className="text-wms-green">
        {sortDir === "asc" ? "↑" : "↓"}
      </span>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-wms-surface border border-wms-border rounded-xl p-16 text-center">
        <p className="text-4xl mb-3">📦</p>
        <p className="font-mono text-wms-muted text-sm">No products found</p>
        <p className="text-xs text-wms-muted/60 mt-1">
          Try adjusting your search or add a new product
        </p>
      </div>
    );
  }

  return (
    <div className="bg-wms-surface border border-wms-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-wms-border">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 text-left text-xs uppercase tracking-widest text-wms-muted cursor-pointer select-none hover:text-wms-green transition-colors"
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    {sortIndicator(col.key)}
                  </span>
                </th>
              ))}
              {/* Actions column — not sortable */}
              <th className="px-4 py-3 text-right text-xs uppercase tracking-widest text-wms-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((product) => {
              const isLow = product.qty <= product.minStock;
              return (
                <tr
                  key={product.id}
                  className="border-b border-wms-border/50 hover:bg-white/[0.02] transition-colors group"
                >
                  {/* SKU */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-wms-muted">
                      {product.sku}
                    </span>
                  </td>

                  {/* Name */}
                  <td className="px-4 py-3">
                    <span className="font-sans text-wms-text font-medium">
                      {product.name}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    <Badge variant="category">{product.category}</Badge>
                  </td>

                  {/* Qty */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-sm font-semibold ${
                          isLow ? "text-wms-orange" : "text-wms-text"
                        }`}
                      >
                        {product.qty}
                      </span>
                      <span className="text-xs text-wms-muted">
                        {product.unit}
                      </span>
                      {isLow && <Badge variant="low">LOW</Badge>}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-wms-text">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        product.status === "active" ? "active" : "inactive"
                      }
                    >
                      {product.status}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        id={`edit-${product.id}`}
                        onClick={() => onEdit(product)}
                        className="px-2.5 py-1 rounded text-xs font-mono text-wms-blue hover:bg-blue-900/20 transition-colors"
                      >
                        Edit
                      </button>
                      {canDelete && (
                        <button
                          id={`delete-${product.id}`}
                          onClick={() => onDelete(product)}
                          className="px-2.5 py-1 rounded text-xs font-mono text-wms-red hover:bg-red-900/20 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-wms-border/50 flex items-center justify-between">
        <span className="text-xs text-wms-muted font-mono">
          {sorted.length} record{sorted.length !== 1 ? "s" : ""}
        </span>
        <span className="text-xs text-wms-muted font-mono">
          sorted by{" "}
          <span className="text-wms-green">{sortKey}</span>{" "}
          {sortDir === "asc" ? "↑" : "↓"}
        </span>
      </div>
    </div>
  );
}
