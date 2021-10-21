const formidable = require("formidable");
const fs = require("fs");
const models = require("../models");
const { exit } = require("process");
const { v4: uuid } = require("uuid");
const dateFormat = require("dateformat");
const { validationResult } = require("express-validator");

const createPost = (req, res) => {
  res.render("create-post", {
    title: "Create Post",
    login: true,
    errors: "",
    data: "",
  });
};

const storePost = (req, res) => {
  // console.log("body", req.body);
  const form = formidable();
  console.log("start");
  form.parse(req, (err, fields, files) => {
    const errors = [];
    const { title, body } = fields;
    // title
    if (title.length == 0) {
      errors.push({ msg: "Post title is required" });
    }
    // body
    if (body.length == 0) {
      errors.push({ msg: "Post body is required" });
    }
    // file
    if (files.image.name.length == 0) {
      errors.push({ msg: "Post image is required" });
      const image_name = files.image.name;
      const extension = image_name.split(".").splice(-1).toString();
      // file extension
      if (
        files.image.name.length &&
        ["jpg", "png", "jpeg", "gif"].indexOf(extension) == -1
      ) {
        errors.push({
          msg: "Only jpg, jpeg, png, jig image extensions are allowed",
        });
      }
    }
    // errors array
    if (errors.length) {
      return res.render("create-post", {
        title: "Create Post",
        login: true,
        errors,
        data: { title, body },
      });
    } else {
      // final response
      const extension = files.image.name.split(".").splice(-1).toString();
      files.image.name = `${uuid()}.${extension}`;
      const old_path = files.image.path;
      const new_path = `${__dirname}/../views/assets/storage/uploaded/images/${files.image.name}`;
      fs.readFile(old_path, (error, data) => {
        if (!error) {
          fs.writeFile(new_path, data, (error) => {
            if (!error) {
              console.log("image uploaded successfully");
              fs.unlink(old_path, async (error) => {
                if (!error) {
                  try {
                    const Post = new models.Post({
                      title,
                      body,
                      image: files.image.name,
                      user_id: req.auth_user._id,
                    });
                    const result = await Post.save();
                    if (result) {
                      // res.send("post created");
                      req.flash("success", "Post created Successfully");
                      res.redirect("all-posts/1");
                    }
                  } catch (error) {
                    console.log(error);
                    res.send("Failed to upload post");
                  }
                } else {
                  console.log("unlink error", error);
                }
              });
            } else {
              console.log("write error", error);
            }
          });
        } else {
          console.log("read error", error);
        }
      });
    }
  });
};

const getAllPosts = async (req, res) => {
  const auth_id = req.auth_user._id;
  const per_page = 4;
  const current_page = req.params.page ? req.params.page : 1;
  const skip = current_page * per_page - per_page; // (current_page-1)*per_page
  const total_posts = await models.Post.find({ user_id: auth_id }).count(); //countDocuments()

  console.log(auth_id);
  const posts = await models.Post.find({ user_id: auth_id })
    .skip(skip)
    .limit(per_page)
    .sort({
      updatedAt: -1,
    });
  res.render("all-posts", {
    title: "All Posts",
    login: true,
    posts,
    formate: dateFormat,
    total_posts,
    per_page,
    current_page: parseInt(current_page),
  });
};

const postDetail = async (req, res) => {
  const post_id = req.params.post_id;
  const post = await models.Post.findOne({ _id: post_id });
  console.log(post);
  return res.render("post-detail", { post, title: "Post Detail", login: true });
};

const updatePostForm = async (req, res) => {
  const post = await models.Post.findOne({
    _id: req.params.post_id,
    user_id: req.auth_user._id,
  });
  res.render("update-post", {
    title: "Update Post",
    login: true,
    errors: "",
    data: { title: post.title, body: post.body, post_id: post._id },
  });
};

const updatePost = async (req, res) => {
  let { title, body } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("update-post", {
      title: "Update Post",
      login: true,
      errors: errors.array(),
      data: { title, body, post_id: req.params.post_id },
    });
  } else {
    const is_updated = await models.Post.findByIdAndUpdate(req.params.post_id, {
      title,
      body,
    });
    if (is_updated) {
      req.flash("success", "Post updated Successfully");
      res.redirect("/all-posts/1");
    } else {
      req.flash("success", "Post failed to update");
      res.redirect("/all-posts/1");
    }
  }
};

const deletePost = async (req, res) => {
  const is_updated = await models.Post.findByIdAndDelete(req.params.post_id);
  if (is_updated) {
    req.flash("success", "Post deleted Successfully");
    res.redirect("/all-posts/1");
  } else {
    req.flash("success", "Post failed to delete");
    res.redirect("/all-posts/1");
  }
};

module.exports = {
  createPost,
  storePost,
  getAllPosts,
  postDetail,
  updatePostForm,
  updatePost,
  deletePost,
};
