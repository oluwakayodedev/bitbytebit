require("dotenv").config();
const formidable = require("formidable");
const Blog = require("../models/blog.model.js");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getBlogs = async (req, res) => {
  try {
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
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: "Error parsing form data." });
    }

    // correct format?
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    const content = Array.isArray(fields.content) ? fields.content[0] : fields.content;
    const imageFile = files.image;

    //  title, content, and image present?
    if (!title || !description || !content || !imageFile || !imageFile[0]) {
      return res.status(400).json({ message: "Title, content, and image are required." });
    }

    try {
      // upload image to Cloudinary and get image URL
      const result = await cloudinary.uploader.upload(imageFile[0].filepath);
      const imageUrl = result.secure_url;

      // push new blog post to the db with title, content, and image.
      const blog = await Blog.create({ title, description, content, image: imageUrl });
      res.status(201).json(blog);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

const updateBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    // whatever the user passed (req.body) will be replaced into the id
    const blog = await Blog.findByIdAndUpdate(id, req.body);

    // if it doesn't exit, return not found
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // recheck if it has been updated in the DB
    const updatedBlog = await Blog.findById(id);
    res.status(200).json(updatedBlog);
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
