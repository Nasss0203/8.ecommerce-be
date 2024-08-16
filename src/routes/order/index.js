const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const orderController = require("../../controllers/order.controller");
const router = express.Router();

// router.use(authentication);

router.post("", asyncHandler(orderController.createOrder));
router.get("", asyncHandler(orderController.getOneOrderByUser));
router.get("/viewAll", asyncHandler(orderController.getAllOrderByAdmin));
router.get("/:orderId", asyncHandler(orderController.getOrderByUser));
router.post(
	"/cancel/:orderId",
	asyncHandler(orderController.cancelOrderByUser),
);

module.exports = router;
