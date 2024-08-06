const { convertToObjectIdMongodb } = require("../../utils");
const { checkout } = require("../checkout.model");

const findCheckoutByCart = async (authId) => {
	return await checkout.findOne({
		checkout_auth: authId,
	});
};

const findCheckoutById = async (checkoutId) => {
	return await checkout
		.findOne({
			_id: convertToObjectIdMongodb(checkoutId),
		})
		.lean();
};

module.exports = {
	findCheckoutByCart,
	findCheckoutById,
};
