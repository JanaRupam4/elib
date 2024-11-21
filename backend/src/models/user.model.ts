import { model, models, Schema } from "mongoose";
import { IUser } from "../types/user.types";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { Config } from "../config/config";
const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v: string) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); // Basic email regex
        },
        message: (props: any) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            v
          );
        },
        message:
          "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.",
      },
    },
  },
  { timestamps: true }
);

//methods
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const saltRounds = 10;
    this.password = await bcryptjs.hash(this.password, saltRounds);
    next();
  } catch (error: any) {
    next(error);
  }
});
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcryptjs.compare(password, this.password);
};
//assign token
userSchema.methods.generateAccessToken = function (id: string): string {
  return jwt.sign({ sub: id }, Config.JWT_SECRET!, { expiresIn: "7d" });
};

export const User = models.User || model<IUser>("User", userSchema);
