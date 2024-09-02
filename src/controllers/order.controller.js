const { SuccessResponse } = require("../core/success.response");
const OrderService = require("../services/order.service");

class OrderController {
	createOrder = async (req, res, next) => {
		new SuccessResponse({
			message: "Create new order success",
			metadata: await OrderService.orderByUser(req.body),
		}).send(res);
	};

	getOneOrderByUser = async (req, res, next) => {
		console.log("req.body~", req.body);
		new SuccessResponse({
			message: "Get One Order By User success",
			metadata: await OrderService.getOneOrderByUser(req.body.userId),
		}).send(res);
	};

	getOrderByUser = async (req, res, next) => {
		console.log("req~", req.params);
		new SuccessResponse({
			message: " Get Order By User success",
			metadata: await OrderService.getOrderByUser({
				orderId: req.params.orderId,
				userId: req.query.userId,
			}),
		}).send(res);
	};

	cancelOrderByUser = async (req, res, next) => {
		new SuccessResponse({
			message: "Cancel Order By User Success",
			metadata: await OrderService.cancelOrderByUser({
				...req.body,
				orderId: req.params.orderId,
				userId: req.body.userId,
			}),
		}).send(res);
	};

	getAllOrderByAdmin = async (req, res, next) => {
		new SuccessResponse({
			message: "Get All Order By Admin",
			metadata: await OrderService.getAllOrderByAdmin(req.query),
		}).send(res);
	};

	updateOrderByAdmin = async (req, res, next) => {
		new SuccessResponse({
			message: "Update order success",
			metadata: await OrderService.updateOrderStatusByShop(
				req.params.order_id,
				{
					...req.body,
				},
			),
		}).send(res);
	};
}

module.exports = new OrderController();
