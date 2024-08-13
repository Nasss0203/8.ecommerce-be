const { Schema, default: mongoose } = require("mongoose");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

// Declare the Schema of the Mongo model
const cartSchema = new Schema(
	{
		cart_state: {
			type: String,
			required: true,
			enum: ["active", "completed", "failed", "pending"],
		},
		cart_products: { type: Array, required: true, default: [] },
		cart_count_product: { type: Number, default: 0 },
		cart_userId: { type: String, required: true },
	},
	{
		timestamps: {
			createdAt: "createdOn",
			updatedAt: "modifiedOn",
		},
		collection: COLLECTION_NAME,
	},
);

//Export the model
module.exports = {
	cart: mongoose.model(DOCUMENT_NAME, cartSchema),
};
