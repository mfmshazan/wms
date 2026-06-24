const prompts = [
  "Which products are critically low on stock?",
  "How many defects are open right now?",
  "What is our inspection pass rate this week?",
  "Show me all overdue NCRs",
  "Which product has moved the most this month?",
  "Summarise all critical open defects",
  "Which NCRs have no CAPA actions yet?",
  "What is our CAPA completion rate?"
];

export function SuggestedPrompts({ onSelect }) {
  return (
    <div className="px-3 pb-3">
      <p className="text-[10px] text-wms-muted uppercase tracking-widest mb-2 font-mono">
        Quick queries
      </p>
      <div className="grid grid-cols-2 gap-2">
        {prompts.map(p => (
          <button
            key={p}
            onClick={() => onSelect(p)}
            className="bg-wms-surface border border-wms-border text-wms-muted hover:text-wms-text hover:border-green-800 text-xs rounded-lg px-3 py-2 text-left transition-colors font-sans leading-snug"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
