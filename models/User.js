const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
    min: 2,
    max: 40,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 2,
    max: 20,
  },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("users", UserSchema);
module.exports = User;
