const { check } = require("express-validator");

// exports.verifyPasswordsMatch = (req, res, next) => {
//     const {confirmPassword} = req.body

//     return check('password')
//       .isLength({ min: 4 })
//       .withMessage('password must be at least 4 characters')
//       .equals(confirmPassword)
// }

let full_name_val = check("full_name")
  .isLength({ min: 2, max: 40 })
  .withMessage("Name must be in between 2 and 40 characters");
let email_val = check("email").isEmail().withMessage("Email is not valid");
let password_val = check("password")
  .isLength({ min: 2, max: 40 })
  .withMessage("Password must be in between 2 and 40 characters");
let confirm_password_val = check("confirm_password").custom(
  (value, { req, loc, path }) => {
    if (value !== req.body.password) throw new Error("Passwords don't match");
    return value;
  }
);
let title_val = check("title")
  .isLength({ min: 2, max: 40 })
  .withMessage("Title is required");
let body_val = check("body")
  .isLength({ min: 2 })
  .withMessage("Body is required");
let validate = {
  full_name_val,
  email_val,
  password_val,
  confirm_password_val,
  title_val,
  body_val,
};

module.exports = validate;
