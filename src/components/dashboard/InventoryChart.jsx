import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function InventoryChart({ inventory }) {
  if (!inventory) {
    return (
      <div className="min-h-[280px] flex items-center justify-center">
        <p className="text-xs font-mono text-wms-muted">No inventory data</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {inventory.lowStockItems && inventory.lowStockItems.length > 0 && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
          <p className="text-sm text-red-400 font-bold mb-2">Low Stock Alerts:</p>
          <ul className="text-xs text-wms-text list-disc list-inside">
            {inventory.lowStockItems.map(p => (
              <li key={p.sku}>{p.name} (Qty: {p.qty}, Min: {p.minStock})</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="h-64 w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={inventory.stockByCategory}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
            />
            <Bar dataKey="value" name="Stock Qty" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
