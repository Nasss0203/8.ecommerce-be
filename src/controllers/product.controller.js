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
}
module.exports = new ProductController()