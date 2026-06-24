import { useMemo } from "react";

/**
 * DefectStatsBar — 5 summary tiles for the defects view.
 * Props:
 *   defects - full array from useDefects
 */
export function DefectStatsBar({ defects }) {
  const stats = useMemo(() => {
    const total = defects.length;
    const criticalOpen = defects.filter(
      (def) => def.severity === "Critical" && def.status === "Open"
    ).length;
    const majorOpen = defects.filter(
      (def) => def.severity === "Major" && def.status === "Open"
    ).length;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const resolvedDefects = defects.filter((def) => {
      if (!def.resolvedAt) return false;
      const d = new Date(def.resolvedAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const resolvedThisMonth = resolvedDefects.length;

    let avgResolutionTimeStr = "—";
    const allResolved = defects.filter((def) => !!def.resolvedAt);
    if (allResolved.length > 0) {
      const totalTimeMs = allResolved.reduce((acc, def) => {
        const start = new Date(def.timestamp).getTime();
        const end = new Date(def.resolvedAt).getTime();
        return acc + (end - start);
      }, 0);
      const avgMs = totalTimeMs / allResolved.length;
      const avgDays = avgMs / (1000 * 60 * 60 * 24);
      avgResolutionTimeStr = `${avgDays.toFixed(1)} days`;
    }

    return [
      {
        id: "def-stat-total",
        label: "Total Defects",
        value: total,
        color: "text-wms-purple",
      },
      {
        id: "def-stat-critical",
        label: "Critical (Open)",
        value: criticalOpen,
        color: "text-wms-red",
      },
      {
        id: "def-stat-major",
        label: "Major (Open)",
        value: majorOpen,
        color: "text-wms-orange",
      },
      {
        id: "def-stat-resolved",
        label: "Resolved (This Month)",
        value: resolvedThisMonth,
        color: "text-wms-green",
      },
      {
        id: "def-stat-avg-time",
        label: "Avg Resolution Time",
        value: avgResolutionTimeStr,
        color: "text-wms-blue",
      },
    ];
  }, [defects]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
      {stats.map((stat) => (
        <div
          key={stat.id}
          id={stat.id}
          className="bg-wms-surface border border-wms-border rounded-xl px-5 py-4"
        >
          <p className={`font-mono text-xl font-bold ${stat.color}`}>
            {stat.value}
          </p>
          <p className="text-xs text-wms-muted mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
