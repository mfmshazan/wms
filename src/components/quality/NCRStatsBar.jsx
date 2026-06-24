import { useMemo } from "react";

export function NCRStatsBar({ ncrs }) {
  const stats = useMemo(() => {
    const total = ncrs.length;
    
    const active = ncrs.filter(
      (ncr) => ncr.status === "Open" || ncr.status === "In Review"
    ).length;

    const todayStr = new Date().toISOString().split("T")[0];
    const overdue = ncrs.filter(
      (ncr) => ncr.targetDate < todayStr && ncr.status !== "Closed" && ncr.status !== "Resolved"
    ).length;

    let completedCapas = 0;
    ncrs.forEach(ncr => {
      ncr.capas?.forEach(capa => {
        if (capa.status === "Completed" || capa.status === "Verified") {
          completedCapas++;
        }
      });
    });

    let avgCloseTimeStr = "—";
    const closedNCRs = ncrs.filter((ncr) => ncr.status === "Closed" && ncr.closedAt);
    if (closedNCRs.length > 0) {
      const totalTimeMs = closedNCRs.reduce((acc, ncr) => {
        const start = new Date(ncr.timestamp).getTime();
        const end = new Date(ncr.closedAt).getTime();
        return acc + (end - start);
      }, 0);
      const avgMs = totalTimeMs / closedNCRs.length;
      const avgDays = avgMs / (1000 * 60 * 60 * 24);
      avgCloseTimeStr = `${avgDays.toFixed(1)} days`;
    }

    return [
      {
        id: "ncr-stat-total",
        label: "Total NCRs",
        value: total,
        color: "text-wms-purple",
      },
      {
        id: "ncr-stat-active",
        label: "Open / In Review",
        value: active,
        color: active > 0 ? "text-wms-red" : "text-wms-text",
      },
      {
        id: "ncr-stat-overdue",
        label: "Overdue",
        value: overdue,
        color: overdue > 0 ? "text-wms-red" : "text-wms-text",
      },
      {
        id: "ncr-stat-capas",
        label: "CAPAs Completed",
        value: completedCapas,
        color: "text-wms-green",
      },
      {
        id: "ncr-stat-avg-time",
        label: "Avg Close Time",
        value: avgCloseTimeStr,
        color: "text-wms-blue",
      },
    ];
  }, [ncrs]);

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
