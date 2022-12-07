const { body, validationResult } = require("express-validator");
const Message = require("../models/message");
const User = require("../models/user");

const async = require("async");

exports.index = (req, res) => {
  Message.find()
    .populate("user")
    .exec(function (err, messages) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("index", {
        title: "Welcome to Send Moods",
        user: req.user,
        messages,
      });
      res.render("layout", {
        user: req.user,
      });
    });
};

exports.message_create_post = [
  body("message_title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title must not be empty"),
  body("text")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Text must not be empty"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("index", { errors: errors.array() });
    }

    const message = new Message({
      user: req.user,
      message_title: req.body.message_title,
      text: req.body.text,
      timestamp: Date.now(),
    });

    message.save((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  },
];

exports.delete_message_get = (req, res, next) => {
  Message.findById(req.params.id)
    .populate("user")
    .exec((err, message) => {
      if (err) {
        return next(err);
      }
      if (message == null) {
        // No results.
        res.redirect("/");
      }
      // Successful, so render.
      res.render("delete-message", {
        title: "Delete Message",
        user: req.user,
        message,
      });
    });
};

exports.delete_message_post = (req, res, next) => {
  Message.findById(req.params.id)
    .populate("user")
    .exec((err, message) => {
      if (err) {
        return next(err);
      }
      // Success
      if (message.length > 0) {
        // Author has books. Render in same way as for GET route.
        res.render("delete-message", {
          title: "Delete Message",
          user: req.user,
          message,
        });
        return;
      }
      // Author has no books. Delete object and redirect to the list of authors.
      Message.findByIdAndRemove(req.body.messageid, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to author list
        res.redirect("/");
      });
    });
};
