const { cart } = require("../models/cart.model");
const { getProductById } = require("../models/repo/product.repo");
const createError = require("http-errors");

class CartService {
	//START REPO SERVICE//
	static async createUserCart({ userId, product }) {
		const query = { cart_userId: userId, cart_state: "active" },
			updateOrInsert = {
				$addToSet: {
					cart_products: product,
				},
			},
			option = { upsert: true, new: true };
		return await cart.findOneAndUpdate(query, updateOrInsert, option);
	}

	static async updateUserCartQuantity({ userId, product }) {
		const { productId, quantity } = product;

		const query = {
				cart_userId: userId,
				"cart_products.productId": productId,
				cart_state: "active",
			},
			updateSet = {
				$inc: {
					"cart_products.$.quantity": quantity,
				},
			},
			option = { upsert: true, new: true };
		return await cart.findOneAndUpdate(query, updateSet, option);
	}
	//END REPO SERVICE//

	static async addToCart({ userId, product = {} }) {
		//check cart ton tai khong
		const userCart = await cart.findOne({ cart_userId: userId });
		if (!userCart) {
			return await CartService.createUserCart({ userId, product });
		}
		if (!userCart.cart_products.length) {
			userCart.cart_products = [product];
			return await userCart.save();
		}

		//Gio hang ton tai, va co san pham thi update quantity
		return await CartService.updateUserCartQuantity({ userId, product });
	}

	static async addToCartV2({ userId, shop_order_ids }) {
		const { productId, quantity, old_quantity } =
			shop_order_ids[0].item_products[0];

		const foundProduct = await getProductById(productId);
		if (!foundProduct) throw new createError(404, "Not foundProduct");
		//Compare
		if (
			foundProduct.product_auth.toString() !== shop_order_ids[0]?.shopId
		) {
			throw new createError(404, "Product do not belong to the shop");
		}

		if (quantity === 0) {
			//Deleted
		}

		return await CartService.updateUserCartQuantity({
			userId,
			product: {
				productId,
				quantity: quantity - old_quantity,
			},
		});
	}

	static async deleteUserCart({ userId, productId }) {
		const query = { cart_userId: userId, cart_state: "active" },
			updateSet = {
				$pull: {
					cart_products: {
						productId,
					},
				},
			};
		const deleteCart = await cart.updateOne(query, updateSet);
		return deleteCart;
	}

	static async getListUserCart({ userId }) {
		return await cart
			.findOne({
				cart_userId: +userId,
			})
			.lean();
	}
}

module.exports = CartService;
