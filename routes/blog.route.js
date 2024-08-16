const express = require('express');
const upload = require('../middleware/upload.middleware.js');
const {getBlogs, getBlogById, createBlog, updateBlogById, deleteBlogById} = require('../controllers/blog.controller.js')
const router = express.Router();

router.get('/', getBlogs);

router.post('/', upload.single('image'), createBlog);

router.get('/:id', getBlogById);

router.put('/:id', updateBlogById);

router.delete('/:id', deleteBlogById);

module.exports = router;