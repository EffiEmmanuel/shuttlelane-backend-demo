import dotenv from "dotenv";
dotenv.config();
import express from "express";
import config from "./config/index.js";
import routes from "./routes.js";
import initLoaders from "./loaders/index.js";
import userRouter from "./router/user.router.js";
import authRouter from "./router/auth.router.js";
import adminRouter from "./router/admin.router.js";
import bookingRouter from "./router/booking.router.js";
import vehicleClassRouter from "./router/vehicleClass.router.js";
import carRouter from "./router/car.router.js";
import priorityPassRouter from "./router/priorityPass.router.js";
import blogRouter from "./router/blog.router.js";
import cityRouter from "./router/city.router.js";
// iscD1lQF1aB7gDxy

async function startServer() {
  const app = express();
  // Express middlewares
  await initLoaders(app);

  // Routes
  app.use(routes.API_AUTH_PREFIX, authRouter); // auth router
  app.use(routes.API_USER_ROUTE, userRouter); // user router
  app.use(routes.API_ADMIN_ROUTE, adminRouter); // admin router
  app.use(routes.API_BOOKING_ROUTE, bookingRouter); // booking router
  app.use(routes.API_VEHICLE_CLASS_ROUTE, vehicleClassRouter); // vehicle class router
  app.use(routes.API_CARS_ROUTE, carRouter); // cars router
  app.use(routes.API_PASS_ROUTE, priorityPassRouter); // passes router
  app.use(routes.API_BLOG_ROUTE, blogRouter); // blog router
  app.use(routes.API_CITY_ROUTE, cityRouter); // city router

  app.listen(config.server.port, () => {
    console.log(`Server listening on port ${config.server.port}`);
  });
}

// Starting up the server
startServer();
