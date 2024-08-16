const mongoose = require("mongoose")

const BlogSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true,
    }
);

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;