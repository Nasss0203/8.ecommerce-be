const express = require("express");
const inventoryControler = require("../../controllers/inventory.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.use(authentication);
router.post("/", asyncHandler(inventoryControler.addStockToInventory));

module.exports = router;
