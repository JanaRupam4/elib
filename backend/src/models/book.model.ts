import mongoose, { Schema } from "mongoose";
import { IBook } from "../types/book.types";
import mongoosePaginate from "mongoose-paginate-v2";
const bookSchema: Schema<IBook> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
bookSchema.plugin(mongoosePaginate);
const Book = mongoose.model<IBook, mongoose.PaginateModel<IBook>>(
  "Book",
  bookSchema
);

export { Book };
