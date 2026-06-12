import { useMemo } from "react";

/**
 * MovementStatsBar — 4 summary tiles for the movements view.
 * Props:
 *   movements - full array from useMovements
 *   products  - full array from useProducts
 */
export function MovementStatsBar({ movements, products }) {
  const stats = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const inboundToday = movements.filter(
      (m) => m.type === "Inbound" && new Date(m.timestamp) >= todayStart
    ).length;

    const outboundToday = movements.filter(
      (m) => m.type === "Outbound" && new Date(m.timestamp) >= todayStart
    ).length;

    const lowStock = products.filter((p) => p.qty <= p.minStock).length;

    return [
      {
        id: "mov-stat-total",
        label: "Total Movements",
        value: movements.length,
        color: "text-wms-purple",
        icon: "⇅",
      },
      {
        id: "mov-stat-inbound",
        label: "Inbound Today",
        value: inboundToday,
        color: "text-wms-green",
        icon: "↓",
      },
      {
        id: "mov-stat-outbound",
        label: "Outbound Today",
        value: outboundToday,
        color: "text-wms-orange",
        icon: "↑",
      },
      {
        id: "mov-stat-low-stock",
        label: "Low Stock Items",
        value: lowStock,
        color: lowStock > 0 ? "text-wms-red" : "text-wms-green",
        icon: "⚠",
      },
    ];
  }, [movements, products]);

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
