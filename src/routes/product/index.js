const express = require('express')
const productController = require('../../controllers/product.controller')
const { authentication } = require('../../auth/authUtils')
const { asyncHandler } = require('../../helpers/asyncHandler')
const router = express.Router()

router.get('/search/:keySearch', asyncHandler(productController.searchProductByUser))

//Authentication
router.use(authentication)
/*------------------- */
router.post('/', asyncHandler(productController.createProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByAuth))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByAuth))

//query
router.get('/drafts/all', asyncHandler(productController.findAllDraftsForShop))
router.get('/publish/all', asyncHandler(productController.findAllPublishForShop))

module.exports = router