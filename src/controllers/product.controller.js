const { SuccessResponse } = require('../core/success.response')
const ProductService = require('../services/product.service')

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success new create product',
            metadata: await ProductService.createProduct(req.body.product_category, {
                ...req.body,
                product_auth: req.user.userId
            })
        }).send(res)
    }

    publishProductByAuth = async (req, res, next) => {
        new SuccessResponse({
            message: 'publishProductByShop product',
            metadata: await ProductService.publishProductByAuth({
                product_id: req.params.id,
                product_auth: req.user.userId
            })
        }).send(res)
    }

    unPublishProductByAuth = async (req, res, next) => {
        new SuccessResponse({
            message: 'unPublishProductByShop product',
            metadata: await ProductService.unPublishProductByAuth({
                product_id: req.params.id,
                product_auth: req.user.userId
            })
        }).send(res)
    }

    findAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Publish Success!',
            metadata: await ProductService.findAllPublishForShop({
                product_auth: req.user.userId
            })
        }).send(res)
    }

    findAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list unPublish Success!',
            metadata: await ProductService.findAllDraftsForShop({
                product_auth: req.user.userId
            })
        }).send(res)
    }

    searchProductByUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Search Product Success!',
            metadata: await ProductService.searchProductByUser(req.params)
        }).send(res)
    }


    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'findAllProducts Success!',
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res)
    }

    findProductById = async (req, res, next) => {
        new SuccessResponse({
            message: 'findProductById Success!',
            metadata: await ProductService.findProductById({
                product_id: req.params.product_id
            })
        }).send(res)
    }
}
module.exports = new ProductController()