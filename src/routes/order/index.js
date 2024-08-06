const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const orderController = require("../../controllers/order.controller");
const router = express.Router();

router.post("", asyncHandler(orderController.createOrder));

module.exports = router;
