const { Schema, default: mongoose } = require("mongoose");

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

let inventorySchema = new Schema(
	{
		inven_productId: {
			type: Schema.Types.ObjectId,
			ref: "Product",
		},
		inven_location: {
			type: String,
			default: "unKnow",
		},
		inven_stock: {
			type: Number,
			required: true,
		},
		inven_authId: {
			type: Schema.Types.ObjectId,
			ref: "Auth",
		},
		inven_reservations: {
			type: Array,
			default: [],
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	},
);

//Export the model
module.exports = {
	inventory: mongoose.model(DOCUMENT_NAME, inventorySchema),
};
