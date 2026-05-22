import { Link } from "react-router";
import { PlusIcon } from "lucide-react";

const Navbar = () => {
  return (
    <header className="navbar-shell">
      <div className="page-container py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">NotesHarbor</h1>
            <p className="text-sm text-slate-600">
              A calm space for capture, refine, and ship your ideas.
            </p>
          </div>
          <Link to={"/create"} className="primary-btn">
            <PlusIcon className="size-5" />
            <span>New Note</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
