import { useState, useMemo } from "react";
import { useProducts } from "./hooks/useProducts";
import { useMovements } from "./hooks/useMovements";
import { useInspections } from "./hooks/useInspections";
import { useDefects } from "./hooks/useDefects";
import { useNCRs } from "./hooks/useNCRs";
import { useToast } from "./hooks/useToast";
import { useDashboard } from "./hooks/useDashboard";

import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { Toast } from "./components/ui/Toast";

// Dashboard view
import { DashboardPage } from "./components/dashboard/DashboardPage";

// AI Assistant
import { AIAssistantPanel } from "./components/ai/AIAssistantPanel";

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

// Defects view
import { DefectStatsBar } from "./components/quality/DefectStatsBar";
import { DefectTable } from "./components/quality/DefectTable";
import { DefectForm } from "./components/quality/DefectForm";
import { DefectDetailModal } from "./components/quality/DefectDetailModal";
import { DefectStatusModal } from "./components/quality/DefectStatusModal";

// NCRs view
import { NCRStatsBar } from "./components/quality/NCRStatsBar";
import { NCRBoard } from "./components/quality/NCRBoard";
import { NCRForm } from "./components/quality/NCRForm";
import { NCRDetailModal } from "./components/quality/NCRDetailModal";
import { CAPAForm } from "./components/quality/CAPAForm";
import { CAPAStatusModal } from "./components/quality/CAPAStatusModal";

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
  const { defects, addDefect, updateDefect, deleteDefect } = useDefects();
  const {
    ncrs,
    addNCR,
    updateNCR,
    deleteNCR,
    addCAPA,
    updateCAPA,
    deleteCAPA,
  } = useNCRs();
  const { toast, showToast } = useToast();

  const metrics = useDashboard(products, movements, inspections, defects, ncrs);

  // ── View state ─────────────────────────────────────────────────────────────
  // "dashboard" | "products" | "movements" | "inspections" | "defects" | "ncrs"
  const [activeView, setActiveView] = useState("dashboard");
  const [isAIOpen, setIsAIOpen] = useState(false);

  // ── Modal state ────────────────────────────────────────────────────────────
  // null | "add" | "edit" | "delete" | "receive" | "dispatch" | "inspection" | "defect" | "defectDetail" | "defectStatus" | "ncr" | "ncrDetail" | "capa" | "capaStatus"
  const [modal, setModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [defectPrefill, setDefectPrefill] = useState(null);
  const [selectedNCR, setSelectedNCR] = useState(null);
  const [ncrPrefill, setNcrPrefill] = useState(null);
  const [selectedCAPA, setSelectedCAPA] = useState(null);

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

  // ── Defect handlers ────────────────────────────────────────────────────────
  function handleAddDefect(defectData) {
    addDefect(defectData);
    showToast("Defect logged successfully", "success");
    setModal(null);
    setDefectPrefill(null);
  }

  function handleUpdateDefectStatus(id, updates) {
    updateDefect(id, updates);
    showToast("Defect status updated", "success");
    setModal(null);
    setSelectedDefect(null);
  }

  function handleDeleteDefect(defect) {
    deleteDefect(defect.id);
    showToast("Defect deleted", "danger");
  }

  function handleConvertToNCR(defect) {
    setNcrPrefill({
      defectId: defect.defectId,
      defectSku: defect.sku,
      productName: defect.productName,
    });
    setModal("ncr");
  }

  function handleConvertInspectionToDefect(inspection, criterion) {
    setDefectPrefill({
      sku: inspection.sku,
      productName: inspection.productName,
      inspectionId: inspection.inspectionId,
      criterionLabel: criterion.label,
    });
    setModal("defect");
  }

  function handleEditDefect(defect) {
    setSelectedDefect(defect);
    setModal("defectStatus");
  }

  function handleViewDefect(defect) {
    setSelectedDefect(defect);
    setModal("defectDetail");
  }

  // ── NCR & CAPA handlers ────────────────────────────────────────────────────
  function handleAddNCR(ncrData) {
    addNCR(ncrData);
    showToast("NCR raised successfully", "success");
    setModal(null);
    setNcrPrefill(null);
  }

  function handleNCRStatusChange(ncr, newStatus) {
    updateNCR(ncr.id, {
      status: newStatus,
      closedAt: newStatus === "Closed" ? new Date().toISOString() : ncr.closedAt,
    });
    showToast(`NCR moved to ${newStatus}`, "success");
  }

  function handleDeleteNCR(ncr) {
    deleteNCR(ncr.id);
    showToast("NCR deleted", "danger");
  }

  function handleViewNCR(ncr) {
    setSelectedNCR(ncr);
    setModal("ncrDetail");
  }

  function handleAddCAPA(ncrId, capaData) {
    addCAPA(ncrId, capaData);
    showToast("CAPA action added", "success");
    setModal("ncrDetail");
  }

  function handleUpdateCAPA(ncrId, capaId, updates) {
    updateCAPA(ncrId, capaId, updates);
    showToast("CAPA updated", "success");
    setModal("ncrDetail");
  }

  function handleDeleteCAPA(ncrId, capaId) {
    deleteCAPA(ncrId, capaId);
    showToast("CAPA removed", "danger");
  }

  function handleOpenCAPAForm(ncrId) {
    const ncr = ncrs.find((n) => n.ncrId === ncrId);
    if (ncr) {
      setSelectedNCR(ncr);
      setModal("capa");
    }
  }

  function handleOpenCAPAStatus(ncrId, capa) {
    const ncr = ncrs.find((n) => n.ncrId === ncrId);
    if (ncr) {
      setSelectedNCR(ncr);
      setSelectedCAPA(capa);
      setModal("capaStatus");
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-wms-bg overflow-x-hidden">
      {/* ── Sidebar ── */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenAI={() => setIsAIOpen(true)}
      />

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col ml-60 min-h-screen min-w-0 overflow-x-hidden">
        {/* ── Top bar ── */}
        <Header
          activeView={activeView}
          onAddProduct={handleAddClick}
          onReceive={() => setModal("receive")}
          onDispatch={() => setModal("dispatch")}
          onNewInspection={() => setModal("inspection")}
          onLogDefect={() => {
            setDefectPrefill(null);
            setModal("defect");
          }}
          onRaiseNCR={() => {
            setNcrPrefill(null);
            setModal("ncr");
          }}
        />

        {/* ── Page content ── */}
        <main className="flex-1 px-6 py-6">
          {activeView === "dashboard" && (
            <DashboardPage metrics={metrics} />
          )}

          {activeView === "products" && (
            <>
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
              <InspectionStatsBar inspections={inspections} />
              <InspectionTable
                inspections={inspections}
                onView={handleViewInspection}
                onDelete={handleDeleteInspection}
                onLogDefect={handleConvertInspectionToDefect}
              />
            </>
          )}

          {activeView === "defects" && (
            <>
              <DefectStatsBar defects={defects} />
              <DefectTable
                defects={defects}
                onView={handleViewDefect}
                onEdit={handleEditDefect}
                onDelete={handleDeleteDefect}
                onConvertToNCR={handleConvertToNCR}
              />
            </>
          )}

          {activeView === "ncrs" && (
            <>
              <NCRStatsBar ncrs={ncrs} />
              <NCRBoard
                ncrs={ncrs}
                onView={handleViewNCR}
                onDelete={handleDeleteNCR}
                onStatusChange={handleNCRStatusChange}
              />
            </>
          )}
        </main>
      </div>

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

      {/* ── Defect Modals ── */}
      {modal === "defect" && (
        <DefectForm
          products={products}
          inspections={inspections}
          prefill={defectPrefill}
          onSave={handleAddDefect}
          onClose={() => {
            setModal(null);
            setDefectPrefill(null);
          }}
        />
      )}

      {modal === "defectDetail" && (
        <DefectDetailModal
          defect={selectedDefect}
          onClose={() => {
            setModal(null);
            setSelectedDefect(null);
          }}
          onEdit={handleEditDefect}
        />
      )}

      {modal === "defectStatus" && (
        <DefectStatusModal
          defect={selectedDefect}
          onSave={handleUpdateDefectStatus}
          onClose={() => {
            setModal(null);
            setSelectedDefect(null);
          }}
        />
      )}

      {/* ── NCR & CAPA Modals ── */}
      {modal === "ncr" && (
        <NCRForm
          defects={defects}
          prefill={ncrPrefill}
          onSave={handleAddNCR}
          onClose={() => {
            setModal(null);
            setNcrPrefill(null);
          }}
        />
      )}

      {modal === "ncrDetail" && (
        <NCRDetailModal
          ncr={selectedNCR}
          defects={defects}
          onClose={() => {
            setModal(null);
            setSelectedNCR(null);
          }}
          onStatusChange={handleNCRStatusChange}
          onAddCAPA={handleOpenCAPAForm}
          onUpdateCAPA={handleOpenCAPAStatus}
          onDeleteCAPA={handleDeleteCAPA}
          onViewDefect={handleViewDefect}
        />
      )}

      {modal === "capa" && (
        <CAPAForm
          onSave={(capaData) => handleAddCAPA(selectedNCR.ncrId, capaData)}
          onClose={() => setModal("ncrDetail")}
        />
      )}

      {modal === "capaStatus" && (
        <CAPAStatusModal
          capa={selectedCAPA}
          ncrId={selectedNCR.ncrId}
          onSave={handleUpdateCAPA}
          onClose={() => {
            setSelectedCAPA(null);
            setModal("ncrDetail");
          }}
        />
      )}

      {/* ── Toast ── */}
      <Toast toast={toast} />

      {/* ── AI Assistant ── */}
      <AIAssistantPanel
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        products={products}
        movements={movements}
        inspections={inspections}
        defects={defects}
        ncrs={ncrs}
        metrics={metrics}
      />
    </div>
  );
}
