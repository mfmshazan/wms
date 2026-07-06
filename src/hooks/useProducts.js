import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "../lib/api";

/**
 * Central hook for all product data + CRUD, backed by the REST API.
 *
 * React Query pattern used throughout the app:
 *  - useQuery      → reads server data, exposes it as `products` and tracks
 *                    isLoading / error for us automatically.
 *  - useMutation   → performs a write (create/update/delete).
 *  - invalidateQueries(["products"]) → after any write, marks the products
 *                    cache stale so React Query refetches and every component
 *                    showing products updates on its own.
 *
 * The returned function names (addProduct, updateProduct, …) match the old
 * in-memory hook, so App.jsx barely changes — but the functions are now async
 * and reject on failure, which the callers handle with try/catch.
 */
export function useProducts() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["products"] });

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: productsApi.list,
  });

  const addMut = useMutation({ mutationFn: productsApi.create, onSuccess: invalidate });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => productsApi.update(id, data),
    onSuccess: invalidate,
  });
  const deleteMut = useMutation({ mutationFn: productsApi.remove, onSuccess: invalidate });

  return {
    products,
    isLoading,
    error,
    addProduct: (data) => addMut.mutateAsync(data),
    updateProduct: (id, data) => updateMut.mutateAsync({ id, data }),
    deleteProduct: (id) => deleteMut.mutateAsync(id),
  };
}
