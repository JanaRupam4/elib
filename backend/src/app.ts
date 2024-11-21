import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import globalErrorMiddleware from "./middlewares/globalError";
import { Config } from "./config/config";
import { userRouter } from "./routers/use.router";
import { bookRouter } from "./routers/book.router";

export const app = express();

const corsOptions = {
  origin: Config.CLIENT_URL, // specify allowed origins
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization", "x-custom-header"], // allowed headers
  credentials: true, // allows cookies to be sent with the request (if needed)
  preflightContinue: false, // pass preflight response to next handler
  optionsSuccessStatus: 204, // Successful preflight response (204 status code)
};
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes.", // Message when rate limit is exceeded
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiter globally to all routes

app.use(limiter);
app.use(express.json({ limit: "50mb" }));
app.use(helmet());
app.use(cors(corsOptions));
//custom router
app.use("/api/v1/user", userRouter);
app.use("/api/v1/book", bookRouter);
//attach global middleware
app.use(globalErrorMiddleware);
