const express = require("express");
const router = express.Router();
const validate = require("../requests");
const userController = require("../controllers/userController");
const { stopLogin, auth } = require("../middlewares/auth");
router.get("/", [stopLogin], userController.loadLogin);
router.get("/login", [stopLogin], userController.loadLogin);
router.get("/signup", [stopLogin], userController.loadSignUp);
router.post(
  "/signup",
  [
    validate.full_name_val,
    validate.email_val,
    validate.password_val,
    validate.confirm_password_val,
  ],
  userController.registerUser
);
router.post(
  "/post-login",
  [validate.email_val, validate.password_val],
  userController.postLogin
);
router.get("/logout", [auth], userController.logout);

module.exports = router;
