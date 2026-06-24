export function Badge({ children, variant = "category" }) {
  const variants = {
    low:      "bg-red-100 border border-red-200 text-red-700 text-[10px] px-1.5 py-0.5 rounded",
    warning:  "bg-orange-100 border border-orange-200 text-orange-700 text-xs px-2 py-0.5 rounded",
    active:   "bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs px-2 py-0.5 rounded",
    inactive: "bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded border border-slate-200",
    category: "bg-blue-100 border border-blue-200 text-blue-700 text-xs px-2 py-0.5 rounded",
  };

  return (
    <span className={`inline-flex items-center font-mono ${variants[variant] ?? variants.category}`}>
      {children}
    </span>
  );
}
