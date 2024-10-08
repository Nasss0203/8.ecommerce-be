const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

// check apiKey
router.use(apiKey);

// check permission
router.use(permission("0000"));

router.use("/v1/api/upload", require("./upload/index"));
router.use("/v1/api/user", require("./user/index"));
router.use("/v1/api/email", require("./email/index"));
router.use("/v1/api/rbac", require("./rbac/index"));
router.use("/v1/api/profile", require("./profile/index"));
router.use("/v1/api/product", require("./product/index"));
router.use("/v1/api/discount", require("./discount/index"));
router.use("/v1/api/cart", require("./cart/index"));
router.use("/v1/api/checkout", require("./checkout/index"));
router.use("/v1/api/order", require("./order/index"));
router.use("/v1/api/inventory", require("./inventory/index"));
router.use("/v1/api/", require("./auth/index"));

module.exports = router;
