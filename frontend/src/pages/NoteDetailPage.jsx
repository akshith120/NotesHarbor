import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState("");

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
        setTagsInput((res.data.tags || []).join(", "));
      } catch (error) {
        console.log("Error in fetching note", error);
        toast.error("Failed to fetch the note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/");
    } catch (error) {
      console.log("Error deleting the note:", error);
      toast.error("Failed to delete note");
    }
  };

  const parseTags = (value) => {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  };

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Please add a title or content");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, {
        ...note,
        tags: parseTags(tagsInput),
      });
      toast.success("Note updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error saving the note:", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="panel flex items-center gap-3 px-6 py-4">
          <LoaderIcon className="animate-spin size-6 text-emerald-600" />
          <span className="text-sm font-semibold text-slate-700">Loading note...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="page-container py-10">
        <div className="max-w-3xl">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/" className="ghost-btn">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>
            <button onClick={handleDelete} className="danger-btn">
              <Trash2Icon className="h-5 w-5" />
              Delete Note
            </button>
          </div>

          <div className="panel p-6 sm:p-8">
            <h2 className="text-3xl font-semibold text-slate-900">Edit note</h2>
            <p className="mt-2 text-sm text-slate-600">Refine your idea and keep it sharp.</p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="field-label">Title</label>
                <input
                  type="text"
                  placeholder="Note title"
                  className="field-input mt-2"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
              </div>

              <div>
                <label className="field-label">Content</label>
                <textarea
                  placeholder="Write your note here..."
                  className="field-input mt-2 min-h-[200px]"
                  value={note.content}
                  onChange={(e) => setNote({ ...note, content: e.target.value })}
                />
              </div>

              <div>
                <label className="field-label">Tags</label>
                <input
                  type="text"
                  placeholder="design, product, meetings"
                  className="field-input mt-2"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
                <p className="mt-2 text-xs text-slate-500">
                  Separate tags with commas so you can filter later.
                </p>
              </div>

              <div className="flex justify-end">
                <button className="primary-btn" disabled={saving} onClick={handleSave}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NoteDetailPage;
