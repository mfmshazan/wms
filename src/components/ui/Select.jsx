/**
 * Select — controlled dropdown with optional label.
 * @param {string[]} options
 */
export function Select({ value, onChange, options = [], label, id }) {
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
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="bg-wms-bg border border-wms-border rounded-lg px-3 py-2 text-sm text-wms-text w-full focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 transition-colors appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-wms-surface">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
