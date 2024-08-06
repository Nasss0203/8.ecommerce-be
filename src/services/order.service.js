const { order } = require("../models/order.model");
const { findCheckoutById } = require("../models/repo/checkout.repo");
const createError = require("http-errors");
const { acquireLock, releaseLock } = require("../utils");

class OrderService {
	static async orderByUser({ checkoutId, userId, user_address = {} }) {
		const foundCheckout = await findCheckoutById(checkoutId);
		console.log("foundCheckout~", foundCheckout.checkout_totalPrice);

		if (!foundCheckout) throw new createError(404, "Checkout not found");

		// const acquireProduct = [];
		// for (let i = 0; i < products.length; i++) {
		// 	const { productId, quantity } = products[i];
		// 	const keyLock = await acquireLock(productId, quantity, checkoutId);
		// 	acquireProduct.push(keyLock ? true : false);
		// 	if (key) {
		// 		await releaseLock(key);
		// 	}
		// }

		// if (acquireProduct.includes(false)) {
		// 	throw new createError(
		// 		400,
		// 		"Mot so san pham da duoc cap nhat, vui lon quay lai gio hang",
		// 	);
		// }

		const newOrder = await order.create({
			order_userId: userId,
			order_checkout: {
				feeShip: 0,
				totalApplyDiscount: foundCheckout.checkout_discount,
				totalPrice: foundCheckout.checkout_totalPrice,
			},
			order_shipping: user_address,
			order_payment: foundCheckout.checkout_paymentStatus,
			order_products: foundCheckout.checkout_items,
		});
		console.log("newOrder~", newOrder);
		return newOrder;
	}

	/*
        1. Query order [Users]
    */
	static async getOneOrderByUser() {}

	/*
        2. Query order Using id [Users]
    */
	static async getOrderByUser() {}

	/*
        3. Cancel order user [Users]
    */
	static async cancelOrderByUser() {}

	/*
        4. Update Order Status  [Shop | Admin]
    */
	static async updateOrderStatusByShop() {}
}

module.exports = OrderService;
