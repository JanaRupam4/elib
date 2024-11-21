import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import path from "node:path";
import fs from "node:fs";
import { asyncHandler } from "../middlewares/asyncHandler";
import Cloudinary from "../config/cloudinary";
import { AuthRequest } from "../middlewares/auth";
import { Book } from "../models/book.model";
import ApiResponse from "../utils/ApiResponse";

interface BookBody {
  title: string;
  genre: string;
}
//create book
export const createBook = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, genre } = req.body as BookBody;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Handling `coverImage` and `file` fields separately
      const coverImageFile = files.coverImage[0];
      const bookFile = files.file[0];

      // Extract MIME types and filenames
      const coverImageMimeType = coverImageFile.mimetype.split("/").at(-1);
      const coverFileName = coverImageFile.filename;
      const coverFilePath = path.resolve(
        __dirname,
        "../../public/data/upload",
        coverFileName
      );

      const fileMimeType = bookFile.mimetype.split("/").at(-1);
      const fileName = bookFile.filename;
      const filePath = path.resolve(
        __dirname,
        "../../public/data/upload",
        fileName
      );

      try {
        // Upload cover image to Cloudinary
        const uploadCoverImageResult = await Cloudinary.uploader.upload(
          coverFilePath,
          {
            folder: "coverImage",
            filename_override: coverFileName,
            format: coverImageMimeType,
          }
        );

        // Upload file to Cloudinary
        const uploadFileResult = await Cloudinary.uploader.upload(filePath, {
          resource_type: "raw",
          folder: "File",
          filename_override: fileName,
          format: fileMimeType,
        });

        const _req = req as AuthRequest;
        const newBook = await Book.create({
          title,
          genre,
          author: _req.userId,
          coverImage: uploadCoverImageResult.secure_url,
          file: uploadFileResult.secure_url,
        });

        // Clean up uploaded files from the local storage
        await fs.promises.unlink(coverFilePath);
        await fs.promises.unlink(filePath);

        res
          .status(201)
          .json(new ApiResponse(200, "Book created", { id: newBook._id }));
      } catch (error: any) {
        console.error("File upload error:", error); // Log the full error object
        return next(
          createHttpError(
            500,
            `Unable to upload files: ${error.message || JSON.stringify(error)}`
          )
        );
      }
    } catch (error) {
      console.error("Book creation error:", error); // Log the full error object
      return next(createHttpError(500, "Failed to create new book"));
    }
  }
);
//update book
export const updateBook = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, genre } = req.body as BookBody;
      const { bookId } = req.params;
      const book = await Book.findOne({ _id: bookId });
      if (!book) {
        return next(createHttpError(400, "Can't find the book."));
      }
      const _req = req as AuthRequest;
      if (book.author.toString() !== _req.userId) {
        return next(
          createHttpError(400, "You are not able to update the book content.")
        );
      }
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      let completeCoverImage = "";
      if (files.coverImage) {
        const coverFileName = files.coverImage[0].filename;
        const coverFileMimeType = files.coverImage[0].mimetype
          .split("/")
          .at(-1);
        const filePath = path.resolve(
          __dirname,
          "../../public/data/upload",
          coverFileName
        );
        completeCoverImage = filePath;
        const uploadResult = await Cloudinary.uploader.upload(filePath, {
          filename_override: completeCoverImage,
          folder: "coverImage",
          format: coverFileMimeType,
        });
        completeCoverImage = uploadResult.secure_url;
        await fs.promises.unlink(filePath);
      }
      let completeFileName = "";
      if (files.file) {
        const fileName = files.file[0].filename;
        const fileMimeType = files.file[0].mimetype.split("/").at(-1);
        const filePath = path.resolve(
          __dirname,
          "../../public/data/upload",
          fileName
        );
        completeFileName = filePath;
        const uploadResult = await Cloudinary.uploader.upload(filePath, {
          resource_type: "raw",
          filename_override: completeFileName,
          folder: "File",
          format: fileMimeType,
        });
        completeFileName = uploadResult.secure_url;
        await fs.promises.unlink(filePath);
      }
      const updatedBook = await Book.findByIdAndUpdate(
        { _id: book._id },
        {
          title,
          genre,
          coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
          file: completeFileName ? completeFileName : book.file,
        },
        { new: true }
      );
      res.status(200).json(new ApiResponse(200, "Book Updated", updatedBook));
    } catch (error) {
      return next(createHttpError(500, `Failed to updated the book: ${error}`));
    }
  }
);
//list all books
export const listBooks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      // Using mongoose-paginate-v2
      const result = await Book.paginate({}, { page, limit });
      res.status(200).json({
        books: result.docs,
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalBooks: result.totalDocs,
          limit: result.limit,
        },
      });
    } catch (error) {
      return next(createHttpError(500, "Error while getting a book"));
    }
  }
);
//get single book
export const getSingleBook = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId = req.params.bookId;
      const book = await Book.findById({ _id: bookId });
      res.status(200).json(new ApiResponse(200, "Book Found", book));
    } catch (error) {
      return next(createHttpError(500, `Unable to find the book: ${error}`));
    }
  }
);
export const deleteBook = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookId } = req.params;
      const book = await Book.findById({ _id: bookId });
      if (!book) {
        return next(createHttpError(400, "Book not found"));
      }
      const _req = req as AuthRequest;
      if (book.author.toString() !== _req.userId) {
        return next(
          createHttpError(400, "You are not able to delete this book.")
        );
      }
      const coverFileSplits = book.coverImage.split("/");
      const coverPublicId =
        coverFileSplits.at(-2) +
        "/" +
        coverFileSplits.at(-1)?.split(".").at(-2);
      const fileSplits = book.file.split("/");
      const filePublicId = fileSplits.at(-2) + "/" + coverFileSplits.at(-1);
      await Cloudinary.uploader.destroy(coverPublicId);
      await Cloudinary.uploader.destroy(filePublicId, { resource_type: "raw" });
      await Book.deleteOne({ _id: bookId });
      res.status(204).json({ message: "Delete the book successfully" });
    } catch (error) {
      return next(createHttpError(500, "Unable to delete the book."));
    }
  }
);
