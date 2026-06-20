import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const tooltipStyle = {
  background: "#14171C",
  border: "1px solid #1C1F24",
  borderRadius: 8,
  color: "#E8E6E0",
  fontSize: 12,
  fontFamily: "'Space Mono', monospace",
};

const axisTickStyle = {
  fill: "#555",
  fontSize: 10,
  fontFamily: "'Space Mono', monospace",
};

const formatTypeLabel = (value) =>
  value.length > 10 ? value.slice(0, 10) + "…" : value;

export default function DefectChart({ defects }) {
  const {
    defectsBySeverity,
    defectsByType,
    defectTrend,
    criticalOpen,
    totalDefects,
  } = defects;

  const allTrendZero = defectTrend.every((d) => d.count === 0);

  return (
    <div className="space-y-6">
      {/* Alert banner */}
      {criticalOpen > 0 && (
        <div className="bg-red-900/30 border border-wms-red text-wms-red text-xs rounded p-2 font-mono">
          ⚠ {criticalOpen} critical defect(s) require immediate attention
        </div>
      )}

      {/* Section 1: Severity donut */}
      <div>
        <p className="text-xs uppercase tracking-widest text-wms-muted mb-3">
          Defects by Severity
        </p>
        {totalDefects === 0 ? (
          <div className="h-32 flex items-center justify-center">
            <p className="text-xs font-mono text-wms-green">
              ✓ No defects recorded
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie
                    data={defectsBySeverity}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={32}
                    outerRadius={56}
                    paddingAngle={3}
                  >
                    <Cell fill="#F08080" />
                    <Cell fill="#F0A080" />
                    <Cell fill="#FFD580" />
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="font-mono text-lg font-bold text-wms-text">
                  {totalDefects}
                </p>
              </div>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <p className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-wms-red inline-block"></span>
                <span className="text-wms-muted">Critical</span>
                <span className="text-wms-text">
                  {defectsBySeverity[0].value}
                </span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-wms-orange inline-block"></span>
                <span className="text-wms-muted">Major</span>
                <span className="text-wms-text">
                  {defectsBySeverity[1].value}
                </span>
              </p>
              <p className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ background: "#FFD580" }}
                ></span>
                <span className="text-wms-muted">Minor</span>
                <span className="text-wms-text">
                  {defectsBySeverity[2].value}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Defects by type bar chart */}
      <div>
        <p className="text-xs uppercase tracking-widest text-wms-muted mb-3 mt-1">
          Defects by Type
        </p>
        {defectsByType.length === 0 ? (
          <div className="h-32 flex items-center justify-center">
            <p className="text-xs font-mono text-wms-muted">
              No defect type data yet
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={defectsByType}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                stroke="#1C1F24"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="type"
                tickFormatter={formatTypeLabel}
                tick={{
                  fill: "#555",
                  fontSize: 9,
                  fontFamily: "'Space Mono', monospace",
                }}
                axisLine={{ stroke: "#1C1F24" }}
                tickLine={false}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={axisTickStyle}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelFormatter={(label) => label}
              />
              <Bar
                dataKey="count"
                fill="#B8A8F0"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Section 3: 14-day trend line */}
      <div>
        <p className="text-xs uppercase tracking-widest text-wms-muted mb-3 mt-1">
          Daily Defect Trend
        </p>
        {allTrendZero ? (
          <div className="h-32 flex items-center justify-center">
            <p className="text-xs font-mono text-wms-green">
              ✓ No defects in the last 14 days
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart
              data={defectTrend}
              margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                stroke="#1C1F24"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{
                  fill: "#555",
                  fontSize: 9,
                  fontFamily: "'Space Mono', monospace",
                }}
                axisLine={{ stroke: "#1C1F24" }}
                tickLine={false}
                interval={1}
              />
              <YAxis
                tick={axisTickStyle}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#F08080"
                strokeWidth={2}
                dot={{ fill: "#F08080", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
