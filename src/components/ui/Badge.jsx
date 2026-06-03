/**
 * Badge — variant: "low" | "active" | "inactive" | "category"
 */
export function Badge({ children, variant = "category" }) {
  const variants = {
    low: "bg-orange-900/40 border border-orange-800/60 text-wms-orange text-[10px] px-1.5 py-0.5 rounded",
    active:
      "bg-green-900/30 border border-green-800/40 text-wms-green text-xs px-2 py-0.5 rounded",
    inactive:
      "bg-wms-border/40 text-wms-muted text-xs px-2 py-0.5 rounded",
    category:
      "bg-blue-900/30 border border-blue-800/40 text-wms-blue text-xs px-2 py-0.5 rounded",
  };

  return (
    <span className={`inline-flex items-center font-mono ${variants[variant] ?? variants.category}`}>
      {children}
    </span>
  );
}
