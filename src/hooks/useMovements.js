import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { movementsApi } from "../lib/api";

/**
 * Central hook for the movement ledger, backed by the REST API.
 *
 * Creating a movement changes stock server-side (in a transaction), so writes
 * here invalidate BOTH the movements and products caches — the movements table
 * and the product quantities both refresh.
 */
export function useMovements() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["movements"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  const { data: movements = [], isLoading, error } = useQuery({
    queryKey: ["movements"],
    queryFn: movementsApi.list,
  });

  const addMut = useMutation({ mutationFn: movementsApi.create, onSuccess: invalidate });
  const deleteMut = useMutation({ mutationFn: movementsApi.remove, onSuccess: invalidate });

  return {
    movements,
    isLoading,
    error,
    // Handles both Inbound and Outbound; server rejects Outbound if stock is
    // insufficient (the promise rejects with "Insufficient stock").
    addMovement: (data) => addMut.mutateAsync(data),
    deleteMovement: (id) => deleteMut.mutateAsync(id),
  };
}
