import { useEffect } from "react";

export function Modal({ title, onClose, children, size = "md" }) {
  const sizeClass = size === "2xl" ? "max-w-2xl" : "max-w-md";

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white border border-wms-border rounded-2xl p-6 w-full ${sizeClass} shadow-2xl animate-in fade-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-wms-text text-base">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-wms-muted hover:text-wms-text transition-colors w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-lg leading-none"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
