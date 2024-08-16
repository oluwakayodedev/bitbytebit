const express = require('express');
const {getBlogs, getBlogById, createBlog, updateBlogById, deleteBlogById} = require('../controllers/blog.controller.js')
const router = express.Router();

router.get('/', getBlogs);

router.post('/', createBlog);

router.get('/:id', getBlogById);

router.put('/:id', updateBlogById);

router.delete('/:id', deleteBlogById);

module.exports = router;