const express = require('express')
const authController = require('../../controllers/auth.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const router = express.Router()

router.post('/auth/signup', asyncHandler(authController.signUp))

module.exports = router