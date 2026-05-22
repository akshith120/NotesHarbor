import { NotebookIcon } from "lucide-react";
import { Link } from "react-router";

const NotesNotFound = () => {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center gap-6 py-10 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600">
        <NotebookIcon className="size-9" />
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">No notes yet</h3>
        <p className="mt-2 text-sm text-slate-600">
          Capture your first idea and let NotesHarbor organize it into something memorable.
        </p>
      </div>
      <Link to="/create" className="primary-btn">
        Create your first note
      </Link>
    </div>
  );
};
export default NotesNotFound;
