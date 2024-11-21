import { Router } from "express";
import multer from "multer";
import path from "node:path";
import authenticated from "../middlewares/auth";
import {
  createBook,
  deleteBook,
  getSingleBook,
  listBooks,
  updateBook,
} from "../controllers/book.controller";
import validateWithZod from "../middlewares/zodSchemaValidator";
import { bookSchema } from "../validation/book.validation";

export const bookRouter = Router();
const upload = multer({
  dest: path.resolve(__dirname + "../../../public/data/upload"),
  limits: { fileSize: 3e7 },
});
bookRouter.route("/").post(
  authenticated,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  validateWithZod(bookSchema),
  createBook
);
bookRouter.route("/:bookId").patch(
  authenticated,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  validateWithZod(bookSchema),
  updateBook
);
bookRouter.route("/").get(listBooks);
bookRouter.route("/:bookId").get(getSingleBook);
bookRouter.route("/:bookId").delete(deleteBook);
