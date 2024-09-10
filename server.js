require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const bodyParser = require('body-parser');
const blogRoute = require("./routes/blog.route.js");
const authRoute = require("./routes/auth.route.js");
const app = express();

// middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


// routes
app.use("/api/blogs", blogRoute);
app.use("/api/auth", authRoute)


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/publishBlog', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'publishBlog.html'));
});
app.get('/blog/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'template.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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