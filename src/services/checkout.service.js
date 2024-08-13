const { findCartById } = require("../models/repo/cart.repo");
const { checkProductByServer } = require("../models/repo/product.repo");
const createError = require("http-errors");
const { getDiscountAmount } = require("./discount.service");
const { checkout } = require("../models/checkout.model");
const {
	findCheckoutByCart,
	findCheckoutById,
} = require("../models/repo/checkout.repo");

class CheckoutService {
	static async checkoutReview({ cartId, userId, shop_order_ids }) {
		const foundCart = await findCartById(cartId);
		if (!foundCart) throw new createError(400, "Cart does not exist!");

		const checkout_order = {
				totalPrice: 0, // Tong tien hang
				feeShip: 0, // phi van chuyen
				totalDiscount: 0, //tong tien discount giam giam
				totalCheckout: 0, // tong thanh toan
			},
			shop_order_ids_new = [];

		// tinh nang tinh tong bill
		for (let i = 0; i < shop_order_ids.length; i++) {
			const {
				authId,
				shop_discounts = [],
				item_products = [],
			} = shop_order_ids[i];

			const checkProductServer = await checkProductByServer(
				item_products,
				foundCart,
			);

			if (!checkProductServer)
				throw new createError(400, "Order wrong!!!");

			//Tong tien don hang
			const checkoutPrice = checkProductServer.reduce((acc, product) => {
				return acc + product.quantity * product.price;
			}, 0);

			checkout_order.totalPrice += checkoutPrice;

			const itemCheckout = {
				authId,
				shop_discounts,
				priceRaw: checkoutPrice, // tien truoc khi giam giam
				priceApplyCheckout: checkoutPrice,
				item_products: checkProductServer,
			};

			if (shop_discounts.length > 0) {
				// gia su chi co mot discount
				// get amount discount

				const { totalPrice = 0, discount = 0 } =
					await getDiscountAmount({
						codeId: shop_discounts[0].codeId,
						userId,
						authId,
						products: checkProductServer,
					});

				//tong cong disscount giam gia
				checkout_order.totalDiscount += discount;
				// console.log("checkout_order~", checkout_order);

				// neu tong tien giam gia lon hon 0
				if (discount > 0) {
					itemCheckout.priceApplyCheckout = checkoutPrice - discount;
				}
			}

			// Tong thanh toan cuoi cung
			checkout_order.totalCheckout += itemCheckout.priceApplyCheckout;
			shop_order_ids_new.push(itemCheckout);
		}

		const checkoutData = {
			checkout_cart: cartId,
			checkout_auth: userId,
			checkout_items: shop_order_ids_new.flatMap((item) => {
				// Sử dụng flatMap để làm phẳng mảng kết quả
				return item.item_products.map((product) => ({
					// Lặp qua từng sản phẩm trong item_products
					productId: product.productId,
					quantity: product.quantity,
					price: product.price,
					discount:
						(item.priceRaw - item.priceApplyCheckout) /
						item.item_products.length, // Tính discount cho từng sản phẩm
					totalPrice:
						product.price * product.quantity -
						(item.priceRaw - item.priceApplyCheckout) /
							item.item_products.length,
				}));
			}),
			checkout_totalPrice: checkout_order.totalPrice,
			checkout_shippingFee: checkout_order.feeShip,
			checkout_discount: checkout_order.totalDiscount,
			checkout_grandTotal: checkout_order.totalCheckout,
			checkout_paymentStatus: "pending",
		};

		let foundCheckout = await findCheckoutByCart(
			checkoutData.checkout_auth,
		);
		let updatedOrCreateCheckout; // Sử dụng một biến mới để lưu kết quả

		if (foundCheckout) {
			updatedOrCreateCheckout = await checkout.findOneAndUpdate(
				{ checkout_auth: userId },
				checkoutData,
				{ new: true },
			);
		} else {
			updatedOrCreateCheckout = await checkout.create(checkoutData);
		}

		return updatedOrCreateCheckout;
	}

	static async findCheckoutById({ checkoutId }) {
		const foundCheckout = await findCheckoutById(checkoutId);
		if (!foundCheckout) throw new createError(404, "Checkout not found");
		return foundCheckout;
	}
}

module.exports = CheckoutService;
