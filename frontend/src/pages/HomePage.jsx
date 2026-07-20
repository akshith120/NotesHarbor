import { useState } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import { useEffect } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";
import GeminiSettingsCard from "../components/GeminiSettingsCard";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [tagQuery, setTagQuery] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        console.log(res.data);
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching notes");
        console.log(error.response);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const tagFilters = tagQuery
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  const filteredNotes = notes.filter((note) => {
    const title = note.title?.toLowerCase() || "";
    const content = note.content?.toLowerCase() || "";
    const tags = (note.tags || []).map((tag) => tag.toLowerCase());

    const matchesQuery =
      !normalizedQuery ||
      title.includes(normalizedQuery) ||
      content.includes(normalizedQuery) ||
      tags.some((tag) => tag.includes(normalizedQuery));

    const matchesTags =
      tagFilters.length === 0 ||
      tagFilters.every((filterTag) => tags.some((tag) => tag.includes(filterTag)));

    return matchesQuery && matchesTags;
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="page-container pb-16">
        <section className="pt-10 pb-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="panel p-6 sm:p-8">
              <span className="pill">Your workspace</span>
              <h2 className="mt-5 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                Write fast. Think clearer.
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-slate-600">
                Capture the spark, shape it into something meaningful, and keep every thought easy to
                find. NotesHarbor keeps your notes calm, clean, and ready for action.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-3xl border border-slate-200/80 bg-white/80 px-5 py-4 shadow-sm">
                  <p className="text-sm text-slate-500">Total notes</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {notes.length} {notes.length === 1 ? "note" : "notes"}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200/80 bg-white/80 px-5 py-4 shadow-sm">
                  <p className="text-sm text-slate-500">Tag library</p>
                  <p className="text-2xl font-semibold text-slate-900">Saved chips</p>
                </div>
              </div>
            </div>

            <GeminiSettingsCard />
          </div>
        </section>

        {isRateLimited && <RateLimitedUI />}

        <section className="panel p-6 sm:p-8">
          <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Your notes</h3>
              <p className="text-sm text-slate-500">
                Showing {filteredNotes.length} of {notes.length}
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
              <input
                type="text"
                placeholder="Search title, content, or tags"
                className="field-input md:w-72"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <input
                type="text"
                placeholder="Filter tags (comma-separated)"
                className="field-input md:w-64"
                value={tagQuery}
                onChange={(e) => setTagQuery(e.target.value)}
              />
            </div>
          </div>
          {loading && (
            <div className="text-center text-sm font-semibold text-emerald-600 py-12">
              Loading notes...
            </div>
          )}

          {notes.length === 0 && !isRateLimited && <NotesNotFound />}

          {notes.length > 0 && filteredNotes.length === 0 && !isRateLimited && !loading && (
            <div className="py-10 text-center text-sm text-slate-500">
              No notes match your search yet.
            </div>
          )}

          {filteredNotes.length > 0 && !isRateLimited && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((note) => (
                <NoteCard key={note._id} note={note} setNotes={setNotes} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
export default HomePage;
