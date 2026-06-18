import { useState, useMemo } from "react";
import { NCR_STATUSES, NCR_TYPES } from "../../data/constants";

function priorityBadgeClass(priority) {
  if (priority === "Critical") return "bg-red-900/40 text-wms-red";
  if (priority === "High") return "bg-orange-900/40 text-wms-orange";
  if (priority === "Medium") return "bg-yellow-900/40 text-yellow-400";
  if (priority === "Low") return "bg-blue-900/40 text-wms-blue";
  return "bg-wms-surface text-wms-text";
}

function getNextStatus(currentStatus) {
  const currentIndex = NCR_STATUSES.indexOf(currentStatus);
  if (currentIndex < NCR_STATUSES.length - 1) {
    return NCR_STATUSES[currentIndex + 1];
  }
  return null;
}

export function NCRBoard({ ncrs, onView, onDelete, onStatusChange }) {
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [assigneeSearch, setAssigneeSearch] = useState("");

  const filteredNCRs = useMemo(() => {
    const q = assigneeSearch.toLowerCase().trim();
    return ncrs.filter((ncr) => {
      const matchPriority = priorityFilter === "All" || ncr.priority === priorityFilter;
      const matchType = typeFilter === "All" || ncr.type === typeFilter;
      const matchAssignee = !q || ncr.assignedTo.toLowerCase().includes(q);
      return matchPriority && matchType && matchAssignee;
    });
  }, [ncrs, priorityFilter, typeFilter, assigneeSearch]);

  // Group by status
  const columns = NCR_STATUSES.map((status) => ({
    status,
    items: filteredNCRs.filter((ncr) => ncr.status === status)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }));

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col gap-4">
      {/* ── Filter bar ── */}
      <div className="bg-wms-surface border border-wms-border rounded-xl px-5 py-3 flex flex-wrap gap-4 items-center">
        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-wms-muted">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-wms-bg border border-wms-border rounded text-xs px-2 py-1 text-wms-text focus:outline-none"
          >
            <option value="All">All</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-wms-muted">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-wms-bg border border-wms-border rounded text-xs px-2 py-1 text-wms-text focus:outline-none"
          >
            <option value="All">All Types</option>
            {NCR_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Assignee Search */}
        <div className="flex items-center gap-2 ml-auto">
          <input
            type="text"
            placeholder="Search assignee..."
            value={assigneeSearch}
            onChange={(e) => setAssigneeSearch(e.target.value)}
            className="bg-wms-bg border border-wms-border rounded text-xs px-3 py-1.5 text-wms-text focus:outline-none focus:border-green-700 w-48"
          />
        </div>
      </div>

      {/* ── Kanban Board ── */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
        {columns.map((col) => (
          <div
            key={col.status}
            className="flex flex-col gap-3 min-w-[300px] w-[300px] flex-shrink-0 snap-start bg-wms-surface/50 border border-wms-border rounded-xl p-3 h-full min-h-[400px]"
          >
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-wms-text">{col.status}</h3>
              <span className="bg-wms-bg border border-wms-border text-wms-muted text-xs px-2 py-0.5 rounded-full font-mono">
                {col.items.length}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {col.items.map((ncr) => {
                const nextStatus = getNextStatus(ncr.status);
                const isOverdue = ncr.targetDate < todayStr && ncr.status !== "Closed" && ncr.status !== "Resolved";

                return (
                  <div
                    key={ncr.id}
                    className="bg-wms-bg border border-wms-border rounded-lg p-3 flex flex-col gap-2 hover:border-wms-muted transition-colors group"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xs text-wms-purple font-bold">
                        {ncr.ncrId}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${priorityBadgeClass(ncr.priority)}`}>
                        {ncr.priority}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-wms-text line-clamp-2 leading-snug" title={ncr.title}>
                      {ncr.title}
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="font-mono text-wms-green">{ncr.defectSku}</span>
                      {ncr.defectId && (
                        <span className="font-mono text-wms-purple bg-purple-900/20 px-1 rounded">
                          {ncr.defectId}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-xs mt-1">
                      <span className="text-wms-muted truncate max-w-[120px]" title={ncr.assignedTo}>
                        {ncr.assignedTo}
                      </span>
                      {isOverdue ? (
                        <span className="text-wms-red font-mono">⚠ Overdue</span>
                      ) : (
                        <span className="text-wms-muted font-mono">{ncr.targetDate}</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-wms-border">
                      <span className="text-[10px] text-wms-muted uppercase tracking-widest">
                        {ncr.capas?.length || 0} CAPAs
                      </span>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onDelete(ncr)}
                          className="p-1 text-wms-muted hover:text-wms-red opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete NCR"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => onView(ncr)}
                          className="px-2 py-1 text-xs border border-wms-border rounded text-wms-muted hover:bg-white/5 hover:text-wms-text transition-colors"
                        >
                          View
                        </button>

                        {nextStatus ? (
                          <button
                            onClick={() => onStatusChange(ncr, nextStatus)}
                            className="px-2 py-1 text-xs border border-wms-blue text-wms-blue rounded hover:bg-blue-900/20 transition-colors"
                          >
                            Move →
                          </button>
                        ) : (
                          <span className="px-2 py-1 text-xs text-wms-muted flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {col.items.length === 0 && (
                <div className="py-6 text-center border border-dashed border-wms-border/50 rounded-lg">
                  <p className="text-xs text-wms-muted font-mono">No NCRs</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
