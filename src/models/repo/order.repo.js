const { default: mongoose } = require("mongoose");
const { convertToObjectIdMongodb } = require("../../utils");
const { order } = require("../order.model");

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

module.exports = {
	getOneOrderByUser,
	getOrderByUser,
};
