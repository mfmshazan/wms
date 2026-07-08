import { useState, useMemo } from "react";
import { useAuth } from "./context/AuthContext";
import { LoginPage } from "./components/auth/LoginPage";
import { TeamPage } from "./components/team/TeamPage";
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

function MainApp() {
  const { user, isAdmin, canWrite, logout } = useAuth();
  const canInventory = canWrite("inventory");
  const canQuality = canWrite("quality");

  // ── Hooks ──────────────────────────────────────────────────────────────────
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
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

  async function handleSave(formData) {
    try {
      if (modal === "add") {
        await addProduct(formData);
        showToast("Product added successfully", "success");
      } else if (modal === "edit") {
        await updateProduct(selectedProduct.id, formData);
        showToast("Product updated", "success");
      }
      setModal(null);
      setSelectedProduct(null);
    } catch (err) {
      showToast(err.message || "Failed to save product", "danger");
    }
  }

  async function handleConfirmDelete() {
    try {
      await deleteProduct(selectedProduct.id);
      showToast(`"${selectedProduct.name}" deleted`, "error");
    } catch (err) {
      showToast(err.message || "Failed to delete product", "danger");
    }
    setModal(null);
    setSelectedProduct(null);
  }

  function handleCloseModal() {
    setModal(null);
    setSelectedProduct(null);
  }

  // ── Movement handlers ──────────────────────────────────────────────────────
  async function handleReceive(movementData) {
    try {
      // Server records the movement and increments stock in one transaction.
      await addMovement(movementData);
      showToast("Stock received successfully", "success");
      setModal(null);
    } catch (err) {
      showToast(err.message || "Failed to receive stock", "danger");
    }
  }

  async function handleDispatch(movementData) {
    try {
      // Server checks stock and decrements atomically; rejects if insufficient.
      await addMovement(movementData);
      showToast("Dispatch recorded successfully", "success");
      setModal(null);
    } catch (err) {
      showToast(err.message || "Failed to record dispatch", "danger");
    }
  }

  async function handleDeleteMovement(movement) {
    try {
      await deleteMovement(movement.id);
      showToast("Movement deleted", "danger");
    } catch (err) {
      showToast(err.message || "Failed to delete movement", "danger");
    }
  }

  // ── Inspection handlers ────────────────────────────────────────────────────
  async function handleAddInspection(inspectionData) {
    try {
      await addInspection(inspectionData);
      showToast("Inspection recorded successfully", "success");
      setModal(null);
    } catch (err) {
      showToast(err.message || "Failed to record inspection", "danger");
    }
  }

  async function handleDeleteInspection(inspection) {
    try {
      await deleteInspection(inspection.id);
      showToast("Inspection deleted", "danger");
    } catch (err) {
      showToast(err.message || "Failed to delete inspection", "danger");
    }
  }

  // onView is handled locally inside InspectionTable (read-only detail modal)
  function handleViewInspection() {
    // No-op at App level — InspectionTable manages the detail modal internally
  }

  // ── Defect handlers ────────────────────────────────────────────────────────
  async function handleAddDefect(defectData) {
    try {
      await addDefect(defectData);
      showToast("Defect logged successfully", "success");
      setModal(null);
      setDefectPrefill(null);
    } catch (err) {
      showToast(err.message || "Failed to log defect", "danger");
    }
  }

  async function handleUpdateDefectStatus(id, updates) {
    try {
      await updateDefect(id, updates);
      showToast("Defect status updated", "success");
      setModal(null);
      setSelectedDefect(null);
    } catch (err) {
      showToast(err.message || "Failed to update defect", "danger");
    }
  }

  async function handleDeleteDefect(defect) {
    try {
      await deleteDefect(defect.id);
      showToast("Defect deleted", "danger");
    } catch (err) {
      showToast(err.message || "Failed to delete defect", "danger");
    }
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
  async function handleAddNCR(ncrData) {
    try {
      await addNCR(ncrData);
      showToast("NCR raised successfully", "success");
      setModal(null);
      setNcrPrefill(null);
    } catch (err) {
      showToast(err.message || "Failed to raise NCR", "danger");
    }
  }

  async function handleNCRStatusChange(ncr, newStatus) {
    try {
      // Server manages closedAt based on the status transition.
      await updateNCR(ncr.id, { status: newStatus });
      showToast(`NCR moved to ${newStatus}`, "success");
    } catch (err) {
      showToast(err.message || "Failed to update NCR", "danger");
    }
  }

  async function handleDeleteNCR(ncr) {
    try {
      await deleteNCR(ncr.id);
      showToast("NCR deleted", "danger");
    } catch (err) {
      showToast(err.message || "Failed to delete NCR", "danger");
    }
  }

  function handleViewNCR(ncr) {
    setSelectedNCR(ncr);
    setModal("ncrDetail");
  }

  async function handleAddCAPA(ncrId, capaData) {
    try {
      await addCAPA(ncrId, capaData);
      showToast("CAPA action added", "success");
      setModal("ncrDetail");
    } catch (err) {
      showToast(err.message || "Failed to add CAPA", "danger");
    }
  }

  async function handleUpdateCAPA(ncrId, capaId, updates) {
    try {
      await updateCAPA(ncrId, capaId, updates);
      showToast("CAPA updated", "success");
      setModal("ncrDetail");
    } catch (err) {
      showToast(err.message || "Failed to update CAPA", "danger");
    }
  }

  async function handleDeleteCAPA(ncrId, capaId) {
    try {
      await deleteCAPA(ncrId, capaId);
      showToast("CAPA removed", "danger");
    } catch (err) {
      showToast(err.message || "Failed to remove CAPA", "danger");
    }
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
          user={user}
          onLogout={logout}
          canInventory={canInventory}
          canQuality={canQuality}
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
                canEdit={canInventory}
                canDelete={isAdmin}
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
                canDelete={isAdmin}
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
                canLogDefect={canQuality}
                canDelete={isAdmin}
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
                canEdit={canQuality}
                canDelete={isAdmin}
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
                canManage={canQuality}
                canDelete={isAdmin}
              />
            </>
          )}

          {activeView === "team" && (
            <TeamPage currentUser={user} isAdmin={isAdmin} showToast={showToast} />
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
          canEdit={canQuality}
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
          ncr={ncrs.find((n) => n.id === selectedNCR?.id) || selectedNCR}
          defects={defects}
          canManage={canQuality}
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

/**
 * Auth gate: shows a loading state while validating a stored session, the
 * login page when signed out, and the full app once authenticated. MainApp
 * (and its data queries) only mount when there's a valid session.
 */
export default function App() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wms-bg text-wms-muted text-sm">
        Loading…
      </div>
    );
  }

  return isAuthenticated ? <MainApp /> : <LoginPage />;
}
