const cron = require("node-cron");
const { checkout } = require("../models/checkout.model");

cron.schedule("30 * * * *", async () => {
	const now = new Date();
	const check = await checkout.deleteMany({ expiresAt: { $lt: now } });
	console.log("Đã xóa các checkout hết hạn", check);
});
