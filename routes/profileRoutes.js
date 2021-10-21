const express = require("express");
const router = express.Router();
const validate = require("../requests");
const profileController = require("../controllers/profileController");
const { auth } = require("../middlewares/auth");
router.get("/profile", [auth], profileController.profile);

module.exports = router;
