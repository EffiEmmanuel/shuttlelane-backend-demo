import BlogModel from "../model/blog.model.js";
import BlogService from "../service/BlogService.js";

// Generic messages
const internalServerError =
  "An error occured while we processed your request. Please try again.";

// SERVICE INSTANCES
// Create a new blogService instance
const blogService = new BlogService(BlogModel);

// BLOG POSTS
// Get Blog Posts
export const fetchBlogPosts = async (req, res) => {
  try {
    // Fetch blog posts
    const response = await blogService.getBlogPosts();

    // Return a response
    return res.status(response?.status).json({
      blogPosts: response?.blogPosts ?? null,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get Blog Post
export const fetchBlogPost = async (req, res) => {
  try {
    // Fetch blog post
    const response = await blogService.getBlogPost(req.params?.slug);

    // Return a response
    return res.status(response?.status).json({
      blogPost: response?.blogPost ?? null,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};
