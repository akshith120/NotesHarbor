import { Link } from "react-router";
import { LogOutIcon, PlusIcon } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {user && (
              <div className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600">
                Signed in as <span className="font-semibold text-slate-900">{user.username}</span>
              </div>
            )}
            <Link to={"/create"} className="primary-btn">
              <PlusIcon className="size-5" />
              <span>New Note</span>
            </Link>
            <button type="button" className="ghost-btn" onClick={logout}>
              <LogOutIcon className="size-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
