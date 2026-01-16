const appError = require("./../utils/appError");
const asyncWrapper = require("../middlewares/asyncWrapper");
const bcrypt = require("bcryptjs");
const generateJWT = require("../utils/generateJWT");
const httpStatusText = require("../utils/httpStatusText");
const User = require("../models/usersModel");
require("dotenv").config();

const getAllUsers = asyncWrapper(async (req, res, next) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const skip = (page - 1) * limit;

  // To Check For Query Parameters:
  // console.log(`Page: ${page}, Limit: ${limit}, Skip: ${skip}`);

  const users = await User.find(
    {
      /*
      Filter Object
      price: { $gt: 2000 }
      */
    },
    {
      /* Projection Object */
      __v: false,
      password: false,
    }
  )
    .limit(limit)
    .skip(skip);

  res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  const oldUser = await User.findOne({ email });
  if (oldUser) {
    const error = appError.create(
      "Email Already Exists, Forgot Your Password?",
      409,
      httpStatusText.FAIL
    );
    return next(error);
  }

  // Encrypt The Password And Create The User Object:
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: String(role).toUpperCase(),
    avatar: req.file.filename,
  });

  // Generate The Token:
  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;

  // Save The User & Return The Data
  await newUser.save();
  return res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { token } });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  // Check For Both Email & Password:
  if (!email || !password) {
    const error = appError.create(
      "Email & Password Are Required !!",
      400,
      httpStatusText.FAIL
    );

    return next(error);
  }

  // Check If User Exists:
  const user = await User.findOne({ email });
  if (!user) {
    const error = appError.create(
      "User Not Found !!",
      404,
      httpStatusText.FAIL
    );

    return next(error);
  }

  // Validate The User's Password:
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (user && matchedPassword) {
    const token = await generateJWT({
      email: user.email,
      id: user._id,
      role: user.role,
    });

    res.json({
      status: httpStatusText.SUCCESS,
      data: { user: `User LoggedIn Successfully`, token },
    });
  } else {
    const error = appError.create(
      "Incorrect Password, Please Check Your Password and Try Again !!",
      500,
      httpStatusText.ERROR
    );

    return next(error);
  }
});

// TODO
// const updateUser = asyncWrapper(async (req, res, next) => {});
// const deleteUser = asyncWrapper(async (req, res, next) => {});

module.exports = {
  getAllUsers,
  login,
  register,
  // updateUser,
  // deleteUser,
};
