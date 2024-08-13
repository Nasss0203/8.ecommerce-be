const express = require("express");
const checkoutController = require("../../controllers/checkout.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.post("/review", asyncHandler(checkoutController.checkoutReview));
router.get(
	"/review/:checkoutId",
	asyncHandler(checkoutController.findCheckoutById),
);

module.exports = router;
