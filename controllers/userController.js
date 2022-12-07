const express = require("express");
const { body, validationResult } = require("express-validator");

const User = require("../models/user");
const passport = require("passport");
const router = express.Router();
const bcrypt = require("bcryptjs");

exports.user_login_get = (req, res, next) => {
  res.render("log-in-form");
};
exports.user_login_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
});

exports.user_signup_get = (req, res) => {
  res.render("sign-up-form", {
    title: "Sign Up",
  });
};

exports.user_signup_post = [
  // Validate and sanitize fields.
  body("first_name", "First name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "Last name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "username must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must be at least 6 characters. ")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("passwordConfirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    // Indicates the success of this synchronous custom validator
    return true;
  }),
  body("image").escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const receivedPath = req.file.path;
    const cleanedPath = receivedPath.slice(6);

    if (!errors.isEmpty()) {
      res.render("sign-up-form", {
        title: "Sign Up",
        errors: errors.array(),
      });
      return;
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) return next(err);
        const user = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          password: hashedPassword,
          membership_status: false,
          admin_status: false,
          image: cleanedPath,
        }).save((err) => (err ? next(err) : res.redirect("/log-in")));
      });
    }
  },
];

exports.user_logout_get = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.user_join_get = (req, res, next) => {
  res.render("join");
};
exports.user_join_post = (req, res, next) => {
  if (req.body.join_code !== process.env.JOIN_CODE) {
    res.render("join", {
      errMessages: ["wrong password"],
      user: res.locals.currentUser,
    });
  } else {
    User.findByIdAndUpdate(
      req.user._id,
      { $set: { membership_status: true } },
      {},
      function (err, result) {
        if (err) return next(err);
        res.redirect("/");
      }
    );
  }
};

exports.user_admin_get = (req, res, next) => {
  res.render("admin-join");
};

exports.user_admin_post = (req, res, next) => {
  if (req.body.admin_code !== process.env.ADMIN_CODE) {
    res.render("admin-join", {
      errMessages: ["wrong password"],
      user: res.locals.currentUser,
    });
  } else {
    User.findByIdAndUpdate(
      req.user._id,
      { membership_status: true, admin_status: true },
      {},
      function (err, result) {
        if (err) return next(err);
        res.redirect("/");
      }
    );
  }
};
