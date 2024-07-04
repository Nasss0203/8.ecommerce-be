const { product, phone } = require("../models/product.model");
const createError = require('http-errors');
const { uploadImageFromLocal } = require("./upload.service");


class ProductFactory {
    static productRegistry = {} // key-class

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new createError(400, (`Invalid Product Types ${type}`))

        return new productClass(payload).createProduct()
    }
}

class ProductService {
    constructor({ product_name, product_thumb, product_image = [], product_quantity, product_category, product_attributes, product_auth, product_price }) {
        this.product_name = product_name;
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

class Phones extends ProductService {
    async createProduct() {
        const newPhone = await phone.create({
            ...this.product_attributes,
            product_auth: this.product_auth
        })
        if (!newPhone) throw new createError(400, 'Create new Phone error')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new createError(400, 'Create new Product error')

        return newProduct
    }
}

ProductFactory.registerProductType('Phones', Phones)

module.exports = ProductFactory