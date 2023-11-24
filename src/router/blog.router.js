import express from "express";
import { verifyUserToken } from "../util/auth.helper.js";
import {
  fetchBlogPost,
  fetchBlogPosts,
} from "../controller/blog.controller.js";

const blogRouter = express.Router();

// Routes
// Get blog posts
blogRouter.get("/", fetchBlogPosts);
// Get blog post by slug
blogRouter.get("/:slug", fetchBlogPost);

export default blogRouter;
