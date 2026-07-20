import api from "./axios";

export async function testGeminiKey(apiKey) {
  const response = await api.post("/gemini/verify", { apiKey });
  return response.data?.result || "OK";
}

export async function generateGeminiResponse(apiKey, mode, note) {
  const response = await api.post("/gemini/assist", { apiKey, mode, note });
  return response.data?.result || "No response returned";
}