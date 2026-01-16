const appError = require("../utils/appError");
const userRoles = require("../utils/userRoles");
const httpStatusText = require("../utils/httpStatusText");

const allowedTo = (...roles) => {
  console.log(roles);
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      return next(
        appError.create("You Don't Have Access !!", 401, httpStatusText.FAIL)
      );
    }
    next();
  };
};

module.exports = allowedTo;
