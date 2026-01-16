const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");

verifyToken = (req, res, next) => {
  try {
    const authHeader =
      req.headers["Authorization"] || req.headers["authorization"];

    if (!authHeader) {
      const error = appError.create(
        "Token is Required",
        401,
        httpStatusText.FAIL
      );
      return next(error);
    }

    const token = authHeader.split(" ")[1];
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser;

    next();
  } catch (err) {
    const error = appError.create(err, 401, httpStatusText.ERROR);
    return next(error);
  }
};

module.exports = verifyToken;
