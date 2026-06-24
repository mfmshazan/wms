import { useState } from "react";

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant",
  content: "Ask me anything about your warehouse — stock levels, movements, inspections, defects, or NCRs.",
  timestamp: new Date().toISOString()
};

export function useAIAssistant() {
  const [messages, setMessages] = useState([{ ...WELCOME_MESSAGE, timestamp: new Date().toISOString() }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (userText, dataContext) => {
    if (!userText.trim() || isLoading) return;

    // Build API history from current messages BEFORE adding the new one
    const apiMessages = messages
      .filter(m => m.id !== "welcome" && m.role !== "error")
      .map(m => ({ role: m.role, content: m.content }));

    apiMessages.push({ role: "user", content: userText });

    setMessages(prev => [
      ...prev,
      {
        id: Date.now() + "-user",
        role: "user",
        content: userText,
        timestamp: new Date().toISOString()
      }
    ]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: `You are a data query engine embedded inside a Warehouse Management System (WMS). You have access to a live snapshot of the warehouse data provided below. Answer questions concisely and accurately based ONLY on the data provided. Format numbers clearly. Use bullet points for lists. When referencing products, always include the SKU. When referencing defects or NCRs, always include the ID. If the user asks about something not in the data, say so clearly rather than guessing.\n\n${dataContext}`,
          messages: apiMessages
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "API response error");
      }

      const reply = data.content
        .filter(block => block.type === "text")
        .map(block => block.text)
        .join("\n");

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + "-assistant",
          role: "assistant",
          content: reply,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (err) {
      const msg = err.message && err.message !== "API response error"
        ? err.message
        : "Something went wrong. Please try again.";
      setError(msg);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + "-error",
          role: "error",
          content: msg,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date().toISOString() }]);
    setError(null);
  };

  return { messages, isLoading, error, sendMessage, clearMessages };
}
