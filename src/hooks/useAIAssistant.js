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
    if (!userText.trim()) return;

    const userMsg = {
      id: Date.now() + "-user",
      role: "user",
      content: userText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    // Build the API messages array (all prev messages except welcome)
    setMessages(currentMessages => {
      // Need to capture currentMessages to build history
      const apiMessages = currentMessages
        .filter(m => m.id !== "welcome" && m.role !== "error")
        .map(m => ({ role: m.role, content: m.content }));
        
      apiMessages.push({ role: "user", content: userText });

      // Call API
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: `You are a data query engine embedded inside a Warehouse Management System (WMS). You have access to a live snapshot of the warehouse data provided below. Answer questions concisely and accurately based ONLY on the data provided. Format numbers clearly. Use bullet points for lists. When referencing products, always include the SKU. When referencing defects or NCRs, always include the ID. If the user asks about something not in the data, say so clearly rather than guessing.\n\n${dataContext}`,
          messages: apiMessages
        })
      })
      .then(async (response) => {
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
      })
      .catch((err) => {
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
      })
      .finally(() => {
        setIsLoading(false);
      });

      return currentMessages;
    });
  };

  const clearMessages = () => {
    setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date().toISOString() }]);
    setError(null);
  };

  return { messages, isLoading, error, sendMessage, clearMessages };
}
