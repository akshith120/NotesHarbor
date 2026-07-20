import { normalizeTag } from "../lib/utils";

const TagSelector = ({
  availableTags,
  selectedTags,
  onToggleTag,
  tagInput,
  setTagInput,
  onAddTag,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTag(tagInput);
    setTagInput("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {availableTags.length > 0 ? (
          availableTags.map((tag) => {
            const normalizedTag = normalizeTag(tag);
            const isSelected = selectedTags.includes(normalizedTag);

            return (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleTag(normalizedTag)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-200"
                    : "border-slate-200 bg-white text-slate-500 hover:border-emerald-200 hover:text-emerald-600"
                }`}
              >
                {tag}
              </button>
            );
          })
        ) : (
          <p className="text-sm text-slate-500">No tags yet. Add a few to build your chip library.</p>
        )}
      </div>

      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add a custom tag"
          className="field-input sm:flex-1"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
        />
        <button type="submit" className="primary-btn sm:w-auto">
          + Add
        </button>
      </form>
    </div>
  );
};

export default TagSelector;