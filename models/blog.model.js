const mongoose = require("mongoose")

const BlogSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "What's the title?"],
        },
        description:{
            type: String,
            required: [true, "Write a short Description"]
        },
        content: {
            type: String,
            required: [true, "Content is required."],
        },
        image: {
            type: String,
            required: [true, "Image is required."],
        }
    },
    {
        timestamps: true,
    }
);

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;