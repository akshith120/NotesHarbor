import Note from "../models/Note.js";

function normalizeTags(input) {
  if (!input) return [];

  const rawTags = Array.isArray(input)
    ? input
    : typeof input === "string"
      ? input.split(",")
      : [];

  const normalized = rawTags
    .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
    .filter(Boolean)
    .map((tag) => tag.toLowerCase());

  return [...new Set(normalized)].slice(0, 12);
}

export async function getAllNotes(req, res) {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 }); // -1 will sort in desc. order (newest first)
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getNoteById(req, res) {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: "Note not found!" });
    res.json(note);
  } catch (error) {
    console.error("Error in getNoteById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content, tags } = req.body;
    const note = new Note({ title, content, tags: normalizeTags(tags), userId: req.user.id });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error in createNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateNote(req, res) {
  try {
    const { title, content, tags } = req.body;
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, content, tags: normalizeTags(tags) },
      {
        new: true,
      }
    );

    if (!updatedNote) return res.status(404).json({ message: "Note not found" });

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in updateNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteNote(req, res) {
  try {
    const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedNote) return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getTags(req, res) {
  try {
    const tags = await Note.distinct("tags", { userId: req.user.id });
    res.status(200).json(tags.sort());
  } catch (error) {
    console.error("Error in getTags controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
