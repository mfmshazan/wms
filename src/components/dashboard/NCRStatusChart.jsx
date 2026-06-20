import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const STATUS_COLORS = ["#F08080", "#F0A080", "#FFD580", "#6EE8A2", "#555555"];

const tooltipStyle = {
  background: "#14171C",
  border: "1px solid #1C1F24",
  borderRadius: 8,
  color: "#E8E6E0",
  fontSize: 12,
  fontFamily: "'Space Mono', monospace",
};

export default function NCRStatusChart({ ncrs }) {
  const {
    ncrsByStatus,
    overdueNCRs,
    totalCAPAs,
    completedCAPAs,
    capaCompletionRate,
    totalNCRs,
  } = ncrs;

  const radius = 54;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - capaCompletionRate / 100);
  const ringColor =
    capaCompletionRate >= 80
      ? "#6EE8A2"
      : capaCompletionRate >= 50
      ? "#F0A080"
      : "#F08080";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left column: NCRs by status bar chart */}
      <div>
        <p className="text-xs uppercase tracking-widest text-wms-muted mb-3">
          NCRs by Status
        </p>
        {totalNCRs === 0 ? (
          <div className="h-56 flex items-center justify-center">
            <p className="text-xs font-mono text-wms-green">
              ✓ No non-conformances recorded
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={ncrsByStatus}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                stroke="#1C1F24"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="status"
                tick={{
                  fill: "#555",
                  fontSize: 9,
                  fontFamily: "'Space Mono', monospace",
                }}
                axisLine={{ stroke: "#1C1F24" }}
                tickLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{
                  fill: "#555",
                  fontSize: 10,
                  fontFamily: "'Space Mono', monospace",
                }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={36}>
                {ncrsByStatus.map((entry, index) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Right column: CAPA completion panel */}
      <div>
        <p className="text-xs uppercase tracking-widest text-wms-muted mb-3">
          CAPA Completion Rate
        </p>
        {totalCAPAs === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center gap-1">
            <p className="text-xs font-mono text-wms-muted">
              No CAPA actions logged yet
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative" style={{ width: 140, height: 140 }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="#1C1F24"
                  strokeWidth={strokeWidth}
                />
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform="rotate(-90 70 70)"
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <p
                  className="font-mono text-xl font-bold"
                  style={{ color: ringColor }}
                >
                  {capaCompletionRate.toFixed(1)}%
                </p>
              </div>
            </div>
            <p className="text-xs text-wms-muted font-mono">
              {completedCAPAs} of {totalCAPAs} CAPAs completed
            </p>
            {overdueNCRs.length > 0 ? (
              <div className="bg-red-900/30 border border-wms-red text-wms-red text-xs rounded p-2 font-mono mt-3 w-full text-center">
                ⚠ {overdueNCRs.length} NCR(s) past target date
              </div>
            ) : (
              <p className="text-xs font-mono text-wms-green mt-3 text-center">
                ✓ No overdue NCRs
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
