export type NoteRequest = {
  title: string;
  content: string;
};

export type UpdateRequset = {
  noteId: string;
  title: string;
  content: string;
};

export type DeleteRequest = {
  noteId: string;
};

export type GetNotesByIdRequest = {
  noteId: string;
};
