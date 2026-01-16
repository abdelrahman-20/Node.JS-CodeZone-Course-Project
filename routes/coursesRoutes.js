const express = require("express");

// Main Controllers:
const {
  getAllCourses,
  getSingleCourse,
  addNewCourse,
  updateCourse,
  deleteCourse,
} = require("./../controllers/coursesControllers");

const allowedTo = require("../middlewares/allowedTo");
const userRoles = require("../utils/userRoles");
const validateAddedCourse = require("../middlewares/validationSchema");
const verifyToken = require("../middlewares/verifyToken");

// Courses Application Router
const router = express.Router();

router
  .route("/")
  .get(getAllCourses)
  .post(verifyToken, validateAddedCourse(), addNewCourse);

router
  .route("/:courseID")
  .get(getSingleCourse)
  .patch(verifyToken, updateCourse)
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANAGER),
    deleteCourse
  );

module.exports = router;
