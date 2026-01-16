const appError = require("./../utils/appError");
const Course = require("./../models/courses_model");
const { validationResult } = require("express-validator");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");

const getAllCourses = asyncWrapper(async (req, res, next) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const skip = (page - 1) * limit;

  // To Check For Query Parameters:
  // console.log(`Page: ${page}, Limit: ${limit}, Skip: ${skip}`);

  const courses = await Course.find(
    {
      /* Filter Object */
      /*price: { $gt: 2000 } */
    },
    {
      /* Projection Object */
      __v: false,
    }
  )
    .limit(limit)
    .skip(skip);

  res.json({ status: httpStatusText.SUCCESS, data: { courses } });
});

const getSingleCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.courseID);
  if (!course) {
    return next(
      appError.create("Course Not Found !!", 404, httpStatusText.FAIL)
    );
  }
  return res.json({ status: httpStatusText.SUCCESS, data: { course } });
});

const addNewCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(appError.create(errors.array(), 400, httpStatusText.FAIL));
  }

  const newCourse = new Course(req.body);
  await newCourse.save();
  return res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { newCourse } });
});

const updateCourse = asyncWrapper(async (req, res, next) => {
  const courseID = req.params.courseID;
  const updatedCourse = await Course.updateOne(
    { _id: courseID },
    { $set: { ...req.body } }
  );

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { updatedCourse } });
});

const deleteCourse = asyncWrapper(async (req, res, next) => {
  const courseID = req.params.courseID;
  await Course.findOneAndDelete({ _id: courseID });
  return res.status(201).json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  getAllCourses,
  getSingleCourse,
  addNewCourse,
  updateCourse,
  deleteCourse,
};
