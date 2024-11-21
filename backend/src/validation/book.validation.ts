import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().nonempty("Title is required"),
  genre: z.string().nonempty("Genre is required"),
});
