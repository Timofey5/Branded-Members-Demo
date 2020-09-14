const express = require("express");
const { check } = require("express-validator");

const checkAuth = require("../middleware/check-auth");
const usersController = require("../controllers/users-controllers");

const router = express.Router();

router.post(
  "/signup",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("age").not().isEmpty(),
  ],
  usersController.signup
);

router.post("/login", [check("email").normalizeEmail()], usersController.login);

router.use(checkAuth);

router.get("/", usersController.getUsers);

module.exports = router;
