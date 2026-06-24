const colorMap = {
  green:  { bg: "bg-emerald-50",  text: "text-emerald-600" },
  orange: { bg: "bg-amber-50",    text: "text-amber-600" },
  red:    { bg: "bg-red-50",      text: "text-red-500" },
  blue:   { bg: "bg-blue-50",     text: "text-blue-600" },
  purple: { bg: "bg-indigo-50",   text: "text-indigo-600" },
};

export function KPICard({ title, value, subtitle, color, icon, trend }) {
  const styles = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-wms-surface border border-wms-border rounded-xl p-5 flex flex-col gap-1 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2 ${styles.bg}`}>
        {icon}
      </div>
      <div className={`text-2xl font-bold ${styles.text}`}>
        {value}
      </div>
      <div className="text-xs text-wms-muted uppercase tracking-widest font-medium mt-0.5">
        {title}
      </div>
      {subtitle && (
        <div className="text-xs text-wms-muted mt-0.5">
          {subtitle}
        </div>
      )}
      {trend && (
        <div className="text-xs font-medium mt-2 flex items-center gap-1">
          {trend.direction === "up" && (
            <span className="text-emerald-600">↑ {trend.label}</span>
          )}
          {trend.direction === "down" && (
            <span className="text-red-500">↓ {trend.label}</span>
          )}
          {trend.direction === "neutral" && (
            <span className="text-wms-muted">→ {trend.label}</span>
          )}
        </div>
      )}
    </div>
  );
}
