import { useState, useMemo } from "react";
import { useProducts } from "./hooks/useProducts";
import { useMovements } from "./hooks/useMovements";
import { useInspections } from "./hooks/useInspections";
import { useToast } from "./hooks/useToast";

import { Header } from "./components/layout/Header";
import { Toast } from "./components/ui/Toast";

// Products view
import { StatsBar } from "./components/products/StatsBar";
import { SearchBar } from "./components/products/SearchBar";
import { ProductTable } from "./components/products/ProductTable";
import { ProductModal } from "./components/products/ProductModal";
import { DeleteConfirm } from "./components/products/DeleteConfirm";

// Movements view
import { MovementStatsBar } from "./components/movements/MovementStatsBar";
import { MovementTable } from "./components/movements/MovementTable";
import { ReceivingForm } from "./components/movements/ReceivingForm";
import { DispatchForm } from "./components/movements/DispatchForm";

// Inspections view
import { InspectionStatsBar } from "./components/quality/InspectionStatsBar";
import { InspectionTable } from "./components/quality/InspectionTable";
import { InspectionForm } from "./components/quality/InspectionForm";

export default function App() {
  // ── Hooks ──────────────────────────────────────────────────────────────────
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    incrementStock,
    decrementStock,
  } = useProducts();

  const { movements, addMovement, deleteMovement } = useMovements();
  const { inspections, addInspection, deleteInspection } = useInspections();
  const { toast, showToast } = useToast();

  // ── View state ─────────────────────────────────────────────────────────────
  // "products" | "movements" | "inspections"
  const [activeView, setActiveView] = useState("products");

  // ── Modal state ────────────────────────────────────────────────────────────
  // null | "add" | "edit" | "delete" | "receive" | "dispatch" | "inspection"
  const [modal, setModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ── Products search & filter ───────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All Categories");

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter((p) => {
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchCat =
        filterCat === "All Categories" || p.category === filterCat;
      return matchSearch && matchCat;
    });
  }, [products, search, filterCat]);

  // ── Products handlers ──────────────────────────────────────────────────────
  function handleAddClick() {
    setSelectedProduct(null);
    setModal("add");
  }

  function handleEditClick(product) {
    setSelectedProduct(product);
    setModal("edit");
  }

  function handleDeleteClick(product) {
    setSelectedProduct(product);
    setModal("delete");
  }

  function handleSave(formData) {
    if (modal === "add") {
      addProduct(formData);
      showToast("Product added successfully", "success");
    } else if (modal === "edit") {
      updateProduct(selectedProduct.id, formData);
      showToast("Product updated", "success");
    }
    setModal(null);
    setSelectedProduct(null);
  }

  function handleConfirmDelete() {
    deleteProduct(selectedProduct.id);
    showToast(`"${selectedProduct.name}" deleted`, "error");
    setModal(null);
    setSelectedProduct(null);
  }

  function handleCloseModal() {
    setModal(null);
    setSelectedProduct(null);
  }

  // ── Movement handlers ──────────────────────────────────────────────────────
  function handleReceive(movementData) {
    addMovement(movementData);
    incrementStock(movementData.sku, movementData.qty);
    showToast("Stock received successfully", "success");
    setModal(null);
  }

  function handleDispatch(movementData) {
    const ok = decrementStock(movementData.sku, movementData.qty);
    if (!ok) {
      showToast("Insufficient stock", "danger");
      return;
    }
    addMovement(movementData);
    showToast("Dispatch recorded successfully", "success");
    setModal(null);
  }

  function handleDeleteMovement(movement) {
    deleteMovement(movement.id);
    showToast("Movement deleted", "danger");
  }

  // ── Inspection handlers ────────────────────────────────────────────────────
  function handleAddInspection(inspectionData) {
    addInspection(inspectionData);
    showToast("Inspection recorded successfully", "success");
    setModal(null);
  }

  function handleDeleteInspection(inspection) {
    deleteInspection(inspection.id);
    showToast("Inspection deleted", "danger");
  }

  // onView is handled locally inside InspectionTable (read-only detail modal)
  function handleViewInspection() {
    // No-op at App level — InspectionTable manages the detail modal internally
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-wms-bg">
      {/* ── Header ── */}
      <Header
        activeView={activeView}
        onViewChange={setActiveView}
        onAddProduct={handleAddClick}
        onReceive={() => setModal("receive")}
        onDispatch={() => setModal("dispatch")}
        onNewInspection={() => setModal("inspection")}
      />

      {/* ── Main content ── */}
      <main className="max-w-screen-xl mx-auto px-6 py-6">
        {activeView === "products" && (
          <>
            {/* Page title */}
            <div className="mb-6">
              <h2 className="font-mono font-bold text-wms-text text-lg tracking-wide">
                Product Inventory
              </h2>
              <p className="text-xs text-wms-muted mt-0.5 uppercase tracking-widest">
                Manage and track all warehouse SKUs
              </p>
            </div>

            <StatsBar products={products} filteredCount={filteredProducts.length} />

            <SearchBar
              search={search}
              onSearch={setSearch}
              filterCat={filterCat}
              onFilterCat={setFilterCat}
            />

            <ProductTable
              products={filteredProducts}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </>
        )}

        {activeView === "movements" && (
          <>
            {/* Page title */}
            <div className="mb-6">
              <h2 className="font-mono font-bold text-wms-text text-lg tracking-wide">
                Stock Movements
              </h2>
              <p className="text-xs text-wms-muted mt-0.5 uppercase tracking-widest">
                Inbound &amp; outbound movement log
              </p>
            </div>

            <MovementStatsBar movements={movements} products={products} />

            <MovementTable
              movements={movements}
              products={products}
              onDelete={handleDeleteMovement}
            />
          </>
        )}

        {activeView === "inspections" && (
          <>
            {/* Page title */}
            <div className="mb-6">
              <h2 className="font-mono font-bold text-wms-text text-lg tracking-wide">
                Quality Inspections
              </h2>
              <p className="text-xs text-wms-muted mt-0.5 uppercase tracking-widest">
                Inspection checklists &amp; audit trail
              </p>
            </div>

            <InspectionStatsBar inspections={inspections} />

            <InspectionTable
              inspections={inspections}
              onView={handleViewInspection}
              onDelete={handleDeleteInspection}
            />
          </>
        )}
      </main>

      {/* ── Product Modals ── */}
      {(modal === "add" || modal === "edit") && (
        <ProductModal
          mode={modal}
          product={selectedProduct}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
      {modal === "delete" && (
        <DeleteConfirm
          product={selectedProduct}
          onConfirm={handleConfirmDelete}
          onClose={handleCloseModal}
        />
      )}

      {/* ── Movement Modals ── */}
      {modal === "receive" && (
        <ReceivingForm
          products={products}
          onSave={handleReceive}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "dispatch" && (
        <DispatchForm
          products={products}
          onSave={handleDispatch}
          onClose={() => setModal(null)}
        />
      )}

      {/* ── Inspection Modals ── */}
      {modal === "inspection" && (
        <InspectionForm
          products={products}
          movements={movements}
          onSave={handleAddInspection}
          onClose={() => setModal(null)}
        />
      )}

      {/* ── Toast ── */}
      <Toast toast={toast} />
    </div>
  );
}
