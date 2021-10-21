const jwt = require("jsonwebtoken");
const models = require("../models");

const auth = async (req, res, next) => {
  if (req.session.user) {
    const token = req.session.user;
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(verified);
    if (!verified) {
      return res.redirect("/login");
    } else {
      req.auth_user = await models.User.findOne({ _id: verified.user_id });
    }
  } else {
    return res.redirect("/login");
  }
  next();
};

const stopLogin = (req, res, next) => {
  if (req.session.user) {
    const token = req.session.user;
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(verified);
    if (verified) {
      return res.redirect("/profile");
    }
  }
  next();
};

module.exports = {
  auth,
  stopLogin,
};
