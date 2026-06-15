import { useMemo } from "react";

/**
 * InspectionStatsBar — 4 summary tiles for the inspections view.
 * Props:
 *   inspections - full array from useInspections
 */
export function InspectionStatsBar({ inspections }) {
  const stats = useMemo(() => {
    const total = inspections.length;
    const passCount = inspections.filter(
      (ins) => ins.overallResult === "Pass"
    ).length;
    const failCount = inspections.filter(
      (ins) => ins.overallResult === "Fail"
    ).length;
    const pendingCount = inspections.filter(
      (ins) => ins.overallResult === "Pending"
    ).length;

    const passRate = total === 0 ? 0 : (passCount / total) * 100;
    const passRateStr = total === 0 ? "—" : `${passRate.toFixed(1)}%`;

    // Color the pass rate: green ≥90%, orange 70–89%, red <70%
    const passRateColor =
      total === 0
        ? "text-wms-muted"
        : passRate >= 90
        ? "text-wms-green"
        : passRate >= 70
        ? "text-wms-orange"
        : "text-wms-red";

    return [
      {
        id: "ins-stat-total",
        label: "Total Inspections",
        value: total,
        color: "text-wms-purple",
        icon: "✓",
      },
      {
        id: "ins-stat-pass-rate",
        label: "Pass Rate",
        value: passRateStr,
        color: passRateColor,
        icon: "%",
      },
      {
        id: "ins-stat-fail",
        label: "Failed",
        value: failCount,
        color: failCount > 0 ? "text-wms-red" : "text-wms-muted",
        icon: "✗",
      },
      {
        id: "ins-stat-pending",
        label: "Pending",
        value: pendingCount,
        color: "text-wms-muted",
        icon: "◌",
      },
    ];
  }, [inspections]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
      {stats.map((stat) => (
        <div
          key={stat.id}
          id={stat.id}
          className="bg-wms-surface border border-wms-border rounded-xl px-5 py-4 flex items-start gap-3"
        >
          <span className={`text-lg leading-none mt-0.5 ${stat.color}`}>
            {stat.icon}
          </span>
          <div>
            <p className={`font-mono text-xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-xs text-wms-muted mt-0.5">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
