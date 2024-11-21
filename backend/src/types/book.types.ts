import { Document } from "mongoose";
import { IUser } from "./user.types";

export interface IBook extends Document {
  title: string;
  author: IUser;
  genre: string;
  coverImage: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
}
