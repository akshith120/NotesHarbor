import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { testGeminiKey } from "../lib/gemini";

const STORAGE_KEY = "notesharbor_gemini_key";

const GeminiSettingsCard = () => {
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    setApiKey(localStorage.getItem(STORAGE_KEY) || "");
  }, []);

  const handleSaveAndTest = async () => {
    const trimmedKey = apiKey.trim();

    if (!trimmedKey) {
      setStatus({ type: "error", message: "Add your Gemini API key first." });
      return;
    }

    setTesting(true);
    setStatus(null);

    try {
      await testGeminiKey(trimmedKey);
      localStorage.setItem(STORAGE_KEY, trimmedKey);
      setStatus({ type: "success", message: "Gemini key verified and saved locally." });
      toast.success("Gemini key saved");
    } catch (error) {
      const status = error.response?.status;

      if (status === 401 || status === 403) {
        setStatus({ type: "error", message: "That key was rejected. Check the API key and permissions." });
      } else if (status === 429) {
        setStatus({ type: "error", message: "Gemini rate limit reached. Try again later." });
      } else if (status === 400) {
        setStatus({ type: "error", message: error.response?.data?.message || "Enter a valid Gemini API key." });
      } else {
        setStatus({ type: "error", message: error.response?.data?.message || "Could not verify the Gemini key right now." });
      }
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="panel p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="pill">Settings</span>
          <h3 className="mt-4 text-2xl font-semibold text-slate-900">Gemini BYOK</h3>
          <p className="mt-2 text-sm text-slate-600">
            Save your Google Gemini key locally to unlock on-demand AI summaries and key takeaways.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <input
          type="password"
          placeholder="Paste your Gemini API key"
          className="field-input"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />

        <button type="button" className="primary-btn w-full" onClick={handleSaveAndTest} disabled={testing}>
          {testing ? "Saving & testing..." : "Save & Test Key"}
        </button>

        {status && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
              status.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiSettingsCard;