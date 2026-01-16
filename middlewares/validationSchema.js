const { body } = require("express-validator");

const validateAddedCourse = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage(`Title is required`)
      .isLength({ min: 5 })
      .withMessage(`Title should be 5 characters or more`),
    body("price")
      .notEmpty()
      .withMessage(`Price is required`)
      .isNumeric()
      .withMessage("Price must be a number"),
  ];
};

module.exports = validateAddedCourse;
