export function ChatMessage({ message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end mb-3 px-2">
        <div className="max-w-[80%]">
          <div className="bg-wms-purple text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm">
            {message.content}
          </div>
          <p className="text-[10px] text-wms-muted text-right mt-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>
    );
  }

  if (message.role === "assistant") {
    return (
      <div className="flex justify-start mb-3 px-2">
        <div className="max-w-[85%]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 text-wms-purple">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <span className="text-[10px] text-wms-muted font-medium">Data Search</span>
          </div>
          <div className="bg-wms-surface border border-wms-border text-wms-text rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm">
            {message.content}
          </div>
          <p className="text-[10px] text-wms-muted mt-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>
    );
  }

  if (message.role === "error") {
    return (
      <div className="flex justify-start mb-3 px-2">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2.5 text-xs max-w-[80%]">
          ⚠ {message.content}
        </div>
      </div>
    );
  }

  return null;
}
