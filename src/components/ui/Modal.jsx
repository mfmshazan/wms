import { useEffect } from "react";

/**
 * Modal — animated backdrop + card.
 * Click backdrop or press Escape to close.
 */
export function Modal({ title, onClose, children }) {
  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Card — stop propagation so clicks inside don't close */}
      <div
        className="bg-wms-surface border border-wms-border rounded-xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-mono font-bold text-wms-text text-base">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-wms-muted hover:text-wms-text transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
