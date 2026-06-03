import { Button } from "../ui/Button";

/**
 * App header — title left, Add Product button right.
 */
export function Header({ onAddProduct }) {
  return (
    <header className="sticky top-0 z-30 bg-wms-bg/80 backdrop-blur-md border-b border-wms-border">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          {/* Warehouse icon */}
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

        {/* Actions */}
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
      </div>
    </header>
  );
}
