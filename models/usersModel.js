const mongoose = require("mongoose");
const validator = require("validator");
const userRoles = require("../utils/userRoles");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Field Must Be A Valid Email Address"],
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  role: {
    type: String,
    enum: [userRoles.USER, userRoles.ADMIN, userRoles.MANAGER],
    default: userRoles.USER,
  },
  avatar: {
    type: String,
    default: "images/profile.jpg",
  },
});

// Create and Export User Model
// "User" will be compiled as "users" collection in MongoDB
module.exports = mongoose.model("User", userSchema);
