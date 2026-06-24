export function Toast({ toast }) {
  if (!toast) return null;

  const styles = {
    success: "bg-white border border-emerald-200 text-emerald-700",
    error:   "bg-white border border-red-200 text-red-600",
    info:    "bg-white border border-blue-200 text-blue-600",
  };

  const icons = { success: "✓", error: "✕", info: "ℹ" };

  const style = styles[toast.type] ?? styles.success;
  const icon  = icons[toast.type]  ?? icons.success;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-300 ${style}`}
    >
      <span className="text-base leading-none">{icon}</span>
      <span>{toast.msg}</span>
    </div>
  );
}
