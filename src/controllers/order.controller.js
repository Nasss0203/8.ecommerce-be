const { SuccessResponse } = require("../core/success.response");
const OrderService = require("../services/order.service");

class OrderController {
	createOrder = async (req, res, next) => {
		new SuccessResponse({
			message: "Create new order success",
			metadata: await OrderService.orderByUser(req.body),
		}).send(res);
	};
}

module.exports = new OrderController();
