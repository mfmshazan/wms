/**
 * Button — variant: "primary" | "danger" | "ghost"
 */
export function Button({ variant = "primary", onClick, children, disabled }) {
  const base =
    "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-green-900/50 border border-green-700 text-wms-green hover:bg-green-900/70",
    danger:
      "bg-red-900/30 border border-red-800 text-wms-red hover:bg-red-900/50",
    ghost:
      "bg-transparent border border-wms-border text-wms-muted hover:bg-white/5",
  };

  return (
    <button
      className={`${base} ${variants[variant] ?? variants.primary}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
