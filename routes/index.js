var express = require("express");
var router = express.Router();
const message_controller = require("../controllers/messageController");
const user_controller = require("../controllers/userController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = `./public/images`;
    cb(null, path);
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
});

/* GET home page. */
router.get("/", message_controller.index);

router.post("/", message_controller.message_create_post);

router.get("/log-in", user_controller.user_login_get);

router.post("/log-in", user_controller.user_login_post);

router.get("/log-out", user_controller.user_logout_get);

router.get("/sign-up", user_controller.user_signup_get);

router.post(
  "/sign-up",
  upload.single("image"),
  user_controller.user_signup_post
);

router.get("/join", user_controller.user_join_get);

router.post("/join", user_controller.user_join_post);

router.get("/admin", user_controller.user_admin_get);

router.post("/admin", user_controller.user_admin_post);

// GET request to delete Author.
router.get("/message/:id/delete", message_controller.delete_message_get);

// // POST request to delete Author.
router.post("/message/:id/delete", message_controller.delete_message_post);

module.exports = router;
