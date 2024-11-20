import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./db/index.js";

const port = process.env.PORT || 8001;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at ${port}`);
    });
  })
  .catch((error) => {
    console.log(`MongoDB connection failed `, error);
  });
