// /api/chat — proxy to Google Gemini for the AI assistant.
// Kept server-side so the API key is never exposed to the browser.
const express = require("express");

const router = express.Router();

router.post("/chat", async (req, res) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GOOGLE_API_KEY not configured" });
  }

  const { system, messages } = req.body;

  // Convert Anthropic-style messages to Gemini format.
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents,
          generationConfig: { maxOutputTokens: 1000 },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      const msg =
        response.status === 429
          ? "Query limit reached. Please wait a moment and try again."
          : data.error?.message || "API error";
      return res.status(response.status).json({ error: msg });
    }

    const text =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
    res.json({ content: [{ type: "text", text }] });
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
