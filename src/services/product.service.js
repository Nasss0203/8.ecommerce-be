const { product, electronic } = require("../models/product.model");
const createError = require('http-errors');
const { publishProductByAuth, unPublishProductByAuth, findAllDraftsForShop, findAllPublishForShop, searchProductByUser, findAllProducts, findProductById } = require("../models/repo/product.repo");


class ProductFactory {
    static productRegistry = {} // key-class

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        console.log('productClass: ', productClass);
        if (!productClass) throw new createError(400, (`Invalid Product Types ${type}`))

        return new productClass(payload).createProduct()
    }


    //PUT
    static async publishProductByAuth({ product_auth, product_id }) {
        return await publishProductByAuth({ product_auth, product_id })
    }
    static async unPublishProductByAuth({ product_auth, product_id }) {
        return await unPublishProductByAuth({ product_auth, product_id })
    }


    //query
    static async findAllDraftsForShop({ product_auth, limit = 50, skip = 0 }) {
        const query = { product_auth, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishForShop({ product_auth, limit = 50, skip = 0 }) {
        const query = { product_auth, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })
    }

    //search
    static async searchProductByUser({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({ limit, sort, filter, page, select: ['product_name', 'product_price', 'product_thumb'] })
    }

    static async findProductById({ product_id }) {
        return await findProductById({ product_id, unSelect: ['__v'] })
    }
}

class ProductService {
    constructor({ product_name, product_thumb, product_image = [], product_quantity, product_category, product_attributes, product_auth, product_price, product_description }) {
        this.product_name = product_name;
        this.product_description = product_description;
        this.product_thumb = product_thumb;
        this.product_price = product_price;
        this.product_image = product_image;
        this.product_quantity = product_quantity;
        this.product_auth = product_auth;
        this.product_category = product_category;
        this.product_attributes = product_attributes;
    }

    async createProduct() {
        return await product.create(this)
    }
}

class Electronics extends ProductService {
    async createProduct() {
        const newPhone = await electronic.create({
            ...this.product_attributes,
            product_auth: this.product_auth
        })
        if (!newPhone) throw new createError(400, 'Create new Phone error')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new createError(400, 'Create new Product error')

        return newProduct
    }
}

ProductFactory.registerProductType('Electronics', Electronics)

module.exports = ProductFactory