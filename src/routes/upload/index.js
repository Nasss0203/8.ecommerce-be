const express = require('express')
// const { authentication } = require('../../auth/authUtils')
const { uploadDisk } = require('../../configs/multer.config')
const { asyncHandler } = require('../../helpers/asyncHandler')
const uploadController = require('../../controllers/upload.controller')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()


// router.use(authentication)
// router.post('', asyncHandler(uploadController.uploadFile))
router.post('/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadFileThumb))

module.exports = router
