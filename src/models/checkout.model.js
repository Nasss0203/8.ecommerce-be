const { Schema, default: mongoose } = require("mongoose");
const DOCUMENT_NAME = "Checkout";
const COLLECTION_NAME = "Checkouts";

// Schema định nghĩa cấu trúc của một document Checkout trong MongoDB
const checkoutSchema = new mongoose.Schema(
	{
		// ID người dùng (liên kết với collection Auth)
		checkout_cart: {
			// type: mongoose.Schema.Types.ObjectId,
			// ref: "Auth",
			type: String,
			required: true,
		},
		checkout_auth: {
			// type: mongoose.Schema.Types.ObjectId,
			// ref: "Auth",
			type: String,
			required: true,
		},

		// Danh sách các sản phẩm trong giỏ hàng
		checkout_items: [
			{
				_id: false,
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product", // Liên kết với collection Product
					required: true,
				},
				// checkout_productName: { type: String, required: true }, // Tên sản phẩm
				quantity: { type: Number, required: true, min: 1 }, // Số lượng
				price: { type: Number, required: true, min: 0 }, // Giá gốc của sản phẩm
				discount: { type: Number, default: 0 }, // Số tiền giảm giá (nếu có)
				totalPrice: { type: Number, required: false, min: 0 }, // Tổng giá của sản phẩm sau khi đã áp dụng giảm giá
			},
		],

		// Tổng giá trị các sản phẩm trong giỏ hàng
		checkout_totalPrice: { type: Number, required: true, min: 0 },

		// Phí vận chuyển
		checkout_shippingFee: { type: Number, default: 0 },

		// Tổng số tiền được giảm giá
		checkout_discount: { type: Number, default: 0 },

		// Thuế
		checkout_tax: { type: Number, default: 0 },

		// Tổng giá trị đơn hàng (bao gồm phí vận chuyển, giảm giá và thuế)
		checkout_grandTotal: { type: Number, required: true, min: 0 },

		// Phương thức vận chuyển
		// checkout_shippingMethod: { type: String, required: true },

		// // Địa chỉ giao hàng
		// checkout_shippingAddress: {
		// 	checkout_fullName: { type: String, required: true },
		// 	checkout_phoneNumber: { type: String, required: true },
		// 	checkout_addressLine1: { type: String, required: true },
		// 	checkout_city: { type: String, required: true },
		// 	checkout_state: { type: String, required: true },
		// 	checkout_postalCode: { type: String, required: true },
		// 	checkout_country: { type: String, required: true },
		// },

		// // Phương thức thanh toán
		// checkout_paymentMethod: { type: String, required: true },

		// Trạng thái thanh toán (pending, paid, failed)
		checkout_paymentStatus: {
			type: String,
			enum: ["pending", "paid", "failed"],
			default: "pending",
		},

		// Thông tin chi tiết về thanh toán (tùy thuộc vào phương thức thanh toán)
		checkout_paymentDetails: {},

		// Ghi chú của khách hàng
		checkout_notes: String,

		// Thời gian hết hạn của checkout (30 phút sau khi tạo)
		expiresAt: {
			type: Date,
			default: Date.now() + 30 * 60 * 1000,
		},
	},
	{
		timestamps: true, // Tự động thêm createdAt và updatedAt
		collection: COLLECTION_NAME, // Tên collection trong MongoDB
	},
);

// Trường ảo để tính tổng giá trị cuối cùng của đơn hàng
// checkoutSchema.virtual("checkout_grandTotal").get(function () {
// 	return (
// 		this.checkout_totalPrice +
// 		this.checkout_shippingFee -
// 		this.checkout_discount +
// 		this.checkout_tax
// 	);
// });

// Export model để sử dụng ở nơi khác
module.exports = {
	checkout: mongoose.model(DOCUMENT_NAME, checkoutSchema),
};
