const colorMap = {
  green: { bg: "bg-green-900/40", text: "text-wms-green" },
  orange: { bg: "bg-orange-900/40", text: "text-wms-orange" },
  red: { bg: "bg-red-900/40", text: "text-wms-red" },
  blue: { bg: "bg-blue-900/40", text: "text-wms-blue" },
  purple: { bg: "bg-purple-900/40", text: "text-wms-purple" },
};

export function KPICard({ title, value, subtitle, color, icon, trend }) {
  const styles = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-wms-surface border border-wms-border rounded-xl p-4 flex flex-col gap-1">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-1 ${styles.bg}`}
      >
        {icon}
      </div>
      <div className={`font-mono text-2xl font-bold ${styles.text}`}>
        {value}
      </div>
      <div className="text-xs text-wms-muted uppercase tracking-widest mt-1">
        {title}
      </div>
      {subtitle && (
        <div className="text-xs text-wms-muted mt-0.5">
          {subtitle}
        </div>
      )}
      {trend && (
        <div className="text-xs font-mono mt-1.5 flex items-center gap-1">
          {trend.direction === "up" && (
            <span className="text-wms-green">↑ {trend.label}</span>
          )}
          {trend.direction === "down" && (
            <span className="text-wms-red">↓ {trend.label}</span>
          )}
          {trend.direction === "neutral" && (
            <span className="text-wms-muted">→ {trend.label}</span>
          )}
        </div>
      )}
    </div>
  );
}
