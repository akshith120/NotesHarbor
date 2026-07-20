import { ArrowLeftIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";
import TagSelector from "../components/TagSelector";
import { normalizeTag, normalizeTags } from "../lib/utils";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get("/notes/tags");
        setAvailableTags(res.data || []);
      } catch (error) {
        console.log("Error loading tags", error);
      }
    };

    fetchTags();
  }, []);

  const handleToggleTag = (tag) => {
    setSelectedTags((currentTags) =>
      currentTags.includes(tag) ? currentTags.filter((currentTag) => currentTag !== tag) : [...currentTags, tag]
    );
  };

  const handleAddTag = (value) => {
    const normalizedTag = normalizeTag(value);

    if (!normalizedTag) {
      return;
    }

    setAvailableTags((currentTags) => normalizeTags([...currentTags, normalizedTag]));
    setSelectedTags((currentTags) => normalizeTags([...currentTags, normalizedTag]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/notes", {
        title,
        content,
        tags: selectedTags,
      });

      toast.success("Note created successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error creating note", error);
      if (error.response.status === 429) {
        toast.error("Slow down! You're creating notes too fast", {
          duration: 4000,
          icon: "💀",
        });
      } else {
        toast.error("Failed to create note");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="page-container py-10">
        <div className="max-w-3xl">
          <Link to={"/"} className="ghost-btn mb-6 inline-flex">
            <ArrowLeftIcon className="size-5" />
            Back to Notes
          </Link>

          <div className="panel p-6 sm:p-8">
            <h2 className="text-3xl font-semibold text-slate-900">Create a new note</h2>
            <p className="mt-2 text-sm text-slate-600">
              Keep it short or write a manifesto. Every idea belongs here.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="field-label">Title</label>
                <input
                  type="text"
                  placeholder="Note title"
                  className="field-input mt-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="field-label">Content</label>
                <textarea
                  placeholder="Write your note here..."
                  className="field-input mt-2 min-h-[180px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div>
                <label className="field-label">Tags</label>
                <p className="mt-2 text-xs text-slate-500">
                  Click a chip to select it, or add a new custom tag below.
                </p>
                <div className="mt-4">
                  <TagSelector
                    availableTags={availableTags}
                    selectedTags={selectedTags}
                    onToggleTag={handleToggleTag}
                    tagInput={tagInput}
                    setTagInput={setTagInput}
                    onAddTag={handleAddTag}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="primary-btn" disabled={loading}>
                  {loading ? "Creating..." : "Create Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePage;
