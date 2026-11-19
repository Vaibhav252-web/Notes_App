import { Document } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
