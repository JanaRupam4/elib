import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  comparePassword: (password: string) => Promise<boolean>;
  generateAccessToken: (id: string) => string;
}
