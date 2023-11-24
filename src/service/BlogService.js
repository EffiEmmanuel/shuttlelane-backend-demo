import { validateFields } from "../util/auth.helper.js";
import { generateSlug } from "../util/index.js";

export default class BlogService {
  constructor(ShuttlelaneBlogModel) {
    this.BlogModel = ShuttlelaneBlogModel;
  }

  // This service CREATES a new blog post
  async createBlogPost(image, title, content, adminId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([image, title, content, adminId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Generate the slug here
    const slug = generateSlug(title);

    // Check if any posts exists with the same slug
    const slugExists = await this.BlogModel.findOne({
      slug,
    });

    if (slugExists) {
      return {
        status: 409,
        message:
          "A blog already exists with the same title / post slug. Try modifying the blog post title to fix this problem.",
      };
    }

    const newPost = await this.BlogModel.create({
      image,
      title,
      content,
      slug,
      author: adminId,
    });

    // Fetch all blogPosts (So the frontend can be update without having to refresh the page & to prevent making another request to get them)
    const blogPosts = await this.BlogModel.find()
      .sort({ createdAt: -1 })
      .populate("author");

    return {
      status: 201,
      message: `Blog Post created successfully!`,
      blogPosts: blogPosts,
    };
  }

  // This service fetches all blog posts
  async getBlogPosts() {
    const blogPosts = await this.BlogModel.find({})
      .sort({ createdAt: -1 })
      .populate("author");

    // Return a response
    return {
      status: 200,
      message: `Blog Posts fetched`,
      blogPosts: blogPosts,
    };
  }

  // This service fetches a blog post
  async getBlogPost(slug) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([slug]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    const blogPost = await this.BlogModel.findOne({
      slug: slug,
    }).sort({ createdAt: -1 });

    // Return a response
    return {
      status: 200,
      message: `Blog post fetched`,
      blogPost: blogPost,
    };
  }

  // This service UPDATES a blog post
  async updateBlogPost(blogPostId, values) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([blogPostId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any blog exists with the _id
    const blog = await this.BlogModel.findOneAndUpdate(
      {
        _id: blogPostId,
      },
      { ...values }
    );

    if (!blog) {
      return {
        status: 404,
        message: `No blog with _id ${blogPostId} exists.`,
      };
    }

    const blogPosts = await this.BlogModel.find({})
      .sort({ createdAt: -1 })
      .populate("author");

    return {
      status: 201,
      message: `Blog post updated successfully!`,
      blogPosts: blogPosts,
    };
  }

  // This service DELETES a blog post
  async deleteBlogPost(blogPostId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([blogPostId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any pass exists with the _id
    const pass = await this.BlogModel.findOneAndRemove({
      _id: blogPostId,
    });

    if (!pass) {
      return {
        status: 404,
        message: `No blog post with _id ${blogPostId} exists.`,
      };
    }

    const blogPosts = await this.BlogModel.find({})
      .sort({ createdAt: -1 })
      .populate("author");

    return {
      status: 201,
      message: `Blog post deleted successfully.`,
      blogPosts: blogPosts,
    };
  }
}
