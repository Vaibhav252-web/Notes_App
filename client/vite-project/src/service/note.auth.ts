import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
}

export interface CreateNoteData {
  noteId: string;
}

export interface GetNotesByIdRequest {
  noteId: string;
}

export interface UpdateNoteRequest {
  noteId: string;
  title: string;
  content: string;
}

export interface DeleteNoteRequest {
  noteId: string;
}

export const notesApi = createApi({
  reducerPath: "notesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/note",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Notes"],
  endpoints: (builder) => ({
    // Get All Notes
    getAllNotes: builder.query<ApiResponse<{ getNotes: Note[] }>, void>({
      query: () => ({
        url: "/getAllNote",
        method: "GET",
      }),
      providesTags: ["Notes"],
    }),

    // Get Note By ID
    getNoteById: builder.query<ApiResponse<{ note: Note }>, GetNotesByIdRequest>({
      query: ({ noteId }) => ({
        url: `/getNoteById?noteId=${encodeURIComponent(noteId)}`,
        method: "GET",
      }),
      providesTags: ["Notes"],
    }),

    // Create Note
    createNote: builder.mutation<ApiResponse<CreateNoteData>, CreateNoteRequest>({
      query: (credentials) => ({
        url: "/createNote",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Notes"],
    }),

    // Update Note
    updateNote: builder.mutation<ApiResponse<{ updateNote: Note }>, UpdateNoteRequest>({
      query: (data) => ({
        url: "/updateNote",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Notes"],
    }),

    // Soft Delete Note
    deleteNote: builder.mutation<ApiResponse<{}>, DeleteNoteRequest>({
      query: (data) => ({
        url: "/deleteNote",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Notes"],
    }),
  }),
});

export const {
  useGetAllNotesQuery,
  useGetNoteByIdQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApi;