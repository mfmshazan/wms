import { useMemo } from "react";
import { NCR_STATUSES } from "../data/constants";

// ── Internal Helper Functions ───────────────────────────────────────────────

function isSameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function formatChartDate(date) {
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

function getLastNDays(n) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

function groupByDay(items, dateField, days) {
  const map = new Map();
  days.forEach((day) => {
    map.set(formatChartDate(day), []);
  });

  items.forEach((item) => {
    if (!item[dateField]) return;
    const d = new Date(item[dateField]);
    if (isNaN(d.getTime())) return;

    for (const day of days) {
      if (isSameDay(d, day)) {
        map.get(formatChartDate(day)).push(item);
        break;
      }
    }
  });

  return map;
}

// ── Main Hook ────────────────────────────────────────────────────────────────

export function useDashboard(products = [], movements = [], inspections = [], defects = [], ncrs = []) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Inventory Metrics
  const inventory = useMemo(() => {
    const totalSKUs = products.length;
    const lowStockItems = products.filter((p) => p.qty <= p.minStock);
    const outOfStockItems = products.filter((p) => p.qty === 0);
    const totalStockValue = Number(
      products.reduce((sum, p) => sum + p.qty * p.price, 0).toFixed(2)
    );

    const catMap = new Map();
    products.forEach((p) => {
      catMap.set(p.category, (catMap.get(p.category) || 0) + p.qty);
    });

    const stockByCategory = Array.from(catMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      totalSKUs,
      lowStockItems,
      outOfStockItems,
      totalStockValue,
      stockByCategory,
    };
  }, [products]);

  // 2. Movements Metrics
  const movementsMetrics = useMemo(() => {
    let inboundToday = 0;
    let outboundToday = 0;
    const topMovedMap = new Map();

    movements.forEach((m) => {
      if (!m.timestamp) return;
      const d = new Date(m.timestamp);
      if (isNaN(d.getTime())) return;

      if (isSameDay(d, today)) {
        if (m.type === "Inbound") inboundToday++;
        if (m.type === "Outbound") outboundToday++;
      }

      const existing = topMovedMap.get(m.sku);
      if (existing) {
        existing.count += 1;
      } else {
        topMovedMap.set(m.sku, { sku: m.sku, name: m.productName, count: 1 });
      }
    });

    const topMovedProducts = Array.from(topMovedMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const days14 = getLastNDays(14);
    const groupedMoves = groupByDay(movements, "timestamp", days14);
    const movementsByDay = [];
    days14.forEach((day) => {
      const label = formatChartDate(day);
      const dayMoves = groupedMoves.get(label) || [];
      let inbound = 0;
      let outbound = 0;
      dayMoves.forEach((m) => {
        if (m.type === "Inbound") inbound++;
        if (m.type === "Outbound") outbound++;
      });
      movementsByDay.push({ date: label, inbound, outbound });
    });

    return {
      totalMovements: movements.length,
      inboundToday,
      outboundToday,
      movementsByDay,
      topMovedProducts,
    };
  }, [movements]);

  // 3. Quality Metrics
  const quality = useMemo(() => {
    let passCount = 0;
    let failCount = 0;
    inspections.forEach((i) => {
      if (i.overallResult === "Pass") passCount++;
      if (i.overallResult === "Fail") failCount++;
    });

    const passRate =
      inspections.length === 0
        ? 0
        : Number(((passCount / inspections.length) * 100).toFixed(1));

    const days7 = getLastNDays(7);
    const groupedInsp = groupByDay(inspections, "timestamp", days7);
    const inspectionTrend = [];
    days7.forEach((day) => {
      const label = formatChartDate(day);
      const dayInsps = groupedInsp.get(label) || [];
      let pass = 0;
      let fail = 0;
      let pending = 0;
      dayInsps.forEach((i) => {
        if (i.overallResult === "Pass") pass++;
        else if (i.overallResult === "Fail") fail++;
        else if (i.overallResult === "Pending") pending++;
      });
      inspectionTrend.push({ date: label, pass, fail, pending });
    });

    return {
      totalInspections: inspections.length,
      passRate,
      failedInspections: failCount,
      inspectionTrend,
    };
  }, [inspections]);

  // 4. Defects Metrics
  const defectsMetrics = useMemo(() => {
    let openDefects = 0;
    let criticalOpen = 0;
    const severityCount = { Critical: 0, Major: 0, Minor: 0 };
    const typeMap = new Map();

    defects.forEach((d) => {
      if (d.status !== "Resolved" && d.status !== "Closed") {
        openDefects++;
        if (d.severity === "Critical") criticalOpen++;
      }

      if (severityCount[d.severity] !== undefined) {
        severityCount[d.severity]++;
      }

      typeMap.set(d.type, (typeMap.get(d.type) || 0) + 1);
    });

    const defectsBySeverity = [
      { name: "Critical", value: severityCount.Critical },
      { name: "Major", value: severityCount.Major },
      { name: "Minor", value: severityCount.Minor },
    ];

    const defectsByType = Array.from(typeMap.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const days14 = getLastNDays(14);
    const groupedDefects = groupByDay(defects, "timestamp", days14);
    const defectTrend = [];
    days14.forEach((day) => {
      const label = formatChartDate(day);
      const dayDefs = groupedDefects.get(label) || [];
      defectTrend.push({ date: label, count: dayDefs.length });
    });

    return {
      totalDefects: defects.length,
      openDefects,
      criticalOpen,
      defectsBySeverity,
      defectsByType,
      defectTrend,
    };
  }, [defects]);

  // 5. NCR Metrics
  const ncrsMetrics = useMemo(() => {
    const openNCRs = ncrs.filter(
      (n) => n.status !== "Resolved" && n.status !== "Closed"
    );

    const overdueNCRs = ncrs.filter((n) => {
      if (!n.targetDate) return false;
      const target = new Date(n.targetDate);
      target.setHours(0, 0, 0, 0);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      return (
        target < todayDate &&
        n.status !== "Resolved" &&
        n.status !== "Closed"
      );
    });

    const statusCount = {};
    NCR_STATUSES.forEach((s) => (statusCount[s] = 0));

    let totalCAPAs = 0;
    let completedCAPAs = 0;

    ncrs.forEach((n) => {
      if (statusCount[n.status] !== undefined) {
        statusCount[n.status]++;
      }

      if (n.capas && Array.isArray(n.capas)) {
        totalCAPAs += n.capas.length;
        n.capas.forEach((c) => {
          if (c.status === "Completed" || c.status === "Verified") {
            completedCAPAs++;
          }
        });
      }
    });

    const ncrsByStatus = NCR_STATUSES.map((status) => ({
      status,
      count: statusCount[status],
    }));

    const capaCompletionRate =
      totalCAPAs === 0
        ? 0
        : Number(((completedCAPAs / totalCAPAs) * 100).toFixed(1));

    return {
      totalNCRs: ncrs.length,
      openNCRs,
      overdueNCRs,
      ncrsByStatus,
      totalCAPAs,
      completedCAPAs,
      capaCompletionRate,
    };
  }, [ncrs]);

  return {
    inventory,
    movements: movementsMetrics,
    quality,
    defects: defectsMetrics,
    ncrs: ncrsMetrics,
  };
}
