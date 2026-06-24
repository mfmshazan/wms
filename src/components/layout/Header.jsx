import { Button } from "../ui/Button";

const pageTitles = {
  dashboard:   { title: "Dashboard",                 sub: "Live overview across all modules" },
  products:    { title: "Product Inventory",          sub: "Manage and track all warehouse SKUs" },
  movements:   { title: "Stock Movements",            sub: "Inbound & outbound movement log" },
  inspections: { title: "Quality Inspections",        sub: "Inspection checklists & audit trail" },
  defects:     { title: "Defect Log",                 sub: "Track and resolve product issues" },
  ncrs:        { title: "Non-Conformance Reports",    sub: "NCR workflow and CAPA management" },
};

export function Header({
  activeView,
  onAddProduct,
  onReceive,
  onDispatch,
  onNewInspection,
  onLogDefect,
  onRaiseNCR,
}) {
  const { title, sub } = pageTitles[activeView] || pageTitles.dashboard;

  return (
    <header className="sticky top-0 z-20 bg-wms-surface border-b border-wms-border px-6 h-16 flex items-center justify-between shadow-sm">
      <div>
        <h2 className="font-bold text-wms-text text-base">{title}</h2>
        <p className="text-xs text-wms-muted">{sub}</p>
      </div>

      <div className="flex items-center gap-2">
        {activeView === "products" && (
          <Button onClick={onAddProduct} id="add-product-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Product
          </Button>
        )}

        {activeView === "movements" && (
          <>
            <Button onClick={onReceive} id="receive-stock-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Receive Stock
            </Button>
            <Button variant="danger" onClick={onDispatch} id="dispatch-stock-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 7.5m0 0L7.5 12M12 7.5V21" />
              </svg>
              Dispatch Stock
            </Button>
          </>
        )}

        {activeView === "inspections" && (
          <Button onClick={onNewInspection} id="new-inspection-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
            </svg>
            New Inspection
          </Button>
        )}

        {activeView === "defects" && (
          <Button onClick={onLogDefect} id="log-defect-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Log Defect
          </Button>
        )}

        {activeView === "ncrs" && (
          <Button onClick={onRaiseNCR} id="raise-ncr-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Raise NCR
          </Button>
        )}
      </div>
    </header>
  );
}
