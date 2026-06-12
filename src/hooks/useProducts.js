import { useState } from "react";
import { INITIAL_PRODUCTS } from "../data/constants";
import { generateSKU } from "../utils/skuGenerator";

/**
 * Central hook for all product CRUD operations.
 */
export function useProducts() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  /** Add a new product. SKU is generated here. */
  function addProduct(formData) {
    const newProduct = {
      ...formData,
      id: Date.now(),
      sku: generateSKU(),
      qty: Number(formData.qty),
      price: Number(formData.price),
      minStock: Number(formData.minStock),
    };
    setProducts((prev) => [...prev, newProduct]);
  }

  /** Update an existing product by id. */
  function updateProduct(id, formData) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...formData,
              id,
              qty: Number(formData.qty),
              price: Number(formData.price),
              minStock: Number(formData.minStock),
            }
          : p
      )
    );
  }

  /** Remove a product by id. */
  function deleteProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  /** Return a single product by id, or undefined. */
  function getProductById(id) {
    return products.find((p) => p.id === id);
  }

  /** Increase a product's qty by the given amount (Inbound). */
  function incrementStock(sku, qty) {
    setProducts((prev) =>
      prev.map((p) =>
        p.sku === sku ? { ...p, qty: p.qty + Number(qty) } : p
      )
    );
  }

  /**
   * Decrease a product's qty by the given amount (Outbound).
   * Never goes below 0. Returns false if stock is insufficient, true on success.
   * @param {string} sku
   * @param {number} qty
   * @returns {boolean}
   */
  function decrementStock(sku, qty) {
    const product = products.find((p) => p.sku === sku);
    if (!product || product.qty < Number(qty)) return false;
    setProducts((prev) =>
      prev.map((p) =>
        p.sku === sku
          ? { ...p, qty: Math.max(0, p.qty - Number(qty)) }
          : p
      )
    );
    return true;
  }

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    incrementStock,
    decrementStock,
  };
}

