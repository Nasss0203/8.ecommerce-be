const createError = require("http-errors");
const discountModel = require("../models/discount.model");
const { convertToObjectIdMongodb } = require("../utils");
const {
	updateDiscountCodeById,
	findAllDiscountCodeUnSelect,
	checkDiscountExists,
} = require("../models/repo/discount.repo");
const { findAllProducts } = require("../models/repo/product.repo");
/**
 * Discount Services
 * 1 - Generate Discount Code [Shop | Admin]
 * 2 - Get Discount amount [User]
 * 3 - Get all discount codes [User | Shop]
 * 4 - Verify discount code [User]
 * 5 - Delete discount Code [Shop | Admin]
 * 6 - Cancel discount code [User]
 */
class DiscountService {
	static async createDiscountCode(
		code,
		start_date,
		end_date,
		is_active,
		authId,
		min_order_value,
		product_ids,
		applies_to,
		name,
		description,
		type,
		value,
		max_value,
		max_uses,
		uses_count,
		max_uses_per_user,
	) {
		if (
			new Date() < new Date(start_date) ||
			new Date() > new Date(end_date)
		) {
			throw new createError(400, "Discount code has expried");
		}

		if (new Date(start_date) >= new Date(end_date)) {
			throw new createError(400, "Start date must be before end date ");
		}

		//create index for discount code
		const foundDiscount = await discountModel
			.findOne({
				discount_code: code,
				discount_authId: convertToObjectIdMongodb(authId),
			})
			.lean();

		if (foundDiscount && foundDiscount.discount_is_active) {
			throw new createError(400, "Discount exists!");
		}

		const newDiscount = await discountModel.create({
			discount_name: name,
			discount_description: description,
			discount_type: type,
			discount_code: code,
			discount_value: value,
			discount_min_order_value: min_order_value || 0,
			discount_max_value: max_value,
			discount_start_date: new Date(start_date),
			discount_end_date: new Date(end_date),
			discount_max_uses: max_uses,
			discount_uses_count: uses_count,
			discount_users_used: users_used,
			discount_authId: authId,
			discount_max_uses_per_user: max_uses_per_user,
			discount_is_active: is_active,
			discount_applies_to: applies_to,
			discount_product_ids: applies_to === "all" ? [] : product_ids,
		});

		return newDiscount;
	}

	static async updateDiscountCode(discountId, payload) {
		return await updateDiscountCodeById({ discountId, payload });
	}

	/**
	 * Get all discount codes available with product
	 */
	static async getAllDiscountCodesWithProduct({
		code,
		authId,
		userId,
		limit,
		page,
	}) {
		//Create index for discount_code
		const foundDiscount = await discountModel
			.findOne({
				discount_code: code,
				discount_shopId: convertToObjectIdMongodb(authId),
			})
			.lean();

		if (!foundDiscount || !foundDiscount.discount_is_active) {
			throw new createError(404, "Discount not exists!");
		}

		const { discount_apply_to, discount_product_ids } = foundDiscount;
		let products;
		if (discount_apply_to === "all") {
			//get all product
			products = await findAllProducts({
				filter: {
					product_shop: convertToObjectIdMongodb(authId),
					isPublished: true,
				},
				limit: +limit,
				page: +page,
				sort: "ctime",
				select: ["product_name"],
			});
		}

		if (discount_apply_to === "specific") {
			//get all product ids
			products = await findAllProducts({
				filter: {
					_id: { $in: discount_product_ids },
					isPublished: true,
				},
				limit: +limit,
				page: +page,
				sort: "ctime",
				select: ["product_name"],
			});
		}
		return products;
	}

	/**
	 * Get all discount code of Shop
	 */
	static async getAllDiscountCodesByShop({ limit, page, authId }) {
		const discounts = await findAllDiscountCodeUnSelect({
			limit: +limit,
			page: +page,
			filter: {
				discount_shopId: convertToObjectIdMongodb(authId),
				discount_is_active: true,
			},
			unSelect: ["__v", "discount_authId"],
			model: discountModel,
		});

		return discounts;
	}

	/**
        Apply Discount Code
        products = [
            {
                productId,
                shopId,
                quantity,
                name,
                price
            },
            {
                productId,
                shopId,
                quantity,
                name,
                price
            },
        ]
     */

	static async getDiscountAmount({ codeId, userId, authId, products }) {
		const foundDiscount = await checkDiscountExists({
			model: discountModel,
			filter: {
				discount_code: codeId,
				discount_authId: convertToObjectIdMongodb(authId),
			},
		});

		if (!foundDiscount)
			throw new createError(404, `Discount doesn't exists`);

		const {
			discount_is_active,
			discount_max_uses,
			discount_min_order_value,
			discount_start_date,
			discount_end_date,
			discount_users_used,
			discount_type,
			discount_value,
		} = foundDiscount;
		if (!discount_is_active)
			throw new createError(404, `Discount expried!`);
		if (!discount_max_uses) throw new createError(404, `Discount are out!`);

		//check xem có set giá trị tối thiểu không
		let totalOrder = 0;
		if (discount_min_order_value > 0) {
			totalOrder = products.reduce((acc, product) => {
				return acc + product.quantity * product.price;
			}, 0);
			if (totalOrder < discount_min_order_value) {
				throw new createError(
					404,
					`Discount required a minium order value of ${discount_min_order_value} !`,
				);
			}
		}

		if (discount_min_order_value > 0) {
			const userDiscount = discount_users_used.find(
				(user) => user.userId === userId,
			);
			if (userDiscount) {
			}
		}

		console.log("discount_value: ", discount_value);

		//Check discount nay la fixed_amount hay
		const amount =
			discount_type === "fixed_amount"
				? discount_value
				: totalOrder * (discount_value / 100);
		console.log("totalOrder: ", totalOrder);
		console.log("discount_value: ", discount_value);
		console.log("amount: ", amount);
		return {
			totalOrder,
			discount: amount,
			totalPrice: totalOrder - amount,
		};
	}

	static async deleteDiscountCode({ authId, codeId }) {
		const foundDiscount = "";
		if (foundDiscount) {
			//deleted
		}
		const deleted = await discountModel.find({
			discount_code: codeId,
			discount_shopId: convertToObjectIdMongodb(authId),
		});

		return deleted;
	}

	/**
        Cancel discount code
     */

	static async cancelDiscountCode({ codeId, authId, userId }) {
		const foundDiscount = await checkDiscountExists({
			model: discountModel,
			filter: {
				discount_code: codeId,
				discount_shopId: convertToObjectIdMongodb(authId),
			},
		});

		if (!foundDiscount)
			throw new createError(404, `Discount doesn't exists`);

		const result = await discountModel.findByIdAndUpdate(
			foundDiscount._id,
			{
				$pull: {
					discount_users_used: userId,
				},
				$inc: {
					discount_max_uses: 1,
					discount_uses_count: -1,
				},
			},
		);
		return result;
	}
}
