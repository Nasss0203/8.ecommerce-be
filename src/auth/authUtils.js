const jwt = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const createError = require('http-errors')
const { findByUserId } = require('../services/key.service')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'Authorization',
    REFRESHTOKEN: "x-rtoken-id"
}


const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await jwt.sign(payload, publicKey, {
            expiresIn: '2 days'
        })

        const refreshToken = await jwt.sign(payload, privateKey, {
            expiresIn: '7 days'
        })

        jwt.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log(`Error verify error::`, err)
            } else {
                console.log(`Decode verify::`, decode)
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {
        return error
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /**
  * 1 - check user missing
  * 2 - get accessToken
  * 3 - verifyToken
  * 4 - check user in dbs
  * 5 - chck keyStore with this userId
  * 6 - ok all -> return next()
  */

    //1 - check user missing
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new createError(401, 'Invalid Request')

    //2 - get accessToken
    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new createError(404, 'Not Found: keyStore');

    //3 - verifyToken
    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = jwt.verify(refreshToken, keyStore.privateKey)
            if (userId !== decodeUser.userId) throw new createError(401, 'Invalid UserId')
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new createError(401, 'Invalid Request')

    //4 - check user in dbs
    try {
        const decodeUser = jwt.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) throw new createError(401, 'Invalid UserId')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        console.error('Authentication Error:', error.message);
        next(error);
    }
})

const verifyJWT = async (token, keySecret) => {
    return await jwt.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}