const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const ProfileController = require("../../controllers/profile.controller");
const { grantAccess } = require("../../middlewares/rbac");
const router = express.Router();

//admin

router.get(
	"/viewAny",
	grantAccess("readAny", "profile"),
	ProfileController.profiles,
);
//shop
router.get(
	"/viewOwn",
	grantAccess("readOwn", "profile"),
	ProfileController.profile,
);
module.exports = router;
