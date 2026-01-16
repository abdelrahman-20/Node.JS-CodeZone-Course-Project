const mongoose = require("mongoose");

// Define Course Schema
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

// Create and Export Course Model
// "Course" will be compiled as "courses" collection in MongoDB
module.exports = mongoose.model("Course", courseSchema);
