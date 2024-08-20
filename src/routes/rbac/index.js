const express = require("express");
const rbacController = require("../../controllers/rbac.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.post("/role", asyncHandler(rbacController.newRole));
router.get("/roles", asyncHandler(rbacController.listRole));

router.post("/resource", asyncHandler(rbacController.newResource));
router.get("/resources", asyncHandler(rbacController.listResource));

module.exports = router;
