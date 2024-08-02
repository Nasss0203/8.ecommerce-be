const { Types } = require("mongoose");
const { product } = require("../product.model");
const {
	getSelectData,
	unGetSelectData,
	convertToObjectIdMongodb,
} = require("../../utils");
const createError = require("http-errors");

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

	const products = await product
		.find(filter)
		.sort(sortBy)
		.skip(skip)
		.limit(limit)
		.select(getSelectData(select))
		.lean();
	return products;
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

const getProductById = async (productId) => {
	return await product
		.findOne({ _id: convertToObjectIdMongodb(productId) })
		.lean();
};

const checkProductByServer = async (products) => {
	return await Promise.all(
		products.map(async (product) => {
			const foundProduct = await getProductById(product.productId);
			if (foundProduct) {
				return {
					price: foundProduct.product_price,
					quantity: foundProduct.product_quantity,
					productId: foundProduct._id,
				};
			}
		}),
	);
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
