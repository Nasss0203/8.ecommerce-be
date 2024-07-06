
const { Types } = require('mongoose')
const { product } = require('../product.model')
const { getSelectData, unSetSelectData } = require('../../utils')


const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const publishProductByAuth = async ({ product_auth, product_id }) => {
    const foundShop = await product.findOne({
        product_auth: new Types.ObjectId(product_auth),
        _id: new Types.ObjectId(product_id)
    })

    if (!foundShop) return null;
    foundShop.isDraft = false
    foundShop.isPublished = true

    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const unPublishProductByAuth = async ({ product_auth, product_id }) => {
    const foundShop = await product.findOne({
        product_auth: new Types.ObjectId(product_auth),
        _id: new Types.ObjectId(product_id)
    })

    if (!foundShop) return null;
    foundShop.isDraft = true
    foundShop.isPublished = false

    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isPublished: true,
        $text: { $search: regexSearch },
    }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .lean()
    return results
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    return products
}

const findProductById = async ({ product_id, unSelect }) => {
    return await product.findById(product_id).select(unSetSelectData(unSelect))
}


const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
        .populate('product_auth', 'name email -_id')
        .sort({ updateAt: -1 }).skip(skip).limit(limit).lean().exec()
}



module.exports = {
    publishProductByAuth,
    unPublishProductByAuth,
    findAllPublishForShop,
    findAllDraftsForShop,
    searchProductByUser,
    findAllProducts,
    findProductById
}