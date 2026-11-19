import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import {
  useDeleteNoteMutation,
  useGetAllNotesQuery,
  useUpdateNoteMutation,
  type Note,
} from "../service/note.auth";

const AllNotes = () => {
  const { data, isLoading, isError, error, refetch } = useGetAllNotesQuery(
    undefined,
    { refetchOnMountOrArgChange: true }, // always fetch fresh notes when tab opens
  );
  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();
  const [updateNote, { isLoading: isUpdating, error: updateError }] =
    useUpdateNoteMutation();

  const [editing, setEditing] = useState<Note | null>(null);

  const notes = data?.data?.getNotes ?? [];

  const handleDelete = async (noteId: string) => {
    try {
      await deleteNote({ noteId }).unwrap();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleUpdate = async () => {
    if (!editing) return;
    try {
      await updateNote({
        noteId: editing._id,
        title: editing.title,
        content: editing.content,
      }).unwrap();
      setEditing(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "calc(100vh - 65px)" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">All Notes</Typography>
        <Button variant="outlined" onClick={() => refetch()}>
          Refresh
        </Button>
      </Box>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error">
          {(error as any)?.data?.message || "Failed to load notes"}
        </Alert>
      )}

      {!isLoading && !isError && notes.length === 0 && (
        <Typography color="text.secondary">
          No notes yet. Create one from the "Create Notes" tab.
        </Typography>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 2,
        }}
      >
        {notes.map((note) => (
          <Card key={note._id} sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                {note.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                {note.content}
              </Typography>
              {note.createdAt && (
                <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: "block" }}>
                  {new Date(note.createdAt).toLocaleString()}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => setEditing(note)}>
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                disabled={isDeleting}
                onClick={() => handleDelete(note._id)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Dialog open={!!editing} onClose={() => setEditing(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Note</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          {updateError && (
            <Alert severity="error">
              {(updateError as any)?.data?.message || "Failed to update note"}
            </Alert>
          )}
          <TextField
            label="Title"
            value={editing?.title ?? ""}
            onChange={(e) => editing && setEditing({ ...editing, title: e.target.value })}
            fullWidth
            sx={{ mt: 1 }}
          />
          <TextField
            label="Content"
            value={editing?.content ?? ""}
            onChange={(e) => editing && setEditing({ ...editing, content: e.target.value })}
            multiline
            minRows={5}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllNotes;
