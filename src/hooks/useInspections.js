import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inspectionsApi } from "../lib/api";

/**
 * Compute overall result from a criteria array. Kept here (and exported)
 * because InspectionForm uses it for a live preview. The server computes the
 * authoritative value on save; this mirrors that logic for the UI.
 * @param {Array<{result: string}>} criteria
 * @returns {"Pass" | "Fail" | "Pending"}
 */
export function computeOverallResult(criteria) {
  if (criteria.some((c) => c.result === "Fail")) return "Fail";
  if (criteria.some((c) => c.result === "Pending")) return "Pending";
  return "Pass";
}

/** Central hook for inspections, backed by the REST API. */
export function useInspections() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["inspections"] });

  const { data: inspections = [], isLoading, error } = useQuery({
    queryKey: ["inspections"],
    queryFn: inspectionsApi.list,
  });

  const addMut = useMutation({ mutationFn: inspectionsApi.create, onSuccess: invalidate });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => inspectionsApi.update(id, data),
    onSuccess: invalidate,
  });
  const deleteMut = useMutation({ mutationFn: inspectionsApi.remove, onSuccess: invalidate });

  return {
    inspections,
    isLoading,
    error,
    addInspection: (data) => addMut.mutateAsync(data),
    updateInspection: (id, data) => updateMut.mutateAsync({ id, data }),
    deleteInspection: (id) => deleteMut.mutateAsync(id),
  };
}
