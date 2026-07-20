const GEMINI_MODEL = "gemini-1.5-flash";

function geminiUrl(apiKey) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
}

function buildPrompt(mode, note) {
  const header = mode === "takeaways" ? "Key takeaways" : "Concise summary";

  return `${header} for this note. Keep the response clear and useful.\n\nTitle: ${note.title}\nContent: ${note.content}\nTags: ${(note.tags || []).join(", ")}`;
}

async function callGemini(apiKey, prompt) {
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

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message = payload?.error?.message || "Gemini request failed";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim() || "No response returned";
}

export async function testGeminiKey(apiKey) {
  return callGemini(apiKey, "Reply with only: OK");
}

export async function generateGeminiResponse(apiKey, mode, note) {
  return callGemini(apiKey, buildPrompt(mode, note));
}