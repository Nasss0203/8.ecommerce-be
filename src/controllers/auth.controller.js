const { CREATED, SuccessResponse } = require("../core/success.response")
const AccessService = require("../services/access.service")

class AuthController {
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registered OK!',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res)
    }

    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout success!',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }

    refreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get toen success!',
            metadata: await AccessService.hadlerRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }
}

module.exports = new AuthController()