const express = require('express')
const authController = require('../../controllers/auth.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

router.post('/auth/signup', asyncHandler(authController.signUp))
router.post('/auth/login', asyncHandler(authController.login))


//Authentication
router.use(authentication)
router.post('/auth/logout', asyncHandler(authController.logout))
router.post('/auth/refreshToken', asyncHandler(authController.refreshToken))

module.exports = router