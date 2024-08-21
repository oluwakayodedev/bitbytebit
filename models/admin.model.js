const mongoose = require("mongoose")

const AdminSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "What's the title?"],
            unique: true,
        },
        password:{
            type: String,
            required: [true, "Write a short Description"]
        }
    }
);

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;