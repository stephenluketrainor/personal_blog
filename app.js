//jshint esversion:6
//Specifying that the dotenv file will be used when running the app on our local server during development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
let posts = [];
const _ = require("lodash");
const { lastIndexOf } = require("lodash");
const Post = require("./models/blogpost").Post;

const mongoose = require("mongoose");
mongoose.connect(process.env.ATLAS_URL, { useNewUrlparser: true });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("mongoose connection successful"));

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home", {
    homeStartingContent: homeStartingContent,
    posts: posts,
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactItems: contactContent });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutItems: aboutContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/posts/:post", (req, res) => {
  const id = _.lowerCase(req.params.post);
  posts.forEach((post) => {
    const postTitle = _.lowerCase(post.title);
    if (id === postTitle) {
      res.render("post", { title: post.title, body: post.body });
    }
  });
});

app.post("/", (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    body: req.body.postBody,
  });

  post.save();
  posts.push(post);
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
