import { z } from "zod";

const userRegisterZodSchema = z.object({
  name: z.string().min(1, "Name is required.").trim(),

  email: z
    .string()
    .email("Invalid email format.")
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format."),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters.")
    .regex(
      /(?=.*[a-z])/,
      "Password must contain at least one lowercase letter."
    )
    .regex(
      /(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter."
    )
    .regex(/(?=.*\d)/, "Password must contain at least one number.")
    .regex(
      /(?=.*[@$!%*?&])/,
      "Password must contain at least one special character."
    ),
});
const userLoginZodSchema = z.object({
  email: z.string().email("Invalid email format."), // Zod's .email() handles format validation

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters.")
    .regex(
      /(?=.*[a-z])/,
      "Password must contain at least one lowercase letter."
    )
    .regex(
      /(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter."
    )
    .regex(/(?=.*\d)/, "Password must contain at least one number.")
    .regex(
      /(?=.*[@$!%*?&])/,
      "Password must contain at least one special character."
    ),
});

export { userRegisterZodSchema, userLoginZodSchema };
