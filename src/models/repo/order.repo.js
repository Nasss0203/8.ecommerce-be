const { default: mongoose } = require("mongoose");
const { convertToObjectIdMongodb } = require("../../utils");
const { order } = require("../order.model");
const orderModel = require("../order.model");

const getOneOrderByUser = async (userId) => {
	return await order
		.findOne({
			order_userId: userId,
		})
		.sort({ createdOn: -1 })
		.lean();
};

const getOrderByUser = async ({ orderId, userId }) => {
	if (!mongoose.Types.ObjectId.isValid(orderId)) {
		throw new Error("Invalid orderId");
	}

	return await order.findOne({
		_id: convertToObjectIdMongodb(orderId),
		order_userId: userId,
	});
};

const getAllOrderByAdmin = async ({
	page = 1,
	limit = 10,
	status,
	fromDate,
	toDate,
	userId,
	paymentMethod,
	search,
	sort = "createOn",
	sortOrder = "desc",
}) => {
	const query = {};
	const skip = (page - 1) * limit;
	const sortBy = { [sort]: sortOrder === "desc" ? -1 : 1 };

	// const checkRole = await find

	if (status) {
		query.order_status = status;
	}

	if (fromDate && toDate) {
		query.createdOn = { $gte: new Date(fromDate), $lte: new Date(toDate) };
	}

	if (userId) {
		query.order_userId = userId;
	}

	if (paymentMethod) {
		query["order_payment.method"] = paymentMethod;
	}

	if (search) {
		query["order_products.name"] = { $regex: search, $options: "i" };
	}

	const data = await order
		.find(query)
		.sort(sortBy)
		.skip(skip)
		.limit(limit)
		.lean();

	const totalOrders = await order.countDocuments(query);
	return {
		data,
		totalPages: Math.ceil(totalOrders / limit),
		currentPage: page,
	};
};

const updateOrderByAdmin = async ({ orderId, payload, isNew = true }) => {
	return await order.findByIdAndUpdate(orderId, payload, {
		new: isNew,
		timestamps: true,
	});
};

module.exports = {
	getOneOrderByUser,
	getOrderByUser,
	getAllOrderByAdmin,
	updateOrderByAdmin,
};
