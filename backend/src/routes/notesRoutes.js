import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getTags,
  getNoteById,
  updateNote,
} from "../controllers/notesController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/tags", getTags);
router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
