const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

// Images Upload To Images Folder:
const multer = require("multer");
const storage = multer.diskStorage({
  // Set The Upload Destination
  destination: function (req, file, cb) {
    // console.log("File ", file);
    cb(null, "images");
  },
  // Set A Unique File Name
  filename: function (req, file, cb) {
    const extension = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${extension}`;
    cb(null, fileName);
  },
});
// Allow Images Only
const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];
  if (imageType === "image") return cb(null, true);
  else return cb(appError.create("The File Must Be An Image", 400), false);
};
const upload = multer({ storage, fileFilter });

const {
  getAllUsers,
  login,
  register,
  // updateUser,
  // deleteUser,
} = require("./../controllers/usersControllers");
const appError = require("../utils/appError");

router.route("/").get(verifyToken, getAllUsers);
router.route("/login").post(login);
router.route("/register").post(upload.single("avatar"), register);

module.exports = router;
