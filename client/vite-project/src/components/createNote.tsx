import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  TextareaAutosize,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useCreateNoteMutation } from "../service/note.auth";

type CreateNoteProps = {
  onCreated?: () => void;
};

const CreateNote = ({ onCreated }: CreateNoteProps) => {
  const [data, setData] = useState({
    title: "",
    content: "",
  });
  const [successMsg, setSuccessMsg] = useState("");

  const [createNote, { isLoading: isCreating, error: createError }] =
    useCreateNoteMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data.title.trim() || !data.content.trim()) {
      return;
    }

    try {
      const response = await createNote(data).unwrap();
      if (response.success) {
        setSuccessMsg("Note created successfully!");
        setData({ title: "", content: "" });
        setTimeout(() => {
          setSuccessMsg("");
          onCreated?.(); // jump to the "All Notes" tab
        }, 800);
      }
    } catch (err) {
      console.error("Note creation failed:", err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 65px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        p: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 800 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Create Note
          </Typography>

          {successMsg && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMsg}
            </Alert>
          )}

          {createError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {(createError as any)?.data?.message || "Failed to create note"}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 2,
            }}
          >
            <TextField
              fullWidth
              type="text"
              label="Enter the title"
              value={data.title}
              onChange={(e) =>
                setData({
                  ...data,
                  title: e.target.value,
                })
              }
              required
            />

            <TextareaAutosize
              minRows={8}
              placeholder="Write your note..."
              value={data.content}
              onChange={(e) =>
                setData({
                  ...data,
                  content: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                fontFamily: "inherit",
                borderRadius: "4px",
                border: "1px solid #ccc",
                resize: "vertical",
                boxSizing: "border-box",
              }}
              required
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateNote;