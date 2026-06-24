import { useState, useEffect, useRef } from "react";
import { useAIAssistant } from "../../hooks/useAIAssistant";
import { ChatMessage } from "./ChatMessage";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { buildDataContext } from "./DataContextBuilder";

export function AIAssistantPanel({
  isOpen,
  onClose,
  products,
  movements,
  inspections,
  defects,
  ncrs,
  metrics
}) {
  const { messages, isLoading, sendMessage, clearMessages } = useAIAssistant();
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef(null);
  const dataContextRef = useRef("");

  useEffect(() => {
    if (isOpen) {
      dataContextRef.current = buildDataContext(
        products,
        movements,
        inspections,
        defects,
        ncrs,
        metrics
      );
    }
  }, [isOpen, products, movements, inspections, defects, ncrs, metrics]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;
    sendMessage(inputText, dataContextRef.current);
    setInputText("");
  };

  const handleSuggest = (promptText) => {
    sendMessage(promptText, dataContextRef.current);
    setInputText("");
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-40" onClick={onClose} />
      )}

      <div
        className={`fixed right-0 top-0 bottom-0 w-full sm:w-96 z-50 bg-wms-surface border-l border-wms-border flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-wms-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-wms-purple">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-wms-text">Data Search</p>
              <p className="text-[10px] text-wms-muted">Live warehouse data</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearMessages}
              className="text-[10px] text-wms-muted hover:text-wms-text font-medium transition-colors px-2 py-1 border border-wms-border rounded-lg hover:bg-slate-50"
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className="text-wms-muted hover:text-wms-text transition-colors w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Message list */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto py-3 space-y-0">
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}

          {messages.length === 1 && (
            <SuggestedPrompts onSelect={handleSuggest} />
          )}

          {isLoading && (
            <div className="flex justify-start mb-3 px-2">
              <div className="bg-wms-surface border border-wms-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-wms-muted animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-wms-muted animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-wms-muted animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-wms-border p-3 flex-shrink-0 bg-slate-50">
          <div className="flex gap-2 items-end">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about your warehouse data..."
              rows={1}
              className="flex-1 bg-white border border-wms-border text-wms-text text-sm rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-wms-purple/20 focus:border-wms-purple font-sans placeholder:text-wms-muted transition-colors"
              style={{ minHeight: "40px", maxHeight: "120px", overflowY: "auto" }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !inputText.trim()}
              className="w-9 h-9 rounded-xl bg-wms-purple text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors text-lg"
            >
              ↑
            </button>
          </div>
          <p className="text-[10px] text-wms-muted mt-2 text-center">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </>
  );
}
