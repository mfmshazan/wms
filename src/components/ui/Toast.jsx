/**
 * Toast — fixed bottom-right notification.
 * @param {{ msg: string, type: "success"|"error"|"info" }} toast
 */
export function Toast({ toast }) {
  if (!toast) return null;

  const styles = {
    success:
      "bg-green-900/80 border border-green-700 text-wms-green",
    error:
      "bg-red-900/80 border border-red-700 text-wms-red",
    info:
      "bg-blue-900/80 border border-blue-700 text-wms-blue",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  const style = styles[toast.type] ?? styles.success;
  const icon = icons[toast.type] ?? icons.success;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl text-sm font-mono backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-300 ${style}`}
    >
      <span className="text-base leading-none">{icon}</span>
      <span>{toast.msg}</span>
    </div>
  );
}
