import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { defectsApi } from "../lib/api";

/** Central hook for defect records, backed by the REST API. */
export function useDefects() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["defects"] });

  const { data: defects = [], isLoading, error } = useQuery({
    queryKey: ["defects"],
    queryFn: defectsApi.list,
  });

  const addMut = useMutation({ mutationFn: defectsApi.create, onSuccess: invalidate });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => defectsApi.update(id, data),
    onSuccess: invalidate,
  });
  const deleteMut = useMutation({ mutationFn: defectsApi.remove, onSuccess: invalidate });

  return {
    defects,
    isLoading,
    error,
    addDefect: (data) => addMut.mutateAsync(data),
    updateDefect: (id, data) => updateMut.mutateAsync({ id, data }),
    deleteDefect: (id) => deleteMut.mutateAsync(id),
  };
}
