const { inventory } = require("../inventory.model");

const insertInventory = async ({
	productId,
	authId,
	stock,
	location = "unKnow",
}) => {
	return await inventory.create({
		inven_productId: productId,
		inven_stock: stock,
		inven_location: location,
		inven_authId: authId,
	});
};
module.exports = {
	insertInventory,
};
