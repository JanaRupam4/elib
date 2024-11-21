import { config as Conf } from "dotenv";
Conf();

const _config = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGO_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  API_KEY: process.env.CLOUDINARY_API_KEY,
  API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
export const Config = Object.freeze(_config);
