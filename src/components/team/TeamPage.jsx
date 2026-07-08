import { useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";

const ROLE_OPTIONS = ["OPERATOR", "QUALITY", "ADMIN"];

const roleStyles = {
  ADMIN: "bg-wms-purple/10 text-wms-purple",
  QUALITY: "bg-blue-50 text-wms-blue",
  OPERATOR: "bg-slate-100 text-wms-muted",
};

function RoleBadge({ role }) {
  return (
    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wide ${roleStyles[role] || roleStyles.OPERATOR}`}>
      {role}
    </span>
  );
}

/**
 * Team management. Every member sees the roster; ADMINs can add members,
 * change roles, and remove people. Self-actions are disabled to prevent an
 * admin from locking themselves out.
 */
export function TeamPage({ currentUser, isAdmin, showToast }) {
  const { users, isLoading, addUser, updateUserRole, removeUser } = useUsers();
  const [showAdd, setShowAdd] = useState(false);

  async function handleRoleChange(user, role) {
    try {
      await updateUserRole(user.id, role);
      showToast(`${user.name} is now ${role}`, "success");
    } catch (err) {
      showToast(err.message || "Failed to change role", "danger");
    }
  }

  async function handleRemove(user) {
    if (!window.confirm(`Remove ${user.name} from the team?`)) return;
    try {
      await removeUser(user.id);
      showToast(`${user.name} removed`, "danger");
    } catch (err) {
      showToast(err.message || "Failed to remove user", "danger");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-wms-text">Team Members</h3>
          <p className="text-xs text-wms-muted">
            {users.length} {users.length === 1 ? "member" : "members"} in your organization
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowAdd(true)} id="add-member-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Member
          </Button>
        )}
      </div>

      <div className="bg-white border border-wms-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-wms-border text-left text-[11px] uppercase tracking-widest text-wms-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              {isAdmin && <th className="px-4 py-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={isAdmin ? 4 : 3} className="px-4 py-8 text-center text-wms-muted">
                  Loading…
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isSelf = u.id === currentUser?.id;
                return (
                  <tr key={u.id} className="border-b border-wms-border last:border-0 hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-wms-text font-medium">
                      {u.name}
                      {isSelf && (
                        <span className="ml-2 text-[10px] uppercase tracking-wide text-wms-muted">(you)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-wms-muted font-mono text-xs">{u.email}</td>
                    <td className="px-4 py-3">
                      {isAdmin && !isSelf ? (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u, e.target.value)}
                          className="bg-white border border-wms-border rounded-lg px-2 py-1 text-xs text-wms-text focus:outline-none focus:ring-2 focus:ring-wms-purple/20 cursor-pointer"
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      ) : (
                        <RoleBadge role={u.role} />
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-right">
                        {!isSelf && (
                          <button
                            onClick={() => handleRemove(u)}
                            className="px-2.5 py-1 rounded text-xs font-mono text-wms-red hover:bg-red-50 transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <AddMemberModal
          onClose={() => setShowAdd(false)}
          onAdd={addUser}
          showToast={showToast}
        />
      )}
    </div>
  );
}

function AddMemberModal({ onClose, onAdd, showToast }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "OPERATOR" });
  const [submitting, setSubmitting] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await onAdd(form);
      showToast(`${form.name} added to the team`, "success");
      onClose();
    } catch (err) {
      showToast(err.message || "Failed to add member", "danger");
      setSubmitting(false);
    }
  }

  return (
    <Modal title="Add Team Member" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Input id="m-name" label="Full name" value={form.name} onChange={set("name")} placeholder="Jane Doe" />
        <Input id="m-email" label="Email" type="email" value={form.email} onChange={set("email")} placeholder="jane@company.com" />
        <Input id="m-password" label="Initial password" type="password" value={form.password} onChange={set("password")} placeholder="At least 6 characters" />
        <Select id="m-role" label="Role" value={form.role} onChange={set("role")} options={ROLE_OPTIONS} />
        <p className="text-xs text-wms-muted">
          The member signs in with this email and password. They can be given ADMIN, QUALITY, or OPERATOR access.
        </p>
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Adding…" : "Add Member"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
