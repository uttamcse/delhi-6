const { multer, uploadFileToGCS } = require("../utils/uploadHelper");
const Blog = require("../models/Blog");
const Customer = require("../models/Customer");

const blogImageUpload = multer.single("image");

const uploadblogImage = async (req, res) => {
  try {
    const { title, description } = req.body;
    let imagePath = "";

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (title or description).",
      });
    }

    // Check file format if file exists
    if (req.file) {
      const allowedFormats = ['image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'image/webp'];
      if (!allowedFormats.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "Unsupported image format. Allowed: BMP, GIF, JPEG, PNG, WebP.",
        });
      }
      imagePath = await uploadFileToGCS(req.file);
    }

    const newBlog = new Blog({
      title,
      path: imagePath,
      description,
    });

    await newBlog.save();

    res.status(200).json({
      success: true,
      message: "Blog uploaded successfully",
      newBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error uploading blog",
      error: error.message,
    });
  }
};

// Get All Blogs (sorted by date)
const getBlogImages = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

// Delete Blog by ID
const deleteBlogImage = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: error.message,
    });
  }
};

// Update Blog (image optional)
const updateBlogImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (title) blog.title = title;
    if (description) blog.description = description;

    if (req.file) {
      const publicUrl = await uploadFileToGCS(req.file);
      blog.path = publicUrl;
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating blog",
      error: error.message,
    });
  }
};

// Get a single Blog by ID
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blog by ID",
      error: error.message,
    });
  }
};

const commentOnBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { userId, comment } = req.body;

    if (!blogId || !userId || !comment) {
      return res.status(400).json({
        success: false,
        message: "blogId, userId, and comment are required",
      });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Find customer
    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Add comment to blog
    blog.comments.push({
      user: customer._id,
      comment,
    });

    await blog.save();

    // Re-fetch blog and populate comments
    const updatedBlog = await Blog.findById(blogId)
      .populate("comments.user", "firstName lastName profilePicture")
      .lean();

    // Transform comments
    const formattedComments = updatedBlog.comments.map((c) => ({
      customerId: c.user?._id,
      firstName: c.user?.firstName,
      lastName: c.user?.lastName,
      profilePicture: c.user?.profilePicture,
      comment: c.comment,
      commentId: c._id,
      createdAt: c.createdAt,
    }));

    // Send response with custom format
    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      blog: {
        _id: updatedBlog._id,
        title: updatedBlog.title,
        path: updatedBlog.path,
        description: updatedBlog.description,
        createdAt: updatedBlog.createdAt,
        updatedAt: updatedBlog.updatedAt,
        __v: updatedBlog.__v,
        comments: formattedComments,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error commenting on blog",
      error: error.message,
    });
  }
};


module.exports = {
  blogImageUpload,
  uploadblogImage,
  getBlogImages,
  deleteBlogImage,
  getBlogById,
  commentOnBlog,
  updateBlogImage,
};
