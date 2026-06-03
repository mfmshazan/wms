/**
 * Input — controlled text/number input with optional label.
 */
export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
  label,
  id,
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className="text-xs uppercase tracking-widest text-wms-muted"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="bg-wms-bg border border-wms-border rounded-lg px-3 py-2 text-sm text-wms-text w-full placeholder:text-wms-muted/60 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      />
    </div>
  );
}
