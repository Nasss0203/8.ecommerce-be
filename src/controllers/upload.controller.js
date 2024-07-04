const { SuccessResponse } = require("../core/success.response")
const { uploadImageFromLocal, uploadImageFromUrl } = require("../services/upload.service")
const createError = require('http-errors')

class UploadController {
    // uploadFile = async (req, res, next) => {
    //     new SuccessResponse({
    //         message: 'Upload successfully upload',
    //         metadata: await uploadImageFromUrl()
    //     }).send(res)
    // }

    uploadFileThumb = async (req, res, next) => {
        const { file } = req
        if (!file) {
            throw new createError(400, 'File missing')
        }
        new SuccessResponse({
            message: 'Upload successfully upload',
            metadata: await uploadImageFromLocal({
                path: file.path
            })
        }).send(res)
    }
}

module.exports = new UploadController()