import expressLoader from "./express.js";
import mongooseLoader from "./mongoose.js";

export default async function initLoaders(app) {
  const mongoConnection = await mongooseLoader();
  if (mongoConnection !== undefined) {
    console.log("Mongo initialized");
  }
  await expressLoader(app);
  console.log("Express initialized");
}
