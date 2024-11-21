import { v2 as Cloudinary } from "cloudinary";
import { Config } from "./config";

Cloudinary.config({
  cloud_name: Config.CLOUD_NAME,
  api_key: Config.API_KEY,
  api_secret: Config.API_SECRET,
});
export default Cloudinary;
