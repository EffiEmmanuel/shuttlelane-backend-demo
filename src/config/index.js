import * as dotenv from "dotenv";
dotenv.config();

export default {
  db: {
    MONGO_URI_DEV: process.env.MONGO_URI_DEV,
    MONGO_URI_PROD: process.env.MONGO_URI_PROD,
  },
  server: {
    port: process.env.PORT || 8080,
  },
  environment: process.env.ENVIRONMENT,
  jwt: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
};
