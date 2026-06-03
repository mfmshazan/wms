import { useState, useMemo } from "react";
import { useProducts } from "./hooks/useProducts";
import { useToast } from "./hooks/useToast";

import { Header } from "./components/layout/Header";
import { StatsBar } from "./components/products/StatsBar";
import { SearchBar } from "./components/products/SearchBar";
import { ProductTable } from "./components/products/ProductTable";
import { ProductModal } from "./components/products/ProductModal";
import { DeleteConfirm } from "./components/products/DeleteConfirm";
import { Toast } from "./components/ui/Toast";

export default function App() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { toast, showToast } = useToast();

  // Modal state: null | "add" | "edit" | "delete"
  const [modal, setModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Search & filter state
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All Categories");

  // Derived: filtered product list
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

  // ── Handlers ───────────────────────────────────────────────
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

  return (
    <div className="min-h-screen bg-wms-bg">
      {/* ── Header ── */}
      <Header onAddProduct={handleAddClick} />

      {/* ── Main content ── */}
      <main className="max-w-screen-xl mx-auto px-6 py-6">
        {/* Page title row */}
        <div className="mb-6">
          <h2 className="font-mono font-bold text-wms-text text-lg tracking-wide">
            Product Inventory
          </h2>
          <p className="text-xs text-wms-muted mt-0.5 uppercase tracking-widest">
            Manage and track all warehouse SKUs
          </p>
        </div>

        {/* Stats */}
        <StatsBar
          products={products}
          filteredCount={filteredProducts.length}
        />

        {/* Search & filter */}
        <SearchBar
          search={search}
          onSearch={setSearch}
          filterCat={filterCat}
          onFilterCat={setFilterCat}
        />

        {/* Table */}
        <ProductTable
          products={filteredProducts}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </main>

      {/* ── Modals ── */}
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

      {/* ── Toast ── */}
      <Toast toast={toast} />
    </div>
  );
}
