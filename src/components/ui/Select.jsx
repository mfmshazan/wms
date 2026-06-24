export function Select({ value, onChange, options = [], label, id }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-medium uppercase tracking-widest text-wms-muted">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="bg-white border border-wms-border rounded-lg px-3 py-2 text-sm text-wms-text w-full focus:outline-none focus:ring-2 focus:ring-wms-purple/20 focus:border-wms-purple transition-colors appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
