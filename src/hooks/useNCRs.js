import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ncrsApi } from "../lib/api";

/**
 * Central hook for NCRs and their nested CAPA actions, backed by the REST API.
 * CAPAs are returned inside each NCR, so every CAPA write also invalidates the
 * ncrs cache.
 */
export function useNCRs() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["ncrs"] });

  const { data: ncrs = [], isLoading, error } = useQuery({
    queryKey: ["ncrs"],
    queryFn: ncrsApi.list,
  });

  // ── NCR mutations ──────────────────────────────────────────────────────────
  const addMut = useMutation({ mutationFn: ncrsApi.create, onSuccess: invalidate });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => ncrsApi.update(id, data),
    onSuccess: invalidate,
  });
  const deleteMut = useMutation({ mutationFn: ncrsApi.remove, onSuccess: invalidate });

  // ── CAPA mutations (addressed by business ids) ─────────────────────────────
  const addCapaMut = useMutation({
    mutationFn: ({ ncrId, data }) => ncrsApi.addCapa(ncrId, data),
    onSuccess: invalidate,
  });
  const updateCapaMut = useMutation({
    mutationFn: ({ ncrId, capaId, data }) => ncrsApi.updateCapa(ncrId, capaId, data),
    onSuccess: invalidate,
  });
  const deleteCapaMut = useMutation({
    mutationFn: ({ ncrId, capaId }) => ncrsApi.removeCapa(ncrId, capaId),
    onSuccess: invalidate,
  });

  return {
    ncrs,
    isLoading,
    error,
    addNCR: (data) => addMut.mutateAsync(data),
    updateNCR: (id, data) => updateMut.mutateAsync({ id, data }),
    deleteNCR: (id) => deleteMut.mutateAsync(id),
    addCAPA: (ncrId, data) => addCapaMut.mutateAsync({ ncrId, data }),
    updateCAPA: (ncrId, capaId, data) => updateCapaMut.mutateAsync({ ncrId, capaId, data }),
    deleteCAPA: (ncrId, capaId) => deleteCapaMut.mutateAsync({ ncrId, capaId }),
  };
}
