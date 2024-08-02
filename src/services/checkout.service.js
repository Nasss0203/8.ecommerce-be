const { findCartById } = require("../models/repo/cart.repo");
const { checkProductByServer } = require("../models/repo/product.repo");
const createError = require("http-errors");
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
		for (let i = 0; i < shop_order_ids_new.length; i++) {
			const {
				shopId,
				shop_discounts = [],
				item_products = {},
			} = shop_order_ids[i];

			const checkProductServer = await checkProductByServer(
				item_products,
			);

			if (!checkProductServer)
				throw new createError(400, "Order wrong!!!");

			//tong tien don hang
			const checkoutPrice = checkProductServer.reduce((acc, product) => {
				return acc + product.quantity * product.price;
			}, 0);

			checkout_order.totalPrice += checkoutPrice;

			const itemCheckout = {
				shopId,
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
						shopId,
						products: checkProductServer,
					});

				//tong cong disscount giam gia
				checkout_order.totalDiscount += discount;

				// neu tong tien giam gia lon hon 0
				if (discount > 0) {
					itemCheckout.priceApplyCheckout = checkoutPrice - discount;
				}
			}

			// Tong thanh toan cuoi cung
			checkout_order.totalCheckout += itemCheckout.priceApplyCheckout;
			shop_order_ids_new.push(itemCheckout);
		}
		return {
			shop_order_ids,
			shop_order_ids_new,
			checkout_order,
		};
	}

	//order
	static async orderByUser({
		shop_order_ids,
		cartId,
		userId,
		user_address = {},
		user_payment = {},
	}) {
		const { shop_order_ids_new, checkout_order } =
			await CheckoutService.checkoutReview({
				cartId,
				userId,
				shop_order_ids,
			});

		//check lai lan nua xem vuot ton kho hay khong
		//get new array products
		const products = shop_order_ids_new.flatMap(
			(order) => order.item_products,
		);
		console.log("[products]: ", products);
		const acquireProduct = [];
		for (let i = 0; i < products.length; i++) {
			const { productId, quantity } = products[i];
			const keyLock = await acquireLock(productId, quantity, cartId);
			acquireProduct.push(keyLock ? true : false);
			if (key) {
				await releaseLock(key);
			}
		}

		//chekc neu co mot san pham het hang trong kho
		if (acquireProduct.includes(false)) {
			throw new createError(
				400,
				"Mot so san pham da duoc cap nhat, vui lon quay lai gio hang",
			);
		}

		const newOrder = await order.create({
			order_userId: userId,
			order_checkout: checkout_order,
			order_shipping: user_address,
			order_payment: user_payment,
			order_products: shop_order_ids_new,
		});

		//Trường hợp: nếu insert thanh coongm thì remove product có trong cart
		if (newOrder) {
		}
		return newOrder;
	}

	/*
        1. Query order [Users]
    */
	static async getOneOrderByUser() {}

	/*
        2. Query order Using id [Users]
    */
	static async getOrderByUser() {}

	/*
        3. Cancel order user [Users]
    */
	static async cancelOrderByUser() {}

	/*
        4. Update Order Status  [Shop | Admin]
    */
	static async updateOrderStatusByShop() {}
}

module.exports = CheckoutService;
