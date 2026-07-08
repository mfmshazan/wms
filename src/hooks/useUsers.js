import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../lib/api";

/** Central hook for organization team members, backed by the REST API. */
export function useUsers() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["users"] });

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: usersApi.list,
  });

  const addMut = useMutation({ mutationFn: usersApi.create, onSuccess: invalidate });
  const roleMut = useMutation({
    mutationFn: ({ id, role }) => usersApi.updateRole(id, role),
    onSuccess: invalidate,
  });
  const deleteMut = useMutation({ mutationFn: usersApi.remove, onSuccess: invalidate });

  return {
    users,
    isLoading,
    error,
    addUser: (data) => addMut.mutateAsync(data),
    updateUserRole: (id, role) => roleMut.mutateAsync({ id, role }),
    removeUser: (id) => deleteMut.mutateAsync(id),
  };
}
