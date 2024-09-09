const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "What's the title?"],
    },
    description: {
      type: String,
      required: [true, "Write a short Description"],
    },
    headerImage: {
      type: String,
      required: [true, "Header image is required."],
    },
    sidebarLinks: [
      {
        href: String,
        text: String,
      },
    ],
    content: [
      {
        type: {
          type: String,
          enum: ['heading', 'text'],
          required: [true, "Content type is required."],
        },
        level: {
          type: Number,
          required: function() { return this.type === 'heading'; },
        },
        text: {
          type: String,
          required: function() { return this.type === 'heading'; },
        },
        id: {
          type: String,
          required: function() { return this.type === 'heading'; },
        },
        content: {
          type: String,
          required: function() { return this.type === 'text'; },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
