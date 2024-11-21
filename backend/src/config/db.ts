import mongoose from "mongoose";
import { Config } from "./config";
import { DB_NAME } from "../../constant";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connection successfull.");
    });
    mongoose.connection.on("error", () => {
      console.log("Can't able connect with database. ");
    });
    mongoose.connection.on("disconnected", () => {
      console.log("Database disconnected successfully.");
    });
    await mongoose
      .connect(`${Config.DB_URL}/${DB_NAME}`)
      .then((data) => console.log(`Connection host: ${data.connection.host}`));
  } catch (error) {
    console.log(`Failed to connect with database: ${error}`);
    setTimeout(connectDB, 5000);
    process.exit(1);
  }
};
export default connectDB;
