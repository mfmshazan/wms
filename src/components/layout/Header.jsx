import { Button } from "../ui/Button";

/**
 * App header — brand left, nav tabs centre, context action buttons right.
 * Props:
 *   activeView: "products" | "movements" | "inspections"
 *   onViewChange(view): switch active view
 *   onAddProduct:      open Add Product modal (products view)
 *   onReceive:         open Receive Stock modal  (movements view)
 *   onDispatch:        open Dispatch Stock modal (movements view)
 *   onNewInspection:   open New Inspection modal (inspections view)
 */
export function Header({
  activeView,
  onViewChange,
  onAddProduct,
  onReceive,
  onDispatch,
  onNewInspection,
  onLogDefect,
  onRaiseNCR,
}) {
  return (
    <header className="sticky top-0 z-30 bg-wms-bg/80 backdrop-blur-md border-b border-wms-border">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center gap-4">
        {/* ── Brand ── */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-green-900/50 border border-green-700/60 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-4 h-4 text-wms-green"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </div>
          <div>
            <h1 className="font-mono font-bold text-wms-text text-sm tracking-wider">
              WMS
            </h1>
            <p className="text-[10px] text-wms-muted uppercase tracking-widest leading-none">
              Warehouse Management
            </p>
          </div>
        </div>

        {/* ── Nav tabs ── */}
        <nav className="flex gap-1 ml-6">
          <button
            id="nav-dashboard"
            onClick={() => onViewChange("dashboard")}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-colors border ${
              activeView === "dashboard"
                ? "bg-wms-surface border-wms-text text-wms-text shadow-sm"
                : "bg-transparent border-transparent text-wms-muted hover:text-wms-text hover:bg-white/5"
            }`}
          >
            Dashboard
          </button>
          <button
            id="nav-products"
            onClick={() => onViewChange("products")}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-colors border ${
              activeView === "products"
                ? "bg-green-900/40 border-green-700/60 text-wms-green"
                : "bg-transparent border-transparent text-wms-muted hover:text-wms-text hover:bg-white/5"
            }`}
          >
            Products
          </button>
          <button
            id="nav-movements"
            onClick={() => onViewChange("movements")}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-colors border ${
              activeView === "movements"
                ? "bg-blue-900/40 border-blue-700/60 text-wms-blue"
                : "bg-transparent border-transparent text-wms-muted hover:text-wms-text hover:bg-white/5"
            }`}
          >
            Movements
          </button>
          <button
            id="nav-inspections"
            onClick={() => onViewChange("inspections")}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-colors border ${
              activeView === "inspections"
                ? "bg-purple-900/40 border-purple-700/60 text-wms-purple"
                : "bg-transparent border-transparent text-wms-muted hover:text-wms-text hover:bg-white/5"
            }`}
          >
            Inspections
          </button>
          <button
            id="nav-defects"
            onClick={() => onViewChange("defects")}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-colors border ${
              activeView === "defects"
                ? "bg-orange-900/40 border-orange-700/60 text-wms-orange"
                : "bg-transparent border-transparent text-wms-muted hover:text-wms-text hover:bg-white/5"
            }`}
          >
            Defects
          </button>
          <button
            id="nav-ncrs"
            onClick={() => onViewChange("ncrs")}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-colors border ${
              activeView === "ncrs"
                ? "bg-wms-surface border-wms-text text-wms-text shadow-sm"
                : "bg-transparent border-transparent text-wms-muted hover:text-wms-text hover:bg-white/5"
            }`}
          >
            NCRs
          </button>
        </nav>

        {/* ── Context actions ── */}
        <div className="ml-auto flex items-center gap-2">
          {activeView !== "dashboard" && activeView === "products" && (
            <Button variant="primary" onClick={onAddProduct} id="add-product-btn">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add Product
            </Button>
          )}

          {activeView === "movements" && (
            <>
              <Button variant="primary" onClick={onReceive} id="receive-stock-btn">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Receive Stock
              </Button>
              <Button variant="danger" onClick={onDispatch} id="dispatch-stock-btn">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 7.5m0 0L7.5 12M12 7.5V21"
                  />
                </svg>
                Dispatch Stock
              </Button>
            </>
          )}

          {activeView === "inspections" && (
            <Button variant="primary" onClick={onNewInspection} id="new-inspection-btn">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                />
              </svg>
              New Inspection
            </Button>
          )}

          {activeView === "defects" && (
            <Button variant="primary" onClick={onLogDefect} id="log-defect-btn">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Log Defect
            </Button>
          )}

          {activeView === "ncrs" && (
            <Button variant="primary" onClick={onRaiseNCR} id="raise-ncr-btn">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Raise NCR
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
