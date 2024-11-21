import { app } from "./src/app";
import { Config } from "./src/config/config";
import connectDB from "./src/config/db";

const startServer = async () => {
  try {
    await connectDB();
    const PORT = Config.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`The app is listning at port: ${PORT}`);
    });
  } catch (error) {
    console.log(`Failed to start the server:${error}`);
  }
};
startServer();
