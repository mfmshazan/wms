import { useState, useCallback } from "react";

/**
 * Lightweight toast notification hook.
 * @returns {{ toast: {msg: string, type: string}|null, showToast: Function }}
 */
export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  return { toast, showToast };
}
