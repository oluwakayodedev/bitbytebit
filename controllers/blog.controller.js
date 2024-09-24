const Blog = require("../models/blog.model.js");

const getBlogs = async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    const blogs = await Blog.find({});
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, description, headerImage, content, sidebarLinks, image } = req.body;

    // Validate required fields
    if (!title || !description || !headerImage || !content) {
      return res.status(400).json({ message: "Title, description, headerImage, and content are required." });
    }

    // Create new blog post
    const blog = await Blog.create({ title, description, headerImage, content, sidebarLinks, image });
    res.status(201).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


const updateBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.set('Cache-Control', 'no-store');

    res.status(200).json({ message: "Blog Deleted Successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlogById,
  deleteBlogById,
};