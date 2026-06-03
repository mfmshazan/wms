
/**
 * StatsBar — 4 summary tiles across the top of the product list.
 */
export function StatsBar({ products, filteredCount }) {
  const lowStockCount = products.filter(
    (p) => p.qty <= p.minStock
  ).length;

  const categoryCount = new Set(products.map((p) => p.category)).size;

  const stats = [
    {
      id: "stat-total",
      label: "Total SKUs",
      value: products.length,
      color: "text-wms-purple",
      icon: "◈",
    },
    {
      id: "stat-low",
      label: "Low Stock",
      value: lowStockCount,
      color: lowStockCount > 0 ? "text-wms-orange" : "text-wms-green",
      icon: "⚠",
    },
    {
      id: "stat-categories",
      label: "Categories",
      value: categoryCount,
      color: "text-wms-blue",
      icon: "⊞",
    },
    {
      id: "stat-showing",
      label: "Showing",
      value: filteredCount,
      color: "text-wms-green",
      icon: "◉",
    },
  ];

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
