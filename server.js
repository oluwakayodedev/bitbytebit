require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const blogRoute = require("./routes/blog.route.js");
const app = express();

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// routes
app.use("/api/blogs", blogRoute);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve HTML form
});

// connect to DB and run server
mongoose
  .connect(process.env.MONGODB_KEY)
  .then(() => {
    console.log("Connected!");
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log("Server is running on port :", port);
    });
  })
  .catch(() => {
    console.log("Connection Failed.");
  });