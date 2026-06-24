export function buildDataContext(products, movements, inspections, defects, ncrs, metrics) {
  try {
    let result = [];

    // --- Section 1: Snapshot timestamp ---
    result.push("=== WMS DATA SNAPSHOT ===");
    result.push(`Generated: ${new Date().toLocaleString()}`);
    result.push("");

    // --- Section 2: Inventory summary ---
    result.push("=== INVENTORY ===");
    result.push(`Total SKUs: ${products.length}`);
    result.push(`Total stock value: $${metrics.inventory.totalStockValue.toLocaleString()}`);
    
    const lowStockCount = metrics.inventory.lowStockItems.length;
    if (lowStockCount > 0) {
      result.push(`Low stock items (${lowStockCount}): ${metrics.inventory.lowStockItems.map(p => p.sku).join(", ")}`);
    } else {
      result.push(`Low stock items (0): none`);
    }

    const outOfStockCount = metrics.inventory.outOfStockItems.length;
    if (outOfStockCount > 0) {
      result.push(`Out of stock items (${outOfStockCount}): ${metrics.inventory.outOfStockItems.map(p => p.sku).join(", ")}`);
    } else {
      result.push(`Out of stock items (0): none`);
    }

    result.push("");
    for (const p of products) {
      result.push(`- ${p.sku} | ${p.name} | ${p.category} | qty:${p.quantity} ${p.unit} | minStock:${p.minStockLevel} | price:$${p.unitPrice} | status:${p.status}`);
    }
    result.push("");

    // --- Section 3: Movement summary ---
    result.push("=== MOVEMENTS ===");
    result.push(`Total movements: ${movements.length}`);
    result.push(`Inbound today: ${metrics.movements.inboundToday}`);
    result.push(`Outbound today: ${metrics.movements.outboundToday}`);
    result.push("");
    
    const recentMovements = [...movements].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 20);
    for (const m of recentMovements) {
      result.push(`- ${m.movementId || m.id} | ${m.type} | ${m.sku} | qty:${m.quantity || m.qty} | reason:${m.reason} | ref:${m.reference} | by:${m.performedBy} | ${new Date(m.timestamp).toLocaleDateString()}`);
    }
    result.push("");

    // --- Section 4: Quality summary ---
    result.push("=== INSPECTIONS ===");
    result.push(`Total: ${inspections.length}`);
    result.push(`Pass rate: ${metrics.quality.passRate}%`);
    result.push(`Failed: ${metrics.quality.failedInspections}`);
    result.push("");
    
    const recentInspections = [...inspections].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
    for (const insp of recentInspections) {
      result.push(`- ${insp.inspectionId || insp.id} | ${insp.type} | ${insp.sku} | qty:${insp.quantity} | result:${insp.overallResult} | by:${insp.inspector} | ${new Date(insp.timestamp).toLocaleDateString()}`);
    }
    result.push("");

    // --- Section 5: Defects summary ---
    result.push("=== DEFECTS ===");
    result.push(`Total: ${defects.length}`);
    result.push(`Open: ${metrics.defects.openDefects}`);
    result.push(`Critical open: ${metrics.defects.criticalOpen}`);
    result.push("");
    
    for (const d of defects) {
      result.push(`- ${d.defectId || d.id} | ${d.severity} | ${d.type} | ${d.sku} | qty:${d.quantity} | status:${d.status} | disposition:${d.disposition} | by:${d.reportedBy} | assigned:${d.assignedTo || 'Unassigned'} | ${new Date(d.timestamp).toLocaleDateString()}`);
    }
    result.push("");

    // --- Section 6: NCR summary ---
    result.push("=== NCRs & CAPAs ===");
    result.push(`Total NCRs: ${ncrs.length}`);
    result.push(`Open NCRs: ${metrics.ncrs.openNCRs.length}`);
    result.push(`Overdue: ${metrics.ncrs.overdueNCRs.length}`);
    result.push(`Total CAPAs: ${metrics.ncrs.totalCAPAs}`);
    result.push(`CAPA completion: ${metrics.ncrs.capaCompletionRate}%`);
    result.push("");
    
    for (const ncr of ncrs) {
      result.push(`- ${ncr.ncrId || ncr.id} | ${ncr.priority} | ${ncr.status} | ${ncr.type} | ${ncr.title} | assigned:${ncr.assignedTo || 'Unassigned'} | target:${new Date(ncr.targetDate).toLocaleDateString()} | ${ncr.capas ? ncr.capas.length : 0} CAPAs`);
      if (ncr.capas && ncr.capas.length > 0) {
        for (const capa of ncr.capas) {
          result.push(`  · ${capa.capaId || capa.id} | ${capa.type} | ${capa.status} | assigned:${capa.assignedTo || 'Unassigned'}`);
        }
      }
    }
    result.push("");

    // --- Section 7: End marker ---
    result.push("=== END SNAPSHOT ===");

    return result.join("\n");
  } catch (err) {
    return "=== WMS DATA SNAPSHOT ===\n[Error building context]\n=== END SNAPSHOT ===";
  }
}
