import mongoose from "mongoose";
import { INote } from "../types/DB/note";

const notesSchema = new mongoose.Schema<INote>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Notes = mongoose.model<INote>("Notes", notesSchema);

export default Notes;
