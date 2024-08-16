require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const blogRoute = require("./routes/blog.route.js");
const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api/blogs", blogRoute);

app.get("/", (req, res) => {
  res.send("Server Runnning");
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