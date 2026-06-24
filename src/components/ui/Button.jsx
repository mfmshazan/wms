export function Button({ variant = "primary", onClick, children, disabled, id }) {
  const base =
    "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-wms-purple text-white hover:bg-indigo-600 border border-wms-purple",
    danger:  "bg-wms-red text-white hover:bg-red-600 border border-wms-red",
    ghost:   "bg-transparent border border-wms-border text-wms-muted hover:bg-slate-50 hover:text-wms-text",
  };

  return (
    <button
      id={id}
      className={`${base} ${variants[variant] ?? variants.primary}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
