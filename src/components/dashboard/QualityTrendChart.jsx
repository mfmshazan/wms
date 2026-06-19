import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function QualityTrendChart({ quality }) {
  const { inspectionTrend, passRate, failedInspections, totalInspections } = quality;

  const passRateColor =
    passRate >= 90
      ? "text-wms-green"
      : passRate >= 70
      ? "text-wms-orange"
      : "text-wms-red";

  return (
    <div className="space-y-5">
      {/* SECTION 1: Inline KPI row */}
      <div className="flex items-center gap-6 flex-wrap">
        <div>
          <p className={`font-mono text-xl font-bold ${passRateColor}`}>
            {passRate}%
          </p>
          <p className="text-[10px] text-wms-muted uppercase tracking-widest mt-0.5">
            Pass Rate
          </p>
        </div>

        <div>
          <p className="font-mono text-xl font-bold text-wms-red">
            {failedInspections}
          </p>
          <p className="text-[10px] text-wms-muted uppercase tracking-widest mt-0.5">
            Failed
          </p>
        </div>

        <div>
          <p className="font-mono text-xl font-bold text-wms-text">
            {totalInspections}
          </p>
          <p className="text-[10px] text-wms-muted uppercase tracking-widest mt-0.5">
            Total Inspections
          </p>
        </div>
      </div>

      {/* SECTION 2: Line chart */}
      <div>
        <p className="text-xs uppercase tracking-widest text-wms-muted mb-3">
          Inspection Results — Last 7 Days
        </p>

        {totalInspections === 0 ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-xs font-mono text-wms-muted">
              No inspection data yet
            </p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={inspectionTrend}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid stroke="#1C1F24" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#555", fontSize: 10, fontFamily: "'Space Mono', monospace" }}
                  axisLine={{ stroke: "#1C1F24" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#555", fontSize: 10, fontFamily: "'Space Mono', monospace" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#14171C",
                    border: "1px solid #1C1F24",
                    borderRadius: 8,
                    color: "#E8E6E0",
                    fontSize: 12,
                    fontFamily: "'Space Mono', monospace",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="pass"
                  stroke="#6EE8A2"
                  strokeWidth={2}
                  dot={{ fill: "#6EE8A2", r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="fail"
                  stroke="#F08080"
                  strokeWidth={2}
                  dot={{ fill: "#F08080", r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="#555555"
                  strokeWidth={2}
                  dot={{ fill: "#555555", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="flex items-center gap-4 mt-2 justify-center text-xs font-mono">
              <span className="flex items-center gap-1.5 text-wms-green">
                <span className="w-2 h-2 rounded-full bg-wms-green inline-block"></span>
                Pass
              </span>
              <span className="flex items-center gap-1.5 text-wms-red">
                <span className="w-2 h-2 rounded-full bg-wms-red inline-block"></span>
                Fail
              </span>
              <span className="flex items-center gap-1.5 text-wms-muted">
                <span className="w-2 h-2 rounded-full bg-wms-muted inline-block"></span>
                Pending
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
