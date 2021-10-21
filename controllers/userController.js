const { validationResult, check, checkBody } = require("express-validator");
const bcrypt = require("bcrypt");
const models = require("../models");
const jwt = require("jsonwebtoken");

const loadLogin = (req, res) => {
  res.render("signin", { title: "SignIn", errors: "", data: "", login: false });
};

const loadSignUp = (req, res) => {
  res.render("signup", { title: "SignUp", errors: "", data: "", login: false });
};

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  const { full_name, email, password } = req.body;
  const already_exists = await models.User.findOne({ email });
  if (!errors.isEmpty() || already_exists) {
    if (already_exists) errors.errors.push({ msg: "Email Already Exists" });
    res.render("signup", {
      title: "SignUp",
      errors: errors.array(),
      data: req.body,
      login: false,
    });
  } else {
    const salt = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(password, salt);
    const user = await models.User.create({
      full_name,
      email,
      password: hash_password,
    });
    req.flash("success", "Your account has been created successfully");
    res.redirect("/login");
  }
};

const postLogin = async (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;
  if (!errors.isEmpty()) {
    res.render("signin", {
      title: "SignIn",
      errors: errors.array(),
      data: req.body,
      login: false,
    });
  } else {
    const user = await models.User.findOne({ email });
    console.log("user", user);
    const password_verify = user
      ? await bcrypt.compare(password, user.password)
      : null;
    if (user && password_verify) {
      const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      req.session.user = token;
      console.log("user token", token);
      return res.redirect("/profile");
    } else {
      errors.errors.push({ msg: "Email or password is incorrect" });
      return res.render("signin", {
        title: "SignIn",
        errors: errors.array(),
        data: req.body,
        login: false,
      });
    }
  }
};

const logout = (req, res, next) => {
  req.session.destroy((error) => {
    if (!error) {
      res.redirect("/login");
    }
  });
};

module.exports = {
  loadLogin,
  loadSignUp,
  registerUser,
  postLogin,
  logout,
};
