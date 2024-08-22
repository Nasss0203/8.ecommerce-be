const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const { newTemplate } = require("../../controllers/email.controller");
const { newUser } = require("../../controllers/user.controller");
const router = express.Router();

router.post("/new_user", asyncHandler(newUser));

module.exports = router;
