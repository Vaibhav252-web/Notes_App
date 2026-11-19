import express from "express";
import userRouter from "./user.routes";
import noteRouter from "./note.routes";

const router = express.Router();

router.use("/user", userRouter);
router.use("/note", noteRouter);

export default router;
