const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const validate = require("../requests");
const postController = require("../controllers/postController");
router.get("/create-post", [auth], postController.createPost);
router.post("/create-post", [auth], postController.storePost);
router.get("/all-posts/:page", [auth], postController.getAllPosts);
router.get("/post-detail/:post_id", [auth], postController.postDetail);
router.get("/update-post/:post_id", [auth], postController.updatePostForm);
router.post(
  "/update-post/:post_id",
  [auth, validate.title_val, validate.body_val],
  postController.updatePost
);
router.get("/delete-post/:post_id", [auth], postController.deletePost);

module.exports = router;
