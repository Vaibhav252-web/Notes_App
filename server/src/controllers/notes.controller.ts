import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Notes from "../models/notes.model";
import { TryCatch, Success } from "../utils/helper";
import ErrorHandler from "../utils/ErrorHandler";
import {
  DeleteRequest,
  GetNotesByIdRequest,
  NoteRequest,
  UpdateRequset,
} from "../types/API/note";

const getAllNote = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const getNotes = await Notes.find({ isDeleted: false }).sort({
      createdAt: -1,
    });

    Success(res, 200, "Here all your notes", { getNotes });
  },
);

const getNotesById = TryCatch(
  async (
    req: Request<{}, {}, {}, GetNotesByIdRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    const { noteId } = req.query;

    if (!noteId) {
      return next(new ErrorHandler("Note ID is required", 400));
    }

    if (!mongoose.isValidObjectId(noteId)) {
      return next(new ErrorHandler("Invalid note ID", 400));
    }

    const note = await Notes.findOne({ _id: noteId, isDeleted: false });

    if (!note) {
      return next(new ErrorHandler("Note not found", 404));
    }

    Success(res, 200, "Here your note", { note });
  },
);

const createNote = TryCatch(
  async (
    req: Request<{}, {}, NoteRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    const { title, content } = req.body ?? {};

    if (!title?.trim() || !content?.trim()) {
      return next(new ErrorHandler("Enter the fields", 400));
    }

    const newNote = await Notes.create({
      title: title.trim(),
      content: content.trim(),
    });

    Success(res, 201, "Note created sucessfully", {
      noteId: newNote._id,
      note: newNote,
    });
  },
);

const updateNote = TryCatch(
  async (
    req: Request<{}, {}, UpdateRequset>,
    res: Response,
    next: NextFunction,
  ) => {
    const { noteId, title, content } = req.body;
    if (!title || !content) {
      return next(new ErrorHandler("Enter the fields", 400));
    }

    if (!noteId) {
      return next(new ErrorHandler("Note ID is required", 400));
    }

    if (!mongoose.isValidObjectId(noteId)) {
      return next(new ErrorHandler("Invalid note ID", 400));
    }

    const note = await Notes.findOne({ _id: noteId, isDeleted: false });

    if (!note) {
      return next(new ErrorHandler("Note not found", 404));
    }

    const updateNote = await Notes.findByIdAndUpdate(
      noteId,
      {
        title: title,
        content: content,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updateNote) {
      return next(new ErrorHandler("Note is not updated", 400));
    }

    Success(res, 200, "Note is updated", { updateNote });
  },
);

const deleteNote = TryCatch(
  async (
    req: Request<{}, {}, DeleteRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    const { noteId } = req.body;

    if (!noteId) {
      return next(new ErrorHandler("Note ID is required", 400));
    }

    if (!mongoose.isValidObjectId(noteId)) {
      return next(new ErrorHandler("Invalid note ID", 400));
    }

    const note = await Notes.findOne({ _id: noteId, isDeleted: false });

    if (!note) {
      return next(new ErrorHandler("Note not found", 404));
    }

    const noteDelete = await Notes.findByIdAndUpdate(
      noteId,
      {
        isDeleted: true,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!noteDelete) {
      return next(new ErrorHandler("Note is not updated", 400));
    }

    Success(res, 200, "Note is deleted", {});
  },
);

export const notesController = {
  createNote,
  updateNote,
  deleteNote,
  getAllNote,
  getNotesById,
};
