import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function MovementChart({ movements }) {
  if (!movements || !movements.movementsByDay) {
    return (
      <div className="min-h-[280px] flex items-center justify-center">
        <p className="text-xs font-mono text-wms-muted">No movement data</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={movements.movementsByDay}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
          <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} />
          <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
            itemStyle={{ color: '#e5e7eb' }}
          />
          <Legend />
          <Bar dataKey="inbound" name="Inbound" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="outbound" name="Outbound" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
