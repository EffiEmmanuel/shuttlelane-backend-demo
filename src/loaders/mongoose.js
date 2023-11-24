import * as mongoose from "mongoose";
import config from "../config/index.js";

const successMessage = "Successfully connected to the database";
const errorMessage =
  "An error occured while connecting to the database. Please restart the server and try again.";

export default async function mongooseLoader() {
  let connection;
  if (config.environment === "dev") {
    connection = await mongoose
      .connect(config.db.MONGO_URI_DEV, {
        UseNewUrlParser: true,
        UseUnifiedTopology: true,
      })
      .then((res) => {
        console.log(successMessage);
      })
      .catch((err) => {
        console.log(errorMessage);
      });
  } else if (config.environment === "prod") {
    connection = await mongoose
      .connect(config.db.MONGO_URI_PROD, {
        UseNewUrlParser: true,
        UseUnifiedTopology: true,
      })
      .then((res) => {
        console.log(successMessage);
      })
      .catch((err) => {
        console.log(errorMessage);
      });
  }
  return connection;
}
