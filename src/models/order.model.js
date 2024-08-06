const { Schema, default: mongoose } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";
// Declare the Schema of the Mongo model
const orderSchema = new Schema(
	{
		order_userId: {
			// type: mongoose.Schema.Types.ObjectId,
			// ref: "Auth", // Liên kết với collection Auth
			type: Number,
			// required: true,
		},
		order_checkout: {
			totalPrice: { type: Number, required: false },
			totalApplyDiscount: { type: Number, default: 0 },
			feeShip: { type: Number, default: 0 },
		},
		order_shipping: {
			street: { type: String, required: true },
			city: { type: String, required: true },
			country: { type: String, required: true },
		},
		order_payment: {
			method: { type: String, required: false },
			status: {
				type: String,
				enum: ["pending", "paid", "failed"],
				default: "pending",
			},
			// Thêm các trường khác tùy thuộc vào phương thức thanh toán cụ thể
		},
		order_products: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				productName: { type: String, required: false },
				quantity: { type: Number, required: false, min: 1 },
				price: { type: Number, required: false, min: 0 },
				discount: { type: Number, default: 0 },
				totalPrice: { type: Number, required: false, min: 0 },
			},
		],
		order_tracking: { type: String, default: "#0000131052024" },
		order_status: {
			type: String,
			enum: ["pending", "confirmed", "shipped", "cancelled", "delivered"],
			default: "pending",
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	},
);

//Export the model
module.exports = {
	order: mongoose.model(DOCUMENT_NAME, orderSchema),
};
