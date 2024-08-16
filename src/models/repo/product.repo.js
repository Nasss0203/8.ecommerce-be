const { Types } = require("mongoose");
const { product } = require("../product.model");
const {
	getSelectData,
	unGetSelectData,
	convertToObjectIdMongodb,
} = require("../../utils");
const createError = require("http-errors");
const { cart } = require("../cart.model");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
	return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
	return await queryProduct({ query, limit, skip });
};

const publishProductByAuth = async ({ product_auth, product_id }) => {
	const foundShop = await product.findOne({
		product_auth: new Types.ObjectId(product_auth),
		_id: new Types.ObjectId(product_id),
	});

	if (!foundShop) return null;
	foundShop.isDraft = false;
	foundShop.isPublished = true;

	const { modifiedCount } = await foundShop.updateOne(foundShop);
	return modifiedCount;
};

const unPublishProductByAuth = async ({ product_auth, product_id }) => {
	const foundShop = await product.findOne({
		product_auth: new Types.ObjectId(product_auth),
		_id: new Types.ObjectId(product_id),
	});

	if (!foundShop) return null;
	foundShop.isDraft = true;
	foundShop.isPublished = false;

	const { modifiedCount } = await foundShop.updateOne(foundShop);
	return modifiedCount;
};

const searchProductByUser = async ({ keySearch }) => {
	const regexSearch = new RegExp(keySearch);
	const results = await product
		.find(
			{
				isPublished: true,
				$text: { $search: regexSearch },
			},
			{ score: { $meta: "textScore" } },
		)
		.sort({ score: { $meta: "textScore" } })
		.lean();
	return results;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
	const skip = (page - 1) * limit;
	const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

	const data = await product
		.find(filter)
		.sort(sortBy)
		.skip(skip)
		.limit(limit)
		.select(getSelectData(select))
		.lean();
	const totalProducts = await product.countDocuments(filter);
	return {
		data,
		totalPages: Math.ceil(totalProducts / limit),
		currentPage: page,
	};
};

const findProductById = async ({ product_id, unSelect }) => {
	return await product.findById(product_id).select(unGetSelectData(unSelect));
};

const updateProductById = async ({
	productId,
	payload,
	model,
	isNew = true,
}) => {
	return await model.findByIdAndUpdate(productId, payload, {
		new: isNew,
	});
};

const deleteProductById = async ({ product_id }) => {
	if (!product_id) throw new createError(404, `Can't find product id repo`);
	return await product.findByIdAndDelete(product_id).lean();
};

const queryProduct = async ({ query, limit, skip }) => {
	return await product
		.find(query)
		.populate("product_auth", "name email -_id")
		.sort({ updateAt: -1 })
		.skip(skip)
		.limit(limit)
		.lean()
		.exec();
};

const getArrayProduct = async (productId) => {
	return await product
		.find({ _id: { $in: productId.map(convertToObjectIdMongodb) } })
		.lean();
};

const getProductById = async (productId) => {
	return await product
		.findOne({ _id: convertToObjectIdMongodb(productId) })
		.lean();
};

const checkProductByServer = async (products, cart) => {
	// Lấy tất cả các productId từ products
	const productIds = products.map((product) => product.productId);

	// Tìm tất cả các sản phẩm trong database dựa trên mảng productIds
	const foundProducts = await getArrayProduct(productIds);

	// Tạo một Map để lưu trữ thông tin sản phẩm từ database
	const productMap = new Map(
		foundProducts.map((product) => [product._id.toString(), product]),
	);

	return products
		.map((product) => {
			// Tìm các sản phẩm trong giỏ hàng có cùng productId
			const foundCartItems = cart.cart_products.filter(
				(item) =>
					item.productId.toString() === product.productId.toString(),
			);

			if (foundCartItems.length > 0) {
				// Lấy thông tin sản phẩm từ Map
				const foundProduct = productMap.get(
					product.productId.toString(),
				);

				if (foundProduct) {
					// Tính tổng số lượng và giá trị từ các sản phẩm trong giỏ hàng
					const totalQuantity = foundCartItems.reduce(
						(sum, item) => sum + item.quantity,
						0,
					);
					const totalPrice = foundCartItems.reduce(
						(sum, item) => sum + item.quantity * item.price,
						0,
					);

					return {
						price: totalPrice / totalQuantity, // Giá trung bình (nếu cần)
						quantity: totalQuantity,
						productId: foundCartItems[0].productId,
						product_price: foundProduct.product_price,
						product_quantity: foundProduct.product_quantity,
					};
				}
			}
		})
		.filter((item) => item !== undefined); // Loại bỏ các mục undefined
};

module.exports = {
	publishProductByAuth,
	unPublishProductByAuth,
	findAllPublishForShop,
	findAllDraftsForShop,
	searchProductByUser,
	findAllProducts,
	findProductById,
	updateProductById,
	deleteProductById,
	getProductById,
	checkProductByServer,
};
