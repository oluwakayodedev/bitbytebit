require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const bodyParser = require('body-parser');
const compression = require('compression');
const blogRoute = require("./routes/blog.route.js");
const authRoute = require("./routes/auth.route.js");

const app = express();

app.use(compression({
  level: 6,
  threshold: 0,
}));

// middleware
app.use(express.json());
app.use(bodyParser.json());

// static file caching
app.use(express.static(path.join(__dirname, 'PUBLIC'), {
  maxAge: '1d', // static catching for 1 day
  setHeaders: (res, path) => {
    if (path.endsWith('.js') || path.endsWith('.css')) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    } else if (path.endsWith('.jpg') || path.endsWith('.png') || path.endsWith('.webp') || path.endsWith('.svg')) {
      res.setHeader('Cache-Control', 'public, max-age=604800');
    } else if (path.endsWith('.woff2') || path.endsWith('.woff') || path.endsWith('.otf') || path.endsWith('.ttf')) {
      res.setHeader('Cache-Control', 'public, max-age=2592000');
    }
  }
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Cache-Control');
  next();
});

// routes
app.use("/api/blogs", blogRoute);
app.use("/api/auth", authRoute)


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'PUBLIC', 'index.html'));
});
app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, 'PUBLIC', 'login.html'));
});
app.get('/publishBlog', (req, res) => {
  res.sendFile(path.join(__dirname, 'PUBLIC', 'publishBlog.html'));
});
app.get('/blog/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'PUBLIC', 'template.html'));
});
app.get('/view-all-blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'PUBLIC', 'viewall.html'));
});
app.get('/editBlog/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'PUBLIC', 'editBlog.html'));
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'PUBLIC', 'index.html'));
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