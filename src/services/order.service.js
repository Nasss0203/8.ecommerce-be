const { order } = require("../models/order.model");
const { findCheckoutById } = require("../models/repo/checkout.repo");
const createError = require("http-errors");
const { acquireLock, releaseLock } = require("../utils");
const {
	getOneOrderByUser,
	getOrderByUser,
	getAllOrderByAdmin,
} = require("../models/repo/order.repo");
const { default: mongoose } = require("mongoose");
const { cart } = require("../models/cart.model");
const { checkout } = require("../models/checkout.model");

class OrderService {
	static async orderByUser({
		checkoutId,
		userId,
		cartId,
		user_address = {},
	}) {
		const foundCheckout = await findCheckoutById(checkoutId);

		if (!foundCheckout) throw new createError(404, "Checkout not found");
		const newOrder = await order.create({
			order_userId: userId,
			order_checkout: {
				feeShip: 0,
				totalApplyDiscount: foundCheckout.checkout_discount,
				totalPrice: foundCheckout.checkout_totalPrice,
				grandTotal:
					foundCheckout.checkout_totalPrice -
					foundCheckout.checkout_discount,
			},
			order_shipping: user_address,
			order_payment: foundCheckout.checkout_paymentStatus,
			order_products: foundCheckout.checkout_items,
		});

		if (newOrder) {
			const session = await mongoose.startSession();
			session.startTransaction();

			try {
				await cart.deleteOne({ _id: cartId }).session(session);
				await checkout.deleteOne({ _id: checkoutId }).session(session);

				await session.commitTransaction();
			} catch (error) {}
		}
		return newOrder;
	}

	/*
        1. Query order [Users]
    */
	static async getOneOrderByUser(userId) {
		const order = getOneOrderByUser(userId);
		if (!order) throw new createError(404, "Order not found");
		return order;
	}

	/*
        2. Query order Using id [Users]
    */
	static async getOrderByUser({ orderId, userId }) {
		const order = await getOrderByUser({
			orderId,
			userId,
		});
		if (!order) throw new createError(404, "Order not found");
		return order;
	}

	/*
        3. Cancel order user [Users]
    */
	static async cancelOrderByUser({ orderId, userId, cancellation_reason }) {
		const order = await getOrderByUser({
			orderId,
			userId,
		});
		console.log(order);
		if (!order) {
			throw new createError(404, "Không tìm thấy đơn hàng này");
		}

		if (order.order_status !== "pending") {
			// Hoặc một điều kiện khác tùy theo yêu cầu
			throw new createError(400, "Không thể hủy đơn hàng này");
		}

		order.order_status = "cancelled";
		order.order_cancel = cancellation_reason; // Lưu trữ lý do hủy đơn
		await order.save();
		return order;
	}

	/*
        4. Update Order Status  [Shop | Admin]
    */
	static async updateOrderStatusByShop() {}

	/*
		5. Query All Order [Admin]
	*/
	static async getAllOrderByAdmin({ limit = 10, sort = "ctime", page = 1 }) {
		return await getAllOrderByAdmin({ limit, sort, page });
	}
}

module.exports = OrderService;
