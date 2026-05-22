import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";

const NoteCard = ({ note, setNotes }) => {
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

  return (
    <Link
      to={`/note/${note._id}`}
      className="note-card group"
    >
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        <span className="flex items-center gap-2">
          <PenSquareIcon className="size-4 text-emerald-500" />
          Note
        </span>
        <span>{formatDate(new Date(note.createdAt))}</span>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <h3 className="text-2xl font-semibold text-slate-900">{note.title}</h3>
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
          <span className="text-xs font-semibold text-emerald-600">Open note</span>
          <button
            className="inline-flex items-center justify-center rounded-full border border-transparent bg-red-50 p-2 text-red-500 transition hover:border-red-200"
            onClick={(e) => handleDelete(e, note._id)}
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>
      </div>
    </Link>
  );
};
export default NoteCard;
