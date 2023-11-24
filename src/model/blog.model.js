import mongoose from "mongoose";

// SCHEMA: This schema is for Shuttlelane's blog
const blogSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
    },

    author: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

const BlogModel = mongoose.model("Blog", blogSchema);

export default BlogModel;
