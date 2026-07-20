import { ChevronDownIcon, Loader2Icon, PenSquareIcon, SparklesIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { generateGeminiResponse } from "../lib/gemini";

const NoteCard = ({ note, setNotes }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedAiMode, setSelectedAiMode] = useState("");
  const [runningAi, setRunningAi] = useState(false);
  const [aiResult, setAiResult] = useState("");

  const handleDelete = async (e, id) => {
    e.preventDefault(); // get rid of the navigation behaviour

    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id)); // get rid of the deleted one
      toast.success("Note deleted successfully");
    } catch (error) {
      console.log("Error in handleDelete", error);
      toast.error("Failed to delete note");
    }
  };

  const runAiAssist = async () => {
    const apiKey = localStorage.getItem("notesharbor_gemini_key");

    if (!apiKey) {
      toast.error("Add your Gemini API key in Settings first");
      return;
    }

    if (!selectedAiMode) {
      toast.error("Choose Summarize or Key Takeaways first");
      return;
    }

    setRunningAi(true);

    try {
      const response = await generateGeminiResponse(apiKey, selectedAiMode, note);
      setAiResult(response);
      setMenuOpen(false);
    } catch (error) {
      if (error.status === 429) {
        toast.error("Gemini rate limit reached. Try again later.");
      } else {
        toast.error(error.message || "Failed to generate AI assist output");
      }
    } finally {
      setRunningAi(false);
    }
  };

  return (
    <div className="note-card group">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        <span className="flex items-center gap-2">
          <PenSquareIcon className="size-4 text-emerald-500" />
          Note
        </span>
        <span>{formatDate(new Date(note.createdAt))}</span>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <Link to={`/note/${note._id}`} className="block">
          <h3 className="text-2xl font-semibold text-slate-900 transition group-hover:text-emerald-600">{note.title}</h3>
        </Link>
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <span key={tag} className="tag-chip">
                {tag}
              </span>
            ))}
          </div>
        )}
        <p className="text-sm leading-relaxed text-slate-600 line-clamp-4">{note.content}</p>
        <div className="flex items-center justify-between pt-2">
          <Link to={`/note/${note._id}`} className="text-xs font-semibold text-emerald-600">
            Open note
          </Link>
          <div className="flex items-center gap-2">
            <div className="relative" onClick={(e) => e.preventDefault()}>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600"
                onClick={() => setMenuOpen((current) => !current)}
              >
                <SparklesIcon className="size-4" />
                AI Assist
                <ChevronDownIcon className="size-4" />
              </button>

              {menuOpen && (
                <div className="absolute bottom-full right-0 z-20 mb-2 w-72 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Choose action</p>
                  <div className="mt-3 space-y-2">
                    {[
                      ["summarize", "Summarize"],
                      ["takeaways", "Key Takeaways"],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                          selectedAiMode === value
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-emerald-200"
                        }`}
                        onClick={() => setSelectedAiMode(value)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="primary-btn mt-4 w-full"
                    onClick={runAiAssist}
                    disabled={runningAi}
                  >
                    {runningAi ? <Loader2Icon className="size-4 animate-spin" /> : <SparklesIcon className="size-4" />}
                    {runningAi ? "Generating..." : "Confirm & Run"}
                  </button>
                </div>
              )}
            </div>

            <button
              className="inline-flex items-center justify-center rounded-full border border-transparent bg-red-50 p-2 text-red-500 transition hover:border-red-200"
              onClick={(e) => handleDelete(e, note._id)}
              type="button"
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>

        {aiResult && (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm leading-relaxed text-slate-700">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">AI result</p>
            <p className="mt-3 whitespace-pre-wrap">{aiResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default NoteCard;
