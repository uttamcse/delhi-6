const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: String,
    path: String,
    description: String,
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Customer",
        },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
