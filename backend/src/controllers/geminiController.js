function geminiUrl(apiKey) {
  return `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${encodeURIComponent(apiKey)}`;
}

function buildPrompt(mode, note) {
  const header = mode === "takeaways" ? "Key takeaways" : "Concise summary";

  return `${header} for this note. Keep the response clear and useful.\n\nTitle: ${note.title}\nContent: ${note.content}\nTags: ${(note.tags || []).join(", ")}`;
}

async function runGeminiRequest(apiKey, prompt) {
  const response = await fetch(geminiUrl(apiKey), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 256,
      },
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.error?.message || "Gemini request failed";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();

  return text || "No response returned";
}

export async function verifyGeminiKey(req, res) {
  try {
    const { apiKey } = req.body;

    if (!apiKey?.trim()) {
      return res.status(400).json({ message: "Gemini API key is required" });
    }

    const result = await runGeminiRequest(apiKey.trim(), "Reply with only: OK");
    return res.status(200).json({ ok: true, result });
  } catch (error) {
    console.error("Error verifying Gemini key", error);
    return res.status(error.status || 500).json({ message: error.message || "Could not verify Gemini key" });
  }
}

export async function generateGeminiAssist(req, res) {
  try {
    const { apiKey, mode, note } = req.body;

    if (!apiKey?.trim()) {
      return res.status(400).json({ message: "Gemini API key is required" });
    }

    if (!note?.title || !note?.content) {
      return res.status(400).json({ message: "A note title and content are required" });
    }

    const result = await runGeminiRequest(apiKey.trim(), buildPrompt(mode, note));
    return res.status(200).json({ result });
  } catch (error) {
    console.error("Error generating Gemini assist", error);
    return res.status(error.status || 500).json({ message: error.message || "Could not generate Gemini response" });
  }
}