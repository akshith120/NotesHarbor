import { Link } from "react-router";
import { MoonStarIcon, LogOutIcon, PlusIcon, SunMediumIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("notesharbor_theme") === "dark");

  useEffect(() => {
    document.body.dataset.theme = isDarkMode ? "dark" : "light";
    localStorage.setItem("notesharbor_theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

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
            <button type="button" className="ghost-btn" onClick={() => setIsDarkMode((current) => !current)}>
              {isDarkMode ? <SunMediumIcon className="size-5" /> : <MoonStarIcon className="size-5" />}
              <span>{isDarkMode ? "Light mode" : "Dark mode"}</span>
            </button>
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
