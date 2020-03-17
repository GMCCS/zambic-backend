exports.createPostValidator = (req, res, next) => {
  // title
  req.check("title", "Write a title please!").notEmpty();
  req.check("title", "Title must be between 5 to 25 characters").isLength({
    min: 5,
    max: 25
  });

  // Description
  req.check("description", "Write a description please!").notEmpty();
  req
    .check("description", "Description must be between 20 to 3000 characters")
    .isLength({
      min: 20,
      max: 3000
    });

  // check for errors
  const errors = req.validationErrors();
  // if error show the first one as they happen
  if (errors) {
    const firstError = errors.map(error => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  // proceed to next middleware
  next();
};

exports.volunteerSignupValidator = (req, res, next) => {
  // First name isnt null
  req.check("firstName", "Let us know your first name please!").notEmpty();
  // Last name isnt null
  req.check("lastName", "Let us know your last name please!").notEmpty();
  // email isn't null
  req.check("email", "Email is required please!").notEmpty();
  req
    .check("email")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @");
  // password is required and must contain at least 6 characters, 1 of them being a number
  req.check("password", "Password is required please!").notEmpty();
  req
    .check("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number");
  // check for errors
  const errors = req.validationErrors();
  // if error show the first one as they happen
  if (errors) {
    const firstError = errors.map(error => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  // proceed to next middleware
  next();
};
