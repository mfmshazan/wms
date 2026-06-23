import { useDashboard } from "../../hooks/useDashboard";
import { KPICard } from "./KPICard";
import MovementChart from "./MovementChart";
import QualityTrendChart from "./QualityTrendChart";
import DefectChart from "./DefectChart";
import NCRStatusChart from "./NCRStatusChart";
import InventoryChart from "./InventoryChart";

export function DashboardPage({ products, movements, inspections, defects, ncrs }) {
  const {
    inventory,
    movements: mv,
    quality,
    defects: df,
    ncrs: nc,
  } = useDashboard(products, movements, inspections, defects, ncrs);

  return (
    <>
      {/* ── Row 1: Page header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-mono text-xl font-bold text-wms-text">
            Dashboard
          </h1>
          <p className="text-xs text-wms-muted mt-0.5">
            Live overview across all modules
          </p>
        </div>
        <span className="text-xs text-wms-muted font-mono">
          Updated just now
        </span>
      </div>

      {/* ── Row 2: KPI cards grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
        {/* 1. Total SKUs */}
        <KPICard
          title="Total SKUs"
          value={inventory.totalSKUs}
          subtitle={`$${inventory.totalStockValue.toLocaleString()} total stock value`}
          icon="📦"
          color="blue"
        />

        {/* 2. Low Stock Alerts */}
        <KPICard
          title="Low Stock Alerts"
          value={inventory.lowStockItems.length}
          subtitle={`${inventory.outOfStockItems.length} out of stock`}
          icon="⚠️"
          color={inventory.lowStockItems.length > 0 ? "orange" : "green"}
          trend={
            inventory.lowStockItems.length > 0
              ? { direction: "down", label: "needs reorder" }
              : { direction: "neutral", label: "all stocked" }
          }
        />

        {/* 3. Inspection Pass Rate */}
        <KPICard
          title="Inspection Pass Rate"
          value={`${quality.passRate}%`}
          subtitle={`${quality.totalInspections} inspections total`}
          icon="✅"
          color={
            quality.passRate >= 90
              ? "green"
              : quality.passRate >= 70
              ? "orange"
              : "red"
          }
          trend={
            quality.passRate >= 90
              ? { direction: "up", label: "above target" }
              : { direction: "down", label: "below 90% target" }
          }
        />

        {/* 4. Open Defects */}
        <KPICard
          title="Open Defects"
          value={df.openDefects}
          subtitle={`${df.criticalOpen} critical open`}
          icon="🔍"
          color={
            df.criticalOpen > 0
              ? "red"
              : df.openDefects > 0
              ? "orange"
              : "green"
          }
        />

        {/* 5. Active NCRs */}
        <KPICard
          title="Active NCRs"
          value={nc.openNCRs.length}
          subtitle={`${nc.overdueNCRs.length} overdue`}
          icon="📋"
          color={
            nc.overdueNCRs.length > 0
              ? "red"
              : nc.openNCRs.length > 0
              ? "orange"
              : "green"
          }
        />

        {/* 6. CAPA Completion */}
        <KPICard
          title="CAPA Completion"
          value={`${nc.capaCompletionRate}%`}
          subtitle={`${nc.completedCAPAs} of ${nc.totalCAPAs} actions done`}
          icon="🎯"
          color={
            nc.capaCompletionRate >= 80
              ? "green"
              : nc.capaCompletionRate >= 50
              ? "orange"
              : "red"
          }
        />
      </div>

      {/* ── Row 3 through 6: Charts ── */}
      <div>
        <p className="text-xs uppercase tracking-widest text-wms-muted mb-3">
          Inventory Health
        </p>
        <div className="bg-wms-surface border border-wms-border rounded-xl p-5">
          <InventoryChart inventory={inventory} />
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-wms-muted mb-3 mt-6">
          Stock Movements
        </p>
        <div className="bg-wms-surface border border-wms-border rounded-xl p-5">
          <MovementChart movements={mv} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-wms-muted mb-3 mt-6">
            Inspection Quality
          </p>
          <div className="bg-wms-surface border border-wms-border rounded-xl p-5">
            <QualityTrendChart quality={quality} />
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-wms-muted mb-3 mt-6">
            Defect Analysis
          </p>
          <div className="bg-wms-surface border border-wms-border rounded-xl p-5">
            <DefectChart defects={df} />
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-wms-muted mb-3 mt-6">
          NCR & CAPA Status
        </p>
        <div className="bg-wms-surface border border-wms-border rounded-xl p-5">
          <NCRStatusChart ncrs={nc} />
        </div>
      </div>
    </>
  );
}
