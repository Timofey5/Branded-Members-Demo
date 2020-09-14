const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "branded.members.hometest@gmail.com",
    pass: "Tima26121994",
  },
});
/// --------------- GET_USERS --------------- ///

const getUsers = async (req, res, next) => {
  const range =
    req.query.gt && req.query.lt
      ? { age: { $gt: req.query.gt, $lt: req.query.lt } }
      : req.query.gt
      ? { age: { $gt: req.query.gt } }
      : req.query.lt
      ? { age: { $lt: req.query.lt } }
      : {};

  const sortOrder =
    req.query.sortOrder === "high"
      ? { age: -1 }
      : req.query.sortOrder === "low"
      ? { age: 1 }
      : { name: 1 }; // (name A-Z) sorting is Default !

  let users;
  try {
    users = await User.find(range).sort(sortOrder);
  } catch (err) {
    return next(new HttpError("Something went wrong, please try again.", 500));
  }
  users = users.map(({ name, age, id, email }) => {
    return { name, age, id, email };
  });

  res.json({ users });
};

/// --------------- SIGNUP --------------- ///

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return next(
      new HttpError("Invalid inputs passes, please check your data", 422)
    );
  const { name, email, password, age } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError("Singing failed , please try again later", 500));
  }
  if (existingUser) return next(new HttpError("Email already exists", 422));

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("Could not create user,please try again", 500));
  }

  const createdUser = new User({
    name,
    email,
    age,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed,please try again", 500);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
        age: createdUser.age,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up failed,please try again", 500);
    return next(error);
  }

  const mailOptions = {
    from: "branded.members.hometest@gmail.com",
    to: email,
    subject: "Sending Email using Node.js",
    html:
      "<div><h1>Thank you for signing up!</h1><a href='https://react-hooks-training-1c7ef.web.app'>Visit Branded-Members-example-app</a></div>",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  res.status(201).json({
    name: createdUser.name,
    email: createdUser.email,
    token,
    age: createdUser.age,
  });
};

/// --------------- LOGIN --------------- ///

const login = async (req, res, next) => {
  const { email, password } = req.body;

  //finding user
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    next(new HttpError("Logging in failed , please try again later", 500));
  }
  //checking if exist
  if (!existingUser)
    return next(
      new HttpError("Invalid credentials, Could not log you in", 401)
    );

  //checking password
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(
      new HttpError(
        "Could not log you in,please check credentials and try again",
        500
      )
    );
  }
  if (!isValidPassword)
    return next(
      new HttpError(
        "Could not log you in,please check credentials and try again",
        500
      )
    );
  //if the user exist and password is correct
  //creating token
  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        age: existingUser.age,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("login failed,please try again", 500);
    return next(error);
  }
  //sending response
  res.json({
    name: existingUser.name,
    email: existingUser.email,
    token,
    age: existingUser.age,
  });
};

exports.login = login;
exports.signup = signup;
exports.getUsers = getUsers;
